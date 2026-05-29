// table/payments-columns.tsx
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Payment } from "@/types/payments";
import { Checkbox } from "@/components/ui/checkbox";
import { PaymentActions } from "@/components/payment/payment-actions";
import { Badge } from "@/components/ui/badge";
import { User, Receipt } from "lucide-react";

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
      <div className="flex flex-col">
        <span className="font-mono text-[10px] text-gray-500 uppercase tracking-tighter">REF</span>
        <span className="font-medium text-xs">{row.original.reference}</span>
      </div>
    ),
  },

  {
    id: "customer",
    header: "Customer",
    cell: ({ row }) => {
      const user = row.original.user;
      if (!user) return <span className="text-gray-400 text-xs italic">Guest</span>;
      
      return (
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
            <User className="h-3.5 w-3.5 text-blue-600" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-xs text-gray-900 leading-none">{user.name || "Unnamed User"}</span>
            <span className="text-[10px] text-gray-500 mt-1">{user.email}</span>
          </div>
        </div>
      );
    },
  },

  {
    id: "order",
    header: "Order",
    cell: ({ row }) => {
      const orderId = row.original.orderId;
      const shortId = orderId.slice(0, 8).toUpperCase();
      
      return (
        <div className="flex items-center gap-2">
            <Receipt className="h-3.5 w-3.5 text-gray-400" />
            <div className="flex flex-col">
                <span className="font-mono text-[10px] font-bold text-blue-600 tracking-tight">#{shortId}</span>
                {row.original.order?.status && (
                    <span className="text-[9px] text-gray-400 uppercase font-semibold">{row.original.order.status}</span>
                )}
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
      return (
        <Badge 
          variant="outline" 
          className={
            status === "SUCCESS" 
              ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
              : status === "PENDING"
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-red-50 text-red-700 border-red-200"
          }
        >
          {status}
        </Badge>
      );
    }
  },

  {
    id: "amount",
    header: "Amount",
    cell: ({ row }) => (
        <div className="font-bold text-gray-900">
            {money(row.original.amount, row.original.currency)}
        </div>
    ),
  },

  {
    accessorKey: "provider",
    header: "Provider",
    cell: ({ row }) => (
        <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0">
            {row.original.provider}
        </Badge>
    )
  },

  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
        <div className="text-xs text-gray-500">
            {new Date(row.original.createdAt).toLocaleDateString()}
            <span className="block text-[10px] text-gray-400 italic">
                {new Date(row.original.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
        </div>
    ),
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <PaymentActions payment={row.original} />,
  },
];
