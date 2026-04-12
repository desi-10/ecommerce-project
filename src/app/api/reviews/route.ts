import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-handler";
import { requireAdminServerSession } from "@/lib/auth-guards";
import { getReviewsService } from "@/server/reviews/reviews.service";

export const GET = async (req: Request) => {
  try {
    await requireAdminServerSession();

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");

    const result = await getReviewsService(page, limit);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};
