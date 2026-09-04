"use client";

import CategoryMonth from "@/components/categoryofthemonth";
import DealOfDay from "@/components/deal";
import FeatureRow from "@/components/feature";
import { HeroBannerPlusPromos } from "@/components/hero-b";
import ProductSection from "@/components/product";
import PromoBanners from "@/components/promo";
import ProductGridCard from "@/components/shop/product-grid";
import ProductListRow from "@/components/shop/product-list";
import Wrapper from "@/components/wrapper";
import { useGetProducts } from "@/hooks/use-product";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";

export default function Page() {
  const { t } = useLanguage();
  const { data: fashionData } = useGetProducts({
    category: "fashion",
    limit: 4,
  });
  const fashionProducts = fashionData?.data.products || [];

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="pb-20 md:pb-0">
        <HeroBannerPlusPromos />
        <FeatureRow />

        <Wrapper>
          <div className="pb-20">
            <CategoryMonth />
            <PromoBanners />
            <DealOfDay />

            <ProductSection
              title={t("section.groceries", "Fresh Groceries & Daily Essentials")}
              category="groceries"
            />

            <section className="py-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* LEFT — Banner Image */}
                <div className="lg:col-span-1 h-full">
                  <div className="relative h-full w-full overflow-hidden rounded-xl">
                    <Image
                      src="https://images.unsplash.com/photo-1523275335684-37898b6baf30"
                      alt="Promo banner"
                      className="w-full h-full object-cover"
                      width={600}
                      height={800}
                      quality={85}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                      <div>
                        <h2 className="text-white text-2xl font-bold">
                          {t("banner.summer_fashion", "Summer Fashion")}
                        </h2>
                        <p className="text-white/80 text-sm">
                          {t("banner.summer_discount", "Up to 40% off selected styles")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT — Product List */}
                <div className="hidden lg:block lg:col-span-2 space-y-4 w-full">
                  {fashionProducts.map((p) => (
                    <ProductListRow key={p.id} p={p} />
                  ))}
                  {fashionProducts.length === 0 && (
                    <div className="text-muted-foreground italic">
                      {t("status.fetching_styles", "Fetching the latest styles...")}
                    </div>
                  )}
                </div>

                <div className="lg:hidden mt-4 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
                  {fashionProducts.map((p) => (
                    <ProductGridCard key={p.id} p={p} />
                  ))}
                </div>
              </div>
            </section>

            <ProductSection
              title={t("section.electronics", "Digital Electronics & Accessories")}
              category="electronics"
            />
          </div>
        </Wrapper>
      </main>
    </div>
  );
}
