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
    await requireAdminServerSession();
    const formData = await req.formData();
    
    const imageFile = formData.get("image") as File | null;
    
    const payload = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || undefined,
      status: (formData.get("status") as string) || "ACTIVE",
    };

    const valid = validateOrThrow(categorySchema, payload);
    const result = await createCategoryService(valid, imageFile);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};
