import { NextResponse } from "next/server";
import { validateOrThrow } from "@/lib/validator";
import { handleApiError } from "@/lib/api-handler";
import { requireServerSession } from "@/lib/auth-guards";
import { createReviewService } from "@/server/reviews/reviews.service";
import { createReviewSchema } from "@/server/reviews/reviews.schema";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const POST = async (req: Request, context: RouteContext) => {
  try {
    const session = await requireServerSession();
    const { id: productId } = await context.params;

    const body = await req.json();
    const valid = validateOrThrow(createReviewSchema, body);

    const result = await createReviewService(productId, session.user.id, valid);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};
