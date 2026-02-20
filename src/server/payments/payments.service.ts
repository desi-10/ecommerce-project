import { paystack } from "@/cofigs/voltex";
import { apiResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error";
import prisma from "@/lib/db";
import { Currency } from "@noelzappy/voltax";
import {
  CreatePaymentInput,
  CreatePaymentRecordInput,
  ListPaymentsInput,
  UpdatePaymentRecordInput,
} from "./payment.validators";
import StatusCodes from "http-status-codes";

export const initiateService = async (
  data: CreatePaymentInput,
  userId: string,
) => {
  const payment = await paystack.initiatePayment({
    amount: Number(data.amount),
    email: data.email,
    currency: Currency.GHS,
  });

  await prisma.payment.create({
    data: {
      provider: "PAYSTACK",
      amount: data.amount,
      metadata: data.metadata,
      orderId: data.orderId,
      userId: userId,
      reference: payment.reference,
      status: "PENDING",
    },
  });

  return apiResponse("Payment initiated", {
    authorizationUrl: payment.authorizationUrl,
    reference: payment.reference,
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

  const [total, items] = await prisma.$transaction([
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
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / query.limit));

  return apiResponse("Payments fetched successfully", {
    items,
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

export const updatePaymentService = async (
  id: string,
  data: UpdatePaymentRecordInput,
  userId: string,
) => {
  const existing = await prisma.payment.findFirst({
    where: { id, userId },
    select: { id: true },
  });

  if (!existing) {
    throw new ApiError("Payment not found", StatusCodes.NOT_FOUND);
  }

  // const updated = await prisma.payment.update({
  //   where: { id },
  //   data: {
  //     ...(data.status !== undefined ? { status: data.status } : {}),
  //     ...(data.reference !== undefined ? { reference: data.reference } : {}),
  //     ...(data.orderId !== undefined ? { orderId: data.orderId } : {}),
  //     ...(data.metadata !== undefined ? { metadata: data.metadata } : {}),
  //   },
  // });

  return apiResponse("Payment updated successfully", null);
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
