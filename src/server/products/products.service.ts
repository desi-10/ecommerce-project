import { apiResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error";
import {
  CreateProductInput,
  ListProductsInput,
  UpdateProductInput,
} from "./products.validators";
import prisma from "@/lib/db";
import { StatusCodes } from "http-status-codes";

import { Prisma } from "../../../prisma/generated/client";

export const decimal = (n: number) => new Prisma.Decimal(n);
// --------------------------
// Common selectors
// --------------------------
const productSelect = {
  id: true,
  name: true,
  description: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  variants: {
    select: {
      id: true,
      name: true,
      sku: true,
      price: true,
      salePrice: true,
      options: true,
      inventory: { select: { id: true, stock: true } },
    },
    orderBy: { createdAt: "asc" as const },
  },
};

// --------------------------
// Services
// --------------------------

export const createProductService = async (data: CreateProductInput) => {
  const hasVariants = data.variants.length > 0;
  const result = await prisma.$transaction(async (tx) => {
    // basic duplicate SKU guard within payload
    if (hasVariants) {
      const skus = data.variants.map((v) => v.sku).filter(Boolean) as string[];
      const set = new Set(skus);
      if (set.size !== skus.length) {
        throw new ApiError(
          "Duplicate SKU in variants payload.",
          StatusCodes.BAD_REQUEST,
        );
      }
    }

    const product = await tx.product.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        status: data.status,
      },
      select: { id: true },
    });

    if (hasVariants) {
      // Create variants + inventories
      await Promise.all(
        data.variants.map(async (v) => {
          const variant = await tx.productVariant.create({
            data: {
              productId: product.id,
              name: v.name,
              sku: v.sku ?? null,
              price: decimal(v.price),
              salePrice:
                v.salePrice === undefined ? null : decimal(v.salePrice),
              //   options: v.options ?? null,
            },
            select: { id: true },
          });

          await tx.inventory.create({
            data: {
              variantId: variant.id,
              stock: v.stock ?? 0,
            },
          });
        }),
      );
    } else {
      // default variant + inventory
      const variant = await tx.productVariant.create({
        data: {
          productId: product.id,
          name: "Default",
          sku: null,
          price: decimal(data.defaultPrice ?? 0),
          salePrice:
            data.defaultSalePrice === undefined
              ? null
              : decimal(data.defaultSalePrice),
          //   options: null,
        },
        select: { id: true },
      });

      await tx.inventory.create({
        data: {
          variantId: variant.id,
          stock: data.defaultStock ?? 0,
        },
      });
    }

    return tx.product.findUnique({
      where: { id: product.id },
      select: productSelect,
    });
  });

  return apiResponse("Product created successfully", result);
};

export const getProductsService = async (data: ListProductsInput) => {
  const { page, limit, q, status, sort, category, onDiscount } = data;

  const where: Prisma.ProductWhereInput = {
    ...(status ? { status } : {}),
    ...(q
      ? {
          name: {
            contains: q,
            mode: "insensitive",
          },
        }
      : {}),
    ...(category
      ? {
          categories: {
            some: {
              category: {
                slug: category,
              },
            },
          },
        }
      : {}),
    ...(onDiscount
      ? {
          discounts: {
            some: {
              status: "ACTIVE",
            },
          },
        }
      : {}),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "newest"
      ? { createdAt: "desc" }
      : sort === "oldest"
        ? { createdAt: "asc" }
        : sort === "name_asc"
          ? { name: "asc" }
          : { name: "desc" };

  const [total, products] = await prisma.$transaction([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      select: productSelect,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return apiResponse("Products fetched successfully", {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  });
};

export const getProductByIdService = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    select: productSelect,
  });

  if (!product) throw new ApiError("Product not found", StatusCodes.NOT_FOUND);

  return apiResponse("Product fetched successfully", product);
};

