// client/inventory.ts
import axios from "axios";
import type {
  CreateInventoryDto,
  GetInventoriesResponse,
  Inventory,
  ListInventoriesParams,
  ApiResponse,
  UpdateInventoryDto,
} from "@/types/inventories";

// LIST
export async function getInventories(params?: ListInventoriesParams) {
  const res = await axios.get<GetInventoriesResponse>("/api/inventories", {
    params,
  });
  return res.data;
}

// GET ONE (if you have /api/inventories/:id)
export async function getInventoryById(id: string) {
  const res = await axios.get<ApiResponse<Inventory>>(`/api/inventories/${id}`);
  return res.data;
}

// CREATE (if you have POST /api/inventories)
export async function createInventory(payload: CreateInventoryDto) {
  const res = await axios.post<ApiResponse<Inventory>>(
    "/api/inventories",
    payload,
  );
  return res.data;
}

// UPDATE (recommended: PATCH /api/inventories/:id)
export async function updateInventory(id: string, payload: UpdateInventoryDto) {
  const res = await axios.patch<ApiResponse<Inventory>>(
    `/api/inventories/${id}`,
    payload,
  );
  return res.data;
}

// DELETE (if you allow it)
export async function deleteInventory(id: string) {
  const res = await axios.delete<ApiResponse<{ id: string }>>(
    `/api/inventories/${id}`,
  );
  return res.data;
}
