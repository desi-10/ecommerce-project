import { apiResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error";
import {
  CreateProductInput,
  ListProductsInput,
  UpdateProductInput,
} from "./products.validators";
import prisma from "@/lib/db";
import { StatusCodes } from "http-status-codes";

import { Prisma } from "../../../prisma/generated/client";
import { generateEmbedding } from "../ai/embedding";
import { getPineconeIndex } from "@/lib/pinecone";

export const decimal = (n: number) => new Prisma.Decimal(n);
// --------------------------
// Common selectors
// --------------------------
const productSelect = {
  id: true,
  name: true,
  description: true,
  image: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  brand: true,
  categories: {
    select: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  },
  vendor: {
    select: {
      name: true,
    },
  },
  reviews: {
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
    },
  },
  images: {
    select: {
      id: true,
      url: true,
      publicId: true,
      alt: true,
      position: true,
    },
    orderBy: { position: "asc" as const },
  },
  variants: {
    select: {
      id: true,
      name: true,
      sku: true,
      price: true,
      salePrice: true,
      options: true,
      inventory: { select: { id: true, stock: true } },
    },
    orderBy: { createdAt: "asc" as const },
  },
  discounts: {
    select: {
      id: true,
      type: true,
      value: true,
      status: true,
      startsAt: true,
      endsAt: true,
    },
  },
};

// --------------------------
// Services
// --------------------------

export const createProductService = async (data: CreateProductInput) => {
  const hasVariants = data.variants.length > 0;

  // Generate embedding for search
  const embeddingText = `${data.name} ${data.description || ""}`;
  const embedding = await generateEmbedding(embeddingText);

  const result = await prisma.$transaction(async (tx) => {
    // basic duplicate SKU guard within payload
    if (hasVariants) {
      const skus = data.variants.map((v) => v.sku).filter(Boolean) as string[];
      const set = new Set(skus);
      if (set.size !== skus.length) {
        throw new ApiError(
          "Duplicate SKU in variants payload.",
          StatusCodes.BAD_REQUEST,
        );
      }
    }

    const product = await tx.product.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        image: data.images?.[0]?.url ?? null,
        status: data.status,
      },
      select: { id: true },
    });

    if (data.categoryId) {
      await tx.productCategory.create({
        data: {
          productId: product.id,
          categoryId: data.categoryId,
        },
      });
    }

    if (data.images && data.images.length > 0) {
      await tx.productImage.createMany({
        data: data.images.map((img, index) => ({
          productId: product.id,
          url: img.url,
          publicId: img.id,
          position: index,
        })),
      });
    }

    if (hasVariants) {
      // Create variants + inventories
      await Promise.all(
        data.variants.map(async (v) => {
          const variant = await tx.productVariant.create({
            data: {
              productId: product.id,
              name: v.name,
              sku: v.sku ?? null,
              price: decimal(v.price),
              salePrice:
                v.salePrice === undefined ? null : decimal(v.salePrice),
              //   options: v.options ?? null,
            },
            select: { id: true },
          });

          await tx.inventory.create({
            data: {
              variantId: variant.id,
              stock: v.stock ?? 0,
            },
          });
        }),
      );
    } else {
      // default variant + inventory
      const variant = await tx.productVariant.create({
        data: {
          productId: product.id,
          name: "Default",
          sku: null,
          price: decimal(data.defaultPrice ?? 0),
          salePrice:
            data.defaultSalePrice === undefined
              ? null
              : decimal(data.defaultSalePrice),
          //   options: null,
        },
        select: { id: true },
      });

      await tx.inventory.create({
        data: {
          variantId: variant.id,
          stock: data.defaultStock ?? 0,
        },
      });
    }

    return tx.product.findUnique({
      where: { id: product.id },
      select: productSelect,
    });
  });

  if (result && result.status === "ACTIVE" && embedding.length > 0) {
    try {
      const index = getPineconeIndex();
      await index.upsert({
        records: [
          {
            id: result.id,
            values: embedding,
            metadata: { name: result.name, description: result.description || "" },
          },
        ],
      });
    } catch (error) {
      console.error("Failed to upsert to Pinecone:", error);
    }
  }

  return apiResponse("Product created successfully", result);
};

