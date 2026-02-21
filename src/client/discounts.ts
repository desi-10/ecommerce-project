import axios from "axios";

export async function getDiscounts(params?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  const res = await axios.get("/api/discounts", { params });
  return res.data;
}

export async function getDiscountById(id: string) {
  const res = await axios.get(`/api/discounts/${id}`);
  return res.data;
}

export async function createDiscount(data: {
  productId: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  status: string;
}) {
  const res = await axios.post("/api/discounts", data);
  return res.data;
}

export async function updateDiscount(id: string, data: any) {
  const res = await axios.patch(`/api/discounts/${id}`, data);
  return res.data;
}

export async function deleteDiscount(id: string) {
  const res = await axios.delete(`/api/discounts/${id}`);
  return res.data;
}
