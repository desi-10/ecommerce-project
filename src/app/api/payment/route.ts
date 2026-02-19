import { validateOrThrow } from "@/lib/validator";
import { initiateService } from "@/server/payments/payments.service";
import { NextResponse } from "next/server";

export const POST = async (req: Response) => {
  const body = await req.json();
  const valid = validateOrThrow(createPayment, body);
  const result = await initiateService(valid);
  return NextResponse.json(result);
};
