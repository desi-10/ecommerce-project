import { z } from "zod";

export const DiscountTypeSchema = z.enum(["PERCENT", "AMOUNT"]);
export const DiscountStatusSchema = z.enum(["ACTIVE", "INACTIVE"]);

const dateOrNull = z.coerce.date().nullable().optional();

export const CreateCouponSchema = z.object({
  code: z
    .string()
    .min(3)
    .max(30)
    .transform((s) => s.trim().toUpperCase().replace(/\s+/g, "")),
  type: DiscountTypeSchema,
  value: z.coerce.number().positive(),
  status: DiscountStatusSchema.optional().default("ACTIVE"),

  minOrderValue: z.coerce.number().positive().optional().nullable(),
  maxUses: z.coerce.number().int().positive().optional().nullable(),

  startsAt: dateOrNull,
  endsAt: dateOrNull,
});

export const UpdateCouponSchema = CreateCouponSchema.partial().extend({
  // don't allow empty string updates
  code: z
    .string()
    .min(3)
    .max(30)
    .transform((s) => s.trim().toUpperCase().replace(/\s+/g, ""))
    .optional(),
});

export const CreateProductDiscountSchema = z.object({
  productId: z.string().min(1),
  type: DiscountTypeSchema,
  value: z.coerce.number().positive(),
  status: DiscountStatusSchema.optional().default("ACTIVE"),
  startsAt: dateOrNull,
  endsAt: dateOrNull,
});

export const UpdateProductDiscountSchema =
  CreateProductDiscountSchema.partial();

export type CreateCouponInput = z.infer<typeof CreateCouponSchema>;
export type UpdateCouponInput = z.infer<typeof UpdateCouponSchema>;
export type CreateProductDiscountInput = z.infer<
  typeof CreateProductDiscountSchema
>;
export type UpdateProductDiscountInput = z.infer<
  typeof UpdateProductDiscountSchema
>;
