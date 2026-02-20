// table/inventory-columns.tsx
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Inventory } from "@/types/inventories";

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
    <input
      type="checkbox"
      aria-label={ariaLabel}
      checked={!!checked}
      ref={(el) => {
        if (el) el.indeterminate = !!indeterminate;
      }}
      onChange={(e) => onChange?.(e.target.checked)}
    />
  );
}

const nfmt = (n: number) =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);

export const inventoryColumns: ColumnDef<Inventory>[] = [
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
    id: "product",
    header: "Product",
    cell: ({ row }) => (
      <div className="min-w-[200px]">
        <div className="font-medium">{row.original.variant.product.name}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.variant.productId}
        </div>
      </div>
    ),
  },

  {
    id: "variant",
    header: "Variant",
    cell: ({ row }) => (
      <div className="min-w-[180px]">
        <div className="font-medium">{row.original.variant.name}</div>
        <div className="text-xs text-muted-foreground">
          SKU: {row.original.variant.sku ?? "—"}
        </div>
      </div>
    ),
  },

  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => (
      <span className={row.original.stock > 0 ? "" : "text-muted-foreground"}>
        {nfmt(row.original.stock)}
      </span>
    ),
  },

  {
    id: "price",
    header: "Price",
    cell: ({ row }) => row.original.variant.price,
  },

  {
    id: "salePrice",
    header: "Sale Price",
    cell: ({ row }) => row.original.variant.salePrice,
  },

  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ row }) => new Date(row.original.updatedAt).toLocaleString(),
  },
];
