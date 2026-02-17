"use client";

import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const categories = [
    "Fruit",
    "Cars & Motorcycle",
    "Clothing & Apparel",
    "Consumer Electronics",
    "Computers & Technologies",
    "Garden & Kitchen",
    "Health & Beauty",
    "Jewelry & Watches",
];

const brands = ["Unilever", "YoungShop", "LG Electronics", "Canon", "Asus", "Sony"];

export default function ShopSidebar() {
    const [price, setPrice] = useState<[number, number]>([0, 2000]);

    return (
        <div className="space-y-6 sticky top-36">
            <div>
                <div className="text-xs font-semibold tracking-wide text-muted-foreground">CATEGORIES</div>
                <Separator className="my-3" />
                <div className="space-y-2">
                    {categories.map((c) => (
                        <label key={c} className="flex items-center gap-2 text-sm">
                            <Checkbox />
                            <span className="text-neutral-700">{c}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <div className="text-xs font-semibold tracking-wide text-muted-foreground">BY BRANDS</div>
                <Separator className="my-3" />
                <div className="space-y-2">
                    {brands.map((b) => (
                        <label key={b} className="flex items-center gap-2 text-sm">
                            <Checkbox />
                            <span className="text-neutral-700">{b}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <div className="text-xs font-semibold tracking-wide text-muted-foreground">BY PRICE</div>
                <Separator className="my-3" />
                <div className="px-1">
                    <Slider
                        value={price}
                        onValueChange={(v) => setPrice([v[0] ?? 0, v[1] ?? 2000])}
                        min={0}
                        max={2000}
                        step={10}
                    />
                    <div className="mt-3 text-xs text-muted-foreground">
                        Price: <span className="text-foreground font-medium">${price[0]}</span> —{" "}
                        <span className="text-foreground font-medium">${price[1]}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
