"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/server/products/products.validators";
import { useCreateProduct } from "@/hooks/use-product";
import { ImageUpload } from "@/components/image-upload";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

export function AddProductForm() {
    const router = useRouter();
    const { mutateAsync, isPending } = useCreateProduct();
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

    const form = useForm<CreateProductInput>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            variants: [],
            status: "ACTIVE",
        }
    });

    const { control, register, handleSubmit, setValue, watch, formState } = form;
    const { errors } = formState;

    const variants = watch("variants");

    const variantsArr = useFieldArray({
        control,
        name: "variants",
    });

    const onSubmit = async (values: CreateProductInput) => {
        try {
            const formData = new FormData();
            
            // Append basic fields
            formData.append("name", values.name);
            if (values.description) formData.append("description", values.description);
            if (values.status) formData.append("status", values.status);
            
            // Append pricing/stock
            if (values.defaultPrice !== undefined) formData.append("defaultPrice", String(values.defaultPrice));
            if (values.defaultSalePrice !== undefined) formData.append("defaultSalePrice", String(values.defaultSalePrice));
            if (values.defaultStock !== undefined) formData.append("defaultStock", String(values.defaultStock));
            
            // Append variants as JSON string
            if (values.variants && values.variants.length > 0) {
                formData.append("variants", JSON.stringify(values.variants));
            }
            
            // Append raw image file
            if (selectedFile) {
                formData.append("image", selectedFile);
            }

            await mutateAsync(formData as any);
            form.reset();
            variantsArr.remove();
            router.push("/dashboard/products");
        } catch (error) {
            console.error("Failed to create product:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => router.push("/dashboard/products")}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Add Product</h1>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl border-gray-200"
                        onClick={() => router.push("/dashboard/products")}
                        disabled={isPending}
                    >
                        Discard
                    </Button>
                    <Button 
                        type="submit" 
                        disabled={isPending}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm px-6"
                    >
                        {isPending ? "Saving..." : "Save Product"}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    {/* General Information */}
                    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-lg font-semibold mb-4 text-gray-900 tracking-tight">General Information</h2>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">Product Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. MacBook Pro M3"
                                        className="rounded-xl border-gray-200 focus:ring-indigo-500"
                                        {...register("name")}
                                    />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe your product in detail..."
                                        className="min-h-[150px] rounded-xl border-gray-200 focus:ring-indigo-500"
                                        {...register("description")}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Media */}
                    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-lg font-semibold mb-4 text-gray-900 tracking-tight">Media</h2>
                            <div className="grid gap-2">
                                <Label className="text-sm font-medium text-gray-700">Product Image</Label>
                                <div className="mt-2 text-gray-500">
                                    <ImageUpload
                                        onFileSelect={(file) => setSelectedFile(file)}
                                        currentImage={null}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="rounded-xl border bg-white shadow-sm">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold">Pricing & Inventory</h2>
                                    <p className="text-sm text-muted-foreground">Default settings if no variants are used.</p>
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label>Price</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min={0}
                                        inputMode="decimal"
                                        disabled={variants?.length > 0}
                                        placeholder="0.00"
                                        {...register("defaultPrice")}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Sale Price</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min={0}
                                        inputMode="decimal"
                                        disabled={variants?.length > 0}
                                        placeholder="0.00"
                                        {...register("defaultSalePrice")}
                                    />
                                </div>
                                <div className="grid gap-2 sm:col-span-2">
                                    <Label>Stock</Label>
                                    <Input
                                        type="number"
                                        step="1"
                                        min={0}
                                        inputMode="numeric"
                                        disabled={variants?.length > 0}
                                        placeholder="0"
                                        {...register("defaultStock")}
                                    />
                                </div>
                            </div>
                            {variantsArr.fields.length > 0 && (
                                <div className="mt-4 rounded-lg bg-orange-50 border border-orange-200 p-3">
                                    <p className="text-sm text-orange-800">
                                        Pricing defaults are disabled because variants have been added. Inventory and pricing will be drawn from variants.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Variants */}
                    <div className="rounded-xl border bg-white shadow-sm">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold">Variants</h2>
                                    <p className="text-sm text-muted-foreground mb-1">
                                        Add different configurations (like color or size).
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    onClick={() =>
                                        variantsArr.append({
                                            name: "New Variant",
                                            sku: "",
                                            price: 0,
                                            salePrice: 0,
                                            stock: 0,
                                            options: {},
                                        })
                                    }
                                >
                                    <Plus className="w-4 h-4" /> Add variant
                                </Button>
                            </div>

                            {errors.variants && (
                                <p className="text-sm text-red-600 mb-4 font-medium">
                                    {errors.variants.message}
                                </p>
                            )}

                            {variantsArr.fields.length === 0 ? (
                                <div className="rounded-lg border border-dashed text-center py-10 bg-gray-50/50">
                                    <p className="text-sm text-muted-foreground">No variants added yet.</p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {variantsArr.fields.map((field, index) => {
                                        const baseErr = errors.variants?.[index];

                                        return (
                                            <div
                                                key={field.id}
                                                className="rounded-lg border bg-gray-50/50 p-4 relative group"
                                            >
                                                <div className="absolute top-4 right-4">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => variantsArr.remove(index)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>

                                                <div className="mb-4 pr-10">
                                                    <h3 className="font-medium">Variant {index + 1}</h3>
                                                </div>

                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    <div className="grid gap-2">
                                                        <Label>Name</Label>
                                                        <Input
                                                            placeholder="e.g. Red / Medium"
                                                            {...register(`variants.${index}.name` as const)}
                                                        />
                                                        {baseErr?.name ? (
                                                            <p className="text-sm text-red-600">{baseErr.name.message}</p>
                                                        ) : null}
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label>SKU <span className="text-muted-foreground font-normal">(optional)</span></Label>
                                                        <Input
                                                            placeholder="SKU"
                                                            {...register(`variants.${index}.sku` as const)}
                                                        />
                                                        {baseErr?.sku ? (
                                                            <p className="text-sm text-red-600">{baseErr.sku.message}</p>
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
                                                            <p className="text-sm text-red-600">{baseErr.price.message}</p>
                                                        ) : null}
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label>Sale Price <span className="text-muted-foreground font-normal">(optional)</span></Label>
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
                                                            <p className="text-sm text-red-600">{baseErr.salePrice.message}</p>
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
                                                            <p className="text-sm text-red-600">{baseErr.stock.message}</p>
                                                        ) : null}
                                                    </div>

                                                    <div className="grid gap-2 sm:col-span-2">
                                                        <Label>Options <span className="text-muted-foreground font-normal">(JSON format)</span></Label>
                                                        <Textarea
                                                            rows={2}
                                                            placeholder={`{"color":"Black", "size":"M"}`}
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
                                                                } catch {}
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
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="rounded-xl border bg-white shadow-sm">
                        <div className="p-6">
                            <h2 className="text-lg font-semibold mb-4">Status</h2>
                            <div className="grid gap-2">
                                <Label>Visibility</Label>
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
                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                        <SelectItem value="INACTIVE">Draft (Inactive)</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status ? (
                                    <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
                                ) : null}
                                <p className="text-xs text-muted-foreground mt-2">
                                    Set the product as active when it's ready to be visible to customers.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
