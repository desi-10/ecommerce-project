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
  DialogTrigger,
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
import { useGetProducts } from "@/hooks/use-product";
import { z } from "zod";

const createDiscountSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  discountPercent: z.number().min(0).max(100),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

type CreateDiscountInput = z.infer<typeof createDiscountSchema>;

export function AddDiscountDialog({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // const { toast } = useToast();

  const { data: productsData } = useGetProducts();
  const products = productsData?.data?.products || [];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateDiscountInput>({
    resolver: zodResolver(createDiscountSchema),
    defaultValues: {
      status: "ACTIVE",
    },
  });

  const onSubmit = async (data: CreateDiscountInput) => {
    setLoading(true);
    try {
      const res = await fetch("/api/discounts", {
        method: "POST",
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
        throw new Error(error.message || "Failed to create discount");
      }

      // toast({
      //   title: "Success",
      //   description: "Discount created successfully",
      // });

      reset();
      onSuccess?.();
      setOpen(false);
    } catch (error: any) {
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: error.message || "Failed to create discount",
      // });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Discount</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Discount</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Product</Label>
            <Select
              value={watch("productId")}
              onValueChange={(value) => setValue("productId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.productId && <p className="text-sm text-red-600">{errors.productId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Discount Percent (%)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              step="0.01"
              placeholder="e.g. 20"
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
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Discount"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
