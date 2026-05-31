// hooks/orders.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, updateOrderStatus, getOrderById } from "@/client/orders";
import type { GetOrdersResponse, ListOrdersParams } from "@/types/orders";

export const ordersKeys = {
  all: ["orders"] as const,
  list: (params?: ListOrdersParams) =>
    ["orders", "list", params ?? {}] as const,
  detail: (id: string) => ["orders", "detail", id] as const,
};

export function useGetOrders(params?: ListOrdersParams) {
  return useQuery<GetOrdersResponse>({
    queryKey: ordersKeys.list(params),
    queryFn: () => getOrders(params),
  });
}

export function useGetOrder(id: string) {
  return useQuery({
    queryKey: ordersKeys.detail(id),
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateOrderStatus(id, status),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ordersKeys.all }),
        qc.invalidateQueries({ queryKey: ["dashboard", "stats"] }),
      ]);
    },
  });
}
