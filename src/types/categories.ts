// types/categories.ts
export type CategoryStatus = "ACTIVE" | "INACTIVE";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  status: CategoryStatus;
  createdAt: string;
  updatedAt: string;
  _count?: { products: number };
};

export type CategoriesPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type ApiResponse<T> = { message: string; data: T };

export type GetCategoriesData = {
  categories: Category[];
  pagination: CategoriesPagination;
};

export type GetCategoriesResponse = ApiResponse<GetCategoriesData>;

export type CreateCategoryDto = {
  name: string;
  description?: string;
  image?: string;
  status?: CategoryStatus; // default ACTIVE on server
};

export type UpdateCategoryDto = Partial<CreateCategoryDto>;
