import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} from "@/client/coupons";

export const couponKeys = {
  all: ["coupons"] as const,
  list: (params?: any) => ["coupons", "list", params ?? {}] as const,
  detail: (id: string) => ["coupons", "detail", id] as const,
};

export function useGetCoupons(params?: any) {
  return useQuery({
    queryKey: couponKeys.list(params),
    queryFn: () => getCoupons(params),
  });
}

export function useGetCoupon(id: string) {
  return useQuery({
    queryKey: couponKeys.detail(id),
    queryFn: () => getCouponById(id),
    enabled: !!id,
  });
}

export function useCreateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => createCoupon(data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: couponKeys.all });
    },
  });
}

export function useUpdateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateCoupon(id, data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: couponKeys.all });
    },
  });
}

export function useDeleteCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCoupon(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: couponKeys.all });
    },
  });
}

/**
 * Hook for checkout page to validate a code
 */
export function useValidateCoupon() {
  return useMutation({
    mutationFn: ({ code, subtotal }: { code: string; subtotal: number }) =>
      validateCoupon(code, subtotal),
  });
}
