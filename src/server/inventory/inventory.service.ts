import prisma from "@/lib/db";
import { ApiError } from "@/lib/api-error";
import { apiResponse } from "@/lib/api-response";
import { StatusCodes } from "http-status-codes";
import {
  CreateInventorySchema,
  UpdateInventorySchema,
  AdjustStockSchema,
  type CreateInventoryInput,
  type UpdateInventoryInput,
  type AdjustStockInput,
} from "./inventory.validators";

/**
 * Create inventory row for a variant (fails if already exists because variantId is unique)
 */
export const createInventoryService = async (raw: unknown) => {
  const data: CreateInventoryInput = CreateInventorySchema.parse(raw);

  const variant = await prisma.productVariant.findUnique({
    where: { id: data.variantId },
    include: { inventory: true },
  });

  if (!variant) throw new ApiError("Variant not found", StatusCodes.NOT_FOUND);
  if (variant.inventory)
    throw new ApiError(
      "Inventory already exists for this variant",
      StatusCodes.CONFLICT,
    );

  const inv = await prisma.inventory.create({
    data: {
      variantId: data.variantId,
      stock: data.stock,
    },
    include: { variant: true },
  });

  return apiResponse("Inventory created", inv);
};

/**
 * Ensure inventory exists (useful when creating variants)
 * - If no inventory row exists, create with 0
 * - Returns inventory
 */
export const ensureInventoryForVariantService = async (variantId: string) => {
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    include: { inventory: true },
  });

  if (!variant) throw new ApiError("Variant not found", StatusCodes.NOT_FOUND);

  if (variant.inventory) return variant.inventory;

  return prisma.inventory.create({
    data: { variantId, stock: 0 },
  });
};

export const getInventoryByIdService = async (id: string) => {
  const inv = await prisma.inventory.findUnique({
    where: { id },
    include: { variant: { include: { product: true } } },
  });

  if (!inv) throw new ApiError("Inventory not found", StatusCodes.NOT_FOUND);

  return apiResponse("Inventory fetched", inv);
};

export const getInventoryByVariantIdService = async (variantId: string) => {
  const inv = await prisma.inventory.findUnique({
    where: { variantId },
    include: { variant: { include: { product: true } } },
  });

  if (!inv)
    throw new ApiError(
      "Inventory not found for this variant",
      StatusCodes.NOT_FOUND,
    );

  return apiResponse("Inventory fetched", inv);
};

