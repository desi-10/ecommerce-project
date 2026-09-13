import { ApiError } from "@/lib/api-error";
import { apiResponse } from "@/lib/api-response";
import prisma from "@/lib/db";
import { StatusCodes } from "http-status-codes";
import { ListOrderInput, OrderSchema, OrderType } from "./orders.validators";
import { validateStatusTransition } from "./orders.utils";
import { OrderStatus, Prisma } from "../../../prisma/generated/client";

const D = (n: number | string | Prisma.Decimal) => new Prisma.Decimal(n);

const normalizeCoupon = (code: string) =>
  code.trim().toUpperCase().replace(/\s+/g, "");

// coupon is active now?
const isCouponActiveNow = (c: {
  status: "ACTIVE" | "INACTIVE";
  startsAt: Date | null;
  endsAt: Date | null;
}) => {
  const now = new Date();
  if (c.status !== "ACTIVE") return false;
  if (c.startsAt && now < c.startsAt) return false;
  if (c.endsAt && now > c.endsAt) return false;
  return true;
};

const computeDiscountAmount = (opts: {
  type: "PERCENT" | "AMOUNT";
  value: Prisma.Decimal;
  base: Prisma.Decimal; // subtotal to apply on
}) => {
  const { type, value, base } = opts;
  if (base.lte(0)) return D(0);

  const raw = type === "PERCENT" ? base.mul(value).div(100) : value;

  // clamp so you never go below 0
  return Prisma.Decimal.min(base, raw);
};

/**
 * Reserve stock atomically: decrement only if enough stock.
 * Must be called inside the same tx as order creation.
 */
const reserveStockTx = async (
  tx: Prisma.TransactionClient,
  items: Array<{ variantId: string; qty: number }>,
) => {
  for (const it of items) {
    const updated = await tx.inventory.updateMany({
      where: { variantId: it.variantId, stock: { gte: it.qty } },
      data: { stock: { decrement: it.qty } },
    });

    if (updated.count !== 1) {
      throw new ApiError(
        `Stock changed. Variant ${it.variantId} is no longer available in requested quantity.`,
        StatusCodes.CONFLICT,
      );
    }
  }
};

/**
 * Release stock atomically: increment.
 * Must be called inside tx when cancelling pending orders.
 */
const releaseStockTx = async (
  tx: Prisma.TransactionClient,
  items: Array<{ variantId: string; qty: number }>,
) => {
  for (const it of items) {
    await tx.inventory.update({
      where: { variantId: it.variantId },
      data: { stock: { increment: it.qty } },
    });
  }
};

