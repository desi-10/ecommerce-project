import prisma from "@/lib/db";
import { apiResponse } from "@/lib/api-response";
import { productSelect, applyDynamicDiscounts } from "../products/products.service";

/**
 * Personalized "Recommended for you" engine.
 *
 * Deliberately separate from the AI assistant's Pinecone semantic search
 * (src/server/ai/ai.actions.ts / embedding.ts): that's query-driven ("find
 * me X"), this is behavior-driven — it needs no user input, just a signal
 * of what the shopper has looked at and bought.
 *
 * Signal → category affinity → products in those categories, ranked by
 * rating and recency. Purchases count more than views (a completed order
 * is a much stronger interest signal than a glance), and both decay out of
 * the window after HISTORY_WINDOW_DAYS so recommendations track a user's
 * current interests rather than everything they've ever looked at.
 *
 * Cold-start (no signal at all — a first-time guest) falls back to
 * storewide trending products so the section is never empty.
 */

const VIEW_WEIGHT = 1;
const PURCHASE_WEIGHT = 3;
const HISTORY_WINDOW_DAYS = 90;
const CATEGORY_LOOKAHEAD = 4; // how many top categories feed the product query

export const trackProductViewService = async (
  productId: string,
  userId: string | null,
  sessionId: string | null,
) => {
  if (!userId && !sessionId) return; // nothing to key the view by

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });
  if (!product) return; // don't fail page load over a stale/removed product id

  await prisma.productView.create({
    data: {
      productId,
      userId: userId ?? undefined,
      sessionId: userId ? undefined : sessionId ?? undefined,
    },
  });
};

const scoreCategories = (
  rows: Array<{ categoryIds: string[]; weight: number }>,
): string[] => {
  const scores = new Map<string, number>();
  for (const row of rows) {
    for (const categoryId of row.categoryIds) {
      scores.set(categoryId, (scores.get(categoryId) ?? 0) + row.weight);
    }
  }
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, CATEGORY_LOOKAHEAD)
    .map(([categoryId]) => categoryId);
};

const getTrendingProductIds = async (limit: number, excludeIds: string[]): Promise<string[]> => {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const topVariants = await prisma.orderItem.groupBy({
    by: ["variantId"],
    where: {
      order: { createdAt: { gte: since }, status: { in: ["PAID", "FULFILLED"] } },
    },
    _sum: { qty: true },
    orderBy: { _sum: { qty: "desc" } },
    take: 50,
  });

  const ids: string[] = [];
  if (topVariants.length > 0) {
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: topVariants.map((v) => v.variantId) } },
      select: { id: true, productId: true },
    });
    const variantToProduct = new Map(variants.map((v) => [v.id, v.productId]));

    for (const v of topVariants) {
      const productId = variantToProduct.get(v.variantId);
      if (productId && !excludeIds.includes(productId) && !ids.includes(productId)) {
        ids.push(productId);
      }
      if (ids.length >= limit) break;
    }
  }

  if (ids.length < limit) {
    const fillers = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        id: { notIn: [...excludeIds, ...ids] },
      },
      select: { id: true },
      orderBy: { createdAt: "desc" },
      take: limit - ids.length,
    });
    ids.push(...fillers.map((f) => f.id));
  }

  return ids.slice(0, limit);
};

export const getRecommendationsService = async ({
  userId,
  sessionId,
  excludeProductId,
  limit = 8,
}: {
  userId?: string | null;
  sessionId?: string | null;
  excludeProductId?: string;
  limit?: number;
}) => {
  const since = new Date();
  since.setDate(since.getDate() - HISTORY_WINDOW_DAYS);

  const excludeIds = excludeProductId ? [excludeProductId] : [];
  const signalRows: Array<{ categoryIds: string[]; weight: number }> = [];
  const purchasedProductIds = new Set<string>();

  if (userId) {
    const [orderItems, views] = await Promise.all([
      prisma.orderItem.findMany({
        where: {
          order: { userId, createdAt: { gte: since } },
        },
        select: {
          variant: {
            select: {
              product: {
                select: { id: true, categories: { select: { categoryId: true } } },
              },
            },
          },
        },
      }),
      prisma.productView.findMany({
        where: { userId, createdAt: { gte: since } },
        select: {
          product: { select: { categories: { select: { categoryId: true } } } },
        },
        take: 200,
      }),
    ]);

    for (const item of orderItems) {
      const product = item.variant?.product;
      if (!product) continue;
      purchasedProductIds.add(product.id);
      signalRows.push({
        categoryIds: product.categories.map((c) => c.categoryId),
        weight: PURCHASE_WEIGHT,
      });
    }
    for (const view of views) {
      if (!view.product) continue;
      signalRows.push({
        categoryIds: view.product.categories.map((c) => c.categoryId),
        weight: VIEW_WEIGHT,
      });
    }
  } else if (sessionId) {
    const views = await prisma.productView.findMany({
      where: { sessionId, createdAt: { gte: since } },
      select: {
        product: { select: { categories: { select: { categoryId: true } } } },
      },
      take: 200,
    });
    for (const view of views) {
      if (!view.product) continue;
      signalRows.push({
        categoryIds: view.product.categories.map((c) => c.categoryId),
        weight: VIEW_WEIGHT,
      });
    }
  }

  const topCategoryIds = scoreCategories(signalRows);

  let products: any[] = [];

  if (topCategoryIds.length > 0) {
    products = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        id: { notIn: [...excludeIds, ...purchasedProductIds] },
        categories: { some: { categoryId: { in: topCategoryIds } } },
      },
      select: productSelect,
      orderBy: [{ createdAt: "desc" }],
      take: limit * 2, // overfetch so we can rank by rating client-side below
    });

    products = products
      .map((p) => {
        const ratings = p.reviews.map((r: { rating: number }) => r.rating);
        const avgRating = ratings.length
          ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
          : 0;
        return { ...p, __avgRating: avgRating };
      })
      .sort((a, b) => b.__avgRating - a.__avgRating)
      .slice(0, limit);
  }

  if (products.length < limit) {
    const alreadyPicked = products.map((p) => p.id);
    const trendingIds = await getTrendingProductIds(limit - products.length, [
      ...excludeIds,
      ...alreadyPicked,
      ...purchasedProductIds,
    ]);

    if (trendingIds.length > 0) {
      const trendingProducts = await prisma.product.findMany({
        where: { id: { in: trendingIds } },
        select: productSelect,
      });
      // preserve trending rank order (findMany doesn't guarantee id-list order)
      const byId = new Map(trendingProducts.map((p) => [p.id, p]));
      for (const id of trendingIds) {
        const p = byId.get(id);
        if (p) products.push(p);
      }
    }
  }

  const result = products.map((p) => applyDynamicDiscounts(p));

  return apiResponse("Recommendations fetched successfully", {
    products: result,
    basis: topCategoryIds.length > 0 ? "personalized" : "trending",
  });
};
