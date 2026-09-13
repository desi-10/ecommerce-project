import { handleApiError } from "@/lib/api-handler";
import { validateOrThrow } from "@/lib/validator";
import { listInventoriesService } from "@/server/inventory/inventory.service";
import { NextResponse } from "next/server";
import { listInventoriesSchema } from "@/server/inventory/inventory.validators";
import { requireDashboardServerSession } from "@/lib/auth-guards";

export const GET = async (req: Request) => {
  try {
    // Dashboard-only data (stock levels) — was previously unauthenticated.
    const session = await requireDashboardServerSession();

    const rawQuery = Object.fromEntries(
      new URL(req.url).searchParams.entries(),
    );

    const query = validateOrThrow(listInventoriesSchema, rawQuery);

    // Vendor management: a vendor only sees stock for their own products.
    const vendorId = session.user.role === "vendor" ? session.user.id : undefined;

    const result = await listInventoriesService({ ...query, vendorId });
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};
