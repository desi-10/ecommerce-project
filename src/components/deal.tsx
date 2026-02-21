"use client";

import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "./ui/button";
import { Heart, ShoppingCart, Check, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useCartStore } from "@/stores/cart.store";
import { useWishlistStore } from "@/stores/wishlist.store";
import { useGetProducts } from "@/hooks/use-product";
import type { Product } from "@/types/product";
import { CountdownTimer } from "./countdown-timer";

const toNumberPrice = (value: string | number) => {
    if (typeof value === "number") return value;
    const n = Number(value.replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : 0;
};

export default function DealOfDay() {
    // Fetch products with active discounts
    const { data: productsData } = useGetProducts({
        onDiscount: true,
        limit: 12,
    });

    const products = productsData?.data?.products || [];

    // ✅ subscribe to state (reactive)
    const cartItems = useCartStore((s) => s.items);
    const wishItems = useWishlistStore((s) => s.items);

    const addItem = useCartStore((s) => s.addItem);
    const toggleWish = useWishlistStore((s) => s.toggle);

    const cartSet = useMemo(() => new Set(cartItems.map((i) => i.id)), [cartItems]);
    const wishSet = useMemo(() => new Set(wishItems.map((i) => i.id)), [wishItems]);

    // ✅ mobile: tap to reveal actions (no hover on touch)
    const [activeId, setActiveId] = useState<string | null>(null);

    // Get the earliest discount end time from products
    const earliestEndTime = products.reduce((earliest, product) => {
        const discount = product.discounts?.[0];
        if (discount?.endDate) {
            const discountEnd = new Date(discount.endDate);
            if (!earliest || discountEnd < earliest) {
                return discountEnd;
            }
        }
        return earliest;
    }, null as Date | null);

    const dealEndTime = earliestEndTime || new Date(Date.now() + 24 * 60 * 60 * 1000); // Default to 24 hours from now

    return (
        <section className="mt-6 bg-white border rounded-sm">
            <div className="flex items-center justify-between px-4 py-3">
                <div className="mozilla-text text-xl lg:text-2xl font-bold">Deal of the day</div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground hidden sm:inline">End in:</span>
                    <CountdownTimer endTime={dealEndTime} />
                    <Button variant="link" className="p-0 text-sm text-muted-foreground hover:text-foreground">
                        View all
                    </Button>
                </div>
            </div>
            <Separator />

            <div className="p-4">
                <Carousel opts={{ align: "start", loop: true }}>
                    <CarouselContent className="-ml-3">
                        {products.map((p) => {
                            const variant = p.variants?.[0];
                            const id = variant?.id || p.id;
                            const priceNum = toNumberPrice(variant?.salePrice || variant?.price || 0);
                            const oldPrice = variant && Number(variant.salePrice) > 0 
                                ? toNumberPrice(variant.price) 
                                : null;
                            const isInCart = cartSet.has(id);
                            const isInWish = wishSet.has(id);
                            const showActions = activeId === id;
                            const imageSrc = "/martfury/product.png";

                            return (
                                <CarouselItem
                                    key={id}
                                    className="pl-3 basis-1/2 sm:basis-1/3 md:basis-1/5"
                                >
                                    {/* wrapper that enables tap-to-show on mobile */}
                                    <div
                                        className="group border rounded-sm p-3 hover:shadow-sm transition bg-white relative"
                                        onClick={() => setActiveId((curr) => (curr === id ? null : id))}
                                    >
                                        {/* Image */}
                                        <div className="relative h-48">
                                            <Image
                                                src={imageSrc}
                                                alt={p.name}
                                                width={1000}
                                                height={1000}
                                                className="object-contain h-full w-full"
                                            />

                                            {/* Desktop: hover-only actions. Mobile: show when activeId matches */}
                                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                                <div
                                                    className={[
                                                        "pointer-events-auto transition duration-200",
                                                        // desktop hover
                                                        "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0",
                                                        // mobile tap (md:hidden to avoid conflicts)
                                                        showActions ? "opacity-100 translate-y-0 md:opacity-0 md:translate-y-2" : "",
                                                    ].join(" ")}
                                                >
                                                    <div className="flex items-center gap-2 rounded-full bg-white/90 p-2 shadow-sm border border-neutral-200">
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            className="h-9 w-9"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleWish({
                                                                    id,
                                                                    name: p.name,
                                                                    price: priceNum,
                                                                    image: imageSrc,
                                                                    brand: "",
                                                                });
                                                            }}
                                                            aria-label={isInWish ? "Remove from wishlist" : "Add to wishlist"}
                                                        >
                                                            <Heart
                                                                className={`h-4 w-4 ${isInWish ? "fill-red-500 text-red-500" : "text-neutral-700"
                                                                    }`}
                                                            />
                                                        </Button>

                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            className="h-9 w-9"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (!isInCart) addItem({ id, name: p.name, price: priceNum, image: imageSrc });
                                                            }}
                                                            aria-label={isInCart ? "Already in cart" : "Add to cart"}
                                                        >
                                                            {isInCart ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
                                                        </Button>

                                                        {/* Close button for mobile tap UI */}
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            className="h-9 w-9 md:hidden"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveId(null);
                                                            }}
                                                            aria-label="Close actions"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <Link
                                            href={`/shop/${p.id}`}
                                            className="mt-1 text-xs font-medium line-clamp-2 block"
                                            onClick={(e) => e.stopPropagation()} // don't toggle actions when navigating
                                        >
                                            <Button variant="link" className="p-0 text-gray-800 hover:text-primary">
                                                {p.name}
                                            </Button>
                                        </Link>

                                        <div className="mt-2 flex items-center gap-2">
                                            <div className="text-sm font-bold text-green-600">${priceNum.toFixed(2)}</div>
                                            {oldPrice !== null && oldPrice > priceNum ? (
                                                <div className="text-xs text-muted-foreground line-through">${oldPrice.toFixed(2)}</div>
                                            ) : null}
                                        </div>
                                    </div>
                                </CarouselItem>
                            );
                        })}
                    </CarouselContent>

                    <CarouselPrevious className="hidden md:flex" />
                    <CarouselNext className="hidden md:flex" />
                </Carousel>
            </div>
        </section>
    );
}
