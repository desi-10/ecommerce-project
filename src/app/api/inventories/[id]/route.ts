import { NextResponse } from "next/server";
import { validateOrThrow } from "@/lib/validator";
import { handleApiError } from "@/lib/api-handler";
import {
  updateInventoryService,
  increaseStockService,
  decreaseStockService,
} from "@/server/inventory/inventory.service";
import {
  UpdateInventorySchema,
  AdjustStockSchema,
} from "@/server/inventory/inventory.validators";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const PATCH = async (req: Request, context: RouteContext) => {
  try {
    const { id } = await context.params;
    const body = await req.json();

    // Determine if this is a direct stock update or an adjust request
    if (body.qty !== undefined && body.variantId) {
      // Adjust stock request (increase or decrease)
      const direction = body.direction || "increase"; // "increase" or "decrease"
      const adjustPayload = {
        variantId: body.variantId,
        qty: body.qty,
      };
      const valid = validateOrThrow(AdjustStockSchema, adjustPayload);

      if (direction === "increase") {
        const result = await increaseStockService(valid);
        return NextResponse.json(result);
      } else if (direction === "decrease") {
        const result = await decreaseStockService(valid);
        return NextResponse.json(result);
      }
    }

    // Direct stock update
    const valid = validateOrThrow(UpdateInventorySchema, body);
    const result = await updateInventoryService(id, valid);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};
