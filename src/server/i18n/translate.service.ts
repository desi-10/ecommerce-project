import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * On-the-fly translation for dynamic, database-backed content (product
 * names/descriptions, vendor-written copy) — the piece the static
 * dictionary in src/context/language-context.tsx can't cover, since that
 * only has fixed UI chrome strings baked in at build time. Together the two
 * satisfy "view product descriptions, menus, and other application content
 * in different languages": menus/chrome via the dictionary, arbitrary
 * content via this.
 *
 * Reuses the same Gemini key as embeddings/the AI assistant
 * (src/server/ai/embedding.ts, ai.actions.ts) — no separate provider to
 * configure.
 */

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing for translation");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Keep in sync with Language in src/context/language-context.tsx.
export const SUPPORTED_LANGUAGES: Record<string, string> = {
  tw: "Twi (Akan, spoken in Ghana)",
  fr: "French",
  ewe: "Ewe (Eʋegbe, spoken in Ghana and Togo)",
  ga: "Ga (spoken in the Greater Accra Region of Ghana)",
};

// Deterministic per (text, targetLang) — cache in-process so a product
// description isn't re-translated by Gemini on every page view. Not
// persisted; a cold restart just refills it lazily.
//
// Bounded: an unauthenticated caller can request a translation for any
// text (see /api/translate), so without a cap this would grow forever —
// one entry per distinct (targetLang, text) ever seen. Simple FIFO
// eviction (Map preserves insertion order) rather than real LRU; good
// enough for "don't leak memory", not tuned for hit-rate.
const CACHE_MAX_ENTRIES = 5000;
const cache = new Map<string, string>();

function cacheSet(key: string, value: string) {
  if (cache.size >= CACHE_MAX_ENTRIES) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey !== undefined) cache.delete(oldestKey);
  }
  cache.set(key, value);
}

export async function translateText(text: string, targetLang: string): Promise<string> {
  const trimmed = text?.trim();
  if (!trimmed || targetLang === "en") return text;

  const languageName = SUPPORTED_LANGUAGES[targetLang];
  if (!languageName) return text; // unsupported target — return source unchanged

  const cacheKey = `${targetLang}:${trimmed}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const result = await model.generateContent(
      `Translate the following e-commerce text into ${languageName}. ` +
        `Preserve meaning and tone; keep numbers, units, and brand names unchanged. ` +
        `Return ONLY the translated text — no notes, no quotes, no explanation.\n\n${trimmed}`,
    );
    const translated = result.response.text().trim();
    if (translated) cacheSet(cacheKey, translated);
    return translated || text;
  } catch (error) {
    console.error("Translation failed:", error);
    return text; // never break the page over a translation failure
  }
}
