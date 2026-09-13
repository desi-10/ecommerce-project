import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-handler";
import { confirmPaymentByReferenceService } from "@/server/payments/payments.service";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ ref: string }> },
) => {
  try {
    const { ref } = await params;
    // Verifies with the payment provider before marking anything paid —
    // see confirmPaymentByReferenceService's doc comment.
    const result = await confirmPaymentByReferenceService(ref);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};
