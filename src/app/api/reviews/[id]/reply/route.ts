import { NextResponse } from "next/server";
import { validateOrThrow } from "@/lib/validator";
import { handleApiError } from "@/lib/api-handler";
import { requireAdminServerSession } from "@/lib/auth-guards";
import { replyToReviewService } from "@/server/reviews/reviews.service";
import { replyReviewSchema } from "@/server/reviews/reviews.schema";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const PATCH = async (req: Request, context: RouteContext) => {
  try {
    await requireAdminServerSession();
    const { id: reviewId } = await context.params;

    const body = await req.json();
    const valid = validateOrThrow(replyReviewSchema, body);

    const result = await replyToReviewService(reviewId, valid);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};
