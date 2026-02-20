// table/categories-columns.tsx
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Category } from "@/types/categories";
import { Checkbox } from "@/components/ui/checkbox";

function IndeterminateCheckbox({
    checked,
    indeterminate,
    onChange,
    ariaLabel,
}: {
    checked?: boolean;
    indeterminate?: boolean;
    onChange?: (v: boolean) => void;
    ariaLabel: string;
}) {
    return (
        <Checkbox
            aria-label={ariaLabel}
            checked={!!checked}
        />
    );
}

export const categoryColumns: ColumnDef<Category>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <IndeterminateCheckbox
                ariaLabel="Select all rows"
                checked={table.getIsAllPageRowsSelected()}
                indeterminate={table.getIsSomePageRowsSelected()}
                onChange={(v) => table.toggleAllPageRowsSelected(v)}
            />
        ),
        cell: ({ row }) => (
            <IndeterminateCheckbox
                ariaLabel="Select row"
                checked={row.getIsSelected()}
                indeterminate={row.getIsSomeSelected()}
                onChange={(v) => row.toggleSelected(v)}
            />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40,
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.slug}</span>,
    },
    {
        id: "products",
        header: "Products",
        cell: ({ row }) => row.original._count?.products ?? 0,
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
    },
];
