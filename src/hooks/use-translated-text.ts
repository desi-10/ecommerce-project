// hooks/use-translated-text.ts
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/context/language-context";
import { translateText } from "@/client/translate";

/**
 * Translates dynamic content (product name/description, etc.) via
 * GET/POST /api/translate whenever the active language isn't English.
 * Falls back to the original text while loading or on error, so a slow or
 * failed translation never blanks out content.
 */
export function useTranslatedText(text: string | null | undefined) {
  const { language } = useLanguage();
  const trimmed = text?.trim() ?? "";

  const { data, isFetching } = useQuery({
    queryKey: ["translate", language, trimmed],
    queryFn: () => translateText(trimmed, language),
    enabled: language !== "en" && trimmed.length > 0,
    staleTime: Infinity, // translation of the same text+language never changes
  });

  if (language === "en" || !trimmed) return { text, isTranslating: false };
  return { text: data ?? text, isTranslating: isFetching && !data };
}
