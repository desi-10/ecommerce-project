import { handleApiError } from "@/lib/api-handler";
import { validateOrThrow } from "@/lib/validator";
import { getOrdersService } from "@/server/order/orders.service";
import { listOrdersSchema } from "@/server/order/orders.validators";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);

    // Convert query params to object
    const rawQuery = Object.fromEntries(url.searchParams.entries());

    // ✅ Validate and coerce (page, limit, etc.)
    const query = validateOrThrow(listOrdersSchema, rawQuery);

    // ✅ Call service
    const result = await getOrdersService(query);

    return NextResponse.json(result);
  } catch (err) {
    return handleApiError(err);
  }
};
