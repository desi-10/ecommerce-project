"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart.store";

function Stars({ value = 4 }: { value?: number }) {
    const full = Math.max(0, Math.min(5, Math.floor(value)));
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <span
                    key={i}
                    className={i < full ? "text-yellow-500" : "text-neutral-300"}
                >
                    ★
                </span>
            ))}
            <span className="ml-2 text-xs text-muted-foreground">(1 review)</span>
        </div>
    );
}

// ✅ make it reusable by passing product/variant data
type ProductInfoProps = {
    variantId: string; // use variantId as cart item id
    name: string;
    brand?: string;
    price: number;
    image: string;
};

export default function ProductInfo({
    variantId,
    name,
    brand = "No Brand",
    price,
    image,
}: ProductInfoProps) {
    const [qty, setQty] = useState(1);
    const router = useRouter();

    const safeQty = useMemo(() => Math.max(1, Math.min(99, qty)), [qty]);

    const addItemWithQty = useCartStore((s) => s.addItemWithQty);

    const addToCart = () => {
        addItemWithQty(
            { id: variantId, name, price, image },
            safeQty
        );
    };

    const buyNow = () => {
        addToCart();
        router.push("/cart"); // or "/checkout"
    };

    return (
        <div className="min-w-0">
            <div className="flex items-center justify-between gap-3">
                <h1 className="text-xl md:text-2xl font-semibold leading-snug">{name}</h1>

                <Button
                    variant="outline"
                    className="h-10 w-10 grid place-items-center border border-neutral-200 hover:bg-neutral-50"
                >
                    <Heart className="h-4 w-4 text-red-500" />
                </Button>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                <div className="text-muted-foreground">
                    Brand: <span className="text-blue-600 cursor-pointer">{brand}</span>
                </div>
                <Stars value={4} />
            </div>

            <div className="mt-4 text-2xl font-semibold">${price.toFixed(2)}</div>

            <div className="mt-3 text-xs text-muted-foreground">
                Sold by:{" "}
                <span className="text-blue-600 cursor-pointer font-medium">NO VENDOR</span>
            </div>

            <ul className="mt-4 space-y-2 text-xs text-muted-foreground list-disc pl-5">
                <li>Unrestrained and portable active stereo speaker</li>
                <li>Free from the confines of wires and chords</li>
                <li>20 hours of portable capabilities</li>
                <li>Double-ended Coil Cord with 3.5mm Stereo Plugs Included</li>
                <li>3/4&quot; Dome Tweeters: 2X and 4&quot; Woofer: 1X</li>
            </ul>

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
                        />

                        <Button
                            variant="ghost"
                            className="rounded-none grid place-items-center text-neutral-600 hover:bg-neutral-50"
                            onClick={() => setQty((v) => Math.min(99, v + 1))}
                            aria-label="Increase quantity"
                            type="button"
                        >
                            +
                        </Button>
                    </div>

                    <Button onClick={addToCart} type="button">
                        Add to cart
                    </Button>

                    <Button variant="outline" onClick={buyNow} type="button">
                        Buy Now
                    </Button>
                </div>
            </div>
        </div>
    );
}
