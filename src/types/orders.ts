// types/orders.ts
export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED"
  | "FULFILLED";

export type PaymentProvider = "PAYSTACK" | "STRIPE" | "CASH" | "OTHER";
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";

export type OrderItem = {
  id: string;
  orderId: string;
  variantId: string;
  qty: number;
  unitPrice: string; // API returns strings
  lineTotal: string; // API returns strings
  createdAt: string;
};

export type OrderPayment = {
  id: string;
  userId: string | null;
  orderId: string;
  provider: PaymentProvider | string;
  status: PaymentStatus | string;
  amount: string;
  currency: string;
  reference: string;
  metadata: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OrderUser = {
  id: string;
  name: string | null;
  email: string;
};

export type Order = {
  id: string;
  userId: string | null;
  status: OrderStatus | string;
  subtotal: string;
  discountTotal: string;
  total: string;
  currency: string;
  couponId: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  payments: OrderPayment[];
  user: OrderUser | null;
  shippingAddress?: unknown;
};

export type OrdersPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type ApiResponse<T> = { message: string; data: T };

export type GetOrdersData = {
  orders: Order[];
  pagination: OrdersPagination;
};

export type GetOrdersResponse = ApiResponse<GetOrdersData>;

export type ListOrdersParams = {
  page?: number;
  limit?: number;
  q?: string;
  status?: OrderStatus;
  sort?: "newest" | "oldest";
};
