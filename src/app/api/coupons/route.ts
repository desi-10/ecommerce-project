import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-handler";
import { requireAdminServerSession } from "@/lib/auth-guards";
import { validateOrThrow } from "@/lib/validator";
import { 
  listCouponsService, 
  createCouponService 
} from "@/server/discount/coupon.service";

export const GET = async (req: Request) => {
  try {
    await requireAdminServerSession();
    const { searchParams } = new URL(req.url);
    
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const status = searchParams.get("status") as any;
    const q = searchParams.get("q") || undefined;

    const result = await listCouponsService({ page, limit, status, q });
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};

export const POST = async (req: Request) => {
  try {
    await requireAdminServerSession();
    const body = await req.json();
    
    const result = await createCouponService(body);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};
