// client/translate.ts
import axios from "axios";
import type { ApiResponse } from "@/types/product";

export async function translateText(text: string, targetLang: string) {
  const res = await axios.post<ApiResponse<{ translated: string }>>("/api/translate", {
    text,
    targetLang,
  });
  return res.data.data.translated;
}
