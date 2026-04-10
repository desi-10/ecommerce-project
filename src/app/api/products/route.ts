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
import { uploadFileToCloudinary } from "@/lib/cloudinary-server";

export const GET = async (req: Request) => {
  try {
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
    const formData = await req.formData();
    
    // Extract file
    const imageFile = formData.get("image") as File | null;
    let imageUrl = "";

    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadFileToCloudinary(imageFile);
    }

    // Extract other fields and parse JSON for complex types
    const name = formData.get("name") as string;
    const description = (formData.get("description") as string) || undefined;
    const status = (formData.get("status") as any) || "ACTIVE";
    const defaultPrice = formData.get("defaultPrice") ? Number(formData.get("defaultPrice")) : undefined;
    const defaultSalePrice = formData.get("defaultSalePrice") ? Number(formData.get("defaultSalePrice")) : undefined;
    const defaultStock = formData.get("defaultStock") ? Number(formData.get("defaultStock")) : undefined;
    
    // Variants might be passed as a JSON string in FormData
    let variants = [];
    const variantsStr = formData.get("variants") as string;
    if (variantsStr) {
      try {
        variants = JSON.parse(variantsStr);
      } catch (e) {
        console.error("Failed to parse variants JSON", e);
      }
    }

    const payload = {
      name,
      description,
      image: imageUrl,
      status,
      defaultPrice,
      defaultSalePrice,
      defaultStock,
      variants
    };

    const valid = validateOrThrow(createProductSchema, payload);
    const result = await createProductService(valid);
    
    return NextResponse.json(result);
  } catch (err) {
    console.error("POST /api/products failure:", err);
    return handleApiError(err);
  }
};

