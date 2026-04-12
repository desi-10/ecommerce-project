// validators/products.schema.ts
import { z } from "zod";
import { toInt, toNumber } from "./products.utils"; // ✅ safe

export const productStatusSchema = z.enum(["ACTIVE", "INACTIVE"]);

export const variantCreateSchema = z.object({
  name: z.string().trim().min(1, "Variant name is required"),
  sku: z.string().trim().min(1, "SKU cannot be empty").optional(),
  price: z.preprocess(toNumber, z.number().nonnegative("Price must be >= 0")),
  salePrice: z.preprocess(toNumber, z.number().nonnegative().optional()),
  stock: z.preprocess(toInt, z.number().int().nonnegative()).default(0),
  options: z.record(z.string(), z.string()).optional(),
});

export const variantUpdateSchema = variantCreateSchema.extend({
  id: z.string().trim().min(1).optional(),
});

export const imageObjectSchema = z.object({
  id: z.string(),
  url: z.string(),
});

export const createProductSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),
  description: z.string().optional(),
  images: z.array(imageObjectSchema).optional(),
  status: productStatusSchema.default("ACTIVE"),
  variants: z.array(variantCreateSchema).default([]),

  defaultPrice: z.preprocess(toNumber, z.number().nonnegative().optional()),
  defaultSalePrice: z.preprocess(toNumber, z.number().nonnegative().optional()),
  defaultStock: z.preprocess(toInt, z.number().int().nonnegative().optional()),
});

export const updateProductSchema = z.object({
  name: z.string().trim().min(1).optional(),
  description: z.string().optional(),
  images: z.array(imageObjectSchema).optional(),
  status: productStatusSchema.optional(),
  variants: z.array(variantUpdateSchema).optional(),
});

export const listProductsSchema = z.object({
  page: z.preprocess(toInt, z.number().int().min(1)).default(1),
  limit: z.preprocess(toInt, z.number().int().min(1).max(100)).default(20),
  q: z.string().trim().optional(),
  status: productStatusSchema.optional(),
  category: z.string().trim().optional(),
  categories: z.preprocess((v) => {
    if (typeof v === "string" && v !== "") return v.split(",");
    if (Array.isArray(v)) return v;
    return undefined;
  }, z.array(z.string()).optional()),
  minPrice: z.preprocess(toNumber, z.number().nonnegative().optional()),
  maxPrice: z.preprocess(toNumber, z.number().nonnegative().optional()),
  onDiscount: z.preprocess((v) => {
    if (v === "true" || v === true) return true;
    if (v === "false" || v === false) return false;
    return undefined;
  }, z.boolean().optional()),
  sort: z.enum(["newest", "oldest", "name_asc", "name_desc", "price_asc", "price_desc"]).default("newest"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ListProductsInput = z.infer<typeof listProductsSchema>;

// For internal use
export type ListProductsParams = {
  page?: number;
  limit?: number;
  q?: string;
  status?: "ACTIVE" | "INACTIVE";
  category?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  onDiscount?: boolean;
  sort?: "newest" | "oldest" | "name_asc" | "name_desc" | "price_asc" | "price_desc";
};
