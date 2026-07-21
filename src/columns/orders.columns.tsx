// table/orders-columns.tsx
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Order } from "@/types/orders";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, User, ShoppingCart, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

function OrderActions({ order }: { order: Order }) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900 transition-colors">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white border-gray-100 shadow-xl rounded-xl p-1 w-44">
        <DropdownMenuItem 
            onClick={() => router.push(`/dashboard/orders/${order.id}`)}
            className="rounded-lg cursor-pointer py-2 font-medium"
        >
          <Eye className="h-4 w-4 mr-2 text-blue-500" />
          View Details
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
            onCheckedChange={(v) => onChange?.(!!v)}
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
        header: "Order",
        cell: ({ row }) => {
            const shortId = row.original.id.slice(0, 8).toUpperCase();
            return (
                <div className="flex flex-col">
                    <span className="font-mono text-[10px] text-gray-400 font-bold tracking-tight">ORDER</span>
                    <span className="font-mono text-xs font-black text-blue-600">#{shortId}</span>
                </div>
            );
        },
    },

    {
        id: "customer",
        header: "Customer",
        cell: ({ row }) => {
            const u = row.original.user;
            if (!u) return <span className="text-gray-400 text-xs italic">Guest</span>;
            
            return (
                <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100">
                        <User className="h-3.5 w-3.5 text-purple-600" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium text-xs text-gray-900 leading-none">{u.name || "Unnamed"}</span>
                        <span className="text-[10px] text-gray-500 mt-1">{u.email}</span>
                    </div>
                </div>
            );
        },
    },

    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status as string;
            const colors: Record<string, string> = {
                PENDING: "bg-amber-50 text-amber-700 border-amber-200",
                PAID: "bg-blue-50 text-blue-700 border-blue-200",
                FULFILLED: "bg-emerald-50 text-emerald-700 border-emerald-200",
                CANCELLED: "bg-red-50 text-red-700 border-red-200",
                REFUNDED: "bg-purple-50 text-purple-700 border-purple-200",
                FAILED: "bg-rose-50 text-rose-700 border-rose-200",
            };
            return (
                <Badge variant="outline" className={`${colors[status] || ""} uppercase text-[9px] font-black tracking-wider`}>
                    {status}
                </Badge>
            );
        },
    },

    {
        id: "items",
        header: "Items",
        cell: ({ row }) => (
            <div className="flex items-center gap-1.5 font-medium text-xs text-gray-600">
                <ShoppingCart className="h-3 w-3 text-gray-400" />
                {row.original.items?.length ?? 0}
            </div>
        ),
    },

    {
        id: "total",
        header: "Total Amount",
        cell: ({ row }) => (
            <div className="font-black text-gray-900 text-sm">
                {money(row.original.total, row.original.currency)}
            </div>
        ),
    },

    {
        id: "payments",
        header: "Payment",
        cell: ({ row }) => {
            const p = row.original.payments?.[0];
            if (!p) return <span className="text-gray-300 text-[10px]">None</span>;
            
            const isSuccess = p.status === "SUCCESS";
            return (
                <div className="flex items-center gap-2">
                    <CreditCard className={`h-3.5 w-3.5 ${isSuccess ? "text-emerald-500" : "text-amber-500"}`} />
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold uppercase text-gray-700">{p.provider}</span>
                            <div className={`h-1 w-1 rounded-full ${isSuccess ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
                        </div>
                        <span className="text-[9px] text-gray-400 font-mono tracking-tighter">REF: {p.reference.slice(0, 10)}...</span>
                    </div>
                </div>
            );
        },
    },

    {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => {
            const date = new Date(row.original.createdAt);
            return (
                <div className="text-xs text-gray-500">
                    <span className="font-medium text-gray-700">{date.toLocaleDateString()}</span>
                    <span className="block text-[10px] text-gray-400 italic mt-0.5">
                        {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            );
        },
    },

    {
        id: "actions",
        header: "",
        cell: ({ row }) => <OrderActions order={row.original} />,
        enableSorting: false,
        enableHiding: false,
        size: 40,
    },
];
