"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ShopSidebar, { FilterPayload } from "./shop-sidebar";
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
import { normalizeProduct } from "@/lib/product-normalizer";
import { ProductGridSkeleton, ProductListSkeleton } from "@/components/ui/skeletons";

type ViewMode = "grid" | "list";
type SortMode = "latest" | "price_low" | "price_high";

const sortMap: Record<string, string> = {
    latest: "newest",
    price_low: "price_asc",
    price_high: "price_desc",
};

export default function ShopResultsWithSidebar() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [view, setView] = useState<ViewMode>("grid");
    const [sort, setSort] = useState<SortMode>("latest");
    const [page, setPage] = useState(1);

    // Initialize filters from SearchParams (for homepage redirects)
    const [filters, setFilters] = useState({
        q: searchParams.get("q") || "",
        categories: searchParams.get("category") ? [searchParams.get("category")!] : [] as string[],
        minPrice: Number(searchParams.get("minPrice") || 0),
        maxPrice: Number(searchParams.get("maxPrice") || 2000),
        rating: searchParams.get("rating") ? Number(searchParams.get("rating")) : null as number | null,
    });

    const pageSize = 12;

    const { data: productsData, isLoading, isError } = useGetProducts({
        page,
        limit: pageSize,
        q: filters.q || undefined,
        categories: filters.categories.length > 0 ? filters.categories : undefined,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        rating: filters.rating || undefined,
        sort: sortMap[sort] || "newest",
    });

    const rawProducts = productsData?.data?.products ?? [];
    const products = useMemo(() => rawProducts.map(normalizeProduct), [rawProducts]);
    const totalPages = productsData?.data?.pagination?.totalPages ?? 1;

    const handleApplyFilters = (payload: FilterPayload) => {
        setFilters({
            q: payload.search,
            categories: payload.categories,
            minPrice: payload.minPrice,
            maxPrice: payload.maxPrice,
            rating: payload.rating,
        });
        setPage(1);
    };

    // when sort changes, ensure page resets
    useEffect(() => {
        setPage(1);
    }, [sort]);

    // Sync URL searchParams to internal filter state (e.g., when routing from homepage categories)
    useEffect(() => {
        setFilters({
            q: searchParams.get("q") || "",
            categories: searchParams.get("category") ? [searchParams.get("category")!] : [],
            minPrice: Number(searchParams.get("minPrice") || 0),
            maxPrice: Number(searchParams.get("maxPrice") || 2000),
            rating: searchParams.get("rating") ? Number(searchParams.get("rating")) : null,
        });
        setPage(1);
    }, [searchParams]);


    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[260px_1fr]">
            {/* Desktop sidebar */}
            <aside className="hidden md:block">
                <ShopSidebar onApply={handleApplyFilters} />
            </aside>

            {/* Main */}
            <section className="min-w-0">
                {/* Mobile: Filter button opens sidebar */}
                <div className="mb-3 flex items-center justify-between md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="rounded-md shadow-sm">
                                Filter
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[320px] p-0">
                            <SheetHeader className="border-b px-4 py-3">
                                <SheetTitle>Filters</SheetTitle>
                            </SheetHeader>
                            <div className="p-4">
                                <ShopSidebar onApply={handleApplyFilters} />
                            </div>
                        </SheetContent>
                    </Sheet>

                    <div className="text-xs text-muted-foreground">
                        {productsData?.data?.pagination?.totalProducts ?? products.length} products found
                    </div>
                </div>

                <ShopToolbar
                    count={productsData?.data?.pagination?.totalProducts ?? products.length}
                    view={view}
                    onViewChange={setView}
                    sort={sort}
                    onSortChange={(v) => {
                        setSort(v as SortMode);
                        setPage(1);
                    }}
                />

                {/* Loading / Error */}
                {isLoading ? (
                    <div className="mt-4">
                        {view === "grid" ? <ProductGridSkeleton count={8} /> : <ProductListSkeleton count={4} />}
                    </div>
                ) : isError ? (
                    <div className="mt-6 text-sm text-red-600">Failed to load products.</div>
                ) : (
                    <>
                        {/* Results */}
                        {view === "grid" ? (
                            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
                                {products.map((p) => (
                                    <ProductGridCard key={p.id} p={p} />
                                ))}
                            </div>
                        ) : (
                            <div className="mt-4 space-y-4">
                                {products.map((p) => (
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
