import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { handleApiError } from "@/lib/api-handler";
import { getRecommendationsService } from "@/server/recommendations/recommendations.service";

const GUEST_COOKIE = "guest_session_id";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const exclude = searchParams.get("exclude") ?? undefined;
    const limitParam = Number(searchParams.get("limit"));
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 24) : 8;

    const requestHeaders = await headers();
    const session = await auth.api.getSession({ headers: requestHeaders });
    const userId = session?.user?.id ?? null;

    const cookieStore = await cookies();
    const sessionId = cookieStore.get(GUEST_COOKIE)?.value ?? null;

    const result = await getRecommendationsService({
      userId,
      sessionId,
      excludeProductId: exclude,
      limit,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("GET RECOMMENDATIONS ROUTE ERROR:", err);
    return handleApiError(err);
  }
};
