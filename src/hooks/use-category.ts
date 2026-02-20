// hooks/categories.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "@/client/category";
import type {
  CreateCategoryDto,
  GetCategoriesResponse,
  UpdateCategoryDto,
} from "@/types/categories";

export const categoriesKeys = {
  all: ["categories"] as const,
  list: (params?: Record<string, unknown>) =>
    ["categories", "list", params ?? {}] as const,
  detail: (id: string) => ["categories", "detail", id] as const,
};

export function useGetCategories(params?: {
  page?: number;
  limit?: number;
  q?: string;
  status?: "ACTIVE" | "INACTIVE";
  sort?: "newest" | "oldest" | "name_asc" | "name_desc";
}) {
  return useQuery<GetCategoriesResponse>({
    queryKey: categoriesKeys.list(params),
    queryFn: () => getCategories(params),
  });
}

export function useGetCategory(id: string) {
  return useQuery({
    queryKey: categoriesKeys.detail(id),
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCategoryDto) => createCategory(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: categoriesKeys.all });
    },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; payload: UpdateCategoryDto }) =>
      updateCategory(vars.id, vars.payload),
    onSuccess: async (_res, vars) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: categoriesKeys.all }),
        qc.invalidateQueries({ queryKey: categoriesKeys.detail(vars.id) }),
      ]);
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: categoriesKeys.all });
    },
  });
}
