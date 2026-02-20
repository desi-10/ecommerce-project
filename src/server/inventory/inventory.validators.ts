import { z } from "zod";

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

export type CreateInventoryInput = z.infer<typeof CreateInventorySchema>;
export type UpdateInventoryInput = z.infer<typeof UpdateInventorySchema>;
export type AdjustStockInput = z.infer<typeof AdjustStockSchema>;