const applyDynamicDiscounts = <T extends Record<string, unknown>>(product: T): T => {
  if (!product) return product;

  // Find active discount if any
  const discounts = product.discounts as Array<{
    status: string;
    startsAt: string | Date | null;
    endsAt: string | Date | null;
    value: string | number;
    type: "PERCENT" | "AMOUNT";
  }> | undefined;

  const activeDiscount = discounts?.find((d) => {
    const now = new Date();
    if (d.status !== "ACTIVE") return false;
    if (d.startsAt && now < new Date(d.startsAt)) return false;
    if (d.endsAt && now > new Date(d.endsAt)) return false;
    return true;
  });

  if (activeDiscount) {
    const value = Number(activeDiscount.value);
    const type = activeDiscount.type;
    const variants = product.variants as Array<{ price: number | string; salePrice?: number | string | Prisma.Decimal | null }> | undefined;

    if (variants) {
      (product as any).variants = variants.map((variant) => {
        const price = Number(variant.price);
        const currentSalePrice = variant.salePrice ? Number(variant.salePrice) : 0;

        // Only apply discount if salePrice is not already set manually
        if (currentSalePrice <= 0) {
          let computedSalePrice = 0;
          if (type === "PERCENT") {
            computedSalePrice = price * (1 - value / 100);
          } else if (type === "AMOUNT") {
            computedSalePrice = Math.max(0, price - value);
          }
          variant.salePrice = new Prisma.Decimal(computedSalePrice.toFixed(2));
        }
        return variant;
      });
    }
  }

  return product;
};

