import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-handler";
import { apiResponse } from "@/lib/api-response";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64File = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64File, {
      folder: "ecommerce_products",
      resource_type: "auto",
    });

    return NextResponse.json(
      apiResponse("Image uploaded successfully", result.secure_url)
    );
  } catch (error) {
    return handleApiError(error);
  }
};
