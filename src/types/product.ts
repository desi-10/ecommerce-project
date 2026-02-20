// types/products.ts
export type ProductStatus = "ACTIVE" | "INACTIVE";

export type Inventory = {
  id: string;
  stock: number;
};

export type Variant = {
  id: string;
  name: string;
  sku: string | null;
  price: string; // your API returns "1000" as string
  salePrice: string; // string
  options: unknown | null;
  inventory: Inventory;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  status: ProductStatus;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  variants: Variant[];
};

export type ApiResponse<T> = {
  message: string;
  data: T;
};

export type Pagination = {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  limit: number;
};

export type GetProductsData = {
  products: Product[];
  pagination: Pagination;
};

export type GetProductsResponse = ApiResponse<GetProductsData>;

export type CreateProductDto = {
  name: string;
  description?: string;
  status: ProductStatus;
  defaultPrice: number;
  defaultSalePrice: number;
  defaultStockPrice: number; // (your naming) – looks like you meant stock, but keeping as-is
};

export type UpdateProductDto = Partial<CreateProductDto>;
