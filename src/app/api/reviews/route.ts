import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-handler";
import { requireDashboardServerSession } from "@/lib/auth-guards";
import { getReviewsService } from "@/server/reviews/reviews.service";

export const GET = async (req: Request) => {
  try {
    const session = await requireDashboardServerSession();

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const vendorId = session.user.role === "vendor" ? session.user.id : undefined;

    const result = await getReviewsService(page, limit, vendorId);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};
