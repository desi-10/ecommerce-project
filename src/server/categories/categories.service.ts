import { apiResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error";
import prisma from "@/lib/db";
import {
  CategorySchemaType,
  ListCategorySchemaType,
  UpdateCategorySchemaType,
} from "./categories.validators";
import { StatusCodes } from "http-status-codes";
import { uploadFileToCloudinary } from "@/lib/cloudinary-server";

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const ensureUniqueSlug = async (baseName: string, excludeId?: string) => {
  const base = toSlug(baseName) || "category";
  let slug = base;
  let index = 1;

  while (true) {
    const existing = await prisma.category.findFirst({
      where: {
        slug,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { id: true },
    });

    if (!existing) return slug;

    index += 1;
    slug = `${base}-${index}`;
  }
};

export const createCategoryService = async (
  data: CategorySchemaType,
  imageFile?: File | null,
) => {
  const exists = await prisma.category.findFirst({
    where: { name: data.name },
    select: { id: true },
  });

  if (exists) {
    throw new ApiError("Category name already exists", StatusCodes.CONFLICT);
  }

  let imageUrl = data.image;
  if (imageFile && imageFile.size > 0) {
    const upload = await uploadFileToCloudinary(imageFile);
    imageUrl = upload.url;
  }

  const slug = await ensureUniqueSlug(data.name);

  const category = await prisma.category.create({
    data: {
      name: data.name,
      status: data.status,
      image: imageUrl || null,
      slug,
    },
  });

  return apiResponse("Category created successfully", category);
};

export const getCategoryService = async (query: ListCategorySchemaType) => {
  const where = query.q
    ? {
        name: {
          contains: query.q,
          mode: "insensitive" as const,
        },
      }
    : undefined;

  const [total, items] = await Promise.all([
    prisma.category.count({ where }),
    prisma.category.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / query.limit));

  return apiResponse("Categories fetched successfully", {
    categories: items,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
      hasNextPage: query.page < totalPages,
      hasPrevPage: query.page > 1,
    },
  });
};

export const getCategoryByIdService = async (id: string) => {
  if (!id) {
    throw new ApiError("Category id is required", StatusCodes.BAD_REQUEST);
  }

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      products: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!category) {
    throw new ApiError("Category not found", StatusCodes.NOT_FOUND);
  }

  return apiResponse("Category fetched successfully", category);
};

export const updateCategoryService = async (
  id: string,
  data: UpdateCategorySchemaType,
  imageFile?: File | null,
) => {
  if (!id) {
    throw new ApiError("Category id is required", StatusCodes.BAD_REQUEST);
  }

  const existing = await prisma.category.findUnique({
    where: { id },
    select: { id: true, name: true },
  });

  if (!existing) {
    throw new ApiError("Category not found", StatusCodes.NOT_FOUND);
  }

  if (data.name && data.name !== existing.name) {
    const duplicate = await prisma.category.findFirst({
      where: { name: data.name, id: { not: id } },
      select: { id: true },
    });

    if (duplicate) {
      throw new ApiError("Category name already exists", StatusCodes.CONFLICT);
    }
  }

  const slug = data.name ? await ensureUniqueSlug(data.name, id) : undefined;

  let imageUrl = data.image;
  if (imageFile && imageFile.size > 0) {
    const upload = await uploadFileToCloudinary(imageFile);
    imageUrl = upload.url;
  }

  const updated = await prisma.category.update({
    where: { id },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(imageUrl !== undefined ? { image: imageUrl } : {}),
      ...(slug ? { slug } : {}),
    },
  });

  return apiResponse("Category updated successfully", updated);
};

export const deleteCategoryService = async (id: string) => {
  if (!id) {
    throw new ApiError("Category id is required", StatusCodes.BAD_REQUEST);
  }

  const existing = await prisma.category.findUnique({
    where: { id },
    include: {
      products: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!existing) {
    throw new ApiError("Category not found", StatusCodes.NOT_FOUND);
  }

  if (existing.products.length > 0) {
    throw new ApiError(
      "Cannot delete category with products",
      StatusCodes.CONFLICT,
    );
  }

  await prisma.category.delete({ where: { id } });

  return apiResponse("Category deleted successfully", null);
};
