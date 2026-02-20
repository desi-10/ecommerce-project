import prisma from "@/lib/db";
import { ApiError } from "@/lib/api-error";
import { apiResponse } from "@/lib/api-response";
import { StatusCodes } from "http-status-codes";
import {
  CreateCouponSchema,
  UpdateCouponSchema,
  type CreateCouponInput,
  type UpdateCouponInput,
} from "./discount.validators";
import {
  validateDateWindow,
  validateDiscountValue,
  isActiveNow,
  computeDiscountAmount,
} from "./discount.utils";
import { Prisma } from "../../../prisma/generated/client";

const D = (n: number | string | Prisma.Decimal) => new Prisma.Decimal(n);

export const createCouponService = async (raw: unknown) => {
  const data: CreateCouponInput = CreateCouponSchema.parse(raw);

  validateDiscountValue(data.type, data.value);
  validateDateWindow(data.startsAt ?? null, data.endsAt ?? null);

  // Ensure unique code (case-insensitive behavior by normalizing to upper)
  const existing = await prisma.coupon.findUnique({
    where: { code: data.code },
  });
  if (existing)
    throw new ApiError("Coupon code already exists", StatusCodes.CONFLICT);

  const coupon = await prisma.coupon.create({
    data: {
      code: data.code,
      type: data.type,
      value: D(data.value),
      status: data.status,
      minOrderValue: data.minOrderValue == null ? null : D(data.minOrderValue),
      maxUses: data.maxUses ?? null,
      startsAt: data.startsAt ?? null,
      endsAt: data.endsAt ?? null,
    },
  });

  return apiResponse("Coupon created successfully", coupon);
};

export const listCouponsService = async (params?: {
  status?: "ACTIVE" | "INACTIVE";
  q?: string;
  page?: number;
  limit?: number;
}) => {
  const page = Math.max(1, params?.page ?? 1);
  const limit = Math.min(50, Math.max(1, params?.limit ?? 20));
  const skip = (page - 1) * limit;

  const where: any = {};
  if (params?.status) where.status = params.status;
  if (params?.q) where.code = { contains: params.q.trim().toUpperCase() };

  const [data, total] = await Promise.all([
    prisma.coupon.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.coupon.count({ where }),
  ]);

  return apiResponse("Coupons fetched", {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};

export const getCouponByIdService = async (id: string) => {
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) throw new ApiError("Coupon not found", StatusCodes.NOT_FOUND);
  return apiResponse("Coupon fetched", coupon);
};

export const updateCouponService = async (id: string, raw: unknown) => {
  const data: UpdateCouponInput = UpdateCouponSchema.parse(raw);

  if (data.type && data.value == null) {
    throw new ApiError(
      "value is required when updating type",
      StatusCodes.BAD_REQUEST,
    );
  }

  if (data.type && data.value != null)
    validateDiscountValue(data.type, data.value);
  if (data.startsAt !== undefined || data.endsAt !== undefined) {
    validateDateWindow(data.startsAt ?? null, data.endsAt ?? null);
  }

  // if updating code ensure unique
  if (data.code) {
    const exist = await prisma.coupon.findUnique({
      where: { code: data.code },
    });
    if (exist && exist.id !== id)
      throw new ApiError("Coupon code already exists", StatusCodes.CONFLICT);
  }

  const updated = await prisma.coupon.update({
    where: { id },
    data: {
      code: data.code,
      type: data.type,
      value: data.value != null ? D(data.value) : undefined,
      status: data.status,
      minOrderValue:
        data.minOrderValue === undefined
          ? undefined
          : data.minOrderValue == null
            ? null
            : D(data.minOrderValue),
      maxUses: data.maxUses === undefined ? undefined : data.maxUses,
      startsAt:
        data.startsAt === undefined ? undefined : (data.startsAt ?? null),
      endsAt: data.endsAt === undefined ? undefined : (data.endsAt ?? null),
    },
  });

  return apiResponse("Coupon updated", updated);
};

export const setCouponStatusService = async (
  id: string,
  status: "ACTIVE" | "INACTIVE",
) => {
  const updated = await prisma.coupon.update({
    where: { id },
    data: { status },
  });
  return apiResponse("Coupon status updated", updated);
};

export const deleteCouponService = async (id: string) => {
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) throw new ApiError("Coupon not found", StatusCodes.NOT_FOUND);

  // Prevent deleting coupon used by orders (safer)
  const used = await prisma.order.count({ where: { couponId: id } });
  if (used > 0)
    throw new ApiError(
      "Cannot delete a coupon already used in orders",
      StatusCodes.CONFLICT,
    );

  await prisma.coupon.delete({ where: { id } });
  return apiResponse("Coupon deleted", null);
};

/**
 * Apply coupon to a subtotal (used inside createOrderService)
 * - validates ACTIVE + date window + maxUses + minOrderValue
 * - returns discountAmount and coupon record
 */
export const applyCouponToSubtotalService = async (opts: {
  code: string;
  subtotal: Prisma.Decimal;
}) => {
  const code = opts.code.trim().toUpperCase().replace(/\s+/g, "");
  const coupon = await prisma.coupon.findUnique({ where: { code } });
  if (!coupon) throw new ApiError("Invalid coupon", StatusCodes.NOT_FOUND);

  if (
    !isActiveNow({
      status: coupon.status,
      startsAt: coupon.startsAt,
      endsAt: coupon.endsAt,
    })
  ) {
    throw new ApiError("Coupon is not active", StatusCodes.BAD_REQUEST);
  }

  if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) {
    throw new ApiError("Coupon has reached max uses", StatusCodes.BAD_REQUEST);
  }

  if (coupon.minOrderValue != null && opts.subtotal.lt(coupon.minOrderValue)) {
    throw new ApiError(
      "Order does not meet minimum value for this coupon",
      StatusCodes.BAD_REQUEST,
    );
  }

  const discountAmount = computeDiscountAmount({
    type: coupon.type,
    value: coupon.value,
    subtotal: opts.subtotal,
  });

  return apiResponse("Coupon applied", { coupon, discountAmount });
};

/**
 * increment usedCount (call this when order successfully PAID)
 */
export const incrementCouponUsageService = async (couponId: string) => {
  await prisma.coupon.update({
    where: { id: couponId },
    data: { usedCount: { increment: 1 } },
  });
};
