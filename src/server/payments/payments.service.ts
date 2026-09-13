import { paystack } from "@/cofigs/voltex";
import { stripe } from "@/cofigs/stripe";
import { createNowPaymentsInvoice, isNowPaymentsConfigured } from "@/cofigs/nowpayments";
import { apiResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error";
import prisma from "@/lib/db";
import { Currency, PaymentStatus as VoltaxPaymentStatus } from "@noelzappy/voltax";
import {
  createOrderPaymentInput,
  CreatePaymentRecordInput,
  ListPaymentsInput,
  UpdatePaymentRecordInput,
} from "./payment.validators";
import StatusCodes from "http-status-codes";
import {
  cancelOrderService,
  createOrderService,
  markOrderFailedService,
  markOrderPaidService,
} from "../order/orders.service";
import { sendPurchaseEmail } from "@/lib/email";
import { convertGhsToUsd } from "@/lib/currency-convert";
import { randomUUID } from "crypto";

// Stripe is the USD-settling option here — Paystack already handles GHS
// natively (Currency.GHS below), so Stripe intentionally charges in
// dollars rather than being a second GHS gateway. The storefront still
// prices everything in cedis throughout the UI, so the GHS order total
// must be converted before it reaches Stripe (see lib/currency-convert.ts)
// — sending the raw GHS number as if it were already USD (the original
// bug) charged a GH₵500 cart as $500.00, ~13-15x the real price.
const STRIPE_CURRENCY = "usd";

const SAFE_MOBILE_SCHEMES = ["martfury://", "exp://", "exps://"];

/**
 * Where the gateway sends the shopper back to once they're done.
 *
 * On web this is always the site's own /checkout pages. On mobile, opening
 * a payment page in a generic in-app browser (expo-web-browser) means the
 * app only ever learns "the browser closed" — not *why*, or which of
 * success_url/cancel_url (if either) the gateway actually redirected to
 * first. Passing an app-scheme deep link here lets the OS hand control
 * back to the app at the exact right moment instead, so a real cancel from
 * inside Stripe/Paystack navigates the app straight back to checkout
 * rather than always landing on the "confirm payment" screen and polling
 * an order that was never going to resolve (this was reported as: cancel
 * a payment on mobile, land on "Confirming Your Payment", it never
 * changes).
 */
function resolveRedirectUrls(
  mobileRedirectBase?: string,
  // Paying for an already-created order (payExistingOrderService) cancels
  // back to that order's own detail view instead of the fresh-checkout
  // page — web: /account/orders/{id}, mobile: orders/{id}.
  cancelOrderId?: string,
) {
  const base =
    mobileRedirectBase && SAFE_MOBILE_SCHEMES.some((scheme) => mobileRedirectBase.startsWith(scheme))
      ? mobileRedirectBase
      : null;

  if (base) {
    // Mobile always cancels back to the same deep-link base regardless of
    // flow (fresh checkout or paying an existing order) — the order-detail
    // cancel target below is a web-only nicety, not worth the fragility of
    // guessing at an app deep-link's path shape from a generic string.
    return {
      successBase: `${base}/success`,
      cancelUrl: base,
    };
  }

  const webBase = `${process.env.BETTER_AUTH_BASE_URL}/checkout`;
  return {
    successBase: `${webBase}/success`,
    cancelUrl: cancelOrderId
      ? `${process.env.BETTER_AUTH_BASE_URL}/account/orders/${cancelOrderId}`
      : webBase,
  };
}

export const initiateOrderService = async (
  data: createOrderPaymentInput,
  userId: string,
) => {
  // Create the order FIRST so the amount charged is always the
  // server-computed total (subtotal minus product/coupon discounts, from
  // createOrderService) — never the client-supplied `data.amount`. The old
  // flow used `data.amount` to build the Stripe/Paystack/crypto session and
  // only computed the real total afterwards when creating the order row,
  // so a tampered request body could charge any price for a real cart.
  // `data.amount` is still accepted for backwards compatibility (older
  // mobile builds send it) but is never used for the actual charge.
  const order = await createOrderService({
    items: data.items,
    userId: userId || data.userId,
    couponCode: data.couponCode,
  });

  const amountToCharge = Number(order.data.total);
  const { successBase, cancelUrl } = resolveRedirectUrls(data.mobileRedirectBase);

  let authorizationUrl: string;
  let reference: string;
  let provider: "STRIPE" | "PAYSTACK" | "CRYPTO";

  try {
    if (data.gateway === "stripe") {
      if (!process.env.STRIPE_SECRET_KEY) {
        throw new ApiError("Stripe is not configured", StatusCodes.NOT_IMPLEMENTED);
      }

      const amountUsd = convertGhsToUsd(amountToCharge);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: STRIPE_CURRENCY,
              product_data: {
                name: "Order Checkout",
              },
              unit_amount: Math.round(amountUsd * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${successBase}?reference={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
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
        amount: Math.round(amountToCharge * 100),
        email: data.email,
        currency: Currency.GHS,
        callbackUrl: successBase,
      });

      if (!payment.authorizationUrl || !payment.reference) {
        throw new Error("Failed to initiate Paystack payment");
      }

      authorizationUrl = payment.authorizationUrl;
      reference = payment.reference;
      provider = "PAYSTACK";
    } else if (data.gateway === "crypto") {
      // Was checking process.env.NOWPAYMENTS_API_KEY directly, which only
      // ever looks at the LIVE key — so a correctly-configured sandbox
      // setup (NOWPAYMENTS_SANDBOX=true + NOWPAYMENTS_SANDBOX_API_KEY, no
      // live key) always failed this check even though
      // createNowPaymentsInvoice below would have worked fine.
      if (!isNowPaymentsConfigured) {
        throw new ApiError("Crypto payment is not configured", StatusCodes.NOT_IMPLEMENTED);
      }

      // NOWPayments echoes order_id back on the IPN and lets us pick it
      // ourselves, so we generate the reference up front instead of getting
      // one back from the provider (unlike Stripe/Paystack above).
      reference = randomUUID();

      // Same currency bug as Stripe had: createNowPaymentsInvoice always
      // invoices in USD (price_currency: "usd" — NOWPayments doesn't do
      // GHS), so the GHS order total must be converted first or a GH₵500
      // cart gets invoiced as $500.00.
      const invoice = await createNowPaymentsInvoice({
        amount: convertGhsToUsd(amountToCharge),
        orderId: reference,
        successUrl: `${successBase}?reference=${reference}`,
        cancelUrl,
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
  } catch (err) {
    // The order (and its stock reservation) was already created above —
    // if we can't actually stand up a payment session for it, release the
    // stock and cancel it rather than leaving an orphaned PENDING order
    // silently holding inventory forever.
    await cancelOrderService(order.data.id).catch((cleanupErr) => {
      console.error("Failed to cancel order after payment init failure:", cleanupErr);
    });
    throw err;
  }

  await prisma.payment.create({
    data: {
      provider: provider,
      amount: amountToCharge,
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
  mobileRedirectBase?: string,
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
  const { successBase, cancelUrl } = resolveRedirectUrls(mobileRedirectBase, order.id);

  if (gateway === "stripe") {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new ApiError("Stripe is not configured", StatusCodes.NOT_IMPLEMENTED);
    }

    const amountUsd = convertGhsToUsd(amountNumber);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: STRIPE_CURRENCY,
            product_data: {
              name: `Order #${order.id.slice(-8).toUpperCase()}`,
            },
            unit_amount: Math.round(amountUsd * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${successBase}?reference={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
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
      callbackUrl: successBase,
    });

    if (!payment.authorizationUrl || !payment.reference) {
      throw new Error("Failed to initiate Paystack payment");
    }

    authorizationUrl = payment.authorizationUrl;
    reference = payment.reference;
    provider = "PAYSTACK";
  } else if (gateway === "crypto") {
    if (!isNowPaymentsConfigured) {
      throw new ApiError("Crypto payment is not configured", StatusCodes.NOT_IMPLEMENTED);
    }

    reference = randomUUID();

    const invoice = await createNowPaymentsInvoice({
      amount: convertGhsToUsd(amountNumber),
      orderId: reference,
      successUrl: `${successBase}?reference=${reference}`,
      cancelUrl,
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

/**
 * The ONLY place a Stripe/Paystack payment gets marked as paid. Called from
 * GET /api/orders/reference/[ref], which the checkout success page hits
 * once the shopper is redirected back.
 *
 * This used to trust that GET on its own — any request with a reference
 * (handed to the browser the moment checkout starts, before any money
 * moves) flipped the order to PAID with no check that payment actually
 * happened. That let anyone mark any of their own pending orders paid for
 * free. Now it verifies with the provider first.
 *
 * Crypto is deliberately excluded from verification here: a client GET
 * proves nothing for an irreversible on-chain payment, so crypto orders are
 * only ever confirmed by the signature-verified NOWPayments IPN webhook
 * (src/app/api/webhooks/nowpayments/route.ts). This just reports whatever
 * status that webhook has (or hasn't yet) set.
 */
export const confirmPaymentByReferenceService = async (reference: string) => {
  const payment = await prisma.payment.findUnique({
    where: { reference },
    include: {
      user: true,
      order: {
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!payment || !payment.order) {
    throw new ApiError("Order not found", StatusCodes.NOT_FOUND);
  }

  // Already resolved (by an earlier hit of this route, or by the crypto
  // webhook) — nothing left to verify.
  if (payment.order.status !== "PENDING") {
    return apiResponse("Order fetched successfully", payment.order);
  }

  let verifiedPaid = false;
  // A definitive "this will never be paid" answer, as opposed to just not
  // being paid *yet*. Without this distinction, a declined/cancelled
  // Paystack payment left the order PENDING forever — reserved stock never
  // released, and the success page polling toward a status that would
  // never arrive (see markOrderFailedService's doc comment).
  let verifiedFailed = false;

  if (payment.provider === "STRIPE") {
    if (process.env.STRIPE_SECRET_KEY) {
      const session = await stripe.checkout.sessions.retrieve(reference);
      verifiedPaid = session.payment_status === "paid";
      // "expired" = the checkout session's time limit passed with no
      // payment — definitively dead. "open" just means still in progress
      // elsewhere; Stripe only ever sends the browser back to this
      // success_url once complete, so "open" shouldn't normally reach
      // here at all.
      verifiedFailed = session.status === "expired";
    }
  } else if (payment.provider === "PAYSTACK") {
    const result = await paystack.verifyTransaction(reference);
    verifiedPaid = result.status === VoltaxPaymentStatus.SUCCESS;
    // Paystack uses one callback URL for both success AND cancel/decline
    // (unlike Stripe's separate success/cancel URLs), so a cancelled
    // checkout lands right here just like a real one — this is what
    // actually resolves it instead of leaving it pending forever.
    verifiedFailed = result.status === VoltaxPaymentStatus.FAILED;
  }
  // CRYPTO: both stay false — see doc comment above; only the webhook
  // resolves crypto orders, in either direction.

  if (verifiedFailed) {
    const { order: updatedOrder } = await markOrderFailedService(payment.order.id, {
      paymentId: payment.id,
    });
    return apiResponse("Order fetched successfully", {
      ...payment.order,
      status: updatedOrder.status,
    });
  }

  if (!verifiedPaid) {
    return apiResponse("Order fetched successfully", payment.order);
  }

  const { order: updatedOrder, alreadyPaid } = await markOrderPaidService(payment.order.id, {
    paymentId: payment.id,
  });

  if (!alreadyPaid) {
    try {
      let email = payment.user?.email;
      if (!email && payment.metadata) {
        const meta =
          typeof payment.metadata === "string" ? JSON.parse(payment.metadata) : payment.metadata;
        email = (meta as { email?: string }).email;
      }

      if (email) {
        await sendPurchaseEmail(email, {
          subtotal: payment.order.subtotal.toString(),
          discountTotal: Number(payment.order.discountTotal),
          total: payment.order.total.toString(),
          items: payment.order.items.map((item) => ({
            qty: item.qty,
            lineTotal: item.lineTotal.toString(),
            variant: {
              name: item.variant.name,
              product: {
                name: item.variant.product.name,
              },
            },
          })),
        });
      }
    } catch (err) {
      // A failed email shouldn't fail the payment confirmation.
      console.error("Could not send purchase email:", err);
    }
  }

  return apiResponse("Order fetched successfully", {
    ...payment.order,
    status: updatedOrder.status,
  });
};
