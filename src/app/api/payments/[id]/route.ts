import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-handler";
import { requireRequestSession } from "@/lib/auth-guards";
import { validateOrThrow } from "@/lib/validator";
import { updatePaymentRecordSchema } from "@/server/payments/payment.validators";
import {
  deletePaymentService,
  getPaymentByIdService,
  updatePaymentService,
} from "@/server/payments/payments.service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const GET = async (req: Request, context: RouteContext) => {
  try {
    const session = await requireRequestSession(req);
    const { id } = await context.params;

    const result = await getPaymentByIdService(id, session.user.id);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};

export const PATCH = async (req: Request, context: RouteContext) => {
  try {
    const session = await requireRequestSession(req);
    const { id } = await context.params;
    const body = await req.json();
    const valid = validateOrThrow(updatePaymentRecordSchema, body);

    const result = await updatePaymentService(id, valid, session.user.id);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};

export const DELETE = async (req: Request, context: RouteContext) => {
  try {
    const session = await requireRequestSession(req);
    const { id } = await context.params;

    const result = await deletePaymentService(id, session.user.id);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};
