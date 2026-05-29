// columns/coupons.columns.tsx
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Ticket } from "lucide-react";
import { EditCouponDialog } from "@/components/coupon/edit-coupon-dialog";
import { useState } from "react";
import { useDeleteCoupon } from "@/hooks/use-coupon";
import { toast } from "sonner";

export const couponColumns: ColumnDef<any>[] = [
  {
    accessorKey: "code",
    header: "Coupon Code",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Ticket className="h-4 w-4 text-blue-600" />
        <span className="font-mono font-black text-blue-600 tracking-wider">
          {row.original.code}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <Badge variant="secondary" className="font-bold text-[10px] uppercase">
          {type === "PERCENT" ? "Percentage" : "Fixed Amount"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => {
      const type = row.original.type;
      const value = Number(row.original.value);
      return (
        <span className="font-bold text-gray-900">
          {type === "PERCENT" ? `${value}%` : `GHS ${value.toFixed(2)}`}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant="outline"
          className={
            status === "ACTIVE"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-gray-50 text-gray-700 border-gray-200"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "usage",
    header: "Usage",
    cell: ({ row }) => {
      const used = row.original.usedCount || 0;
      const max = row.original.maxUses;
      return (
        <div className="text-xs text-gray-600 font-medium">
          {used} / {max ?? "∞"}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-gray-500">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CouponActionRow coupon={row.original} />,
  },
];

function CouponActionRow({ coupon }: { coupon: any }) {
  const [editOpen, setEditOpen] = useState(false);
  const { mutate: deleteCoupon, isPending } = useDeleteCoupon();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      deleteCoupon(coupon.id, {
        onSuccess: () => toast.success("Coupon deleted successfully"),
        onError: (err: any) => toast.error(err.response?.data?.message || "Failed to delete coupon"),
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white border rounded-xl shadow-lg p-1">
          <DropdownMenuItem onClick={() => setEditOpen(true)} className="rounded-lg cursor-pointer">
            <Edit className="h-4 w-4 mr-2" />
            Edit Coupon
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} disabled={isPending} className="rounded-lg cursor-pointer text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditCouponDialog
        coupon={coupon}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}
