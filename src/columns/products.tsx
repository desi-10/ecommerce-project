// table/products-columns.tsx
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Product } from "@/types/product";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { DeleteProductDialog } from "@/components/product/delete-product";

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

function ProductActions({ product }: { product: Product }) {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href={`/dashboard/products/${product.id}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Page
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setDeleteOpen(true)}
                        className="text-red-600"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DeleteProductDialog
                product={product}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
            />
        </>
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
        id: "image",
        header: "Image",
        cell: ({ row }) => {
            const p = row.original;
            const imgSrc = p.image || "/martfury/product.png";
            return (
                <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-gray-50">
                    <Image
                        src={imgSrc}
                        alt={p.name}
                        fill
                        className="object-contain p-1"
                    />
                </div>
            );
        },
        size: 60,
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

    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <ProductActions product={row.original} />,
        enableSorting: false,
        enableHiding: false,
    },
];
