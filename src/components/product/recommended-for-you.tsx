"use client";

import { useRecommendations } from "@/hooks/use-recommendations";
import { useLanguage } from "@/context/language-context";
import { ProductGridSkeleton } from "@/components/ui/skeletons";
import ProductGridCard from "@/components/shop/product-grid";

/**
 * "Recommended for you" — the personalized-recommendation objective's
 * customer-facing surface. Backed by
 * src/server/recommendations/recommendations.service.ts, which scores a
 * shopper's browsing (ProductView) + purchase (OrderItem) history by
 * category and falls back to storewide trending products when there's not
 * enough signal yet (new/guest visitors).
 *
 * Distinct from RightSidebar's "More from {category}" (same-category-only,
 * no personalization) — drop this in wherever a personalized rail belongs:
 * homepage, product page (excluding the current product), cart/checkout.
 */
export default function RecommendedForYou({
  excludeProductId,
  limit = 8,
  title,
}: {
  excludeProductId?: string;
  limit?: number;
  title?: string;
}) {
  const { t } = useLanguage();
  const { data, isLoading } = useRecommendations({ limit, exclude: excludeProductId });

  const products = data?.data?.products ?? [];

  if (!isLoading && products.length === 0) return null;

  return (
    <section className="mt-6 bg-white border rounded-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="mozilla-text text-xl lg:text-2xl font-bold">
          {title ?? t("section.recommended_for_you", "Recommended for you")}
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <ProductGridSkeleton count={limit} />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {products.map((p) => (
              <ProductGridCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
