// hooks/products.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "@/client/products";
import type {
  CreateProductDto,
  GetProductsResponse,
  UpdateProductDto,
} from "@/types/product";

export const productsKeys = {
  all: ["products"] as const,
  list: (params?: { 
    page?: number; 
    limit?: number; 
    category?: string;
    categories?: string[];
    minPrice?: number;
    maxPrice?: number;
    q?: string;
    onDiscount?: boolean;
    status?: string;
    sort?: string;
    rating?: number;
  }) =>
    ["products", "list", params ?? {}] as const,
  detail: (id: string) => ["products", "detail", id] as const,
};

export function useGetProducts(params?: {
  page?: number;
  limit?: number;
  category?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  q?: string;
  onDiscount?: boolean;
  status?: string;
  sort?: string;
  rating?: number;
}) {
  return useQuery<GetProductsResponse>({
    queryKey: productsKeys.list(params),
    queryFn: () => getProducts(params),
  });
}

export function useGetProduct(id: string) {
  return useQuery({
    queryKey: productsKeys.detail(id),
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: FormData) => createProduct(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: productsKeys.all });
    },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; payload: UpdateProductDto }) =>
      updateProduct(vars.id, vars.payload),
    onSuccess: async (_res, vars) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: productsKeys.all }),
        qc.invalidateQueries({ queryKey: productsKeys.detail(vars.id) }),
      ]);
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: productsKeys.all });
    },
  });
}
