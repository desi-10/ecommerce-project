"use client";

import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";
import { useGetCategories } from "@/hooks/use-category";

type FilterPayload = {
    search: string;
    categories: string[];
    brands: string[];
    minPrice: number;
    maxPrice: number;
};

type Props = {
    onApply?: (filters: FilterPayload) => void;
};

const brands = ["Unilever", "LG Electronics", "Canon", "Asus", "Sony"];

export default function ShopSidebar({ onApply }: Props) {
    const { data: categoryData } = useGetCategories();
    const categories = categoryData?.data?.categories ?? [];

    const [search, setSearch] = useState("");
    const [price, setPrice] = useState<[number, number]>([0, 2000]);
    const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set());
    const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());

    const handleApply = () => {
        onApply?.({
            search,
            categories: Array.from(selectedCats),
            brands: Array.from(selectedBrands),
            minPrice: price[0],
            maxPrice: price[1],
        });
    };

    const handleReset = () => {
        setSearch("");
        setSelectedCats(new Set());
        setSelectedBrands(new Set());
        setPrice([0, 2000]);

        onApply?.({
            search: "",
            categories: [],
            brands: [],
            minPrice: 0,
            maxPrice: 2000,
        });
    };

    return (
        <div className="space-y-6 sticky top-36 bg-white p-4">
            {/* SEARCH */}
            <div>
                <div className="text-xs font-semibold tracking-wide text-muted-foreground">
                    SEARCH
                </div>
                <Separator className="my-3" />
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products..."
                        className="pl-9"
                    />
                </div>
            </div>

            {/* CATEGORIES */}
            <div>
                <div className="text-xs font-semibold tracking-wide text-muted-foreground">
                    CATEGORIES
                </div>
                <Separator className="my-3" />
                <div className="space-y-2 max-h-48 overflow-auto">
                    {categories.map((c) => {
                        const slug = String(c.slug);
                        const checked = selectedCats.has(slug);

                        return (
                            <label key={slug} className="flex items-center gap-2 text-sm">
                                <Checkbox
                                    checked={checked}
                                    onCheckedChange={(val) => {
                                        const next = new Set(selectedCats);
                                        if (val) next.add(slug);
                                        else next.delete(slug);
                                        setSelectedCats(next);
                                    }}
                                />
                                <span className="text-neutral-700">{c.name}</span>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* BRANDS */}
            <div>
                <div className="text-xs font-semibold tracking-wide text-muted-foreground">
                    BY BRANDS
                </div>
                <Separator className="my-3" />
                <div className="space-y-2">
                    {brands.map((b) => {
                        const checked = selectedBrands.has(b);

                        return (
                            <label key={b} className="flex items-center gap-2 text-sm">
                                <Checkbox
                                    checked={checked}
                                    onCheckedChange={(val) => {
                                        const next = new Set(selectedBrands);
                                        if (val) next.add(b);
                                        else next.delete(b);
                                        setSelectedBrands(next);
                                    }}
                                />
                                <span className="text-neutral-700">{b}</span>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* PRICE */}
            <div>
                <div className="text-xs font-semibold tracking-wide text-muted-foreground">
                    BY PRICE
                </div>
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
                        Price:{" "}
                        <span className="font-medium text-foreground">${price[0]}</span> —{" "}
                        <span className="font-medium text-foreground">${price[1]}</span>
                    </div>
                </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-2 pt-4 border-t">
                <Button className="w-full" onClick={handleApply}>
                    Apply Filters
                </Button>

                <Button variant="outline" className="w-full" onClick={handleReset}>
                    Reset
                </Button>
            </div>
        </div>
    );
}