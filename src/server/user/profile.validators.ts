import { z } from "zod";

export const ProfileUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  image: z.string().url().optional().nullable(),
  phone: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  addressLine1: z.string().optional().nullable(),
  addressLine2: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
});

export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;
