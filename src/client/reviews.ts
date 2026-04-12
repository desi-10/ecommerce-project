import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const reviewsKeys = {
  all: ["reviews"] as const,
  list: (params?: { page?: number; limit?: number }) =>
    ["reviews", "list", params ?? {}] as const,
  byProduct: (productId: string) => ["reviews", "product", productId] as const,
};

export function useGetReviews(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: reviewsKeys.list(params),
    queryFn: async () => {
      const qs = new URLSearchParams();
      if (params?.page) qs.append("page", params.page.toString());
      if (params?.limit) qs.append("limit", params.limit.toString());
      const res = await fetch(`/api/reviews?${qs.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json();
    },
  });
}

// NOTE: Usually we'd fetch product reviews from `/api/products/[id]` or maybe a new GET endpoint.
// But we actually receive `product.reviews` inside the product detail already! So we don't necessarily need a fetch hook for storefront display unless paginated.

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { productId: string; rating: number; comment?: string }) => {
      const res = await fetch(`/api/products/${vars.productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: vars.rating, comment: vars.comment }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to submit review");
      }
      return res.json();
    },
    onSuccess: async (_, vars) => {
      // Invalidate the specific product to refresh its embedded reviews
      await qc.invalidateQueries({ queryKey: ["products", "detail", vars.productId] });
    },
  });
}

export function useReplyToReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { reviewId: string; reply: string }) => {
      const res = await fetch(`/api/reviews/${vars.reviewId}/reply`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: vars.reply }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to submit reply");
      }
      return res.json();
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: reviewsKeys.all });
    },
  });
}
