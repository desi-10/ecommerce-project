// table/products-columns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import type { Product } from "@/types/product";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

// Simple checkbox component (swap with shadcn Checkbox if you want)
function IndeterminateCheckbox({
    checked,
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
            className=""
        />
    );
}

export const productColumns: ColumnDef<Product>[] = [
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
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => row.original.status,
    },

    // Default price from the "Default" variant (or first variant)
    {
        id: "defaultPrice",
        header: "Price",
        cell: ({ row }) => {
            const v = row.original.variants?.[0];
            return v?.price ?? "-";
        },
    },

    {
        id: "defaultSalePrice",
        header: "Sale Price",
        cell: ({ row }) => {
            const v = row.original.variants?.[0];
            return v?.salePrice ?? "-";
        },
    },

    {
        id: "stock",
        header: "Stock",
        cell: ({ row }) => {
            const v = row.original.variants?.[0];
            return v?.inventory?.stock ?? 0;
        },
    },

    {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) =>
            new Date(row.original.createdAt).toLocaleString(),
    },
];
