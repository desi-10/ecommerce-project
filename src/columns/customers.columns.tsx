"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatGHS } from "@/lib/currency";

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

function CustomerActions({ customerId }: { customerId: string }) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900 transition-colors">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white border-gray-100 shadow-sm rounded-md p-1 w-44">
        <DropdownMenuItem 
          onClick={() => router.push(`/dashboard/customers/${customerId}`)}
          className="rounded-md cursor-pointer py-2 font-medium"
        >
          <Eye className="h-4 w-4 mr-2 text-blue-500" />
          View History
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export type Customer = {
  id: string;
  name: string;
  email: string;
  role: string | null;
  image: string | null;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
};

export const customerColumns: ColumnDef<Customer>[] = [
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
    id: "customer",
    header: "Customer",
    cell: ({ row }) => {
      const u = row.original;
      return (
        <Link href={`/dashboard/customers/${u.id}`} className="flex items-center gap-2 hover:opacity-85 transition-opacity">
          {u.image ? (
            <img src={u.image} alt={u.name} className="h-8 w-8 rounded-full object-cover border border-purple-100" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100 font-bold text-xs text-purple-600">
              {u.name?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-semibold text-xs text-gray-900 leading-none hover:underline">{u.name || "Unnamed User"}</span>
            <span className="text-[10px] text-gray-500 mt-1">{u.email}</span>
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: "orderCount",
    header: "Orders Placed",
    cell: ({ row }) => (
      <span className="font-bold text-xs text-gray-700">{row.original.orderCount} orders</span>
    ),
  },
  {
    accessorKey: "totalSpent",
    header: "Total Spent",
    cell: ({ row }) => (
      <span className="font-black text-xs text-gray-900">{formatGHS(row.original.totalSpent)}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Joined Date",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <span className="text-xs text-gray-500">
          {date.toLocaleDateString()}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <CustomerActions customerId={row.original.id} />,
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
];
