// types/inventory.ts
export type ApiResponse<T> = { message: string; data: T };

export type InventoryProduct = {
  id: string;
  name: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
};

export type InventoryVariant = {
  id: string;
  productId: string;
  name: string;
  sku: string | null;
  price: string;
  salePrice: string;
  options: unknown | null;
  createdAt: string;
  updatedAt: string;
  product: InventoryProduct;
};

export type Inventory = {
  id: string;
  variantId: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
  variant: InventoryVariant;
};

export type InventoriesPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type GetInventoriesData = {
  data: Inventory[];
  pagination: InventoriesPagination;
};

export type GetInventoriesResponse = ApiResponse<GetInventoriesData>;

export type ListInventoriesParams = {
  productId?: string;
  variantId?: string;
  inStock?: boolean;
  q?: string;
  page?: number;
  limit?: number;
};

export type UpdateInventoryDto = {
  stock: number;
};

export type CreateInventoryDto = {
  variantId: string;
  stock?: number;
};
