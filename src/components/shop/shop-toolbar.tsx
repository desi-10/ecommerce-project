"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LayoutGrid, List } from "lucide-react";

export default function ShopToolbar({
    count,
    view,
    onViewChange,
    sort,
    onSortChange,
}: {
    count: number;
    view: "grid" | "list";
    onViewChange: (v: "grid" | "list") => void;
    sort: "latest" | "price_low" | "price_high";
    onSortChange: (v: "latest" | "price_low" | "price_high") => void;
}) {
    return (
        <div className="hidden md:flex items-center justify-between border border-neutral-200 bg-white px-4 py-3">
            <div className="text-sm">
                <span className="font-semibold">{count}</span>{" "}
                <span className="text-muted-foreground">products found</span>
            </div>

            <div className="flex items-center gap-3">
                <div className="text-sm text-muted-foreground">Sort by:</div>

                <Select value={sort} onValueChange={(v) => onSortChange(v as "latest" | "price_low" | "price_high")}>
                    <SelectTrigger className="h-9 w-[180px] rounded-sm">
                        <SelectValue placeholder="Sort by latest" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="latest">Sort by latest</SelectItem>
                        <SelectItem value="price_low">Price: low to high</SelectItem>
                        <SelectItem value="price_high">Price: high to low</SelectItem>
                    </SelectContent>
                </Select>

                <div className="ml-2 text-sm text-muted-foreground">View:</div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className={[
                            "h-9 w-9 rounded-sm",
                            view === "grid" ? "border-primary text-primary" : "",
                        ].join(" ")}
                        onClick={() => onViewChange("grid")}
                        aria-label="Grid view"
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        className={[
                            "h-9 w-9 rounded-sm",
                            view === "list" ? "border-primary text-primary" : "",
                        ].join(" ")}
                        onClick={() => onViewChange("list")}
                        aria-label="List view"
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
