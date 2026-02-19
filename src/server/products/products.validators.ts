import z from "zod";
import { toInt, toNumber } from "./products.utils";

const productStatusSchema = z.enum(["ACTIVE", "INACTIVE"]);

const variantCreateSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  sku: z.string().min(1).optional(),
  price: z.preprocess(toNumber, z.number().nonnegative("Price must be >= 0")),
  salePrice: z.preprocess(toNumber, z.number().nonnegative().optional()),
  stock: z.preprocess(toInt, z.number().int().nonnegative()).default(0),
  // options like: { color: "Black", size: "M" }
  options: z.record(z.string(), z.string()).optional(),
});

const variantUpdateSchema = variantCreateSchema.extend({
  id: z.string().min(1).optional(), // if present => update, else => create
});

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  status: productStatusSchema.default("ACTIVE"),
  variants: z.array(variantCreateSchema).default([]),

  // Used only if variants is empty:
  defaultPrice: z.preprocess(toNumber, z.number().nonnegative().optional()),
  defaultSalePrice: z.preprocess(toNumber, z.number().nonnegative().optional()),
  defaultStock: z.preprocess(toInt, z.number().int().nonnegative().optional()),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  status: productStatusSchema.optional(),
  // If provided, we sync variants to match this list.
  variants: z.array(variantUpdateSchema).optional(),
});

export const listProductsSchema = z.object({
  page: z.preprocess(toInt, z.number().int().min(1)).default(1),
  limit: z.preprocess(toInt, z.number().int().min(1).max(100)).default(20),
  q: z.string().trim().optional(), // search name
  status: productStatusSchema.optional(),
  sort: z.enum(["newest", "oldest", "name_asc", "name_desc"]).default("newest"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ListProductsInput = z.infer<typeof listProductsSchema>;
