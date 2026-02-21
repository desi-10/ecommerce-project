// table/orders-columns.tsx
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Order } from "@/types/orders";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit } from "lucide-react";
import { UpdateOrderStatusDialog } from "@/components/order/update-status";

function OrderActions({ order, onRefresh }: { order: Order; onRefresh?: () => void }) {
  const [statusOpen, setStatusOpen] = useState(false);

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
          <DropdownMenuItem onClick={() => setStatusOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Update Status
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateOrderStatusDialog
        order={order}
        open={statusOpen}
        onOpenChange={setStatusOpen}
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

// Small helpers
const money = (value: string, currency: string) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return `${value} ${currency}`;
    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(n);
};

export const orderColumns: ColumnDef<Order>[] = [
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
        accessorKey: "id",
        header: "Order ID",
        cell: ({ row }) => (
            <span className="font-mono text-xs">{row.original.id}</span>
        ),
    },

    {
        id: "customer",
        header: "Customer",
        cell: ({ row }) => {
            const u = row.original.user;
            return (
                <div className="min-w-[180px]">
                    <div className="font-medium">{u?.name ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">{u?.email ?? "—"}</div>
                </div>
            );
        },
    },

    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <span className="text-sm">{row.original.status}</span>
        ),
    },

    {
        id: "items",
        header: "Items",
        cell: ({ row }) => row.original.items?.length ?? 0,
    },

    {
        id: "total",
        header: "Total",
        cell: ({ row }) => money(row.original.total, row.original.currency),
    },

    {
        id: "discount",
        header: "Discount",
        cell: ({ row }) => money(row.original.discountTotal, row.original.currency),
    },

    {
        id: "payments",
        header: "Payment",
        cell: ({ row }) => {
            const p = row.original.payments?.[0];
            if (!p) return "—";
            return (
                <div className="min-w-[160px]">
                    <div className="text-sm">
                        {p.provider} • {p.status}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Ref: {p.reference}
                    </div>
                </div>
            );
        },
    },

    {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
    },

    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <OrderActions order={row.original} />,
        enableSorting: false,
        enableHiding: false,
    },
];
