import { z } from "zod";
import { toInt } from "../products/products.utils";

export const OrderSchema = z.object({
  userId: z.string().optional(),
  couponCode: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .transform((s) => s.toUpperCase().replace(/\s+/g, ""))
    .optional(),
  items: z
    .array(
      z.object({
        variantId: z.string().min(1),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
});

export const orderStatusSchema = z.enum([
  "PENDING",
  "PAID",
  "FAILED",
  "CANCELLED",
  "REFUNDED",
]);

export const listOrdersSchema = z.object({
  page: z.preprocess(toInt, z.number().int().min(1)).default(1),

  limit: z.preprocess(toInt, z.number().int().min(1).max(100)).default(20),

  q: z.string().trim().optional(), // search by email or order number

  status: orderStatusSchema.optional(),

  sort: z.enum(["newest", "oldest"]).default("newest"),
});

export type ListOrderInput = z.infer<typeof listOrdersSchema>;

export type OrderType = z.infer<typeof OrderSchema>;