export const getProductsService = async (data: ListProductsInput) => {
  const {
    page,
    limit,
    q,
    status,
    sort,
    category,
    categories,
    onDiscount,
    minPrice,
    maxPrice,
    ids,
    rating,
  } = data;

  const categorySlugs = categories ?? (category ? [category] : undefined);

  let ratedProductIds: string[] | undefined = undefined;
  if (rating !== undefined) {
    const ratedGroups = await prisma.review.groupBy({
      by: ["productId"],
      _avg: {
        rating: true,
      },
      having: {
        rating: {
          _avg: {
            gte: rating,
          },
        },
      },
    });
    ratedProductIds = ratedGroups.map((g) => g.productId);
  }

  const where: Prisma.ProductWhereInput = {
    ...(ids && ids.length > 0
      ? {
          id: {
            in: ratedProductIds
              ? ids.filter((id) => ratedProductIds!.includes(id))
              : ids,
          },
        }
      : ratedProductIds
        ? { id: { in: ratedProductIds } }
        : {}),
    ...(status && { status }),
    ...(q && {
      name: {
        contains: q,
        mode: "insensitive",
      },
    }),
    ...(categorySlugs && categorySlugs.length > 0 && {
      categories: {
        some: {
          category: {
            slug: { in: categorySlugs },
          },
        },
      },
    }),
    ...(onDiscount && {
      OR: [
        {
          variants: {
            some: {
              salePrice: {
                gt: 0,
              },
            },
          },
        },
        {
          discounts: {
            some: {
              status: "ACTIVE",
              AND: [
                { OR: [{ startsAt: null }, { startsAt: { lte: new Date() } }] },
                { OR: [{ endsAt: null }, { endsAt: { gte: new Date() } }] },
              ],
            },
          },
        },
      ],
    }),
    ...((minPrice !== undefined || maxPrice !== undefined) && {
      variants: {
        some: {
          AND: [
            ...(minPrice !== undefined ? [{ price: { gte: minPrice } }] : []),
            ...(maxPrice !== undefined ? [{ price: { lte: maxPrice } }] : []),
          ],
        },
      },
    }),
  };

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "name_asc") orderBy = { name: "asc" };
  else if (sort === "name_desc") orderBy = { name: "desc" };
  else if (sort === "oldest") orderBy = { createdAt: "asc" };

  if (sort === "price_asc" || sort === "price_desc") {
    try {
      const variantGroups = await prisma.productVariant.groupBy({
        by: ["productId"],
        _min: {
          price: true,
        },
        where: {
          product: where,
          AND: [
            ...(minPrice !== undefined ? [{ price: { gte: minPrice } }] : []),
            ...(maxPrice !== undefined ? [{ price: { lte: maxPrice } }] : []),
          ],
        },
        orderBy: {
          _min: {
            price: sort === "price_asc" ? "asc" : "desc",
          },
        },
      });

      const total = variantGroups.length;
      const paginatedGroups = variantGroups.slice((page - 1) * limit, page * limit);
      const productIds = paginatedGroups.map((g) => g.productId);

      const products = await prisma.product.findMany({
        where: {
          id: { in: productIds },
        },
        select: productSelect,
      });

      // Keep the sort order of productIds
      const productsMap = new Map(products.map((p) => [p.id, p]));
      const orderedProducts = productIds
        .map((id) => productsMap.get(id))
        .filter(Boolean) as Record<string, unknown>[];

      const totalPages = Math.max(1, Math.ceil(total / limit));
      const processedProducts = orderedProducts.map(applyDynamicDiscounts);

      return apiResponse("Products fetched successfully", {
        products: processedProducts,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      });
    } catch (error: unknown) {
      console.error("[getProductsService] GroupBy Sort Failed:", (error as Error).message);
      // Fallback below to safe mode
    }
  }

  try {
    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select: productSelect,
      }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));
    const processedProducts = products.map(applyDynamicDiscounts);

    return apiResponse("Products fetched successfully", {
      products: processedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error: unknown) {
    console.error("[getProductsService] Primary Query Failed:", (error as Error).message);
    
    // Fallback if aggregate sort or complex where failed
    const [total, products] = await Promise.all([
      prisma.product.count({ where: { status: "ACTIVE" } }),
      prisma.product.findMany({
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: productSelect,
      }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));
    const processedProducts = products.map(applyDynamicDiscounts);

    return apiResponse("Products fetched successfully (safe mode)", {
      products: processedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  }
};

export const getProductByIdService = async (id: string, isAdmin: boolean = false) => {
  const product = await prisma.product.findUnique({
    where: { id },
    select: productSelect,
  });

  if (!product || (!isAdmin && product.status === "INACTIVE")) {
    throw new ApiError("Product not found", StatusCodes.NOT_FOUND);
  }

  return apiResponse("Product fetched successfully", applyDynamicDiscounts(product));
};

export const updateProductService = async (
  id: string,
  data: UpdateProductInput,
) => {
  const existingProduct = await prisma.product.findUnique({
    where: { id },
    select: { name: true, description: true, status: true },
  });

  if (!existingProduct) {
    throw new ApiError("Product not found", StatusCodes.NOT_FOUND);
  }

  // Regenerate embedding if name or description changed, OR if status is changing from INACTIVE to ACTIVE
  let embedding: number[] | null = null;
  const isActivating = existingProduct.status === "INACTIVE" && data.status === "ACTIVE";
  const nameOrDescChanged = data.name !== undefined || data.description !== undefined;

  if (nameOrDescChanged || isActivating) {
    const name = data.name ?? existingProduct.name;
    const description = data.description ?? existingProduct.description;
    embedding = await generateEmbedding(`${name} ${description || ""}`);
  }

  const updated = await prisma.$transaction(async (tx) => {
    const existing = await tx.product.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing)
      throw new ApiError("Product not found", StatusCodes.NOT_FOUND);

    // update product core
    const updatedProduct = await tx.product.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.description !== undefined
          ? { description: data.description ?? null }
          : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
      },
      select: { id: true, name: true, description: true },
    });

    if (data.categoryId !== undefined) {
      await tx.productCategory.deleteMany({ where: { productId: id } });
      if (data.categoryId) {
        await tx.productCategory.create({
          data: {
            productId: id,
            categoryId: data.categoryId,
          },
        });
      }
    }

    if (data.images !== undefined) {
      await tx.productImage.deleteMany({ where: { productId: id } });
      if (data.images.length > 0) {
        await tx.productImage.createMany({
          data: data.images.map((img, index) => ({
            productId: id,
            url: img.url,
            publicId: img.id,
            position: index,
          })),
        });

        // Set first image as main product image
        await tx.product.update({
          where: { id },
          data: { image: data.images[0].url },
        });
      }
    }

    // If variants not provided, stop here (core update only or default variant update)
    if (!data.variants) {
      if (
        data.defaultPrice !== undefined ||
        data.defaultSalePrice !== undefined ||
        data.defaultStock !== undefined
      ) {
        const current = await tx.productVariant.findMany({
          where: { productId: id },
          select: { id: true },
        });

        if (current.length === 1) {
          const singleVariant = current[0];
          await tx.productVariant.update({
            where: { id: singleVariant.id },
            data: {
              ...(data.defaultPrice !== undefined ? { price: decimal(data.defaultPrice) } : {}),
              ...(data.defaultSalePrice !== undefined
                ? { salePrice: data.defaultSalePrice === null ? null : decimal(data.defaultSalePrice) }
                : {}),
            },
          });

          if (data.defaultStock !== undefined) {
            await tx.inventory.upsert({
              where: { variantId: singleVariant.id },
              create: { variantId: singleVariant.id, stock: data.defaultStock },
              update: { stock: data.defaultStock },
            });
          }
        }
      }
      return tx.product.findUnique({ where: { id }, select: productSelect });
    }

    // Guard duplicate SKUs within payload
    const skus = data.variants.map((v) => v.sku).filter(Boolean) as string[];
    const set = new Set(skus);
    if (set.size !== skus.length) {
      throw new ApiError(
        "Duplicate SKU in variants payload.",
        StatusCodes.BAD_REQUEST,
      );
    }

    // Fetch current variants for deletion detection
    const current = await tx.productVariant.findMany({
      where: { productId: id },
      select: { id: true, name: true, sku: true },
    });
    const currentIds = new Set(current.map((v) => v.id));
    const incomingIds = new Set(
      data.variants.map((v) => v.id).filter(Boolean) as string[],
    );
    const toDelete = [...currentIds].filter((vid) => !incomingIds.has(vid));

    // Check if the product has been purchased (has any order items)
    const orderItem = await tx.orderItem.findFirst({
      where: { variant: { productId: id } },
      select: { id: true },
    });
    const hasBeenPurchased = !!orderItem;

    if (hasBeenPurchased) {
      // 1. You shouldn't be able to remove existing variants
      if (toDelete.length > 0) {
        throw new ApiError(
          "Cannot delete variants from a product that has been purchased.",
          StatusCodes.BAD_REQUEST,
        );
      }

      // 2. You should only modify variant stock or price (not name/sku)
      for (const v of data.variants) {
        if (v.id) {
          const existingVar = current.find((cv) => cv.id === v.id);
          if (existingVar) {
            const nameChanged = v.name !== undefined && v.name !== existingVar.name;
            const skuChanged = v.sku !== undefined && v.sku !== (existingVar.sku ?? undefined);

            if (nameChanged || skuChanged) {
              throw new ApiError(
                `Cannot modify name or SKU of existing variant "${existingVar.name}" because this product has been purchased.`,
                StatusCodes.BAD_REQUEST,
              );
            }
          }
        }
      }

      // 3. For single ones, you shouldn't be able to add variants to them
      const isSingleProduct = current.length === 1;
      if (isSingleProduct) {
        const hasNewVariants = data.variants.some((v) => !v.id);
        if (hasNewVariants) {
          throw new ApiError(
            "Cannot add variants to a single product that has been purchased.",
            StatusCodes.BAD_REQUEST,
          );
        }
      }
    }

    // Delete variants removed from payload
    if (toDelete.length) {
      // inventory should cascade if relation is onDelete: Cascade,
      // but we delete explicitly to be safe if your schema doesn't cascade.
      await tx.inventory.deleteMany({ where: { variantId: { in: toDelete } } });
      await tx.productVariant.deleteMany({
        where: { id: { in: toDelete }, productId: id },
      });
    }

    // Upsert (update existing, create new)
    for (const v of data.variants) {
      if (v.id) {
        // update variant
        const variant = await tx.productVariant.update({
          where: { id: v.id },
          data: {
            name: v.name,
            sku: v.sku ?? null,
            price: decimal(v.price),
            salePrice: v.salePrice === undefined ? null : decimal(v.salePrice),
            // options: v.options ?? null,
          },
          select: { id: true, productId: true },
        });

        if (variant.productId !== id) {
          throw new ApiError(
            "Variant does not belong to this product.",
            StatusCodes.BAD_REQUEST,
          );
        }

        // upsert inventory
        await tx.inventory.upsert({
          where: { variantId: variant.id },
          create: { variantId: variant.id, stock: v.stock ?? 0 },
          update: { stock: v.stock ?? 0 },
        });
      } else {
        // create variant
        const created = await tx.productVariant.create({
          data: {
            productId: id,
            name: v.name,
            sku: v.sku ?? null,
            price: decimal(v.price),
            salePrice: v.salePrice === undefined ? null : decimal(v.salePrice),
            // options: v.options ?? null,
          },
          select: { id: true },
        });

        await tx.inventory.create({
          data: { variantId: created.id, stock: v.stock ?? 0 },
        });
      }
    }

    // Ensure at least 1 variant exists
    const count = await tx.productVariant.count({ where: { productId: id } });
    if (count === 0) {
      throw new ApiError(
        "A product must have at least one variant.",
        StatusCodes.BAD_REQUEST,
      );
    }

    return tx.product.findUnique({ where: { id }, select: productSelect });
  });

  if (updated) {
    try {
      const index = getPineconeIndex();
      if (updated.status === "ACTIVE") {
        if (embedding && embedding.length > 0) {
          await index.upsert({
            records: [
              {
                id: id,
                values: embedding,
                metadata: { 
                  name: updated.name, 
                  description: updated.description || "" 
                },
              },
            ]
          });
        }
      } else {
        // status is INACTIVE: remove from Pinecone
        await index.deleteOne({ id });
      }
    } catch (error) {
      console.error("Failed to update Pinecone index:", error);
    }
  }

  return apiResponse("Product updated successfully", updated);
};

