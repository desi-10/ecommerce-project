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

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);

    const rawQuery = Object.fromEntries(url.searchParams.entries());
    const query = validateOrThrow(listProductsSchema, rawQuery);

    const result = await getProductsService(query);
    return NextResponse.json(result);
  } catch (err) {
    // if validateOrThrow threw a NextResponse, return it
    if (err instanceof Response) return err;

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const valid = validateOrThrow(createProductSchema, body);
    const result = await createProductService(valid);
    return NextResponse.json(result);
  } catch (err) {
    // if validateOrThrow threw a NextResponse, return it
    if (err instanceof Response) return err;

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};
