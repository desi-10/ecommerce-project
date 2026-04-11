import { auth } from "@/lib/auth";
import { getUserOrderDetailService } from "@/server/order/orders.service";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const result = await getUserOrderDetailService(id, session.user.id);
  return NextResponse.json(result);
};
