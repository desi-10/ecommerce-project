// client/categories.ts
import axios from "axios";
import type {
  ApiResponse,
  Category,
  CreateCategoryDto,
  GetCategoriesResponse,
  UpdateCategoryDto,
} from "@/types/categories";

export async function getCategories(params?: {
  page?: number;
  limit?: number;
  q?: string;
  status?: "ACTIVE" | "INACTIVE";
  sort?: "newest" | "oldest" | "name_asc" | "name_desc";
}) {
  const res = await axios.get<GetCategoriesResponse>("/api/categories", {
    params,
  });
  return res.data;
}

export async function getCategoryById(id: string) {
  const res = await axios.get<ApiResponse<Category>>(`/api/categories/${id}`);
  return res.data;
}

export async function createCategory(payload: CreateCategoryDto) {
  const res = await axios.post<ApiResponse<Category>>(
    "/api/categories",
    payload,
  );
  return res.data;
}

export async function updateCategory(id: string, payload: UpdateCategoryDto) {
  const res = await axios.patch<ApiResponse<Category>>(
    `/api/categories/${id}`,
    payload,
  );
  return res.data;
}

export async function deleteCategory(id: string) {
  const res = await axios.delete<ApiResponse<{ id: string }>>(
    `/api/categories/${id}`,
  );
  return res.data;
}
