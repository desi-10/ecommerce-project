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
