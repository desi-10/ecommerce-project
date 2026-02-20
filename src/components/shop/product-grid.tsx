"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Check, BarChart3 } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { useWishlistStore } from "@/stores/wishlist.store";


export default function ProductGridCard({
    p,
}: {
    p: {
        id: string; // ✅ ADD id (variantId or productId)
        brand: string;
        name: string;
        price: number;
        oldPrice: number | null;
        rating: number;
        reviews: number;
        image: string;
    };
}) {
    const addItem = useCartStore((s) => s.addItem);
    const inCart = useCartStore((s) => s.has(p.id));

    const toggleWish = useWishlistStore((s) => s.toggle);
    const inWish = useWishlistStore((s) => s.has(p.id));

    const productHref = `/shop/${p.id}`;

    return (
        <div className="group border border-neutral-200 bg-white p-3 hover:shadow-sm transition">
            {/* Image + hover overlay */}
            <div className="relative aspect-square w-full overflow-hidden">
                <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-contain p-4 transition-transform duration-200 group-hover:scale-[1.02]"
                />

                {/* Hover actions (like Woo/WordPress themes) */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="pointer-events-auto translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-200">
                        <div className="flex items-center gap-2 rounded-full bg-white/90 p-2 shadow-sm border border-neutral-200">
                            <Button
                                size="icon"
                                variant="outline"
                                className="h-9 w-9"
                                onClick={() =>
                                    toggleWish({
                                        id: p.id,
                                        name: p.name,
                                        price: p.price,
                                        image: p.image,
                                        brand: p.brand,
                                    })
                                }
                                aria-label={inWish ? "Remove from wishlist" : "Add to wishlist"}
                            >
                                <Heart
                                    className={`h-4 w-4 ${inWish ? "fill-red-500 text-red-500" : "text-neutral-700"}`}
                                />
                            </Button>

                            <Button
                                size="icon"
                                variant="outline"
                                className="h-9 w-9"
                                onClick={() => {
                                    if (!inCart) {
                                        addItem({ id: p.id, name: p.name, price: p.price, image: p.image });
                                    }
                                }}
                                aria-label={inCart ? "Already in cart" : "Add to cart"}
                            >
                                {inCart ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
                            </Button>

                            <Button
                                size="icon"
                                variant="outline"
                                className="h-9 w-9"
                                onClick={() => {
                                    // compare can come later; for now you can store a compare list similar to wishlist
                                    console.log("compare", p.id);
                                }}
                                aria-label="Compare"
                            >
                                <BarChart3 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Small badge top-left (optional) */}
                {p.oldPrice && (
                    <div className="absolute left-2 top-2 rounded bg-red-500 px-2 py-1 text-[10px] font-semibold text-white">
                        Sale
                    </div>
                )}
            </div>

            {/* Text content */}
            <div className="mt-2 text-[11px] text-muted-foreground">{p.brand}</div>

            <Link
                href={productHref}
                className="mt-1 text-xs font-medium text-blue-600 line-clamp-2 hover:underline cursor-pointer"
            >
                {p.name}
            </Link>

            <div className="mt-1 text-xs text-yellow-500">
                {"★★★★☆"} <span className="text-muted-foreground">({p.reviews})</span>
            </div>

            <div className="mt-1 flex items-center gap-2">
                <div className="text-sm font-semibold">${p.price.toFixed(2)}</div>
                {p.oldPrice && (
                    <div className="text-xs text-muted-foreground line-through">
                        ${p.oldPrice.toFixed(2)}
                    </div>
                )}
            </div>

            {/* Bottom row button (optional, also like WP themes) */}
            <div className="mt-3">
                <Button
                    className="w-full"
                    variant={inCart ? "outline" : "default"}
                    onClick={() => {
                        if (!inCart) addItem({ id: p.id, name: p.name, price: p.price, image: p.image });
                    }}
                >
                    {inCart ? "In cart ✓" : "Add to cart"}
                </Button>
            </div>
        </div>
    );
}
