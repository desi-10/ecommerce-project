// hooks/orders.ts
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/client/orders";
import type { GetOrdersResponse, ListOrdersParams } from "@/types/orders";

export const ordersKeys = {
  all: ["orders"] as const,
  list: (params?: ListOrdersParams) =>
    ["orders", "list", params ?? {}] as const,
};

export function useGetOrders(params?: ListOrdersParams) {
  return useQuery<GetOrdersResponse>({
    queryKey: ordersKeys.list(params),
    queryFn: () => getOrders(params),
  });
}
