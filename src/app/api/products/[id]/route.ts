import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { validateOrThrow } from "@/lib/validator";
import { handleApiError } from "@/lib/api-handler";
import { requireDashboardServerSession } from "@/lib/auth-guards";
import {
  deleteProductService,
  getProductByIdService,
  updateProductService,
} from "@/server/products/products.service";
import { updateProductSchema } from "@/server/products/products.validators";
import { uploadFileToCloudinary } from "@/lib/cloudinary-server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const GET = async (req: Request, context: RouteContext) => {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(req.url);
    // Set only by the dashboard edit page (see use-product.ts's
    // useGetProduct) — the storefront product page calls this same route
    // and must never be vendor-scoped, or every vendor account gets 404s
    // browsing other vendors' products while shopping normally.
    const mine = searchParams.get("mine") === "true";

    const requestHeaders = await headers();
    const session = await auth.api.getSession({
      headers: requestHeaders,
    });
    const isAdmin = session?.user?.role === "admin";
    const isVendor = mine && session?.user?.role === "vendor";

    const result = await getProductByIdService(
      id,
      isAdmin || isVendor, // vendors can also load their own INACTIVE products to edit
      isVendor ? session!.user.id : undefined,
    );
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};

export const PATCH = async (req: Request, context: RouteContext) => {
  try {
    const session = await requireDashboardServerSession();
    const vendorId = session.user.role === "vendor" ? session.user.id : undefined;
    const { id: productId } = await context.params;

    // Check if it's FormData or JSON
    const contentType = req.headers.get("content-type") || "";
    
    let payload: any = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      
      // Handle Images
      const imageFiles = formData.getAll("images") as File[];
      if (imageFiles.length > 0) {
        const imageUrls = [];
        for (const file of imageFiles) {
          if (file && file.size > 0) {
            const uploaded = await uploadFileToCloudinary(file);
            imageUrls.push(uploaded);
          }
        }
        payload.images = imageUrls;
      }

      // Handle other fields
      if (formData.has("name")) payload.name = formData.get("name") as string;
      if (formData.has("description")) payload.description = formData.get("description") as string;
      if (formData.has("status")) payload.status = formData.get("status") as string;
      if (formData.has("categoryId")) payload.categoryId = formData.get("categoryId") as string;
      if (formData.has("defaultPrice")) payload.defaultPrice = formData.get("defaultPrice");
      if (formData.has("defaultSalePrice")) payload.defaultSalePrice = formData.get("defaultSalePrice");
      if (formData.has("defaultStock")) payload.defaultStock = formData.get("defaultStock");

      const variantsStr = formData.get("variants") as string;
      if (variantsStr) {
        payload.variants = JSON.parse(variantsStr);
      }
    } else {
      payload = await req.json();
    }

    const valid = validateOrThrow(updateProductSchema, payload);
    const result = await updateProductService(productId, valid, vendorId);

    return NextResponse.json(result);
  } catch (error) {
    console.error("PATCH PRODUCT ERROR:", error);
    return handleApiError(error);
  }
};

export const DELETE = async (req: Request, context: RouteContext) => {
  try {
    const session = await requireDashboardServerSession();
    const vendorId = session.user.role === "vendor" ? session.user.id : undefined;
    const { id } = await context.params;

    const result = await deleteProductService(id, { vendorId });
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
};
