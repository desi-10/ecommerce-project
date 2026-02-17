"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import ShopSidebar from "./shop-sidebar";
import ShopToolbar from "./shop-toolbar";
import ProductGridCard from "./product-grid";
import ProductListRow from "./product-list";
import PaginationBar from "./pagination";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";

type ViewMode = "grid" | "list";
type SortMode = "latest" | "price_low" | "price_high";

const ALL_PRODUCTS = Array.from({ length: 18 }).map((_, i) => ({
    id: i + 1,
    brand: "",
    name: [
        "NYX Beauty Couton Palette Makeup 12",
        "WarGold 100% Juice Milk 360ml",
        "Beef Loin Fresh Frozen Loin",
        "Pineapple (Imported) 500g",
        "Organic Oranges Valencia 1kg",
        "Lovely Cut Strawberry 1kg",
        "Package 2 60mm Beadlock Rim Tire",
        "Beats Mix On Ear Bluetooth Headphones",
        "RLA Pro Mini Bluetooth Speaker",
        "Acrylic Cover Case for iPhone X (Clear)",
        "HP Chromebook CB 11.6 Ultra",
        "GoPro Karma 4K Camera & Drone",
        "Apple TV 4K — 32GB (4th Gen)",
        "EDM 2.4 Plus Kit Hider & Charger",
        "Bose Ear Phone Bluetooth",
        "Apple Macbook Air Retina 12",
        "YI 11 Inch 2K TV",
        "Samsung Galaxy A10 4GB RAM",
    ][i],
    price: [16.19, 17.99, 39.99, 52.99, 83.99, 87.99, 79.99, 31.99, 59.99, 16.99, 97.99, 89.99, 96.99, 75.99, 22.99, 84.99, 95.99, 86.99][i],
    oldPrice: i % 4 === 0 ? [25.99, 19.99, 49.99, 69.99][i % 4] : null,
    rating: 4,
    reviews: 2,
    image: "/martfury/product.png",
}));

export default function ShopResultsWithSidebar() {
    const [view, setView] = useState<ViewMode>("grid");
    const [sort, setSort] = useState<SortMode>("latest");
    const [page, setPage] = useState(1);

    const pageSize = 12;

    const sorted = useMemo(() => {
        const items = [...ALL_PRODUCTS];
        if (sort === "price_low") items.sort((a, b) => a.price - b.price);
        if (sort === "price_high") items.sort((a, b) => b.price - a.price);
        return items;
    }, [sort]);

    const totalPages = Math.ceil(sorted.length / pageSize);

    const paged = useMemo(() => {
        const start = (page - 1) * pageSize;
        return sorted.slice(start, start + pageSize);
    }, [sorted, page]);

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[260px_1fr]">
            {/* Desktop sidebar */}
            <aside className="hidden md:block">
                <ShopSidebar />
            </aside>

            {/* Main */}
            <section className="min-w-0">
                {/* Mobile: Filter button opens sidebar */}
                <div className="md:hidden mb-3 flex items-center justify-between">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="rounded-sm">
                                Filter
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[320px] p-0">
                            <SheetHeader className="px-4 py-3 border-b">
                                <SheetTitle>Filters</SheetTitle>
                            </SheetHeader>
                            <div className="p-4">
                                <ShopSidebar />
                            </div>
                        </SheetContent>
                    </Sheet>

                    <div className="text-xs text-muted-foreground">{ALL_PRODUCTS.length} products found</div>
                </div>

                <ShopToolbar
                    count={ALL_PRODUCTS.length}
                    view={view}
                    onViewChange={setView}
                    sort={sort}
                    onSortChange={(v) => {
                        setSort(v);
                        setPage(1);
                    }}
                />

                {/* Results */}
                {view === "grid" ? (
                    <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
                        {paged.map((p) => (
                            <ProductGridCard key={p.id} p={p} />
                        ))}
                    </div>
                ) : (
                    <div className="mt-4 space-y-4">
                        {paged.map((p) => (
                            <ProductListRow key={p.id} p={p} />
                        ))}
                    </div>
                )}

                <PaginationBar page={page} totalPages={totalPages} onChange={setPage} />
            </section>
        </div>
    );
}
