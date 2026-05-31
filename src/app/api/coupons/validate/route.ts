import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-handler";
import { applyCouponToSubtotalService } from "@/server/discount/coupon.service";
import { Prisma } from "../../../../../prisma/generated/client";

export const POST = async (req: Request) => {
  try {
    const { code, subtotal } = await req.json();

    if (!code) {
        return NextResponse.json({ message: "Coupon code is required" }, { status: 400 });
    }

    if (subtotal === undefined) {
        return NextResponse.json({ message: "Subtotal is required" }, { status: 400 });
    }

    const result = await applyCouponToSubtotalService({
      code,
      subtotal: new Prisma.Decimal(subtotal),
    });

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};
