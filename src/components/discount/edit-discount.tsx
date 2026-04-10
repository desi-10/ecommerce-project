"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const updateDiscountSchema = z.object({
  discountPercent: z.number().min(0).max(100),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

type UpdateDiscountInput = z.infer<typeof updateDiscountSchema>;

interface EditDiscountDialogProps {
  discount: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditDiscountDialog({
  discount,
  open,
  onOpenChange,
  onSuccess,
}: EditDiscountDialogProps) {
  const [loading, setLoading] = useState(false);
  // const { toast } = useToast();

  const formatDatetime = (date: string | Date) => {
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateDiscountInput>({
    resolver: zodResolver(updateDiscountSchema),
    defaultValues: {
      discountPercent: discount.discountPercent,
      startDate: formatDatetime(discount.startDate),
      endDate: formatDatetime(discount.endDate),
      status: discount.status,
    },
  });

  const onSubmit = async (data: UpdateDiscountInput) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/discounts/${discount.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          discountPercent: Number(data.discountPercent),
          startDate: new Date(data.startDate).toISOString(),
          endDate: new Date(data.endDate).toISOString(),
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update discount");
      }

      // toast({
      //   title: "Success",
      //   description: "Discount updated successfully",
      // });

      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: error.message || "Failed to update discount",
      // });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Discount</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Product</Label>
            <Input value={discount.product?.name} disabled />
          </div>

          <div className="space-y-2">
            <Label>Discount Percent (%)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              step="0.01"
              {...register("discountPercent", { valueAsNumber: true })}
            />
            {errors.discountPercent && (
              <p className="text-sm text-red-600">{errors.discountPercent.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input type="datetime-local" {...register("startDate")} />
            {errors.startDate && <p className="text-sm text-red-600">{errors.startDate.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>End Date</Label>
            <Input type="datetime-local" {...register("endDate")} />
            {errors.endDate && <p className="text-sm text-red-600">{errors.endDate.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={watch("status")} onValueChange={(value) => setValue("status", value as "ACTIVE" | "INACTIVE")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
