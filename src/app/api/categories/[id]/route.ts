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

    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;

    const payload = {
      name: (formData.get("name") as string) || undefined,
      description: (formData.get("description") as string) || undefined,
      status: (formData.get("status") as string as string) || undefined,
    };

    const valid = validateOrThrow(updateCategorySchema, payload);
    const result = await updateCategoryService(id, valid, imageFile);

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
