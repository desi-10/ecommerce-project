import { paystack } from "@/cofigs/voltex";
import { stripe } from "@/cofigs/stripe";
import { createNowPaymentsInvoice } from "@/cofigs/nowpayments";
import { apiResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error";
import prisma from "@/lib/db";
import { Currency } from "@noelzappy/voltax";
import {
  createOrderPaymentInput,
  CreatePaymentRecordInput,
  ListPaymentsInput,
  UpdatePaymentRecordInput,
} from "./payment.validators";
import StatusCodes from "http-status-codes";
import { createOrderService } from "../order/orders.service";
import { randomUUID } from "crypto";

export const initiateOrderService = async (
  data: createOrderPaymentInput,
  userId: string,
) => {
  let authorizationUrl: string;
  let reference: string;
  let provider: "STRIPE" | "PAYSTACK" | "CRYPTO";

  if (data.gateway === "stripe") {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new ApiError("Stripe is not configured", StatusCodes.NOT_IMPLEMENTED);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Order Checkout",
            },
            unit_amount: Math.round(Number(data.amount) * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.BETTER_AUTH_BASE_URL}/checkout/success?reference={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BETTER_AUTH_BASE_URL}/checkout`,
      customer_email: data.email,
    });

    if (!session.url || !session.id) {
      throw new Error("Failed to create Stripe session");
    }

    authorizationUrl = session.url;
    reference = session.id;
    provider = "STRIPE";
  } else if (data.gateway === "paystack") {
    const payment = await paystack.initiatePayment({
      amount: Math.round(Number(data.amount) * 100),
      email: data.email,
      currency: Currency.GHS,
      callbackUrl: `${process.env.BETTER_AUTH_BASE_URL}/checkout/success`,
    });

    if (!payment.authorizationUrl || !payment.reference) {
      throw new Error("Failed to initiate Paystack payment");
    }

    authorizationUrl = payment.authorizationUrl;
    reference = payment.reference;
    provider = "PAYSTACK";
  } else if (data.gateway === "crypto") {
    if (!process.env.NOWPAYMENTS_API_KEY) {
      throw new ApiError("Crypto payment is not configured", StatusCodes.NOT_IMPLEMENTED);
    }

    // NOWPayments echoes order_id back on the IPN and lets us pick it
    // ourselves, so we generate the reference up front instead of getting
    // one back from the provider (unlike Stripe/Paystack above).
    reference = randomUUID();

    const invoice = await createNowPaymentsInvoice({
      amount: Number(data.amount),
      orderId: reference,
      successUrl: `${process.env.BETTER_AUTH_BASE_URL}/checkout/success?reference=${reference}`,
      cancelUrl: `${process.env.BETTER_AUTH_BASE_URL}/checkout`,
      ipnCallbackUrl: `${process.env.BETTER_AUTH_BASE_URL}/api/webhooks/nowpayments`,
    });

    if (!invoice.invoice_url) {
      throw new Error("Failed to create crypto invoice");
    }

    authorizationUrl = invoice.invoice_url;
    provider = "CRYPTO";
  } else {
    throw new ApiError("Unsupported payment gateway", StatusCodes.BAD_REQUEST);
  }

  console.log("Initiating order");
  console.log(data, "data");
  const order = await createOrderService({
    items: data.items,
    userId: userId || data.userId,
    couponCode: data.couponCode,
  });
  console.log("Order created");
  console.log(order, "order");

  await prisma.payment.create({
    data: {
      provider: provider,
      amount: data.amount,
      metadata: data.metadata,
      orderId: order.data.id,
      userId: order.data.userId || null,
      reference: reference,
      status: "PENDING",
    },
  });

  return apiResponse("Payment initiated", {
    authorizationUrl: authorizationUrl,
    reference: reference,
  });
};

export const listPaymentsService = async (
  query: ListPaymentsInput,
  userId: string,
) => {
  const where = {
    userId,
    ...(query.status ? { status: query.status } : {}),
  };

  const [total, items] = await Promise.all([
    prisma.payment.count({ where }),
    prisma.payment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        order: {
          select: {
            id: true,
            status: true,
            total: true,
          },
        },
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / query.limit));

  return apiResponse("Payments fetched successfully", {
    payments: items,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
      hasNextPage: query.page < totalPages,
      hasPrevPage: query.page > 1,
    },
  });
};

export const adminListPaymentsService = async (query: ListPaymentsInput) => {
  const where = {
    ...(query.status ? { status: query.status } : {}),
  };

  const [total, items] = await Promise.all([
    prisma.payment.count({ where }),
    prisma.payment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        order: {
          select: {
            id: true,
            status: true,
            total: true,
            createdAt: true,
          },
        },
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / query.limit));

  return apiResponse("All payments fetched successfully", {
    payments: items,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
      hasNextPage: query.page < totalPages,
      hasPrevPage: query.page > 1,
    },
  });
};

export const createPaymentRecordService = async (
  data: CreatePaymentRecordInput,
  userId: string,
) => {
  const payment = await prisma.payment.create({
    data: {
      userId,
      provider: data.provider,
      status: data.status,
      amount: data.amount,
      currency: data.currency,
      orderId: data.orderId,
      reference: data.reference,
      metadata: data.metadata,
    },
  });

  return apiResponse("Payment created successfully", payment);
};

export const getPaymentByIdService = async (id: string, userId: string) => {
  const payment = await prisma.payment.findFirst({
    where: { id, userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!payment) {
    throw new ApiError("Payment not found", StatusCodes.NOT_FOUND);
  }

  return apiResponse("Payment fetched successfully", payment);
};

export const updatePaymentStatusService = async (
  id: string,
  status: "PENDING" | "SUCCEEDED" | "FAILED" | "CANCELLED" | "REFUNDED",
) => {
  const existing = await prisma.payment.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new ApiError("Payment not found", StatusCodes.NOT_FOUND);
  }

  const updated = await prisma.payment.update({
    where: { id },
    data: { status },
  });

  return apiResponse("Payment status updated successfully", updated);
};

export const deletePaymentService = async (id: string, userId: string) => {
  const existing = await prisma.payment.findFirst({
    where: { id, userId },
    select: { id: true },
  });

  if (!existing) {
    throw new ApiError("Payment not found", StatusCodes.NOT_FOUND);
  }

  await prisma.payment.delete({ where: { id } });

  return apiResponse("Payment deleted successfully", null);
};

export const payExistingOrderService = async (
  orderId: string,
  userId: string,
  gateway: string = "paystack",
) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      payments: {
        orderBy: { createdAt: "desc" },
      },
      user: true,
    },
  });

  if (!order) {
    throw new ApiError("Order not found", StatusCodes.NOT_FOUND);
  }

  if (order.status !== "PENDING") {
    throw new ApiError(
      "Payment can only be made for pending orders",
      StatusCodes.BAD_REQUEST,
    );
  }

  let authorizationUrl: string;
  let reference: string;
  let provider: "STRIPE" | "PAYSTACK" | "CRYPTO";

  const paymentWithMeta = order.payments?.find((p: any) => p.metadata);
  let email = order.user?.email;

  if (paymentWithMeta?.metadata) {
    try {
      const meta = typeof paymentWithMeta.metadata === "string"
        ? JSON.parse(paymentWithMeta.metadata)
        : paymentWithMeta.metadata;
      if (meta?.email) email = meta.email;
    } catch (e) {
      console.error("Failed to parse metadata", e);
    }
  }

  if (!email) {
    throw new ApiError("Customer email missing", StatusCodes.BAD_REQUEST);
  }

  const amountNumber = Number(order.total);

  if (gateway === "stripe") {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new ApiError("Stripe is not configured", StatusCodes.NOT_IMPLEMENTED);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Order #${order.id.slice(-8).toUpperCase()}`,
            },
            unit_amount: Math.round(amountNumber * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.BETTER_AUTH_BASE_URL}/checkout/success?reference={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BETTER_AUTH_BASE_URL}/account/orders/${order.id}`,
      customer_email: email,
    });

    if (!session.url || !session.id) {
      throw new Error("Failed to create Stripe session");
    }

    authorizationUrl = session.url;
    reference = session.id;
    provider = "STRIPE";
  } else if (gateway === "paystack") {
    const payment = await paystack.initiatePayment({
      amount: Math.round(amountNumber * 100),
      email: email,
      currency: Currency.GHS,
      callbackUrl: `${process.env.BETTER_AUTH_BASE_URL}/checkout/success`,
    });

    if (!payment.authorizationUrl || !payment.reference) {
      throw new Error("Failed to initiate Paystack payment");
    }

    authorizationUrl = payment.authorizationUrl;
    reference = payment.reference;
    provider = "PAYSTACK";
  } else if (gateway === "crypto") {
    if (!process.env.NOWPAYMENTS_API_KEY) {
      throw new ApiError("Crypto payment is not configured", StatusCodes.NOT_IMPLEMENTED);
    }

    reference = randomUUID();

    const invoice = await createNowPaymentsInvoice({
      amount: amountNumber,
      orderId: reference,
      successUrl: `${process.env.BETTER_AUTH_BASE_URL}/checkout/success?reference=${reference}`,
      cancelUrl: `${process.env.BETTER_AUTH_BASE_URL}/account/orders/${order.id}`,
      ipnCallbackUrl: `${process.env.BETTER_AUTH_BASE_URL}/api/webhooks/nowpayments`,
    });

    if (!invoice.invoice_url) {
      throw new Error("Failed to create crypto invoice");
    }

    authorizationUrl = invoice.invoice_url;
    provider = "CRYPTO";
  } else {
    throw new ApiError("Unsupported payment gateway", StatusCodes.BAD_REQUEST);
  }

  await prisma.payment.create({
    data: {
      provider: provider,
      amount: order.total,
      metadata: (paymentWithMeta?.metadata as any) ?? undefined,
      orderId: order.id,
      userId: order.userId || null,
      reference: reference,
      status: "PENDING",
    },
  });

  return apiResponse("Payment initiated", {
    authorizationUrl,
    reference,
  });
};
