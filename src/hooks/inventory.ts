// hooks/inventory.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createInventory,
  deleteInventory,
  getInventories,
  getInventoryById,
  updateInventory,
} from "@/client/inventory";
import type {
  CreateInventoryDto,
  GetInventoriesResponse,
  ListInventoriesParams,
  UpdateInventoryDto,
} from "@/types/inventories";

export const inventoryKeys = {
  all: ["inventory"] as const,
  list: (params?: ListInventoriesParams) =>
    ["inventory", "list", params ?? {}] as const,
  detail: (id: string) => ["inventory", "detail", id] as const,
};

export function useGetInventories(params?: ListInventoriesParams) {
  return useQuery<GetInventoriesResponse>({
    queryKey: inventoryKeys.list(params),
    queryFn: () => getInventories(params),
  });
}

export function useGetInventory(id: string) {
  return useQuery({
    queryKey: inventoryKeys.detail(id),
    queryFn: () => getInventoryById(id),
    enabled: !!id,
  });
}

export function useCreateInventory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateInventoryDto) => createInventory(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
}

export function useUpdateInventory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; payload: UpdateInventoryDto }) =>
      updateInventory(vars.id, vars.payload),
    onSuccess: async (_res, vars) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: inventoryKeys.all }),
        qc.invalidateQueries({ queryKey: inventoryKeys.detail(vars.id) }),
      ]);
    },
  });
}

export function useDeleteInventory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteInventory(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
}
