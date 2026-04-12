"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetProducts } from "@/hooks/use-product";

export default function PromoBanners() {
    const { data: promoData } = useGetProducts({ category: "electronics", limit: 2 });
    const promos = promoData?.data?.products || [];

    const p1 = promos[0];
    const p2 = promos[1];

    return (
        <section className="mt-6 grid md:grid-cols-2 gap-4">

            {/* Banner 1 */}
            <div className="relative h-64 rounded-sm overflow-hidden border group">
                <Image
                    src={p1?.image || "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1200&q=80"}
                    alt={p1?.name || "Featured Tech"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30" />

                {/* Content */}
                <div className="relative z-10 p-6 flex flex-col justify-center h-full text-white">
                    <div className="text-xl font-bold">{p1?.name || "Premium Audio"}</div>
                    <div className="text-sm mt-1 font-medium opacity-90">
                        {p1 ? `Save on ${p1.name}` : "Limited time offers"}
                    </div>

                    <Link href={p1 ? `/shop/${p1.id}` : "/shop"}>
                        <Button
                            size="sm"
                            className="mt-4 bg-white text-black hover:bg-neutral-100 font-bold w-fit"
                        >
                            Shop Now
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Banner 2 */}
            <div className="relative h-64 rounded-sm overflow-hidden border group">
                <Image
                    src={p2?.image || "https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?auto=format&fit=crop&w=1200&q=80"}
                    alt={p2?.name || "Top Deal"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/30" />

                <div className="relative z-10 p-6 flex flex-col justify-center h-full text-white">
                    <div className="text-xl font-bold">{p2?.name || "Modern Gadgets"}</div>
                    <div className="text-sm mt-1 font-medium opacity-90">
                        {p2 ? `Exclusive Deal on ${p2.name}` : "Best price guaranteed"}
                    </div>

                    <Link href={p2 ? `/shop/${p2.id}` : "/shop"}>
                        <Button
                            size="sm"
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold w-fit"
                        >
                            Explore Deals
                        </Button>
                    </Link>
                </div>
            </div>

        </section>
    );
}
