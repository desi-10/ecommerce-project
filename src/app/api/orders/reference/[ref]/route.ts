import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-handler";
import { getOrderByReferenceService } from "@/server/order/orders.service";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ ref: string }> },
) => {
  try {
    const { ref } = await params;
    const result = await getOrderByReferenceService(ref);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};
