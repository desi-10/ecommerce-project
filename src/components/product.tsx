"use client";

import Image from "next/image";
import Link from "next/link";
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
const items = [
    {
        id: "1",
        brand: "APPLE",
        name: "Apple iPhone 14 Pro – Space Black",
        price: "$999.99",
        image:
            "https://images.unsplash.com/photo-1664478546384-1b1c4a829af9?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: "1dvrbg",
        brand: "APPLE",
        name: "Apple iPhone 14 Pro – Space Black",
        price: "$999.99",
        image:
            "https://images.unsplash.com/photo-1664478546384-1b1c4a829af9?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: "1sqdwd",
        brand: "APPLE",
        name: "Apple iPhone 14 Pro – Space Black",
        price: "$999.99",
        image:
            "https://images.unsplash.com/photo-1664478546384-1b1c4a829af9?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: "qsqs1",
        brand: "APPLE",
        name: "Apple iPhone 14 Pro – Space Black",
        price: "$999.99",
        image:
            "https://images.unsplash.com/photo-1664478546384-1b1c4a829af9?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: "1swdwd",
        brand: "APPLE",
        name: "Apple iPhone 14 Pro – Space Black",
        price: "$999.99",
        image:
            "https://images.unsplash.com/photo-1664478546384-1b1c4a829af9?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: "   qs1",
        brand: "APPLE",
        name: "Apple iPhone 14 Pro – Space Black",
        price: "$999.99",
        image:
            "https://images.unsplash.com/photo-1664478546384-1b1c4a829af9?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: "1dwds",
        brand: "APPLE",
        name: "Apple iPhone 14 Pro – Space Black",
        price: "$999.99",
        image:
            "https://images.unsplash.com/photo-1664478546384-1b1c4a829af9?auto=format&fit=crop&w=600&q=80",
    },
    // ... keep the rest, but make id a string for consistency
];
const toNumberPrice = (value: string) => {
    const n = Number(value.replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : 0;
};

export default function ProductSection({ title }: { title: string }) {
    const addItem = useCartStore((s) => s.addItem);

    // ✅ subscribe to reactive state
    const cartItems = useCartStore((s) => s.items);
    const wishItems = useWishlistStore((s) => s.items);

    const toggleWish = useWishlistStore((s) => s.toggle);

    // ✅ fast lookups that update when items change
    const cartSet = new Set(cartItems.map((i) => i.id));
    const wishSet = new Set(wishItems.map((i) => i.id));

    return (
        <section className="mt-8 bg-white border rounded-sm">
            <div className="p-4 flex items-center justify-between gap-4">
                <div className="mozilla-text text-xl lg:text-2xl font-bold">{title}</div>
                <Button variant="link" className="p-0 text-sm text-muted-foreground hover:text-foreground">
                    View All
                </Button>
            </div>

            {/* Desktop grid */}
            <div className="hidden md:grid grid-cols-5 gap-0 border-t">
                {items.slice(0, 10).map((p) => {
                    const id = String(p.id);
                    const priceNum = toNumberPrice(p.price);

                    const isInCart = cartSet.has(id);
                    const isInWish = wishSet.has(id);

                    return (
                        <div key={id} className="group p-4 border-r last:border-r-0 border-b">
                            <div className="relative h-48 overflow-hidden">
                                <Image
                                    src={p.image}
                                    alt={p.name}
                                    className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-[1.03]"
                                    width={1000}
                                    height={1000}
                                />

                                {/* ✅ Hover-only actions */}
                                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                    <div className="pointer-events-auto translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-200">
                                        <div className="flex items-center gap-2 rounded-full bg-white/90 p-2 shadow-sm border border-neutral-200">
                                            {/* Wishlist */}
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className="h-9 w-9"
                                                onClick={() =>
                                                    toggleWish({
                                                        id,
                                                        name: p.name,
                                                        price: priceNum,
                                                        image: p.image,
                                                        brand: p.brand,
                                                    })
                                                }
                                                aria-label={isInWish ? "Remove from wishlist" : "Add to wishlist"}
                                            >
                                                <Heart
                                                    className={`h-4 w-4 ${isInWish ? "fill-red-500 text-red-500" : "text-neutral-700"
                                                        }`}
                                                />
                                            </Button>

                                            {/* Cart */}
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className="h-9 w-9"
                                                onClick={() => {
                                                    if (!isInCart) {
                                                        addItem({ id, name: p.name, price: priceNum, image: p.image });
                                                    }
                                                }}
                                                aria-label={isInCart ? "Already in cart" : "Add to cart"}
                                            >
                                                {isInCart ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-2 text-[11px] text-muted-foreground">{p.brand}</div>

                            <Link
                                href={`/shop/${id}`}
                                className="mt-1 text-xs font-medium line-clamp-2 hover:text-blue-600"
                            >
                                {p.name}
                            </Link>

                            <div className="mt-2 text-sm font-bold text-green-600">{p.price}</div>
                        </div>
                    );
                })}
            </div>

            {/* Mobile slider (no actions row; hover doesn’t exist on mobile) */}
            <div className="md:hidden border-t p-4">
                <Carousel opts={{ align: "start", loop: true }}>
                    <CarouselContent className="-ml-3">
                        {items.slice(0, 10).map((p) => {
                            const id = String(p.id);

                            return (
                                <CarouselItem key={id} className="pl-3 basis-1/2">
                                    <div className="border rounded-sm p-3 bg-white">
                                        <div className="relative h-40">
                                            <Image
                                                src={p.image}
                                                alt={p.name}
                                                width={1000}
                                                height={1000}
                                                className="object-contain w-full h-full"
                                            />
                                        </div>

                                        <div className="mt-2 text-[11px] text-muted-foreground">{p.brand}</div>

                                        <Link href={`/shop/${id}`} className="mt-1 block text-xs font-medium line-clamp-2">
                                            {p.name}
                                        </Link>

                                        <div className="mt-2 text-sm font-bold text-green-600">{p.price}</div>
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
