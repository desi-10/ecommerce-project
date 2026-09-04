"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart.store";
import { useLanguage } from "@/context/language-context";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

function Stars({ value = 4, count = 0 }: { value?: number, count?: number }) {
    const full = Math.max(0, Math.min(5, Math.floor(value)));
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < full ? "text-yellow-500" : "text-neutral-300"}>
                    ★
                </span>
            ))}
            <span className="ml-2 text-xs text-muted-foreground">({count} reviews)</span>
        </div>
    );
}

type Variant = {
    id: string;
    name: string;
    sku: string | null;
    price: string;
    salePrice: string;
    inventory?: { stock: number } | null;
};

type Product = {
    id: string;
    name: string;
    description?: string;
    brand?: string | null;
    status: "ACTIVE" | "INACTIVE";
    variants: Variant[];
    reviews?: any[];
    vendor?: { name: string } | null;
};

type Props = {
    product: Product;
    selectedVariantId: string;
    onSelectVariant: (id: string) => void;
};

const toMoney = (v: string) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};

export default function ProductInfo({
    product,
    selectedVariantId,
    onSelectVariant,
}: Props) {
    const { t } = useLanguage();
    const [qty, setQty] = useState(1);
    const router = useRouter();
    const addItemWithQty = useCartStore((s) => s.addItemWithQty);

    const safeQty = useMemo(() => Math.max(1, Math.min(99, qty)), [qty]);

    const selectedVariant =
        product.variants.find((v) => v.id === selectedVariantId) ?? product.variants[0];

    const price = toMoney(selectedVariant?.salePrice || selectedVariant?.price || "0");
    const stock = selectedVariant?.inventory?.stock ?? 0;
    const outOfStock = stock <= 0;

    const addToCart = () => {
        if (!selectedVariant) return;

        // You can replace image with real product image if you have one
        addItemWithQty(
            {
                id: selectedVariant.id,
                name: `${product.name} — ${selectedVariant.name}`,
                price,
                image: "/martfury/product.png",
            },
            safeQty
        );
    };

    const buyNow = () => {
        addToCart();
        router.push("/checkout");
    };

    return (
        <div className="min-w-0">
            <div className="flex items-center justify-between gap-3">
                <h1 className="text-xl md:text-2xl font-semibold leading-snug">
                    {product.name}
                </h1>

                <Button
                    variant="outline"
                    className="h-10 w-10 grid place-items-center border border-neutral-200 hover:bg-neutral-50"
                    type="button"
                >
                    <Heart className="h-4 w-4 text-red-500" />
                </Button>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                <div className="text-muted-foreground">
                    Brand: <span className="text-blue-600 font-medium">{product.brand || "Original"}</span>
                </div>
                <Stars value={product.reviews?.length ? 5 : 0} count={product.reviews?.length || 0} />
            </div>

            {/* Variant selector */}
            <div className="mt-5 grid gap-2">
                <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Variant</div>
                    <div className="text-xs text-muted-foreground">
                        Stock:{" "}
                        <span className={outOfStock ? "text-red-600" : ""}>
                            {stock}
                        </span>
                    </div>
                </div>

                <Select value={selectedVariantId} onValueChange={onSelectVariant}>
                    <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select a variant" />
                    </SelectTrigger>
                    <SelectContent>
                        {product.variants.map((v) => {
                            const s = v.inventory?.stock ?? 0;
                            return (
                                <SelectItem key={v.id} value={v.id}>
                                    {v.name}
                                    {v.sku ? ` • ${v.sku}` : ""}
                                    {s <= 0 ? " • Out of stock" : ""}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </div>

            <div className="mt-4 text-2xl font-semibold">
                {price.toFixed(2)}
            </div>

            <div className="mt-3 text-xs text-muted-foreground">
                Sold by: <span className="text-blue-600 cursor-pointer font-medium">{product.vendor?.name || "Martfury Official"}</span>
            </div>

            {product.description ? (
                <p className="mt-4 text-sm text-muted-foreground">{product.description}</p>
            ) : null}

            {/* Quantity + actions */}
            <div className="mt-6">
                <div className="text-xs text-muted-foreground mb-2">Quantity</div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center border border-neutral-200 bg-white h-10">
                        <Button
                            variant="ghost"
                            className="rounded-none grid place-items-center text-neutral-600 hover:bg-neutral-50"
                            onClick={() => setQty((v) => Math.max(1, v - 1))}
                            aria-label="Decrease quantity"
                            type="button"
                            disabled={outOfStock}
                        >
                            –
                        </Button>

                        <Input
                            className="border-none w-14 h-10 text-center text-sm outline-none rounded-none"
                            value={safeQty}
                            onChange={(e) => setQty(Number(e.target.value || 1))}
                            type="number"
                            inputMode="numeric"
                            min={1}
                            max={99}
                            disabled={outOfStock}
                        />

                        <Button
                            variant="ghost"
                            className="rounded-none grid place-items-center text-neutral-600 hover:bg-neutral-50"
                            onClick={() => setQty((v) => Math.min(99, v + 1))}
                            aria-label="Increase quantity"
                            type="button"
                            disabled={outOfStock}
                        >
                            +
                        </Button>
                    </div>

                    <Button onClick={addToCart} type="button" disabled={outOfStock}>
                        {outOfStock ? t("product.out_of_stock", "Out of stock") : t("product.add_to_cart", "Add to cart")}
                    </Button>

                    <Button variant="outline" onClick={buyNow} type="button" disabled={outOfStock}>
                        {t("product.buy_now", "Buy Now")}
                    </Button>
                </div>
            </div>
        </div>
    );
}