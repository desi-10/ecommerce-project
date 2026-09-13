import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { ApiError } from "@/lib/api-error";

export const requireRequestSession = async (req: Request) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session?.user) {
    throw new ApiError("Unauthorized", 401);
  }

  return session;
};

export const requireServerSession = async () => {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session?.user) {
    throw new ApiError("Unauthorized", 401);
  }

  return session;
};

// ✅ optional helper if you want admin-only routes/layouts
export const requireAdminServerSession = async () => {
  const session = await requireServerSession();

  if (session.user.role !== "admin") {
    throw new ApiError("Forbidden", 403);
  }

  return session;
};

// Dashboard access for the vendor management system: admins see everything,
// vendors get a scoped view of their own products/inventory/orders (see
// src/server/products/products.service.ts and orders.service.ts for the
// vendorId filtering this gates access to).
export const requireDashboardServerSession = async () => {
  const session = await requireServerSession();

  if (session.user.role !== "admin" && session.user.role !== "vendor") {
    throw new ApiError("Forbidden", 403);
  }

  return session;
};

export const isAdminRole = (role: string | null | undefined) => role === "admin";
export const isVendorRole = (role: string | null | undefined) => role === "vendor";
