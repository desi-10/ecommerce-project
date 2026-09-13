import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-handler";
import { apiResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error";
import { translateText } from "@/server/i18n/translate.service";
import StatusCodes from "http-status-codes";

// Intentionally unauthenticated — guests browsing the storefront in a
// non-English language need this too, not just signed-in shoppers. That
// means anyone can call it, so the one thing worth guarding cheaply here
// (no infra for real rate limiting yet) is payload size: a product
// name/description never approaches this, so it costs legitimate use
// nothing while capping how much of the shared Gemini quota one request
// can spend.
const MAX_TEXT_LENGTH = 2000;

/**
 * Translates arbitrary shopper-facing text (product name/description, etc.)
 * on demand — see src/server/i18n/translate.service.ts. Called from
 * useTranslatedText (src/hooks/use-translated-text.ts) whenever the active
 * language isn't English.
 */
export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const text = typeof body?.text === "string" ? body.text : "";
    const targetLang = typeof body?.targetLang === "string" ? body.targetLang : "";

    if (!targetLang) {
      throw new ApiError("targetLang is required", StatusCodes.BAD_REQUEST);
    }

    if (text.length > MAX_TEXT_LENGTH) {
      throw new ApiError(
        `text must be ${MAX_TEXT_LENGTH} characters or fewer`,
        StatusCodes.BAD_REQUEST,
      );
    }

    if (!text) {
      return NextResponse.json(apiResponse("Translated", { translated: "" }));
    }

    const translated = await translateText(text, targetLang);
    return NextResponse.json(apiResponse("Translated", { translated }));
  } catch (err) {
    console.error("TRANSLATE ROUTE ERROR:", err);
    return handleApiError(err);
  }
};
