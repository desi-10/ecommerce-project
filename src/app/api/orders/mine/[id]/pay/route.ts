import { auth } from "@/lib/auth";
import { handleApiError } from "@/lib/api-handler";
import { payExistingOrderService } from "@/server/payments/payments.service";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const gateway = body?.gateway || "paystack";

    const result = await payExistingOrderService(id, session.user.id, gateway);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};