export const createOrderService = async (raw: unknown) => {
  const data: OrderType = OrderSchema.parse(raw);

  // Merge duplicates
  const qtyByVariant = new Map<string, number>();
  for (const it of data.items) {
    qtyByVariant.set(
      it.variantId,
      (qtyByVariant.get(it.variantId) || 0) + it.quantity,
    );
  }
  const variantIds = Array.from(qtyByVariant.keys());

  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: { product: true, inventory: true },
  });

  if (variants.length !== variantIds.length) {
    throw new ApiError("One or more variants not found", StatusCodes.NOT_FOUND);
  }

  // Check if any product is inactive
  for (const v of variants) {
    if (!v.product || v.product.status === "INACTIVE") {
      throw new ApiError(
        `Product "${v.product?.name || "Unknown"}" is inactive and cannot be purchased.`,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  // Active product discounts
  const productIds = variants.map((v) => v.productId);
  const productDiscounts = await prisma.productDiscount.findMany({
    where: {
      productId: { in: productIds },
      status: "ACTIVE",
      OR: [{ startsAt: null }, { startsAt: { lte: new Date() } }],
      AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: new Date() } }] }],
    },
    orderBy: { createdAt: "desc" },
  });

  // choose 1 discount per product (latest wins)
  const discountByProduct = new Map<
    string,
    { type: "AMOUNT" | "PERCENT"; value: Prisma.Decimal }
  >();
  for (const dsc of productDiscounts) {
    if (!discountByProduct.has(dsc.productId)) {
      discountByProduct.set(dsc.productId, {
        type: dsc.type,
        value: dsc.value,
      });
    }
  }

  const computeUnitPrice = (v: (typeof variants)[number]) =>
    v.salePrice ?? v.price;

  const computeDiscountPerUnit = (
    unitPrice: Prisma.Decimal,
    productId: string,
  ) => {
    const dsc = discountByProduct.get(productId);
    if (!dsc) return D(0);

    if (dsc.type === "AMOUNT") return Prisma.Decimal.min(unitPrice, dsc.value);

    // percent
    if (dsc.value.lte(0)) return D(0);
    const disc = unitPrice.mul(dsc.value).div(100);
    return Prisma.Decimal.min(unitPrice, disc);
  };

  // Build order items + validate stock
  const orderItemsData = variants.map((v) => {
    const qty = qtyByVariant.get(v.id) || 0;
    const available = v.inventory?.stock ?? 0;

    if (qty > available) {
      throw new ApiError(
        `Insufficient stock for variant ${v.id}`,
        StatusCodes.BAD_REQUEST,
      );
    }

    const unit = computeUnitPrice(v);
    const discountPerUnit = computeDiscountPerUnit(unit, v.productId);
    const netUnit = unit.sub(discountPerUnit);

    return {
      variantId: v.id,
      qty,
      unitPrice: unit, // snapshot
      lineTotal: netUnit.mul(qty), // after product discount
      discountLine: discountPerUnit.mul(qty),
    };
  });

  const subtotal = orderItemsData.reduce(
    (acc, it) => acc.add(it.unitPrice.mul(it.qty)),
    D(0),
  );
  const productDiscountTotal = orderItemsData.reduce(
    (acc, it) => acc.add(it.discountLine),
    D(0),
  );
  const afterProductDiscount = subtotal.sub(productDiscountTotal);

  // Optional coupon (applied after product discounts)
  let couponId: string | null = null;
  let couponDiscount = D(0);

  if (data.couponCode) {
    const code = normalizeCoupon(data.couponCode);
    const coupon = await prisma.coupon.findUnique({ where: { code } });

    if (!coupon) throw new ApiError("Invalid coupon", StatusCodes.NOT_FOUND);
    if (!isCouponActiveNow(coupon))
      throw new ApiError("Coupon is not active", StatusCodes.BAD_REQUEST);

    if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) {
      throw new ApiError(
        "Coupon has reached max uses",
        StatusCodes.BAD_REQUEST,
      );
    }

    if (
      coupon.minOrderValue != null &&
      afterProductDiscount.lt(coupon.minOrderValue)
    ) {
      throw new ApiError(
        "Order does not meet minimum value for this coupon",
        StatusCodes.BAD_REQUEST,
      );
    }

    couponId = coupon.id;
    couponDiscount = computeDiscountAmount({
      type: coupon.type,
      value: coupon.value,
      base: afterProductDiscount,
    });
  }

  const discountTotal = productDiscountTotal.add(couponDiscount);
  const total = subtotal.sub(discountTotal);

  // Reserve + create order/items in ONE tx
  const result = await prisma.$transaction(async (tx) => {
    await reserveStockTx(
      tx,
      orderItemsData.map((it) => ({ variantId: it.variantId, qty: it.qty })),
    );

    const order = await tx.order.create({
      data: {
        userId: data.userId || null,
        status: "PENDING",
        subtotal,
        discountTotal,
        total,
        couponId,
        // currency: "GHS",
        items: {
          create: orderItemsData.map((it) => ({
            variantId: it.variantId,
            qty: it.qty,
            unitPrice: it.unitPrice,
            lineTotal: it.lineTotal, // includes product discounts already
          })),
        },
      },
      include: {
        coupon: true,
        items: {
          include: {
            variant: { include: { product: true } },
          },
        },
      },
    });

    return order;
  });

  return apiResponse("Order created successfully", result);
};

export const updateOrderStatusService = async (
  orderId: string,
  nextStatus: OrderStatus,
) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) throw new ApiError("Order not found", StatusCodes.NOT_FOUND);

  validateStatusTransition(order.status, nextStatus);

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status: nextStatus },
  });

  return apiResponse("Order status updated", updated);
};

export const fulfillOrderService = async (orderId: string) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new ApiError("Order not found", StatusCodes.NOT_FOUND);

  validateStatusTransition(order.status, "FULFILLED");

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status: "FULFILLED" },
  });

  return apiResponse("Order fulfilled successfully", updated);
};

