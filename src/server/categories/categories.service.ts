import { apiResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error"; // ✅ adjust path
import { CategorySchemaType } from "./categories.validators";
import { statusCodes } from "better-auth";
import prisma from "@/lib/db";

// ✅ CREATE
export const createCategoryService = async (data: CategorySchemaType) => {
  // optional: prevent duplicate names
  const exists = await prisma.category.findFirst({
    where: { name: data.name },
    select: { id: true },
  });

  if (exists) {
    throw new ApiError("Category name already exists", statusCodes.CONFLICT);
  }

  const category = await prisma.category.create({
    data: {
      name: data.name,
      status: "ACTIVE",
      slug: "123", // change this in production
    },
  });

  return apiResponse("Category created successfully", category);
};

// ✅ GET ALL
export const getCategoryService = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });

  return apiResponse("Categories fetched successfully", categories);
};

// ✅ GET BY ID
export const getCategoryByIdService = async (id: string) => {
  if (!id)
    throw new ApiError("Category id is required", statusCodes.BAD_REQUEST);

  const category = await prisma.category.findUnique({
    where: { id },
    include: { products: { select: { id: true } } }, // ✅ adjust relation name if different
  });

  if (!category)
    throw new ApiError("Category not found", statusCodes.NOT_FOUND);

  return apiResponse("Category fetched successfully", category);
};

// ✅ DELETE
export const deleteCategoryService = async (id: string) => {
  if (!id)
    throw new ApiError("Category id is required", statusCodes.BAD_REQUEST);

  const existing = await prisma.category.findUnique({
    where: { id },
    include: { products: { select: { id: true } } }, // ✅ adjust relation name if different
  });

  if (!existing)
    throw new ApiError("Category not found", statusCodes.NOT_FOUND);

  // ✅ block delete if linked products exist
  if (existing.products?.length) {
    throw new ApiError(
      "Cannot delete category with products",
      statusCodes.CONFLICT,
    );
  }

  await prisma.category.delete({ where: { id } });

  return apiResponse("Deleted successfully", null);
};
