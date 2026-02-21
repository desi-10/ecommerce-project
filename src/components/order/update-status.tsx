"use client";

import { useState } from "react";
import { useUpdateOrderStatus } from "@/hooks/use-order";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Order } from "@/types/orders";

interface UpdateOrderStatusProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const ORDER_STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

export function UpdateOrderStatusDialog({
  order,
  open,
  onOpenChange,
  onSuccess,
}: UpdateOrderStatusProps) {
  const [status, setStatus] = useState(order.status || "PENDING");
  const [loading, setLoading] = useState(false);
  const { mutate: updateStatus } = useUpdateOrderStatus();
  const { toast } = useToast();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      updateStatus(
        { id: order.id, status },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Order status updated successfully",
            });
            onOpenChange(false);
            onSuccess?.();
          },
          onError: () => {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to update order status",
            });
          },
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Order ID</label>
            <p className="text-sm text-muted-foreground">{order.id}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Updating..." : "Update Status"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
