// hooks/payments.ts
import { useQuery } from "@tanstack/react-query";
import { getPayments } from "@/client/payment";
import type { GetPaymentsResponse, ListPaymentsParams } from "@/types/payments";

export const paymentsKeys = {
  all: ["payments"] as const,
  list: (params?: ListPaymentsParams) =>
    ["payments", "list", params ?? {}] as const,
};

export function useGetPayments(params?: ListPaymentsParams) {
  return useQuery<GetPaymentsResponse>({
    queryKey: paymentsKeys.list(params),
    queryFn: () => getPayments(params),
  });
}
