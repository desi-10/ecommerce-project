import { auth } from "@/lib/auth";
import { getUserOrdersService } from "@/server/order/orders.service";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const result = await getUserOrdersService(session.user.id);
  return NextResponse.json(result);
};
