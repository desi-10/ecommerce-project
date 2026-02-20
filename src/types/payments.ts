// types/payments.ts
export type PaymentProvider = "PAYSTACK" | "STRIPE" | "CASH" | "OTHER";
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";

export type Payment = {
  id: string;
  userId: string | null;
  orderId: string;
  provider: PaymentProvider | string;
  status: PaymentStatus | string;
  amount: string; // API returns string
  currency: string;
  reference: string;
  metadata: string | null;
  createdAt: string;
  updatedAt: string;
  // optional if your API includes relations later
  order?: {
    id: string;
    status?: string;
    total?: string;
    currency?: string;
  } | null;
  user?: { id: string; name?: string | null; email?: string } | null;
};

export type PaymentsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type ApiResponse<T> = { message: string; data: T };

export type GetPaymentsData = {
  payments: Payment[];
  pagination: PaymentsPagination;
};

export type GetPaymentsResponse = ApiResponse<GetPaymentsData>;

export type ListPaymentsParams = {
  page?: number;
  limit?: number;
  q?: string; // reference / email / orderId etc (depends on backend)
  status?: PaymentStatus;
  provider?: PaymentProvider;
  sort?: "newest" | "oldest";
};
