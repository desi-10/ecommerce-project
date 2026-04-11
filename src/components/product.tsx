"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Button } from "./ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Heart, ShoppingCart, Check } from "lucide-react";
import { useWishlistStore } from "@/stores/wishlist.store";
import { useCartStore } from "@/stores/cart.store";
import { useGetProducts } from "@/hooks/use-product";
import type { Product } from "@/types/product";

function pickDisplayVariant(p: Product) {
    if (!p.variants?.length) return null;
    const withSale = p.variants.find((v) => Number(v.salePrice) > 0);
    return withSale ?? p.variants[0];
}

function toCard(p: Product) {
    const v = pickDisplayVariant(p);

    const id = v?.id ? String(v.id) : String(p.id); // use variantId if possible
    const priceNum = v ? Number(v.salePrice || v.price || 0) : 0;

    // Resolve product image from API data
    const image = p.image
        ?? (p.images?.[0] && typeof p.images[0] === 'object' ? p.images[0].url : p.images?.[0])
        ?? "/martfury/product.png";
    const brand = ""; // add p.brand later if your API returns it

    return {
        id,
        productId: String(p.id),
        name: p.name,
        brand,
        priceNum,
        priceText: `$${priceNum.toFixed(2)}`,
        image,
    };
}

export default function ProductSection({
    title,
    category,
}: {
    title: string;
    category: string;
}) {
    const { data: productsData, isLoading, isError } = useGetProducts({ category });
    const products = productsData?.data?.products ?? [];

    const cards = useMemo(() => products.map(toCard).slice(0, 10), [products]);

    const addItem = useCartStore((s) => s.addItem);

    // reactive state
    const cartItems = useCartStore((s) => s.items);
    const wishItems = useWishlistStore((s) => s.items);
    const toggleWish = useWishlistStore((s) => s.toggle);

    // fast lookups (memo)
    const cartSet = useMemo(() => new Set(cartItems.map((i) => i.id)), [cartItems]);
    const wishSet = useMemo(() => new Set(wishItems.map((i) => i.id)), [wishItems]);

    return (
        <section className="mt-8 rounded-sm border bg-white">
            <div className="flex items-center justify-between gap-4 p-4">
                <div className="mozilla-text text-xl font-bold lg:text-2xl">{title}</div>
                <Button
                    variant="link"
                    className="p-0 text-sm text-muted-foreground hover:text-foreground"
                >
                    View All
                </Button>
            </div>

            {/* States */}
            {isLoading ? (
                <div className="border-t p-4 text-sm text-muted-foreground">Loading...</div>
            ) : isError ? (
                <div className="border-t p-4 text-sm text-red-600">Failed to load products.</div>
            ) : cards.length === 0 ? (
                <div className="border-t p-4 text-sm text-muted-foreground">No products found.</div>
            ) : (
                <>
                    {/* Desktop grid */}
                    <div className="hidden grid-cols-5 gap-0 border-t md:grid">
                        {cards.map((p) => {
                            const isInCart = cartSet.has(p.id);
                            const isInWish = wishSet.has(p.id);

                            return (
                                <div key={p.id} className="group border-b border-r p-4 last:border-r-0">
                                    <div className="relative h-48 overflow-hidden">
                                        <Image
                                            src={p.image}
                                            alt={p.name}
                                            className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-[1.03]"
                                            width={1000}
                                            height={1000}
                                        />
                                    </div>

                                    {p.brand ? (
                                        <div className="mt-2 text-[11px] text-muted-foreground">{p.brand}</div>
                                    ) : null}

                                    {/* link should use productId for product page */}
                                    <Link
                                        href={`/shop/${p.productId}`}
                                        className="mt-1 line-clamp-2 text-xs font-medium hover:text-blue-600"
                                    >
                                        {p.name}
                                    </Link>

                                    <div className="mt-2 text-sm font-bold text-green-600">{p.priceText}</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Mobile slider */}
                    <div className="border-t p-4 md:hidden">
                        <Carousel opts={{ align: "start", loop: true }}>
                            <CarouselContent className="-ml-3">
                                {cards.map((p) => (
                                    <CarouselItem key={p.id} className="basis-1/2 pl-3">
                                        <div className="rounded-sm border bg-white p-3">
                                            <div className="relative h-40">
                                                <Image
                                                    src={p.image}
                                                    alt={p.name}
                                                    width={1000}
                                                    height={1000}
                                                    className="h-full w-full object-contain"
                                                />
                                            </div>

                                            {p.brand ? (
                                                <div className="mt-2 text-[11px] text-muted-foreground">{p.brand}</div>
                                            ) : null}

                                            <Link
                                                href={`/shop/${p.productId}`}
                                                className="mt-1 block line-clamp-2 text-xs font-medium"
                                            >
                                                {p.name}
                                            </Link>

                                            <div className="mt-2 text-sm font-bold text-green-600">
                                                {p.priceText}
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            <CarouselPrevious className="hidden md:flex" />
                            <CarouselNext className="hidden md:flex" />
                        </Carousel>
                    </div>
                </>
            )}
        </section>
    );
}