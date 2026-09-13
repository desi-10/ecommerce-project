import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { requireDashboardServerSession } from "@/lib/auth-guards";
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
    const { searchParams } = new URL(req.url);
    const rawQuery = Object.fromEntries(searchParams.entries());

    const query = validateOrThrow(listProductsSchema, rawQuery);

    const requestHeaders = await headers();
    const session = await auth.api.getSession({
      headers: requestHeaders,
    });
    const role = session?.user?.role;
    const isAdmin = role === "admin";
    const isVendor = role === "vendor";

    if (!isAdmin) {
      query.status = "ACTIVE";
    }

    // Vendor management: a vendor's own dashboard view of /api/products
    // (?mine=true) only lists their products; storefront and admin see all.
    const mine = searchParams.get("mine") === "true";
    const scope = isVendor && mine && session?.user?.id
      ? { vendorId: session.user.id }
      : undefined;
    if (scope) query.status = undefined; // vendors manage both ACTIVE and INACTIVE of their own

    const result = await getProductsService(query, scope);

    return NextResponse.json(result);
  } catch (err) {
    console.error("GET PRODUCTS ROUTE ERROR:", err);
    return handleApiError(err);
  }
};

export const POST = async (req: Request) => {
  try {
    // Was previously wide open — anyone could create products. Dashboard
    // write access, same as every other /api/products mutation.
    const session = await requireDashboardServerSession();
    const vendorId = session.user.role === "vendor" ? session.user.id : undefined;

    const formData = await req.formData();

    const additionalImageFiles = formData.getAll("images") as File[];

    const additionalImageUrls: { id: string; url: string }[] = [];
    for (const file of additionalImageFiles) {
      if (file && file.size > 0) {
        const { id, url } = await uploadFileToCloudinary(file);
        additionalImageUrls.push({ id, url });
      }
    }

    // If main image was provided, add it to the start of the gallery as well if desired
    // Or just keep them separate as per the schema (Product.image vs ProductImage table)
    const galleryUrls = additionalImageUrls;

    // Extract other fields and parse JSON for complex types
    const name = formData.get("name") as string;
    const description = (formData.get("description") as string) || undefined;
    const status = (formData.get("status") as string) || "ACTIVE";
    const defaultPrice = formData.get("defaultPrice")
      ? Number(formData.get("defaultPrice"))
      : undefined;
    const defaultSalePrice = formData.get("defaultSalePrice")
      ? Number(formData.get("defaultSalePrice"))
      : undefined;
    const defaultStock = formData.get("defaultStock")
      ? Number(formData.get("defaultStock"))
      : undefined;
    const categoryId = (formData.get("categoryId") as string) || undefined;

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
      images: galleryUrls,
      status,
      defaultPrice,
      defaultSalePrice,
      defaultStock,
      variants,
      categoryId,
    };

    const valid = validateOrThrow(createProductSchema, payload);
    const result = await createProductService(valid, vendorId);

    return NextResponse.json(result);
  } catch (err) {
    console.error("POST /api/products failure:", err);
    return handleApiError(err);
  }
};
