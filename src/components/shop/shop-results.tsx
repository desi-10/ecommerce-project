"use client";

import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ShopSidebar from "./shop-sidebar";
import ShopToolbar from "./shop-toolbar";
import ProductGridCard from "./product-grid";
import ProductListRow from "./product-list";
import PaginationBar from "./pagination";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../ui/sheet";
import { useGetProducts } from "@/hooks/use-product";
import { Product } from "@/types/product";

type ViewMode = "grid" | "list";
type SortMode = "latest" | "price_low" | "price_high";

// If your Product components expect these fields, normalize your API product here.
function normalizeProduct(p) {
    return {
        id: String(p.id),
        brand: p.brand ?? "",
        name: p.name ?? "",
        price: Number(p.salePrice ?? p.price ?? 0),
        oldPrice: p.salePrice ? Number(p.price ?? 0) : (p.oldPrice ?? null),
        rating: p.rating ?? 4,
        reviews: p.reviews ?? 0,
        image: p.image ?? p.images?.[0]?.url ?? p.images?.[0] ?? "/martfury/product.png",
        // keep the rest if needed:
        ...p,
    };
}

export default function ShopResultsWithSidebar() {
    const [view, setView] = useState<ViewMode>("grid");
    const [sort, setSort] = useState<SortMode>("latest");
    const [page, setPage] = useState(1);

    const pageSize = 12;

    const { data: productsData, isLoading, isError } = useGetProducts();

    // Your current shape: productsData?.data.products
    const rawProducts = productsData?.data?.products ?? [];

    // normalize so ProductGridCard/ProductListRow always get what they expect
    const products = useMemo(() => rawProducts.map(normalizeProduct), [rawProducts]);

    // when sort changes, ensure page resets
    useEffect(() => {
        setPage(1);
    }, [sort]);

    const sorted = useMemo(() => {
        const items: Product[] = [...products];

        if (sort === "price_low") items.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        if (sort === "price_high") items.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));

        // "latest": if you have createdAt, sort by it; otherwise leave order as-is
        if (sort === "latest" && items[0]?.createdAt) {
            items.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        }

        return items;
    }, [products, sort]);

    const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));

    // keep page within range when data changes
    useEffect(() => {
        setPage((p) => Math.min(Math.max(1, p), totalPages));
    }, [totalPages]);

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
                <div className="mb-3 flex items-center justify-between md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="rounded-sm">
                                Filter
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[320px] p-0">
                            <SheetHeader className="border-b px-4 py-3">
                                <SheetTitle>Filters</SheetTitle>
                            </SheetHeader>
                            <div className="p-4">
                                <ShopSidebar />
                            </div>
                        </SheetContent>
                    </Sheet>

                    <div className="text-xs text-muted-foreground">
                        {products.length} products found
                    </div>
                </div>

                <ShopToolbar
                    count={products.length}
                    view={view}
                    onViewChange={setView}
                    sort={sort}
                    onSortChange={(v) => {
                        setSort(v);
                        setPage(1);
                    }}
                />

                {/* Loading / Error */}
                {isLoading ? (
                    <div className="mt-6 text-sm text-muted-foreground">Loading products...</div>
                ) : isError ? (
                    <div className="mt-6 text-sm text-red-600">Failed to load products.</div>
                ) : (
                    <>
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

                        <PaginationBar
                            page={page}
                            totalPages={totalPages}
                            onChange={setPage}
                        />
                    </>
                )}
            </section>
        </div>
    );
}