import prisma from "@/lib/db";
import { ApiError } from "@/lib/api-error";
import { apiResponse } from "@/lib/api-response";
import { StatusCodes } from "http-status-codes";
import {
  CreateProductDiscountSchema,
  UpdateProductDiscountSchema,
  type CreateProductDiscountInput,
  type UpdateProductDiscountInput,
} from "./discount.validators";
import {
  validateDateWindow,
  validateDiscountValue,
  isActiveNow,
} from "./discount.utils";
import { Prisma } from "../../../prisma/generated/client";

const D = (n: number | string | Prisma.Decimal) => new Prisma.Decimal(n);

export const createProductDiscountService = async (raw: unknown) => {
  const data: CreateProductDiscountInput =
    CreateProductDiscountSchema.parse(raw);

  validateDiscountValue(data.type, data.value);
  validateDateWindow(data.startsAt ?? null, data.endsAt ?? null);

  const product = await prisma.product.findUnique({
    where: { id: data.productId },
  });
  if (!product) throw new ApiError("Product not found", StatusCodes.NOT_FOUND);

  const discount = await prisma.productDiscount.create({
    data: {
      productId: data.productId,
      type: data.type,
      value: D(data.value),
      status: data.status,
      startsAt: data.startsAt ?? null,
      endsAt: data.endsAt ?? null,
    },
  });

  return apiResponse("Product discount created", discount);
};

export const listProductDiscountsService = async (params?: {
  productId?: string;
  status?: "ACTIVE" | "INACTIVE";
  page?: number;
  limit?: number;
}) => {
  const page = Math.max(1, params?.page ?? 1);
  const limit = Math.min(50, Math.max(1, params?.limit ?? 20));
  const skip = (page - 1) * limit;

  const where: any = {};
  if (params?.productId) where.productId = params.productId;
  if (params?.status) where.status = params.status;

  const [data, total] = await Promise.all([
    prisma.productDiscount.findMany({
      where,
      include: { product: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.productDiscount.count({ where }),
  ]);

  return apiResponse("Product discounts fetched", {
    data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
};

export const getProductDiscountByIdService = async (id: string) => {
  const discount = await prisma.productDiscount.findUnique({
    where: { id },
    include: { product: true },
  });
  if (!discount)
    throw new ApiError("Product discount not found", StatusCodes.NOT_FOUND);
  return apiResponse("Product discount fetched", discount);
};

export const updateProductDiscountService = async (
  id: string,
  raw: unknown,
) => {
  const data: UpdateProductDiscountInput =
    UpdateProductDiscountSchema.parse(raw);

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

  const updated = await prisma.productDiscount.update({
    where: { id },
    data: {
      productId: data.productId,
      type: data.type,
      value: data.value != null ? D(data.value) : undefined,
      status: data.status,
      startsAt:
        data.startsAt === undefined ? undefined : (data.startsAt ?? null),
      endsAt: data.endsAt === undefined ? undefined : (data.endsAt ?? null),
    },
  });

  return apiResponse("Product discount updated", updated);
};

export const setProductDiscountStatusService = async (
  id: string,
  status: "ACTIVE" | "INACTIVE",
) => {
  const updated = await prisma.productDiscount.update({
    where: { id },
    data: { status },
  });
  return apiResponse("Product discount status updated", updated);
};

export const deleteProductDiscountService = async (id: string) => {
  const discount = await prisma.productDiscount.findUnique({ where: { id } });
  if (!discount)
    throw new ApiError("Product discount not found", StatusCodes.NOT_FOUND);

  await prisma.productDiscount.delete({ where: { id } });
  return apiResponse("Product discount deleted", null);
};

/**
 * helper: get active discount for product right now (use in order pricing)
 */
export const getActiveProductDiscountService = async (productId: string) => {
  const discounts = await prisma.productDiscount.findMany({
    where: { productId, status: "ACTIVE" },
    orderBy: { createdAt: "desc" }, // choose latest if multiple
  });

  const active = discounts.find((d) =>
    isActiveNow({ status: d.status, startsAt: d.startsAt, endsAt: d.endsAt }),
  );

  return active ?? null;
};
