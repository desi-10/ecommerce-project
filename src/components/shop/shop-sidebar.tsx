"use client";

import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useGetCategories } from "@/hooks/use-category";
import { cn } from "@/lib/utils";

type FilterPayload = {
    search: string;
    categories: string[];
    rating: number | null;
    minPrice: number;
    maxPrice: number;
};

type Props = {
    onApply?: (filters: FilterPayload) => void;
};

export default function ShopSidebar({ onApply }: Props) {
    const { data: categoryData } = useGetCategories();
    const categories = categoryData?.data?.categories ?? [];

    const searchParams = useSearchParams();

    const [search, setSearch] = useState("");
    const [price, setPrice] = useState<[number, number]>([0, 2000]);
    const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set());
    const [rating, setRating] = useState<number | null>(null);

    // Sync visual UI state with initial search params or when URL changes externally
    useEffect(() => {
        const q = searchParams.get("q");
        if (q) setSearch(q);
        
        const cat = searchParams.get("category");
        if (cat) {
            setSelectedCats(new Set([cat]));
        } else {
            setSelectedCats(new Set()); // Clear if URL loses the query
        }

        const min = searchParams.get("minPrice");
        const max = searchParams.get("maxPrice");
        if (min || max) {
            setPrice([Number(min || 0), Number(max || 2000)]);
        }

        const rate = searchParams.get("rating");
        if (rate) {
            setRating(Number(rate));
        } else {
            setRating(null);
        }
    }, [searchParams]);

    const handleApply = () => {
        onApply?.({
            search,
            categories: Array.from(selectedCats),
            rating,
            minPrice: price[0],
            maxPrice: price[1],
        });
    };

    const handleReset = () => {
        setSearch("");
        setSelectedCats(new Set());
        setRating(null);
        setPrice([0, 2000]);

        onApply?.({
            search: "",
            categories: [],
            rating: null,
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

            {/* RATING */}
            <div>
                <div className="text-xs font-semibold tracking-wide text-muted-foreground">
                    BY RATING
                </div>
                <Separator className="my-3" />
                <div className="space-y-2.5">
                    {[5, 4, 3, 2, 1].map((r) => {
                        const checked = rating === r;

                        return (
                            <label key={r} className="flex items-center gap-2.5 text-sm cursor-pointer select-none py-0.5 group">
                                <Checkbox
                                    checked={checked}
                                    onCheckedChange={(val) => {
                                        setRating(val ? r : null);
                                    }}
                                    className={cn(
                                        checked ? "border-primary bg-primary text-primary-foreground" : "border-neutral-300"
                                    )}
                                />
                                <div className="flex items-center gap-1.5">
                                    <div className="flex items-center text-amber-400">
                                        {Array.from({ length: 5 }).map((_, idx) => (
                                            <Star
                                                key={idx}
                                                className={cn(
                                                    "w-3.5 h-3.5",
                                                    idx < r ? "fill-amber-400 stroke-amber-400" : "fill-transparent stroke-neutral-300 dark:stroke-neutral-600"
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs text-neutral-600 font-medium group-hover:text-primary transition-colors">
                                        {r === 5 ? "5 Stars" : `& Up`}
                                    </span>
                                </div>
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