"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Separator } from "@/components/ui/separator";

import {
  updateProductSchema,
  type UpdateProductInput,
} from "@/server/products/products.validators";
import { useUpdateProduct } from "@/hooks/use-product";
import type { Product } from "@/types/product";

interface EditProductDialogProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProductDialog({
  product,
  open,
  onOpenChange,
}: EditProductDialogProps) {
  const { mutateAsync, isPending } = useUpdateProduct();

  const form = useForm<UpdateProductInput>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      name: product.name,
      description: product.description || "",
      status: product.status,
      variants: product.variants.map((v) => ({
        id: v.id,
        name: v.name,
        sku: v.sku || "",
        price: Number(v.price),
        salePrice: v.salePrice ? Number(v.salePrice) : undefined,
        stock: v.inventory?.stock ?? 0,
        options: v.options,
      })),
    },
  });

  const { control, register, handleSubmit, setValue, watch, formState } = form;
  const { errors } = formState;

  const status = watch("status");
  const variants = watch("variants");

  const variantsArr = useFieldArray({
    control,
    name: "variants",
  });

  const onSubmit = async (values: UpdateProductInput) => {
    await mutateAsync({ id: product.id, payload: values });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[760px]">
        <DialogHeader>
          <DialogTitle>Edit product</DialogTitle>
          <DialogDescription>
            Update product details and variants.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          {/* Basic info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="name">Product name</Label>
              <Input
                id="name"
                placeholder="e.g. MacBook Pro i7"
                {...register("name")}
              />
              {errors.name ? (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              ) : null}
            </div>

            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Optional description"
                {...register("description")}
              />
              {errors.description ? (
                <p className="text-sm text-red-600">
                  {errors.description.message}
                </p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(v) =>
                  setValue("status", v as "ACTIVE" | "INACTIVE", {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                  <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                </SelectContent>
              </Select>
              {errors.status ? (
                <p className="text-sm text-red-600">{errors.status.message}</p>
              ) : null}
            </div>
          </div>

          <Separator />

          {/* Variants */}
          <div className="grid gap-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold">Variants</p>
                <p className="text-sm text-muted-foreground">
                  Edit existing variants or add new ones.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  variantsArr.append({
                    name: "New Variant",
                    sku: "",
                    price: 0,
                    salePrice: undefined,
                    stock: 0,
                  })
                }
              >
                Add variant
              </Button>
            </div>

            {variantsArr.fields.length === 0 ? (
              <div className="rounded-lg border bg-muted/20 p-4 text-sm text-muted-foreground">
                No variants available.
              </div>
            ) : (
              <div className="grid gap-3">
                {variantsArr.fields.map((field, index) => {
                  const baseErr = errors.variants?.[index];

                  return (
                    <div
                      key={field.id}
                      className="rounded-xl border bg-white p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold">
                          Variant {index + 1}: {field.name}
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => variantsArr.remove(index)}
                        >
                          Remove
                        </Button>
                      </div>

                      <div className="mt-3 grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                          <Label>Name</Label>
                          <Input
                            placeholder="Variant name"
                            {...register(`variants.${index}.name` as const)}
                          />
                          {baseErr?.name ? (
                            <p className="text-sm text-red-600">
                              {baseErr.name.message}
                            </p>
                          ) : null}
                        </div>

                        <div className="grid gap-2">
                          <Label>SKU (optional)</Label>
                          <Input
                            placeholder="SKU"
                            {...register(`variants.${index}.sku` as const)}
                          />
                          {baseErr?.sku ? (
                            <p className="text-sm text-red-600">
                              {baseErr.sku.message}
                            </p>
                          ) : null}
                        </div>

                        <div className="grid gap-2">
                          <Label>Price</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min={0}
                            inputMode="decimal"
                            {...register(`variants.${index}.price` as const)}
                          />
                          {baseErr?.price ? (
                            <p className="text-sm text-red-600">
                              {baseErr.price.message}
                            </p>
                          ) : null}
                        </div>

                        <div className="grid gap-2">
                          <Label>Sale price (optional)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min={0}
                            inputMode="decimal"
                            {...register(
                              `variants.${index}.salePrice` as const
                            )}
                          />
                          {baseErr?.salePrice ? (
                            <p className="text-sm text-red-600">
                              {baseErr.salePrice.message}
                            </p>
                          ) : null}
                        </div>

                        <div className="grid gap-2 sm:col-span-2">
                          <Label>Stock</Label>
                          <Input
                            type="number"
                            step="1"
                            min={0}
                            inputMode="numeric"
                            {...register(`variants.${index}.stock` as const)}
                          />
                          {baseErr?.stock ? (
                            <p className="text-sm text-red-600">
                              {baseErr.stock.message}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
