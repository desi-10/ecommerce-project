"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart.store";
import type { Product } from "@/types/product";

function money(n: number) {
    // You can swap this for Intl.NumberFormat later
    return n.toFixed(2);
}

function pickDisplayVariant(p: Product) {
    // Prefer a variant with a sale price; fallback to the first variant.
    if (!p.variants?.length) return null;

    const withSale = p.variants.find((v) => Number(v.salePrice) > 0);
    return withSale ?? p.variants[0];
}

export default function ProductListRow({ p }: { p: Product }) {
    const addItem = useCartStore((s) => s.addItem);

    const v = pickDisplayVariant(p);

    const price = v ? Number(v.salePrice || v.price || 0) : 0;
    const oldPrice =
        v && Number(v.salePrice) > 0 ? Number(v.price || 0) : null;

    const stock = v?.inventory?.stock ?? 0;

    // Resolve product image from API data
    const imageSrc = p.image
        ?? (p.images?.[0] && typeof p.images[0] === 'object' ? (p.images[0] as any).url : p.images?.[0])
        ?? "/martfury/product.png";
    const brand = ""; // or p.brand if you add it later
    const reviews = 0; // or p.reviewCount if you add it later

    const disabled = stock <= 0;

    return (
        <div className="border border-neutral-200 bg-white p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[120px_1fr_160px] md:items-start">
                <div className="relative aspect-square w-full">
                    <Image
                        src={imageSrc}
                        alt={p.name}
                        fill
                        className="object-contain p-2"
                        sizes="120px"
                    />
                </div>

                <div className="min-w-0">
                    {brand ? (
                        <div className="text-[11px] text-muted-foreground">{brand}</div>
                    ) : null}

                    <Link
                        href={`/shop/${p.id}`}
                        className="mt-1 line-clamp-2 cursor-pointer text-sm font-medium text-blue-600 hover:underline"
                    >
                        {p.name}
                    </Link>

                    <div className="mt-2 text-xs text-yellow-500">
                        {"★★★★☆"}{" "}
                        <span className="text-muted-foreground">({reviews})</span>
                    </div>

                    <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-muted-foreground">
                        <li>Portable and lightweight</li>
                        <li>High quality build</li>
                        <li>Fast delivery</li>
                    </ul>

                    {v ? (
                        <div className="mt-3 text-xs text-muted-foreground">
                            SKU: <span className="font-medium text-foreground">{v.sku ?? "—"}</span>{" "}
                            • Stock:{" "}
                            <span className={stock > 0 ? "text-foreground" : "text-red-600"}>
                                {stock > 0 ? stock : "Out of stock"}
                            </span>
                        </div>
                    ) : (
                        <div className="mt-3 text-xs text-red-600">
                            No variant/pricing attached to this product.
                        </div>
                    )}
                </div>

                <div className="text-left md:text-right">
                    <div className="text-sm font-semibold">${money(price)}</div>

                    {oldPrice !== null && oldPrice > price ? (
                        <div className="text-xs text-muted-foreground line-through">
                            ${money(oldPrice)}
                        </div>
                    ) : null}

                    <Link href={`/shop/${p.id}`}>
                        <Button
                            className="mt-3 w-full md:w-auto"
                            disabled={disabled || !v}
                            onClick={() =>
                                addItem({
                                    id: p.id,
                                    name: p.name,
                                    price,
                                    image: imageSrc,
                                })
                            }
                        >
                            {/* {disabled ? "Out of stock" : "Add to cart"} */}
                            View
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}