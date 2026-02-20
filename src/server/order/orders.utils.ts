import { ApiError } from "@/lib/api-error";
import { StatusCodes } from "http-status-codes";
import { OrderStatus } from "../../../prisma/generated/enums";

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["PAID", "FAILED", "CANCELLED"],
  PAID: ["FULFILLED", "REFUNDED"],
  FAILED: [],
  CANCELLED: [],
  REFUNDED: [],
  FULFILLED: [],
};

export const validateStatusTransition = (
  current: OrderStatus,
  next: OrderStatus,
) => {
  if (!allowedTransitions[current].includes(next)) {
    throw new ApiError(
      `Cannot change order status from ${current} to ${next}`,
      StatusCodes.BAD_REQUEST,
    );
  }
};
