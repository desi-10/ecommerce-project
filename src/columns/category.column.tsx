// table/categories-columns.tsx
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Category } from "@/types/categories";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { EditCategoryDialog } from "@/components/category/edit-category";
import { DeleteCategoryDialog } from "@/components/category/delete-category";

function CategoryActions({ category, onRefresh }: { category: Category; onRefresh?: () => void }) {
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
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
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

      <EditCategoryDialog
        category={category}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={onRefresh}
      />
      <DeleteCategoryDialog
        category={category}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onSuccess={onRefresh}
      />
    </>
  );
}

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
        enableHiding: false,
        size: 40,
    },
    {
        id: "image",
        header: "Image",
        cell: ({ row }) => (
            <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-gray-50">
                <Image
                    src={row.original.image || "/martfury/product.png"}
                    alt={row.original.name}
                    fill
                    className="object-contain p-1"
                />
            </div>
        ),
        size: 60,
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

    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <CategoryActions category={row.original} />,
        enableSorting: false,
        enableHiding: false,
    },
];
