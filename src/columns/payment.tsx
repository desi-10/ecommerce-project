// table/payments-columns.tsx
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Payment } from "@/types/payments";
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

const money = (value: string, currency: string) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return `${value} ${currency}`;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n);
};

export const paymentColumns: ColumnDef<Payment>[] = [
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
    accessorKey: "reference",
    header: "Reference",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.reference}</span>
    ),
  },

  {
    accessorKey: "provider",
    header: "Provider",
  },

  {
    accessorKey: "status",
    header: "Status",
  },

  {
    id: "amount",
    header: "Amount",
    cell: ({ row }) => money(row.original.amount, row.original.currency),
  },

  {
    accessorKey: "currency",
    header: "Currency",
    size: 80,
  },

  {
    accessorKey: "orderId",
    header: "Order ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.orderId}</span>
    ),
  },

  {
    accessorKey: "userId",
    header: "User ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.userId ?? "—"}</span>
    ),
  },

  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
  },
];
