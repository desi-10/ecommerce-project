// client/payments.ts
import axios from "axios";
import type { GetPaymentsResponse, ListPaymentsParams } from "@/types/payments";

export async function getPayments(params?: ListPaymentsParams) {
  const res = await axios.get<GetPaymentsResponse>("/api/payments", { params });
  return res.data;
}