/**
 * Delete product:
 * - default: hard delete (variants + inventory should cascade)
 * - optional: soft delete by setting status INACTIVE
 */
export const deleteProductService = async (
  id: string,
  opts?: { soft?: boolean },
) => {
  const exists = await prisma.product.findUnique({
    where: { id },
    select: { id: true, status: true },
  });

  if (!exists) throw new ApiError("Product not found", StatusCodes.NOT_FOUND);

  if (opts?.soft) {
    const updated = await prisma.product.update({
      where: { id },
      data: { status: "INACTIVE" },
      select: productSelect,
    });
    try {
      const index = getPineconeIndex();
      await index.deleteOne({ id });
    } catch (error) {
      console.error("Failed to delete from Pinecone on soft delete:", error);
    }
    return apiResponse("Product archived successfully", updated);
  }

  // If you have Orders, you should block delete if referenced.
  // Example (adjust):
  // const hasOrders = await prisma.orderItem.findFirst({
  //   where: {  variantId:  },
  //   select: { id: true },
  // });
  // if (hasOrders)
  //   throw new ApiError(
  //     "Cannot delete product with orders.",
  //     statusCodes.CONFLICT,
  //   );

  await prisma.$transaction(async (tx) => {
    const variantIds = await tx.productVariant.findMany({
      where: { productId: id },
      select: { id: true },
    });

    const ids = variantIds.map((v) => v.id);
    if (ids.length) {
      await tx.inventory.deleteMany({ where: { variantId: { in: ids } } });
      await tx.productVariant.deleteMany({ where: { id: { in: ids } } });
    }

    await tx.product.delete({ where: { id } });
  });

  // Remove from Pinecone
  try {
    const index = getPineconeIndex();
    await index.deleteOne({ id });
  } catch (error) {
    console.error("Failed to delete from Pinecone:", error);
  }

  return apiResponse("Product deleted successfully", null);
};
