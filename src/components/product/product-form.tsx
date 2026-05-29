"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

import {
  createProductSchema,
  type CreateProductInput,
} from "@/server/products/products.validators";
import { useCreateProduct, useUpdateProduct } from "@/hooks/use-product";
import { useGetCategories } from "@/hooks/use-category";
import {
  ArrowLeft,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

interface ProductFormProps {
  initialData?: any; // The Product object if editing
  isEdit?: boolean;
}

export function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync: createProduct, isPending: isCreating } =
    useCreateProduct();
  const { mutateAsync: updateProduct, isPending: isUpdating } =
    useUpdateProduct();
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useGetCategories({ limit: 100 });

  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const isPending = isCreating || isUpdating;

  const form = useForm<any>({
    resolver: zodResolver(createProductSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description || "",
          status: initialData.status,
          categoryId: initialData.categories?.[0]?.category?.id || "",
          defaultPrice: Number(initialData.variants?.[0]?.price) || 0,
          defaultSalePrice: initialData.variants?.[0]?.salePrice
            ? Number(initialData.variants[0].salePrice)
            : undefined,
          defaultStock: initialData.variants?.[0]?.inventory?.stock || 0,
          variants:
            initialData.variants?.length > 1
              ? initialData.variants.map((v: any) => ({
                  id: v.id,
                  name: v.name,
                  sku: v.sku || "",
                  price: Number(v.price),
                  salePrice: v.salePrice ? Number(v.salePrice) : undefined,
                  stock: v.inventory?.stock || 0,
                }))
              : [],
        }
      : {
          name: "",
          description: "",
          variants: [],
          status: "ACTIVE",
          categoryId: "",
        },
  });

  const { control, register, handleSubmit, setValue, watch, formState } = form;
  const { errors } = formState;

  const watchedVariants = watch("variants");
  const watchedCategoryId = watch("categoryId");
  const status = watch("status");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const onSubmit = async (values: any) => {
    try {
      setSubmitError(null);

      // Validation for images if creating
      if (!isEdit && selectedFiles.length === 0) {
        setSubmitError("Please upload at least one product image");
        return;
      }

      const formData = new FormData();

      formData.append("name", values.name);
      if (values.description)
        formData.append("description", values.description);
      formData.append("status", values.status);
      if (values.categoryId) formData.append("categoryId", values.categoryId);

      // Single variant support (if no multi-variants specified)
      if (!values.variants?.length) {
        if (values.defaultPrice !== undefined)
          formData.append("defaultPrice", String(values.defaultPrice));
        if (values.defaultSalePrice !== undefined)
          formData.append("defaultSalePrice", String(values.defaultSalePrice));
        if (values.defaultStock !== undefined)
          formData.append("defaultStock", String(values.defaultStock));
      } else {
        formData.append("variants", JSON.stringify(values.variants));
      }

      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      if (isEdit) {
        await updateProduct({ id: initialData.id, payload: formData as any });
      } else {
        await createProduct(formData as any);
      }

      setShowSuccess(true);

      setTimeout(() => {
        router.push("/dashboard/products");
        router.refresh();
      }, 1500);
    } catch (error: any) {
      setSubmitError(error?.message || "Failed to save product.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {showSuccess && (
        <div className="flex items-start gap-3 rounded-lg bg-green-50 p-4 border border-green-200 animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-green-900">
              Product {isEdit ? "updated" : "created"} successfully!
            </p>
            <p className="text-sm text-green-700 mt-0.5">Redirecting...</p>
          </div>
        </div>
      )}

      {submitError && (
        <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4 border border-red-200">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-900">Error</p>
            <p className="text-sm text-red-700 mt-0.5">{submitError}</p>
          </div>
        </div>
      )}

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
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            {isEdit ? "Edit Product" : "Add Product"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/dashboard/products")}
          >
            Discard
          </Button>
          <Button
            type="submit"
            disabled={isPending || showSuccess}
            className="bg-blue-600 text-white rounded-xl px-6 hover:bg-blue-700 h-10"
          >
            {isPending ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {/* General Information */}
          <div className="rounded-xl border bg-white shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">General Information</h2>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Apple MacBook Pro 14"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">
                    {errors.name.message as string}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell more about the product..."
                  className="min-h-[150px]"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message as string}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="rounded-xl border bg-white shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Product Images</h2>
              <p className="text-xs text-muted-foreground">
                {isEdit ? "Upload to replace gallery" : "Upload up to 5 images"}
              </p>
            </div>
            <div className="grid gap-4">
              <div className="grid grid-cols-4 gap-4">
                {isEdit &&
                  initialData.images?.map((img: any, idx: number) => (
                    <div
                      key={img.id || idx}
                      className="relative rounded-lg overflow-hidden border aspect-square bg-gray-50 flex items-center justify-center group"
                    >
                      <img
                        src={img.url}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[10px] text-white font-bold px-2 py-1 bg-black/60 rounded uppercase">
                          Current
                        </span>
                      </div>
                    </div>
                  ))}
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg overflow-hidden border aspect-square bg-white shadow-sm ring-2 ring-blue-500 flex items-center justify-center"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedFiles((prev) =>
                          prev.filter((_, i) => i !== index),
                        )
                      }
                      className="absolute top-1 right-1 bg-white shadow-md p-1 rounded-full text-red-600 hover:bg-red-50"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-blue-600 text-[8px] font-bold text-white rounded uppercase">
                      New
                    </div>
                  </div>
                ))}
                {selectedFiles.length +
                  (isEdit ? initialData.images?.length || 0 : 0) <
                  8 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-400 font-medium"
                  >
                    <Plus className="h-6 w-6 mb-1" />
                    <span className="text-[10px]">Add Photo</span>
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  setSelectedFiles((prev) => [
                    ...prev,
                    ...Array.from(e.target.files || []),
                  ])
                }
              />
            </div>
          </div>

          {/* Pricing */}
          {!fields.length && (
            <div className="rounded-xl border bg-white shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">
                Pricing & Inventory
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Standard Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("defaultPrice")}
                  />
                  {errors.defaultPrice && (
                    <p className="text-sm text-red-500">
                      {errors.defaultPrice.message as string}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label>Sale Price (Optional)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("defaultSalePrice")}
                  />
                  {errors.defaultSalePrice && (
                    <p className="text-sm text-red-500">
                      {errors.defaultSalePrice.message as string}
                    </p>
                  )}
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label>Initial Stock</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    {...register("defaultStock")}
                  />
                  {errors.defaultStock && (
                    <p className="text-sm text-red-500">
                      {errors.defaultStock.message as string}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Variants Restoration */}
          <div className="rounded-xl border bg-white shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Product Variants</h2>
                <p className="text-sm text-muted-foreground">
                  Manage different sizes, colors or versions.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  append({ name: "", sku: "", price: 0, stock: 0 })
                }
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Variant
              </Button>
            </div>

            {fields.length > 0 ? (
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-4 border rounded-xl bg-gray-50/50 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold">
                        Variant #{index + 1}
                      </h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-1.5">
                        <Label className="text-xs">
                          Variant Name (e.g. Red / Large)
                        </Label>
                        <Input
                          {...register(`variants.${index}.name` as const)}
                          placeholder="Name"
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label className="text-xs">SKU</Label>
                        <Input
                          {...register(`variants.${index}.sku` as const)}
                          placeholder="SKU"
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label className="text-xs">Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          {...register(`variants.${index}.price` as const)}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label className="text-xs">Stock</Label>
                        <Input
                          type="number"
                          {...register(`variants.${index}.stock` as const)}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border-2 border-dashed rounded-xl bg-gray-50">
                <ImageIcon className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No variants added yet.</p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Single product pricing will be used.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Status Toggle */}
          <div className="rounded-xl border bg-white shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Availability</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Product Status</Label>
                <Badge variant={status === "ACTIVE" ? "default" : "secondary"}>
                  {status === "ACTIVE" ? "Active" : "Archived"}
                </Badge>
              </div>
              <Select
                value={status}
                onValueChange={(v) =>
                  setValue("status", v as "ACTIVE" | "INACTIVE")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Publish Now</SelectItem>
                  <SelectItem value="INACTIVE">Save as Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Single Category Select Restoration */}
          <div className="rounded-xl border bg-white shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Category</h2>
            {isLoadingCategories ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="space-y-4">
                <Select
                  value={watchedCategoryId}
                  onValueChange={(v) => setValue("categoryId", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesData?.data?.categories.map((category: any) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && (
                  <p className="text-sm text-red-500">
                    {errors.categoryId.message as string}
                  </p>
                )}

                {watchedCategoryId && (
                  <div className="pt-2">
                    <Label className="text-xs text-muted-foreground mb-2 block">
                      Selected Category
                    </Label>
                    <Badge
                      variant="outline"
                      className="bg-blue-50/50 text-blue-700 border-blue-200 py-1"
                    >
                      {
                        categoriesData?.data?.categories.find(
                          (c: any) => c.id === watchedCategoryId,
                        )?.name
                      }
                    </Badge>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
