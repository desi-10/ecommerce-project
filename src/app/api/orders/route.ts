import { handleApiError } from "@/lib/api-handler";
import { validateOrThrow } from "@/lib/validator";
import { getOrdersService } from "@/server/order/orders.service";
import { listOrdersSchema } from "@/server/order/orders.validators";
import { NextResponse } from "next/server";
import { requireDashboardServerSession } from "@/lib/auth-guards";

export const GET = async (req: Request) => {
  try {
    // Dashboard-only (all customers' orders) — was previously unauthenticated.
    const session = await requireDashboardServerSession();

    const url = new URL(req.url);

    // Convert query params to object
    const rawQuery = Object.fromEntries(url.searchParams.entries());

    // ✅ Validate and coerce (page, limit, etc.)
    const query = validateOrThrow(listOrdersSchema, rawQuery);

    // Vendor management: scope to orders containing this vendor's products.
    const vendorId = session.user.role === "vendor" ? session.user.id : undefined;

    // ✅ Call service
    const result = await getOrdersService(query, vendorId);

    return NextResponse.json(result);
  } catch (err) {
    return handleApiError(err);
  }
};
