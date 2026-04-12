export type Review = {
  id: string;
  productId: string;
  userId: string | null;
  rating: number;
  comment: string | null;
  reply: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | string;
  createdAt: string;
  updatedAt: string;
  product: {
    name: string;
    image?: string | null;
  };
  user?: {
    name: string | null;
    email: string;
  } | null;
};

export type GetReviewsData = {
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};
