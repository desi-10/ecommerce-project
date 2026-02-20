import { NextResponse } from "next/server";
import { validateOrThrow } from "@/lib/validator";
import { handleApiError } from "@/lib/api-handler";
import { requireAdminServerSession } from "@/lib/auth-guards";
import {
  createCategoryService,
  getCategoryService,
} from "@/server/categories/categories.service";
import {
  categorySchema,
  listCategorySchema,
} from "@/server/categories/categories.validators";

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const rawQuery = Object.fromEntries(url.searchParams.entries());
    const query = validateOrThrow(listCategorySchema, rawQuery);

    const result = await getCategoryService(query);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};

export const POST = async (req: Request) => {
  try {
    // await requireAdminServerSession();
    const body = await req.json();
    const valid = validateOrThrow(categorySchema, body);

    const result = await createCategoryService(valid);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};
