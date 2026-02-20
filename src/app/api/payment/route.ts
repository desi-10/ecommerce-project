import { handleApiError } from "@/lib/api-handler";
import { requireRequestSession } from "@/lib/auth-guards";
import { validateOrThrow } from "@/lib/validator";
import { createPayment } from "@/server/payments/payment.validators";
import { initiateService } from "@/server/payments/payments.service";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const session = await requireRequestSession(req);

    const body = await req.json();
    const valid = validateOrThrow(createPayment, body);
    const result = await initiateService(valid, session.user.id);

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};
