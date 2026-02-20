// client/orders.ts
import axios from "axios";
import type { GetOrdersResponse, ListOrdersParams } from "@/types/orders";

export async function getOrders(params?: ListOrdersParams) {
  const res = await axios.get<GetOrdersResponse>("/api/orders", { params });
  return res.data;
}
