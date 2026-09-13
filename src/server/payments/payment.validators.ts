import { z } from "zod";
import { toInt } from "../products/products.utils";

export const createOrderPayment = z.object({
  email: z.string().email(),
  amount: z.number().positive(),
  gateway: z.enum(["stripe", "paystack", "crypto"]),
  orderId: z.string().optional(),
  metadata: z.string().optional(),
  userId: z.string().optional(),
  // Mobile passes its own app-scheme deep link base here (from
  // expo-linking's Linking.createURL('checkout')) instead of falling
  // through to the web's /checkout/success page — that's what lets the
  // gateway's own redirect, not just the in-app browser closing for any
  // reason, drive what the app does next. Not restricted at the schema
  // level — payments.service.ts only actually uses it when it matches a
  // known-safe scheme (martfury:// or exp://, the Expo Go dev proxy),
  // silently falling back to the web URL otherwise, so a malformed or
  // spoofed value degrades gracefully instead of failing the whole
  // request or becoming an open redirect to an arbitrary https URL
  // mid-payment.
  mobileRedirectBase: z.string().min(1).optional(),
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

export const createPayment = z.object({
  email: z.string().email(),
  amount: z.number().positive(),
  orderId: z.string().optional(),
  metadata: z.string().optional(),
});

export const createPaymentRecordSchema = z.object({
  provider: z.enum(["STRIPE", "PAYSTACK", "CRYPTO", "FLUTTERWAVE", "CASH", "OTHER"]),
  status: z
    .enum(["PENDING", "SUCCEEDED", "FAILED", "CANCELLED", "REFUNDED"])
    .default("PENDING"),
  amount: z.number().positive(),
  currency: z.string().min(3).max(3).default("GHS"),
  orderId: z.string().optional(),
  reference: z.string().optional(),
  metadata: z.string().optional(),
});

export const updatePaymentRecordSchema = z.object({
  status: z
    .enum(["PENDING", "SUCCEEDED", "FAILED", "CANCELLED", "REFUNDED"])
    .optional(),
  reference: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  orderId: z.string().optional(),
});

export const listPaymentsSchema = z.object({
  page: z.preprocess(toInt, z.number().int().min(1)).default(1),
  limit: z.preprocess(toInt, z.number().int().min(1).max(100)).default(20),
  status: z
    .enum(["PENDING", "SUCCEEDED", "FAILED", "CANCELLED", "REFUNDED"])
    .optional(),
});

export type createOrderPaymentInput = z.infer<typeof createOrderPayment>;
export type CreatePaymentInput = z.infer<typeof createPayment>;
export type CreatePaymentRecordInput = z.infer<
  typeof createPaymentRecordSchema
>;
export type UpdatePaymentRecordInput = z.infer<
  typeof updatePaymentRecordSchema
>;
export type ListPaymentsInput = z.infer<typeof listPaymentsSchema>;
