import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-handler";
import { requireAdminServerSession } from "@/lib/auth-guards";
import { 
  getCouponByIdService, 
  updateCouponService, 
  deleteCouponService 
} from "@/server/discount/coupon.service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const GET = async (_req: Request, context: RouteContext) => {
  try {
    await requireAdminServerSession();
    const { id } = await context.params;
    const result = await getCouponByIdService(id);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};

export const PATCH = async (req: Request, context: RouteContext) => {
  try {
    await requireAdminServerSession();
    const { id } = await context.params;
    const body = await req.json();
    
    const result = await updateCouponService(id, body);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};

export const DELETE = async (_req: Request, context: RouteContext) => {
  try {
    await requireAdminServerSession();
    const { id } = await context.params;
    const result = await deleteCouponService(id);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};
