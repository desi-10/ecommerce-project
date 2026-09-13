// hooks/use-recommendations.ts
import { useQuery } from "@tanstack/react-query";
import { getRecommendations, RecommendationsResponse } from "@/client/recommendations";

export const recommendationsKeys = {
  all: ["recommendations"] as const,
  list: (params?: { limit?: number; exclude?: string }) =>
    ["recommendations", params ?? {}] as const,
};

export function useRecommendations(params?: { limit?: number; exclude?: string }) {
  return useQuery<RecommendationsResponse>({
    queryKey: recommendationsKeys.list(params),
    queryFn: () => getRecommendations(params),
    staleTime: 60 * 1000,
  });
}
