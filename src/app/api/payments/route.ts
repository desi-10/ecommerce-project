import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-handler";
import { requireRequestSession } from "@/lib/auth-guards";
import { validateOrThrow } from "@/lib/validator";
import {
  createPaymentRecordSchema,
  listPaymentsSchema,
} from "@/server/payments/payment.validators";
import {
  createPaymentRecordService,
  listPaymentsService,
  adminListPaymentsService,
} from "@/server/payments/payments.service";

export const GET = async (req: Request) => {
  try {
    const session = await requireRequestSession(req);
    const rawQuery = Object.fromEntries(
      new URL(req.url).searchParams.entries(),
    );
    const query = validateOrThrow(listPaymentsSchema, rawQuery);

    const result = session.user.role === "admin"
      ? await adminListPaymentsService(query)
      : await listPaymentsService(query, session.user.id);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};

export const POST = async (req: Request) => {
  try {
    const session = await requireRequestSession(req);
    const body = await req.json();
    const valid = validateOrThrow(createPaymentRecordSchema, body);

    const result = await createPaymentRecordService(valid, session.user.id);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};
