import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount,
} from "@/client/discounts";

export const discountKeys = {
  all: ["discounts"] as const,
  list: (params?: { page?: number; limit?: number; status?: string }) =>
    ["discounts", "list", params ?? {}] as const,
  detail: (id: string) => ["discounts", "detail", id] as const,
};

export function useGetDiscounts(params?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  return useQuery({
    queryKey: discountKeys.list(params),
    queryFn: () => getDiscounts(params),
  });
}

export function useGetDiscount(id: string) {
  return useQuery({
    queryKey: discountKeys.detail(id),
    queryFn: () => getDiscountById(id),
    enabled: !!id,
  });
}

export function useCreateDiscount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof createDiscount>[0]) => createDiscount(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: discountKeys.all });
    },
  });
}

export function useUpdateDiscount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      updateDiscount(id, data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: discountKeys.all });
    },
  });
}

export function useDeleteDiscount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDiscount(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: discountKeys.all });
    },
  });
}
