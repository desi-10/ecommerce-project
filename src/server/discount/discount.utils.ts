import { ApiError } from "@/lib/api-error";
import { StatusCodes } from "http-status-codes";
import { Prisma } from "../../../prisma/generated/client";

const D = (n: number | string | Prisma.Decimal) => new Prisma.Decimal(n);

export function validateDiscountValue(
  type: "PERCENT" | "AMOUNT",
  value: number,
) {
  if (type === "PERCENT" && (value <= 0 || value > 100)) {
    throw new ApiError(
      "Percent discount must be between 1 and 100",
      StatusCodes.BAD_REQUEST,
    );
  }
  if (type === "AMOUNT" && value <= 0) {
    throw new ApiError(
      "Amount discount must be greater than 0",
      StatusCodes.BAD_REQUEST,
    );
  }
}

export function validateDateWindow(
  startsAt?: Date | null,
  endsAt?: Date | null,
) {
  if (startsAt && endsAt && endsAt.getTime() < startsAt.getTime()) {
    throw new ApiError(
      "endsAt cannot be before startsAt",
      StatusCodes.BAD_REQUEST,
    );
  }
}

export function isActiveNow(params: {
  status: "ACTIVE" | "INACTIVE";
  startsAt?: Date | null;
  endsAt?: Date | null;
  now?: Date;
}) {
  const now = params.now ?? new Date();
  if (params.status !== "ACTIVE") return false;
  if (params.startsAt && now < params.startsAt) return false;
  if (params.endsAt && now > params.endsAt) return false;
  return true;
}

/**
 * Returns discount amount (money) to subtract from subtotal.
 * - clamps so discount never exceeds subtotal
 */
export function computeDiscountAmount(opts: {
  type: "PERCENT" | "AMOUNT";
  value: Prisma.Decimal; // from DB
  subtotal: Prisma.Decimal;
}) {
  const { type, value, subtotal } = opts;

  if (subtotal.lte(0)) return D(0);

  const raw = type === "PERCENT" ? subtotal.mul(value).div(100) : value;

  return Prisma.Decimal.min(subtotal, raw);
}
