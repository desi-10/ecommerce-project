"use client";

import Image from "next/image";
import Link from "next/link";
import Wrapper from "./wrapper";
import { useGetProducts } from "@/hooks/use-product";
import { useLanguage } from "@/context/language-context";

export function HeroBannerPlusPromos() {
  const { t } = useLanguage();
  const { data: productsData } = useGetProducts({ onDiscount: true, limit: 3 });
  const products = productsData?.data?.products || [];

  // Fallback data for empty states
  const mainProduct = products[0];
  const side1 = products[1];
  const side2 = products[2];

  return (
    <section className="">
      <Wrapper>
        <div className="py-6 md:py-8 grid gap-4 md:grid-cols-[1fr_320px]">
          {/* 🔥 Big Banner */}
          <div className="relative h-[360px] rounded-md overflow-hidden border border-neutral-200 shadow-sm group">
            <Image
              src={
                mainProduct?.image ||
                "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1600&q=80"
              }
              alt={mainProduct?.name || "Smart Gadget"}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />

            <div className="absolute inset-0 bg-black/40" />

            <div className="relative z-10 h-full flex flex-col justify-center p-6 md:p-10 text-white">
              <p className="text-xs text-blue-300 font-bold tracking-widest uppercase">
                {t("hero.exclusive_deals", "Exclusive Deals")}
              </p>

              <h2 className="mt-2 text-3xl md:text-4xl font-extrabold leading-tight">
                {mainProduct ? mainProduct.name : "Smart Modern Gadgets"} <br />
                <span className="text-blue-400">{t("hero.up_to_50_off", "Up to 50% Off")}</span>
              </h2>

              <p className="mt-3 text-sm opacity-90 max-w-md line-clamp-2">
                {mainProduct?.description ||
                  "Experience the next level of tech with our curated selection of premium gadgets."}
              </p>

              <div className="mt-6 flex items-center gap-4">
                <Link
                  href={mainProduct ? `/shop/${mainProduct.id}` : "/shop"}
                  className="inline-flex rounded-md bg-blue-600 px-6 py-3 text-white font-bold hover:bg-blue-700 transition shadow-sm"
                >
                  {t("hero.shop_now", "Shop Now")}
                </Link>

                <Link
                  href="/shop"
                  className="text-sm font-bold text-white hover:text-blue-300 transition"
                >
                  {t("hero.view_all_deals", "View all deals")}
                </Link>
              </div>
            </div>
          </div>

          {/* 🔥 Right Promos */}
          <div className="grid gap-4">
            {/* Promo 1 */}
            <div className="relative h-[170px] rounded-md overflow-hidden border border-neutral-200 shadow-sm group">
              <Image
                src={
                  side1?.image ||
                  "https://images.unsplash.com/photo-1512499617640-c2f999098c01?auto=format&fit=crop&w=1000&q=80"
                }
                alt={side1?.name || "Accessories"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/40" />

              <div className="relative z-10 h-full p-5 flex flex-col justify-center text-white">
                <div className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                  {t("hero.new_arrival", "New Arrival")}
                </div>
                <div className="mt-1 font-bold leading-snug text-lg">
                  {side1 ? side1.name : "Accessories Collection"}
                </div>

                <Link
                  href={side1 ? `/shop/${side1.id}` : "/shop"}
                  className="inline-flex mt-3 text-xs font-bold uppercase tracking-tighter text-white hover:text-blue-300 transition"
                >
                  {t("hero.discover_now", "Discover Now →")}
                </Link>
              </div>
            </div>

            {/* Promo 2 */}
            <div className="relative h-[170px] rounded-md overflow-hidden border border-neutral-200 shadow-sm group">
              <Image
                src={
                  side2?.image ||
                  "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80"
                }
                alt={side2?.name || "Featured"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/40" />

              <div className="relative z-10 h-full p-5 flex flex-col justify-center text-white">
                <div className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                  {t("hero.limited_time", "Limited Time")}
                </div>
                <div className="mt-1 font-bold leading-snug text-lg">
                  {side2 ? side2.name : "Premium Audio Experience"}
                </div>

                <Link
                  href={side2 ? `/shop/${side2.id}` : "/shop"}
                  className="inline-flex mt-3 text-xs font-bold uppercase tracking-tighter text-white hover:text-blue-300 transition"
                >
                  {t("hero.save_big", "Save Big Today →")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