export const listInventoriesService = async (params?: {
  productId?: string;
  variantId?: string;
  inStock?: boolean; // true => stock > 0
  q?: string; // search on product name or variant name
  page?: number;
  limit?: number;
}) => {
  const page = Math.max(1, params?.page ?? 1);
  const limit = Math.min(50, Math.max(1, params?.limit ?? 20));
  const skip = (page - 1) * limit;

  const where: any = {};

  if (params?.variantId) where.variantId = params.variantId;

  if (params?.inStock === true) where.stock = { gt: 0 };
  if (params?.inStock === false) where.stock = { lte: 0 };

  // Filters using relations
  if (params?.productId || params?.q) {
    where.variant = {};
    if (params.productId) where.variant.productId = params.productId;
    if (params.q) {
      const q = params.q.trim();
      where.variant.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { product: { name: { contains: q, mode: "insensitive" } } },
      ];
    }
  }

  const [data, total] = await Promise.all([
    prisma.inventory.findMany({
      where,
      include: { variant: { include: { product: true } } },
      orderBy: { updatedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.inventory.count({ where }),
  ]);

  return apiResponse("Inventories fetched", {
    data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
};

/**
 * Set stock to an exact value (admin operation)
 */
export const updateInventoryService = async (id: string, raw: unknown) => {
  const data: UpdateInventoryInput = UpdateInventorySchema.parse(raw);

  const inv = await prisma.inventory.update({
    where: { id },
    data: { stock: data.stock },
    include: { variant: { include: { product: true } } },
  });

  return apiResponse("Inventory updated", inv);
};

/**
 * Increase stock by qty (restock)
 */
export const increaseStockService = async (raw: unknown) => {
  const data: AdjustStockInput = AdjustStockSchema.parse(raw);

  // ensure inventory exists
  await ensureInventoryForVariantService(data.variantId);

  const inv = await prisma.inventory.update({
    where: { variantId: data.variantId },
    data: { stock: { increment: data.qty } },
    include: { variant: { include: { product: true } } },
  });

  return apiResponse("Stock increased", inv);
};

/**
 * Decrease stock by qty (admin/manual decrease)
 * - prevents negative stock
 */
export const decreaseStockService = async (raw: unknown) => {
  const data: AdjustStockInput = AdjustStockSchema.parse(raw);

  await ensureInventoryForVariantService(data.variantId);

  const updated = await prisma.inventory.updateMany({
    where: { variantId: data.variantId, stock: { gte: data.qty } },
    data: { stock: { decrement: data.qty } },
  });

  if (updated.count !== 1) {
    throw new ApiError("Insufficient stock", StatusCodes.BAD_REQUEST);
  }

  const inv = await prisma.inventory.findUnique({
    where: { variantId: data.variantId },
    include: { variant: { include: { product: true } } },
  });

  return apiResponse("Stock decreased", inv);
};

/**
 * Reserve stock for an order (atomic)
 * - pass a map of variantId => qty
 * - throws 409 if any stock isn't enough
 */
export const reserveStockService = async (
  items: Array<{ variantId: string; qty: number }>,
) => {
  if (!items.length) return;

  // Ensure all inventories exist
  await prisma.$transaction(async (tx) => {
    for (const it of items) {
      // make sure inventory exists for each variant
      const existing = await tx.inventory.findUnique({
        where: { variantId: it.variantId },
      });
      if (!existing) {
        // only create if variant exists
        const variant = await tx.productVariant.findUnique({
          where: { id: it.variantId },
        });
        if (!variant)
          throw new ApiError(
            `Variant not found: ${it.variantId}`,
            StatusCodes.NOT_FOUND,
          );
        await tx.inventory.create({
          data: { variantId: it.variantId, stock: 0 },
        });
      }
    }

    // Atomic decrements (prevents overselling)
    for (const it of items) {
      const res = await tx.inventory.updateMany({
        where: { variantId: it.variantId, stock: { gte: it.qty } },
        data: { stock: { decrement: it.qty } },
      });
      if (res.count !== 1) {
        throw new ApiError(
          `Stock changed. Variant ${it.variantId} is no longer available in requested quantity.`,
          StatusCodes.CONFLICT,
        );
      }
    }
  });
};

/**
 * Release stock back (for cancelled pending orders)
 */
export const releaseStockService = async (
  items: Array<{ variantId: string; qty: number }>,
) => {
  if (!items.length) return;

  await prisma.$transaction(async (tx) => {
    for (const it of items) {
      // If inventory row somehow missing, create then increment.
      const inv = await tx.inventory.findUnique({
        where: { variantId: it.variantId },
      });
      if (!inv) {
        const variant = await tx.productVariant.findUnique({
          where: { id: it.variantId },
        });
        if (!variant) continue; // if variant deleted, skip
        await tx.inventory.create({
          data: { variantId: it.variantId, stock: it.qty },
        });
      } else {
        await tx.inventory.update({
          where: { variantId: it.variantId },
          data: { stock: { increment: it.qty } },
        });
      }
    }
  });
};

/**
 * Delete inventory row (rare; only if you truly want it)
 */
export const deleteInventoryService = async (id: string) => {
  const inv = await prisma.inventory.findUnique({ where: { id } });
  if (!inv) throw new ApiError("Inventory not found", StatusCodes.NOT_FOUND);

  await prisma.inventory.delete({ where: { id } });
  return apiResponse("Inventory deleted", null);
};