export const updateProductService = async (
  id: string,
  data: UpdateProductInput,
) => {
  const updated = await prisma.$transaction(async (tx) => {
    const existing = await tx.product.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing)
      throw new ApiError("Product not found", StatusCodes.NOT_FOUND);

    // update product core
    await tx.product.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.description !== undefined
          ? { description: data.description ?? null }
          : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
      },
      select: { id: true },
    });

    // If variants not provided, stop here (core update only)
    if (!data.variants) {
      return tx.product.findUnique({ where: { id }, select: productSelect });
    }

    // Guard duplicate SKUs within payload
    const skus = data.variants.map((v) => v.sku).filter(Boolean) as string[];
    const set = new Set(skus);
    if (set.size !== skus.length) {
      throw new ApiError(
        "Duplicate SKU in variants payload.",
        StatusCodes.BAD_REQUEST,
      );
    }

    // Fetch current variants for deletion detection
    const current = await tx.productVariant.findMany({
      where: { productId: id },
      select: { id: true },
    });
    const currentIds = new Set(current.map((v) => v.id));
    const incomingIds = new Set(
      data.variants.map((v) => v.id).filter(Boolean) as string[],
    );

    // Delete variants removed from payload
    const toDelete = [...currentIds].filter((vid) => !incomingIds.has(vid));
    if (toDelete.length) {
      // inventory should cascade if relation is onDelete: Cascade,
      // but we delete explicitly to be safe if your schema doesn't cascade.
      await tx.inventory.deleteMany({ where: { variantId: { in: toDelete } } });
      await tx.productVariant.deleteMany({
        where: { id: { in: toDelete }, productId: id },
      });
    }

    // Upsert (update existing, create new)
    for (const v of data.variants) {
      if (v.id) {
        // update variant
        const variant = await tx.productVariant.update({
          where: { id: v.id },
          data: {
            name: v.name,
            sku: v.sku ?? null,
            price: decimal(v.price),
            salePrice: v.salePrice === undefined ? null : decimal(v.salePrice),
            // options: v.options ?? null,
          },
          select: { id: true, productId: true },
        });

        if (variant.productId !== id) {
          throw new ApiError(
            "Variant does not belong to this product.",
            StatusCodes.BAD_REQUEST,
          );
        }

        // upsert inventory
        await tx.inventory.upsert({
          where: { variantId: variant.id },
          create: { variantId: variant.id, stock: v.stock ?? 0 },
          update: { stock: v.stock ?? 0 },
        });
      } else {
        // create variant
        const created = await tx.productVariant.create({
          data: {
            productId: id,
            name: v.name,
            sku: v.sku ?? null,
            price: decimal(v.price),
            salePrice: v.salePrice === undefined ? null : decimal(v.salePrice),
            // options: v.options ?? null,
          },
          select: { id: true },
        });

        await tx.inventory.create({
          data: { variantId: created.id, stock: v.stock ?? 0 },
        });
      }
    }

    // Ensure at least 1 variant exists
    const count = await tx.productVariant.count({ where: { productId: id } });
    if (count === 0) {
      throw new ApiError(
        "A product must have at least one variant.",
        StatusCodes.BAD_REQUEST,
      );
    }

    return tx.product.findUnique({ where: { id }, select: productSelect });
  });

  return apiResponse("Product updated successfully", updated);
};

/**
 * Delete product:
 * - default: hard delete (variants + inventory should cascade)
 * - optional: soft delete by setting status INACTIVE
 */
export const deleteProductService = async (
  id: string,
  opts?: { soft?: boolean },
) => {
  const exists = await prisma.product.findUnique({
    where: { id },
    select: { id: true, status: true },
  });

  if (!exists) throw new ApiError("Product not found", StatusCodes.NOT_FOUND);

  if (opts?.soft) {
    const updated = await prisma.product.update({
      where: { id },
      data: { status: "INACTIVE" },
      select: productSelect,
    });
    return apiResponse("Product archived successfully", updated);
  }

  // If you have Orders, you should block delete if referenced.
  // Example (adjust):
  // const hasOrders = await prisma.orderItem.findFirst({
  //   where: {  variantId:  },
  //   select: { id: true },
  // });
  // if (hasOrders)
  //   throw new ApiError(
  //     "Cannot delete product with orders.",
  //     statusCodes.CONFLICT,
  //   );

  await prisma.$transaction(async (tx) => {
    const variantIds = await tx.productVariant.findMany({
      where: { productId: id },
      select: { id: true },
    });

    const ids = variantIds.map((v) => v.id);
    if (ids.length) {
      await tx.inventory.deleteMany({ where: { variantId: { in: ids } } });
      await tx.productVariant.deleteMany({ where: { id: { in: ids } } });
    }

    await tx.product.delete({ where: { id } });
  });

  return apiResponse("Product deleted successfully", null);
};
