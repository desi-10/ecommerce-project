import { z } from "zod";
import { toInt } from "../products/products.utils";

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be 80 characters or less"),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be 80 characters or less")
    .optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const listCategorySchema = z.object({
  page: z.preprocess(toInt, z.number().int().min(1)).default(1),
  limit: z.preprocess(toInt, z.number().int().min(1).max(100)).default(20),
  q: z.string().trim().optional(),
});

export type CategorySchemaType = z.infer<typeof categorySchema>;
export type UpdateCategorySchemaType = z.infer<typeof updateCategorySchema>;
export type ListCategorySchemaType = z.infer<typeof listCategorySchema>;
