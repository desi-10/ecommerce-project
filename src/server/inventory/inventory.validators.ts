import { z } from "zod";
import { toInt } from "../products/products.utils";

export const CreateInventorySchema = z.object({
  variantId: z.string().min(1),
  stock: z.coerce.number().int().nonnegative().default(0),
});

export const UpdateInventorySchema = z.object({
  stock: z.coerce.number().int().nonnegative(),
});

export const AdjustStockSchema = z.object({
  variantId: z.string().min(1),
  qty: z.coerce.number().int().positive(),
});

export const listInventoriesSchema = z.object({
  productId: z.string().min(1).optional(),
  variantId: z.string().min(1).optional(),
  q: z.string().trim().optional(),
  inStock: z.preprocess((v) => {
    if (v === "true" || v === true) return true;
    if (v === "false" || v === false) return false;
    return undefined;
  }, z.boolean().optional()),
  page: z.preprocess(toInt, z.number().int().min(1)).default(1),
  limit: z.preprocess(toInt, z.number().int().min(1).max(100)).default(20),
});

export type CreateInventoryInput = z.infer<typeof CreateInventorySchema>;
export type UpdateInventoryInput = z.infer<typeof UpdateInventorySchema>;
export type AdjustStockInput = z.infer<typeof AdjustStockSchema>;
