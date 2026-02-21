"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useUpdateInventory } from "@/hooks/inventory";
import type { Inventory } from "@/types/inventories";
import axios from "axios";

interface AdjustStockDialogProps {
  inventory: Inventory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const adjustStockSchema = z.object({
  qty: z.coerce
    .number()
    .int()
    .positive("Quantity must be greater than 0"),
  direction: z.enum(["increase", "decrease"]),
});

type AdjustStockInput = z.infer<typeof adjustStockSchema>;

export function AdjustStockDialog({
  inventory,
  open,
  onOpenChange,
}: AdjustStockDialogProps) {
  const [isPending, setIsPending] = useState(false);
  const { register, handleSubmit, watch, formState, setValue, reset } =
    useForm<AdjustStockInput>({
      resolver: zodResolver(adjustStockSchema),
      defaultValues: {
        qty: 1,
        direction: "increase",
      },
    });

  const { errors } = formState;
  const direction = watch("direction");

  const onSubmit = async (values: AdjustStockInput) => {
    try {
      setIsPending(true);
      await axios.patch(`/api/inventories/${inventory.id}`, {
        variantId: inventory.variantId,
        qty: values.qty,
        direction: values.direction,
      });
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to adjust stock:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Adjust stock</DialogTitle>
          <DialogDescription>
            Adjust inventory for {inventory.variant.product.name} -{" "}
            {inventory.variant.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Current stock</Label>
              <Input
                type="number"
                value={inventory.stock}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="grid gap-2">
              <Label>Action</Label>
              <Select
                value={direction}
                onValueChange={(v) =>
                  setValue("direction", v as "increase" | "decrease", {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="increase">Increase</SelectItem>
                  <SelectItem value="decrease">Decrease</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="qty">
              Quantity to {direction === "increase" ? "add" : "remove"}
            </Label>
            <Input
              id="qty"
              type="number"
              min="1"
              inputMode="numeric"
              placeholder="Enter quantity"
              {...register("qty")}
            />
            {errors.qty ? (
              <p className="text-sm text-red-600">{errors.qty.message}</p>
            ) : null}
          </div>

          <div className="rounded-lg bg-muted p-3 text-sm">
            <p className="text-muted-foreground">
              New stock will be:{" "}
              <span className="font-semibold">
                {direction === "increase"
                  ? `${inventory.stock + (parseInt(watch("qty") as any) || 0)}`
                  : `${Math.max(0, inventory.stock - (parseInt(watch("qty") as any) || 0))}`}
              </span>
            </p>
          </div>

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adjusting..." : "Adjust stock"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
