import { Voltax } from "@noelzappy/voltax";

export const paystack = Voltax("paystack", {
  secretKey: process.env.PAYSTACK_SECRET_KEY!,
});
