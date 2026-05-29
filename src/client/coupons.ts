// client/coupons.ts
import axios from "axios";

export async function getCoupons(params?: any) {
  const res = await axios.get("/api/coupons", { params });
  return res.data;
}

export async function getCouponById(id: string) {
  const res = await axios.get(`/api/coupons/${id}`);
  return res.data;
}

export async function createCoupon(data: any) {
  const res = await axios.post("/api/coupons", data);
  return res.data;
}

export async function updateCoupon(id: string, data: any) {
  const res = await axios.patch(`/api/coupons/${id}`, data);
  return res.data;
}

export async function deleteCoupon(id: string) {
  const res = await axios.delete(`/api/coupons/${id}`);
  return res.data;
}

export async function validateCoupon(code: string, subtotal: number) {
  const res = await axios.post("/api/coupons/validate", { code, subtotal });
  return res.data;
}
