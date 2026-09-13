"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    SortingState,
    getSortedRowModel,
    ColumnFiltersState,
    getFilteredRowModel,
    VisibilityState,
    // selectRowsFn,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
// import { useSelectedRowsStore } from "@/features/products/product.store";
import { Pagination } from "./pagination-component";

import { TableSkeleton } from "@/components/ui/skeletons";

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

interface DataTableProps<TData extends { id?: string }, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: {
        items: TData[];
        pagination?: Pagination | null;
    };
    isLoading?: boolean;
}

type TRows = {
    [key: number]: boolean;
};

export function DataTable<TData extends { id?: string }, TValue>({
    columns,
    data,
    isLoading,
}: DataTableProps<TData, TValue>) {
    const [filtering, setFiltering] = useState("");

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState<TRows>({});
    const table = useReactTable({
        data: data?.items || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setFiltering,
        manualPagination: true,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter: filtering,

            pagination: {
                pageIndex: (data?.pagination?.page ?? 1) - 1, // 0-indexed
                pageSize: data?.pagination?.limit ?? 10, // your API page size
            },
        },
    });

    if (isLoading) {
        return <TableSkeleton columns={columns.length} rows={5} />;
    }

    // const setSelected = useSelectedRowsStore((s) => s.setSelected);

    // useEffect(() => {
    //     const selectedRows = table.getSelectedRowModel().rows.map((row) => ({
    //         id: row.original.id || "",
    //     }));

    //     setSelected(selectedRows);
    // }, [table, table.getSelectedRowModel().rows, setSelected]);

    return (
        <div className="text-xs">
            <div className="">
                <div className="rounded-md border border-border/60 mt-4 overflow-hidden shadow-sm">
                    <Table className="">
                        <TableHeader className="bg-muted/50">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead
                                                key={header.id}
                                                className="text-foreground/80 font-semibold uppercase tracking-wide text-[11px] h-11"
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody className="text-xs bg-card">
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="hover:bg-muted/40 transition-colors"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="py-3">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-32 text-center text-muted-foreground"
                                    >
                                        No results found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <div className="mt-6">
                {data?.pagination && <Pagination table={table} {...data?.pagination} />}
            </div>
        </div>
    );
}