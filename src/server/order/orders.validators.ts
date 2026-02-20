import { z } from "zod";

export const OrderSchema = z.object({
  userId: z.string().min(1),
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

export type OrderType = z.infer<typeof OrderSchema>;
