import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a raw File to Cloudinary from the server.
 * @param file The file object from FormData
 * @returns The secure URL of the uploaded image
 */
export async function uploadFileToCloudinary(file: File): Promise<{
  id: string;
  url: string;
}> {
  // Convert file to base64
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64File = `data:${file.type};base64,${buffer.toString("base64")}`;

  // Upload to Cloudinary
  const result = await cloudinary.uploader.upload(base64File, {
    folder: "ecommerce_products",
    resource_type: "auto",
  });

  return {
    id: result.public_id,
    url: result.secure_url,
  };
}
