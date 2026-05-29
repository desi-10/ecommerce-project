import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-handler";
import { requireAdminServerSession } from "@/lib/auth-guards";
import { adminGetOrderService, updateOrderStatusService } from "@/server/order/orders.service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const GET = async (req: Request, context: RouteContext) => {
  try {
    await requireAdminServerSession();
    const { id } = await context.params;

    const result = await adminGetOrderService(id);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};

export const PATCH = async (req: Request, context: RouteContext) => {
  try {
    await requireAdminServerSession();
    const { id } = await context.params;
    const { status } = await req.json();

    if (!status) {
        return NextResponse.json({ message: "Status is required" }, { status: 400 });
    }

    const result = await updateOrderStatusService(id, status);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};
