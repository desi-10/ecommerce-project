import { NextResponse } from "next/server";
import { validateOrThrow } from "@/lib/validator";
import { handleApiError } from "@/lib/api-handler";
import { requireAdminServerSession } from "@/lib/auth-guards";
import {
  deleteCategoryService,
  getCategoryByIdService,
  updateCategoryService,
} from "@/server/categories/categories.service";
import { updateCategorySchema } from "@/server/categories/categories.validators";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const GET = async (req: Request, context: RouteContext) => {
  try {
    const { id } = await context.params;

    const result = await getCategoryByIdService(id);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};

export const PATCH = async (req: Request, context: RouteContext) => {
  try {
    await requireAdminServerSession();
    const { id } = await context.params;

    const body = await req.json();
    const valid = validateOrThrow(updateCategorySchema, body);
    const result = await updateCategoryService(id, valid);

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};

export const DELETE = async (req: Request, context: RouteContext) => {
  try {
    await requireAdminServerSession();
    const { id } = await context.params;

    const result = await deleteCategoryService(id);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};
