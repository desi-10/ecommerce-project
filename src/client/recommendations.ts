// client/recommendations.ts
import axios from "axios";
import type { ApiResponse, Product } from "@/types/product";

export type RecommendationsResponse = ApiResponse<{
  products: Product[];
  basis: "personalized" | "trending";
}>;

export async function getRecommendations(params?: { limit?: number; exclude?: string }) {
  const res = await axios.get<RecommendationsResponse>("/api/recommendations", { params });
  return res.data;
}

export async function trackProductView(productId: string) {
  // Best-effort — a failed view ping should never disrupt the page.
  try {
    await axios.post(`/api/products/${productId}/view`);
  } catch {
    // ignore
  }
}
