// client/products.ts
import axios from "axios";
import type {
  ApiResponse,
  CreateProductDto,
  GetProductsResponse,
  Product,
  UpdateProductDto,
} from "@/types/product";

export async function getProducts(params?: { 
  page?: number; 
  limit?: number;
  q?: string;
  category?: string;
  onDiscount?: boolean;
  status?: string;
  sort?: string;
}) {
  const res = await axios.get("/api/products", { params });
  return res.data;
}

export async function getProductById(id: string) {
  const res = await axios.get<ApiResponse<Product>>(`/api/products/${id}`);
  return res.data;
}

export async function createProduct(payload: CreateProductDto) {
  const res = await axios.post<ApiResponse<Product>>("/api/products", payload);
  return res.data;
}

export async function updateProduct(id: string, payload: UpdateProductDto) {
  const res = await axios.patch<ApiResponse<Product>>(
    `/api/products/${id}`,
    payload,
  );
  return res.data;
}

export async function deleteProduct(id: string) {
  const res = await axios.delete<ApiResponse<{ id: string }>>(
    `/api/products/${id}`,
  );
  return res.data;
}
