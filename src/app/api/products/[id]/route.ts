import { NextResponse } from "next/server";
import { validateOrThrow } from "@/lib/validator";
import { handleApiError } from "@/lib/api-handler";
import { requireAdminServerSession } from "@/lib/auth-guards";
import {
  deleteProductService,
  getProductByIdService,
  updateProductService,
} from "@/server/products/products.service";
import { updateProductSchema } from "@/server/products/products.validators";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const GET = async (req: Request, context: RouteContext) => {
  try {
    const { id } = await context.params;

    const result = await getProductByIdService(id);
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
    const valid = validateOrThrow(updateProductSchema, body);

    const result = await updateProductService(id, valid);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};

export const DELETE = async (req: Request, context: RouteContext) => {
  try {
    await requireAdminServerSession();
    const { id } = await context.params;

    const result = await deleteProductService(id);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};
