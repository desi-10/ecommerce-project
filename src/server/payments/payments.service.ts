import { paystack } from "@/cofigs/voltex";
import { apiResponse } from "@/lib/api-response";
import prisma from "@/lib/db";
import { Currency } from "@noelzappy/voltax";

type dataType<T> = {
  email: string;
  amount: number;
  userId: string;
  metadata: T;
  orderId: string;
};

export const initiateService = async <T>(data: dataType<T>) => {
  const payment = await paystack.initiatePayment({
    amount: 5000,
    email: "customer@example.com",
    currency: Currency.GHS,
  });

  await prisma.payment.create({
    data: {
      provider: "PAYSTACK",
      amount: data.amount,
      metadata: JSON.stringify(data.metadata),
      orderId: data.orderId,
      userId: data.userId,
      reference: payment.reference,
    },
  });

  const authorizationUrl = payment.authorizationUrl;

  return apiResponse("ok", { authorizationUrl });
};
