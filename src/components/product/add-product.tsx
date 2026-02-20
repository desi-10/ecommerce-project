"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// shadcn/ui
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
    DialogTrigger,
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
    createProductSchema,
    type CreateProductInput,
} from "@/server/products/products.validators"; // <-- your file
import { useCreateProduct } from "@/hooks/use-product"; // your mutation hook

export function CreateProductDialog() {
    const [open, setOpen] = React.useState(false);
    const { mutateAsync, isPending } = useCreateProduct();

    const form = useForm<CreateProductInput>({
        resolver: zodResolver(createProductSchema),
    });

    const { control, register, handleSubmit, setValue, watch, formState } = form;
    const { errors } = formState;

    const status = watch("status");
    const variants = watch("variants");

    const variantsArr = useFieldArray({
        control,
        name: "variants",
    });

    const onSubmit = async (values: CreateProductInput) => {
        // ✅ Optional UX: if variants exist, you can ignore defaults
        // (backend can also ignore defaults if variants are provided)
        await mutateAsync(values);
        form.reset();
        variantsArr.remove(); // clear variants list in UI
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(v) => {
                setOpen(v);
                if (!v) {
                    form.reset();
                    variantsArr.remove();
                }
            }}
        >
            <DialogTrigger asChild>
                <Button>Create product</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[760px]">
                <DialogHeader>
                    <DialogTitle>Create product</DialogTitle>
                    <DialogDescription>
                        Create a product. Add variants or leave variants empty to use default
                        price and stock.
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
                                    Add one or more variants. If you add variants, the default
                                    price/stock below can be ignored.
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    variantsArr.append({
                                        name: "Default",
                                        sku: "",
                                        price: 0,
                                        salePrice: 0,
                                        stock: 0,
                                        options: {},
                                    })
                                }
                            >
                                Add variant
                            </Button>
                        </div>

                        {errors.variants && (
                            <p className="text-sm text-red-600">
                                {errors.variants.message}
                            </p>
                        )}

                        {variantsArr.fields.length === 0 ? (
                            <div className="rounded-lg border bg-muted/20 p-4 text-sm text-muted-foreground">
                                No variants added. Defaults below will be used.
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
                                                    Variant #{index + 1}
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

                                                {/* Options (simple: JSON input) */}
                                                <div className="grid gap-2 sm:col-span-2">
                                                    <Label>Options (JSON, optional)</Label>
                                                    <Textarea
                                                        rows={3}
                                                        placeholder={`Example:\n{"color":"Black","size":"M"}`}
                                                        value={JSON.stringify(
                                                            watch(`variants.${index}.options` as const) ?? {},
                                                            null,
                                                            2
                                                        )}
                                                        onChange={(e) => {
                                                            try {
                                                                const parsed = e.target.value
                                                                    ? JSON.parse(e.target.value)
                                                                    : {};
                                                                setValue(
                                                                    `variants.${index}.options` as const,
                                                                    parsed,
                                                                    { shouldDirty: true, shouldValidate: true }
                                                                );
                                                            } catch {
                                                                // don't crash; just keep typing.
                                                                // You could show an error state if you want.
                                                            }
                                                        }}
                                                    />

                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Defaults (used when no variants) */}
                    <div className="grid gap-3">
                        <div>
                            <p className="font-semibold">Default pricing & stock</p>
                            <p className="text-sm text-muted-foreground">
                                Used only when <span className="font-medium">variants</span> is
                                empty.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="grid gap-2">
                                <Label>Default price</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min={0}
                                    inputMode="decimal"
                                    disabled={variants?.length > 0}
                                    {...register("defaultPrice")}
                                />
                                {/* {errors.defaultPrice ? (
                                    <p className="text-sm text-red-600">
                                        {errors.defaultPrice.message as any}
                                    </p>
                                ) : null} */}
                            </div>

                            <div className="grid gap-2">
                                <Label>Default sale price</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min={0}
                                    inputMode="decimal"
                                    disabled={variants?.length > 0}
                                    {...register("defaultSalePrice")}
                                />

                            </div>

                            <div className="grid gap-2">
                                <Label>Default stock</Label>
                                <Input
                                    type="number"
                                    step="1"
                                    min={0}
                                    inputMode="numeric"
                                    disabled={variants?.length > 0}
                                    {...register("defaultStock")}
                                />

                            </div>
                        </div>

                        {variantsArr.fields.length > 0 ? (
                            <p className="text-xs text-muted-foreground">
                                Defaults are disabled because variants exist.
                            </p>
                        ) : null}
                    </div>

                    <DialogFooter className="mt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Creating..." : "Create product"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
