import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import { randomUUID } from "crypto";
import { auth } from "@/lib/auth";
import { handleApiError } from "@/lib/api-handler";
import { trackProductViewService } from "@/server/recommendations/recommendations.service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const GUEST_COOKIE = "guest_session_id";

/**
 * Fire-and-forget browsing-history signal for the recommendation engine
 * (src/server/recommendations/recommendations.service.ts). Called from the
 * product detail page on mount — see product-main.tsx.
 *
 * Guests get an anonymous, httpOnly session id cookie so views still build
 * a profile pre-login; it's swapped for the real userId once they sign in
 * (see getRecommendationsService, which only ever reads one or the other).
 */
export const POST = async (req: Request, context: RouteContext) => {
  try {
    const { id } = await context.params;

    const requestHeaders = await headers();
    const session = await auth.api.getSession({ headers: requestHeaders });
    const userId = session?.user?.id ?? null;

    const cookieStore = await cookies();
    let sessionId = cookieStore.get(GUEST_COOKIE)?.value ?? null;

    const res = NextResponse.json({ message: "View tracked" });

    if (!userId && !sessionId) {
      sessionId = randomUUID();
      res.cookies.set(GUEST_COOKIE, sessionId, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 180, // 180 days
      });
    }

    await trackProductViewService(id, userId, sessionId);

    return res;
  } catch (err) {
    // Never let a tracking failure surface to the shopper.
    console.error("VIEW TRACKING ERROR:", err);
    return handleApiError(err);
  }
};
