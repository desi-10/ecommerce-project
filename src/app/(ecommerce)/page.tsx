"use client"

import CategoryMonth from "@/components/categoryofthemonth";
import DealOfDay from "@/components/deal";
import FeatureRow from "@/components/feature";
// import Hero from "@/components/hero";
// import { HeroWithCategories } from "@/components/hero-a";
import { HeroBannerPlusPromos } from "@/components/hero-b";
import ProductSection from "@/components/product";
import PromoBanners from "@/components/promo";
import ProductGridCard from "@/components/shop/product-grid";
import ProductListRow from "@/components/shop/product-list";
import { ALL_PRODUCTS } from "@/components/shop/shop-results";
import Wrapper from "@/components/wrapper";
import Image from "next/image";
import { useMemo } from "react";


export default function Page() {
  const sorted = useMemo(() => {
    const items = [...ALL_PRODUCTS];
    return items;
  }, []);


  const paged = useMemo(() => {
    return sorted.slice(0, 4);
  }, [sorted]);


  return (
    <div className="min-h-screen bg-gray-100">

      <main className="pb-20 md:pb-0">
        {/* <Hero /> */}
        <HeroBannerPlusPromos />
        {/* <HeroWithCategories /> */}
        <FeatureRow />

        <Wrapper>
          <div className="pb-20">

            <CategoryMonth />
            <PromoBanners />
            <DealOfDay />

            <ProductSection
              title="Popular Smartphones & Tablets"
            />
            {/* <ProductSection
            title="Best Seller Laptops & Sounds"
            tabs={["Apple", "Laptop", "Asus", "Marshall", "Speaker"]}
          /> */}

            <section className="py-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* LEFT — Banner Image */}
                <div className="lg:col-span-1 h-full">
                  <div className="relative h-full w-full overflow-hidden rounded-xl">
                    <Image
                      src="https://images.unsplash.com/photo-1523275335684-37898b6baf30"
                      alt="Promo banner"
                      className="w-full h-full object-cover"
                      width={1000}
                      height={1000}
                    />

                    {/* Optional overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                      <div>
                        <h2 className="text-white text-2xl font-bold">
                          Summer Collection
                        </h2>
                        <p className="text-white/80 text-sm">
                          Up to 40% off selected items
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT — Product List */}
                <div className="hidden lg:block lg:col-span-2 space-y-4 w-full">
                  {paged.map((p) => (
                    <ProductListRow key={p.id} p={p} />
                  ))}
                </div>

                <div className="lg:hidden mt-4 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
                  {paged.map((p) => (
                    <ProductGridCard key={p.id} p={p} />
                  ))}
                </div>

              </div>
            </section>



            <ProductSection
              title="Technology Toys Recommended For You"
            />
          </div>
        </Wrapper>
      </main>


    </div>
  );
}
