"use client";

import { Table } from "@tanstack/react-table";
import { Button } from "./ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { useTablePagination } from "./use-table-pagination";

interface PaginationProps<TData> {
    table: Table<TData>;
    totalPages: number;
    onPageChange?: (page: number, limit: number) => void;
}

export const Pagination = <TData,>({
    table,
    totalPages,
    onPageChange,
}: PaginationProps<TData>) => {
    const { page, limit, setPage, setLimit } = useTablePagination();

    const handlePrev = () => {
        if (page <= 1) return;
        const newPage = page - 1;
        setPage(newPage);
        onPageChange?.(newPage, limit);
        table.setPageIndex(newPage - 1);
    };

    const handleNext = () => {
        if (page >= totalPages) return;
        const newPage = page + 1;
        setPage(newPage);
        onPageChange?.(newPage, limit);
        table.setPageIndex(newPage - 1);
    };

    const handlePageClick = (p: number) => {
        setPage(p);
        onPageChange?.(p, limit);
        table.setPageIndex(p - 1);
    };

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit);
        setPage(1); // reset to first page
        onPageChange?.(1, newLimit);
        table.setPageIndex(0);
    };

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <section className="flex flex-col md:flex-row items-center justify-between mt-4 space-y-2 md:space-y-0">
            <div className="flex items-center space-x-2">
                <p>Rows per page:</p>
                <Select
                    value={limit.toString()}
                    onValueChange={(v) => handleLimitChange(Number(v))}
                >
                    <SelectTrigger>
                        <SelectValue defaultValue={30} placeholder="30" />
                    </SelectTrigger>
                    <SelectContent>
                        {[10, 20, 30, 40, 50].map((v) => (
                            <SelectItem key={v} value={v.toString()}>
                                {v}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center space-x-1">
                <Button
                    onClick={handlePrev}
                    disabled={page <= 1}
                    size="sm"
                    variant="outline"
                >
                    Previous
                </Button>

                {pageNumbers.map((p) => (
                    <Button
                        key={p}
                        size="sm"
                        variant={p === page ? "default" : "outline"}
                        onClick={() => handlePageClick(p)}
                        className="px-3 py-1 rounded border"
                    >
                        {p}
                    </Button>
                ))}

                <Button
                    onClick={handleNext}
                    disabled={page >= totalPages}
                    size="sm"
                    variant="outline"
                >
                    Next
                </Button>
            </div>
        </section>
    );
};