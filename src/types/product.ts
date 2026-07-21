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
  options: unknown;
  inventory: Inventory;
};

export type ProductImage = { 
  id: string;
  url: string; 
  publicId: string;
  alt?: string | null;
  position?: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  image?: string; // Featured image
  images?: ProductImage[]; // Gallery images
  brand?: string | null;
  variants: Variant[];
  price?: number;
  salePrice?: number;
  oldPrice?: number | null;
  stock?: number;
  categories?: {
    category: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
  discounts?: {
    id: string;
    type: "PERCENT" | "AMOUNT";
    value: string | number;
    status: "ACTIVE" | "INACTIVE";
    startsAt: string | null;
    endsAt: string | null;
  }[];
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
  defaultPrice?: number;
  defaultSalePrice?: number;
  defaultStock?: number;
  categoryIds?: string[];
  images?: { id: string; url: string }[];
  variants?: Partial<Variant>[];
};

export type UpdateProductDto = Partial<CreateProductDto> & { id?: string };
