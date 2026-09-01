import { NextResponse } from "next/server";
import { verifyNowPaymentsSignature } from "@/cofigs/nowpayments";
import prisma from "@/lib/db";
import { sendPurchaseEmail } from "@/lib/email";

/**
 * NOWPayments IPN callback. Unlike the Stripe/Paystack flow (confirmed only
 * by the client hitting GET /api/orders/reference/[ref] once the in-app
 * browser closes — see getOrderByReferenceService), this is a real
 * server-to-server, signature-verified confirmation: crypto payments are
 * irreversible, so trusting an unauthenticated client GET alone is a bigger
 * risk here than it is for card payments.
 *
 * The client-driven confirm-by-reference flow still runs afterwards and is
 * left untouched (see src/server/order/orders.service.ts) — it's a no-op if
 * this webhook already flipped the order to PAID.
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

  // Mirrors getOrderByReferenceService's query shape (src/server/order/orders.service.ts)
  // so the two confirmation paths behave identically regardless of which
  // one wins the race — including sending the purchase email exactly once.
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

  if (payment.order.status === "PENDING") {
    await prisma.$transaction([
      prisma.order.update({
        where: { id: payment.order.id },
        data: { status: "PAID" },
      }),
      prisma.payment.update({
        where: { id: payment.id },
        data: { status: "SUCCEEDED" },
      }),
    ]);

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
      // Same trade-off as getOrderByReferenceService: a failed email
      // shouldn't fail the payment confirmation.
      console.error("NOWPayments IPN: failed to send purchase email", e);
    }
  }

  return NextResponse.json({ message: "OK" }, { status: 200 });
};
