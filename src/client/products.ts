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
  rating?: number;
}) {
  const query = { ...params } as Record<string, any>;
  
  if (Array.isArray(query.categories)) {
    query.categories = query.categories.join(',');
  }

  const res = await axios.get("/api/products", { params: query });
  return res.data;
}

export async function getProductById(id: string) {
  const res = await axios.get<ApiResponse<Product>>(`/api/products/${id}`);
  return res.data;
}

export async function createProduct(payload: FormData) {
  const res = await axios.post<ApiResponse<Product>>("/api/products", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

export async function updateProduct(id: string, payload: UpdateProductDto | FormData) {
  const isFormData = payload instanceof FormData;
  const res = await axios.patch<ApiResponse<Product>>(
    `/api/products/${id}`,
    payload,
    {
      headers: isFormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" },
    }
  );
  return res.data;
}

export async function deleteProduct(id: string) {
  const res = await axios.delete<ApiResponse<{ id: string }>>(
    `/api/products/${id}`,
  );
  return res.data;
}
