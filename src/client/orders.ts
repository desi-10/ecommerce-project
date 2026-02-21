// client/orders.ts
import axios from "axios";
import type { GetOrdersResponse, ListOrdersParams } from "@/types/orders";

export async function getOrders(params?: ListOrdersParams) {
  const res = await axios.get<GetOrdersResponse>("/api/orders", { params });
  return res.data;
}

export async function updateOrderStatus(id: string, status: string) {
  const res = await axios.patch(`/api/orders/${id}`, { status });
  return res.data;
}

export async function getOrderById(id: string) {
  const res = await axios.get(`/api/orders/${id}`);
  return res.data;
}