export const cancelOrderService = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) throw new ApiError("Order not found", StatusCodes.NOT_FOUND);

  validateStatusTransition(order.status, "CANCELLED");

  // Only release stock if it was reserved (PENDING)
  if (order.status === "PENDING") {
    await prisma.$transaction(async (tx) => {
      await releaseStockTx(
        tx,
        order.items.map((it) => ({ variantId: it.variantId, qty: it.qty })),
      );

      await tx.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" },
      });
    });

    return apiResponse("Order cancelled", null);
  }

  // If PAID -> you probably want refund flow instead of cancel
  throw new ApiError(
    "Only pending orders can be cancelled",
    StatusCodes.BAD_REQUEST,
  );
};

/**
 * The single place an order actually transitions PENDING -> PAID and a
 * coupon's usedCount gets incremented. Callers: confirmPaymentByReferenceService
 * (Stripe/Paystack, after verifying with the provider) and the NOWPayments
 * webhook (crypto) — both can race for the same order, so this is
 * idempotent: called again on an already-PAID (or later) order, it's a
 * no-op rather than an error.
 */
export const markOrderPaidService = async (
  orderId: string,
  opts?: { paymentId?: string },
) => {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: orderId } });

    if (!order) throw new ApiError("Order not found", StatusCodes.NOT_FOUND);

    if (order.status !== "PENDING") {
      // Already paid (or moved past PENDING some other way) — nothing to do.
      return { order, alreadyPaid: true };
    }

    validateStatusTransition(order.status, "PAID");

    const updated = await tx.order.update({
      where: { id: orderId },
      data: { status: "PAID" },
    });

    // increment coupon usage ONLY when payment succeeds
    if (order.couponId) {
      await tx.coupon.update({
        where: { id: order.couponId },
        data: { usedCount: { increment: 1 } },
      });
    }

    if (opts?.paymentId) {
      await tx.payment.update({
        where: { id: opts.paymentId },
        data: { status: "SUCCEEDED" },
      });
    }

    return { order: updated, alreadyPaid: false };
  });
};

export const getOrdersService = async (
  data: ListOrderInput,
  // Vendor management: a vendor's Orders tab only shows orders containing
  // at least one of their own products — never another vendor's or the
  // storewide order list an admin gets.
  vendorId?: string,
) => {
  const { page, limit, q, status, sort } = data;

  const where: Prisma.OrderWhereInput = {
    ...(status ? { status } : {}),

    ...(q
      ? {
          OR: [
            {
              userId: {
                contains: q,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),

    ...(vendorId
      ? {
          items: {
            some: { variant: { product: { vendorId } } },
          },
        }
      : {}),
  };

  const orderBy: Prisma.OrderOrderByWithRelationInput =
    sort === "newest"
      ? { createdAt: "desc" }
      : sort === "oldest"
        ? { createdAt: "asc" }
        : { createdAt: "desc" }; // fallback

  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        items: true, // adjust if you have relation name
        payments: true, // optional
        _count: {
          select: { items: true },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return apiResponse("Orders fetched successfully", {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  });
};
/**
 * Read-only lookup by payment reference — no side effects. This used to
 * also be the thing that marked an order PAID, unconditionally, the moment
 * this route was hit — with no check that a payment had actually
 * succeeded. That's now confirmPaymentByReferenceService in
 * payments.service.ts (it verifies with Stripe/Paystack before calling
 * markOrderPaidService above), which is what the
 * /api/orders/reference/[ref] route actually calls. This plain read is
 * kept for anything that just needs to display order-by-reference without
 * triggering a confirmation attempt.
 */
export const getOrderByReferenceService = async (reference: string) => {
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

  return apiResponse("Order fetched successfully", payment.order);
};

export const getUserOrdersService = async (userId: string) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      _count: {
        select: { items: true },
      },
    },
  });

  return apiResponse("User orders fetched successfully", orders);
};

export const getUserOrderDetailService = async (
  orderId: string,
  userId: string,
) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: {
                  images: true,
                },
              },
            },
          },
        },
      },
      payments: {
        orderBy: { createdAt: "desc" },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      coupon: true,
    },
  });

  if (!order) {
    throw new ApiError("Order not found", StatusCodes.NOT_FOUND);
  }

  return apiResponse("Order detail fetched successfully", order);
};
export const adminGetOrderService = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
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
      payments: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      coupon: true,
    },
  });

  if (!order) {
    throw new ApiError("Order not found", StatusCodes.NOT_FOUND);
  }

  return apiResponse("Order fetched successfully", order);
};
