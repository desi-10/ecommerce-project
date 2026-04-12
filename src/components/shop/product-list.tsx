"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { useWishlistStore } from "@/stores/wishlist.store";
import type { Product } from "@/types/product";

function money(n: number) {
    return n.toFixed(2);
}

function pickDisplayVariant(p: Product) {
    if (!p.variants?.length) return null;
    const withSale = p.variants.find((v) => Number(v.salePrice) > 0);
    return withSale ?? p.variants[0];
}

export default function ProductListRow({ p }: { p: Product }) {
    const addItem = useCartStore((s) => s.addItem);
    const toggleWish = useWishlistStore((s) => s.toggle);

    const v = pickDisplayVariant(p);
    const keyId = v?.id ? String(v.id) : String(p.id);

    const inCart = useCartStore((s) => s.has(keyId));
    const inWish = useWishlistStore((s) => s.has(keyId));

    const price = v ? Number(v.salePrice || v.price || 0) : 0;
    const oldPrice = v && Number(v.salePrice) > 0 ? Number(v.price || 0) : null;

    const stock = v?.inventory?.stock ?? 0;
    const disabled = !v || stock <= 0;

    const imageSrc = p.image
        ?? (p.images?.[0] && typeof p.images[0] === 'object' ? (p.images[0] as any).url : p.images?.[0])
        ?? "/martfury/product.png";
    const brand = ""; 
    const reviews = 0; 

    return (
        <div className="border border-neutral-200 bg-white p-4 hover:shadow-sm transition">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[150px_1fr_200px] md:items-start">
                <div className="relative aspect-square w-full">
                    <Image
                        src={imageSrc}
                        alt={p.name}
                        fill
                        className="object-contain p-2"
                        sizes="150px"
                    />
                </div>

                <div className="min-w-0">
                    <Link
                        href={`/shop/${p.id}`}
                        className="mt-1 line-clamp-2 cursor-pointer text-base font-medium text-blue-600 hover:underline"
                    >
                        {p.name}
                    </Link>

                    <div className="mt-1 text-xs text-yellow-500">
                        {"★★★★☆"}{" "}
                        <span className="text-muted-foreground">({reviews})</span>
                    </div>

                    <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-muted-foreground">
                        <li>High-quality materials and construction</li>
                        <li>Ergonomic design for maximum comfort</li>
                        <li>1-year manufacturer warranty included</li>
                    </ul>

                    {v && (
                        <div className="mt-3 text-[11px] text-muted-foreground">
                            SKU: <span className="font-medium text-foreground">{v.sku ?? "—"}</span>{" "}
                            • Stock:{" "}
                            <span className={stock > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                                {stock > 0 ? `${stock} available` : "Out of stock"}
                            </span>
                        </div>
                    )}
                </div>

                <div className="bg-neutral-50 p-4 rounded-sm border border-neutral-100 h-full flex flex-col justify-between">
                    <div>
                        <div className="text-lg font-bold text-neutral-900">${money(price)}</div>
                        {oldPrice !== null && oldPrice > price ? (
                            <div className="text-sm text-muted-foreground line-through">
                                ${money(oldPrice)}
                            </div>
                        ) : null}
                    </div>

                    <div className="mt-4 space-y-2">
                        <Button
                            className="w-full gap-2"
                            variant={inCart ? "outline" : "default"}
                            disabled={disabled}
                            onClick={() => {
                                if (!inCart && v) {
                                    addItem({ id: keyId, name: p.name, price, image: imageSrc });
                                }
                            }}
                        >
                            {inCart ? <> <Check className="h-4 w-4" /> In Cart </> : <> <ShoppingCart className="h-4 w-4" /> Add to cart </>}
                        </Button>
                        
                        <Button
                            variant="ghost"
                            className="w-full text-xs gap-2 h-9"
                            onClick={() => toggleWish({ id: keyId, name: p.name, price, image: imageSrc })}
                        >
                            <Heart className={`h-4 w-4 ${inWish ? "fill-red-500 text-red-500" : ""}`} />
                            {inWish ? "Wishlisted" : "Add to wishlist"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}