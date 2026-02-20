import { ApiError } from "@/lib/api-error";
import { apiResponse } from "@/lib/api-response";
import prisma from "@/lib/db";
import { StatusCodes } from "http-status-codes";
import { OrderSchema, OrderType } from "./orders.validators";
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
        userId: data.userId,
        status: "PENDING",
        subtotal,
        discountTotal,
        total,
        couponId,
        currency: "GHS",
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

export const markOrderPaidService = async (orderId: string) => {
  const updatedOrder = await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { coupon: true },
    });

    if (!order) throw new ApiError("Order not found", StatusCodes.NOT_FOUND);

    validateStatusTransition(order.status, "PAID");

    const updated = await tx.order.update({
      where: { id: orderId },
      data: { status: "PAID" },
      include: { coupon: true },
    });

    // increment coupon usage ONLY when payment succeeds
    if (updated.couponId) {
      await tx.coupon.update({
        where: { id: updated.couponId },
        data: { usedCount: { increment: 1 } },
      });
    }

    return updated;
  });

  return apiResponse("Order marked as paid", updatedOrder);
};
