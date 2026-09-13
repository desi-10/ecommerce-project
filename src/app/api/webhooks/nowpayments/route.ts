import { NextResponse } from "next/server";
import { verifyNowPaymentsSignature } from "@/cofigs/nowpayments";
import prisma from "@/lib/db";
import { sendPurchaseEmail } from "@/lib/email";
import { markOrderPaidService } from "@/server/order/orders.service";

/**
 * NOWPayments IPN callback. Unlike the Stripe/Paystack flow (confirmed by
 * GET /api/orders/reference/[ref] verifying with Stripe/Paystack's own API
 * — see confirmPaymentByReferenceService in payments.service.ts), this is
 * the ONLY confirmation crypto orders ever get: a real, signature-verified,
 * server-to-server call. Crypto payments are irreversible, so a client GET
 * alone is never trusted for them — confirmPaymentByReferenceService
 * deliberately never marks a crypto order paid.
 *
 * Goes through the same markOrderPaidService as the card-payment path so
 * crypto orders get the same coupon usedCount increment and idempotency
 * (safe to run twice, e.g. NOWPayments retrying the IPN).
 */
export const POST = async (req: Request) => {
  const rawBody = await req.text();
  const signature = req.headers.get("x-nowpayments-sig");

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  if (!verifyNowPaymentsSignature(payload, signature)) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  const reference: string | undefined = payload.order_id;
  const paymentStatus: string | undefined = payload.payment_status;

  if (!reference) {
    return NextResponse.json({ message: "Missing order_id" }, { status: 400 });
  }

  // NOWPayments statuses: waiting, confirming, confirmed, sending,
  // partially_paid, finished, failed, refunded, expired. Only "finished"
  // means the funds have actually settled.
  if (paymentStatus !== "finished") {
    return NextResponse.json({ message: "Ignored (not finished)" }, { status: 200 });
  }

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
    // Don't 4xx here — NOWPayments retries on non-2xx, and a payment for a
    // reference we don't recognize isn't something retrying will fix.
    console.error("NOWPayments IPN: no payment found for reference", reference);
    return NextResponse.json({ message: "Payment not found" }, { status: 200 });
  }

  const { alreadyPaid } = await markOrderPaidService(payment.order.id, {
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
    } catch (e) {
      // Same trade-off as confirmPaymentByReferenceService: a failed email
      // shouldn't fail the payment confirmation.
      console.error("NOWPayments IPN: failed to send purchase email", e);
    }
  }

  return NextResponse.json({ message: "OK" }, { status: 200 });
};
