import { handleApiError } from "@/lib/api-handler";
import { requireRequestSession } from "@/lib/auth-guards";
import { validateOrThrow } from "@/lib/validator";
import { createOrderPayment } from "@/server/payments/payment.validators";
import { initiateOrderService } from "@/server/payments/payments.service";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const session = await requireRequestSession(req);

    const body = await req.json();
    const valid = validateOrThrow(createOrderPayment, body);
    const result = await initiateOrderService(valid, session.user.id);

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};
