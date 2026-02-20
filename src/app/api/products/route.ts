import { NextResponse } from "next/server";
import {
  createProductService,
  getProductsService,
} from "@/server/products/products.service";
import {
  createProductSchema,
  listProductsSchema,
} from "@/server/products/products.validators";
import { validateOrThrow } from "@/lib/validator";
import { handleApiError } from "@/lib/api-handler";
import { requireRequestSession } from "@/lib/auth-guards";

export const GET = async (req: Request) => {
  try {
    await requireRequestSession(req);

    const url = new URL(req.url);

    const rawQuery = Object.fromEntries(url.searchParams.entries());
    const query = validateOrThrow(listProductsSchema, rawQuery);

    const result = await getProductsService(query);
    return NextResponse.json(result);
  } catch (err) {
    return handleApiError(err);
  }
};

export const POST = async (req: Request) => {
  try {
    await requireRequestSession(req);

    const body = await req.json();
    const valid = validateOrThrow(createProductSchema, body);
    const result = await createProductService(valid);
    return NextResponse.json(result);
  } catch (err) {
    return handleApiError(err);
  }
};
