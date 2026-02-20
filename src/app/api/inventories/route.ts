import { handleApiError } from "@/lib/api-handler";
import { validateOrThrow } from "@/lib/validator";
import { listInventoriesService } from "@/server/inventory/inventory.service";
import { NextResponse } from "next/server";
import { listInventoriesSchema } from "@/server/inventory/inventory.validators";

export const GET = async (req: Request) => {
  try {
    // const session = await requireAdminServerSession(req);

    const rawQuery = Object.fromEntries(
      new URL(req.url).searchParams.entries(),
    );

    const query = validateOrThrow(listInventoriesSchema, rawQuery);

    const result = await listInventoriesService(query);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};
