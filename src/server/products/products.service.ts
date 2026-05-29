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
import { generateEmbedding } from "../ai/embedding";
import { getPineconeIndex } from "@/lib/pinecone";

export const decimal = (n: number) => new Prisma.Decimal(n);
// --------------------------
// Common selectors
// --------------------------
const productSelect = {
  id: true,
  name: true,
  description: true,
  image: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  brand: true,
  categories: {
    select: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  },
  vendor: {
    select: {
      name: true,
    },
  },
  reviews: {
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
    },
  },
  images: {
    select: {
      id: true,
      url: true,
      publicId: true,
      alt: true,
      position: true,
    },
    orderBy: { position: "asc" as const },
  },
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

  // Generate embedding for search
  const embeddingText = `${data.name} ${data.description || ""}`;
  const embedding = await generateEmbedding(embeddingText);

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
        image: data.images?.[0]?.url ?? null,
        status: data.status,
      },
      select: { id: true },
    });

    if (embedding.length > 0) {
      const index = getPineconeIndex();
      await index.upsert({
        records: [
          {
            id: product.id,
            values: embedding,
            metadata: { name: data.name, description: data.description || "" },
          },
        ]
      });
    }

    if (data.categoryId) {
      await tx.productCategory.create({
        data: {
          productId: product.id,
          categoryId: data.categoryId,
        },
      });
    }

    if (data.images && data.images.length > 0) {
      await tx.productImage.createMany({
        data: data.images.map((img, index) => ({
          productId: product.id,
          url: img.url,
          publicId: img.id,
          position: index,
        })),
      });
    }

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
  const {
    page,
    limit,
    q,
    status,
    sort,
    category,
    categories,
    onDiscount,
    minPrice,
    maxPrice,
    ids,
  } = data;

  const categorySlugs = categories ?? (category ? [category] : undefined);

  const where: Prisma.ProductWhereInput = {
    ...(ids && ids.length > 0 && { id: { in: ids } }),
    ...(status && { status }),
    ...(q && {
      name: {
        contains: q,
        mode: "insensitive",
      },
    }),
    ...(categorySlugs && categorySlugs.length > 0 && {
      categories: {
        some: {
          category: {
            slug: { in: categorySlugs },
          },
        },
      },
    }),
    ...(onDiscount && {
      variants: {
        some: {
          salePrice: {
            gt: 0,
          },
        },
      },
    }),
    ...((minPrice !== undefined || maxPrice !== undefined) && {
      variants: {
        some: {
          AND: [
            ...(minPrice !== undefined ? [{ price: { gte: minPrice } }] : []),
            ...(maxPrice !== undefined ? [{ price: { lte: maxPrice } }] : []),
          ],
        },
      },
    }),
  };

  let orderBy: any = { createdAt: "desc" };
  if (sort === "name_asc") orderBy = { name: "asc" };
  else if (sort === "name_desc") orderBy = { name: "desc" };
  else if (sort === "oldest") orderBy = { createdAt: "asc" };
  else if (sort === "price_asc") {
    orderBy = {
      variants: {
        _min: {
          price: "asc",
        },
      },
    };
  } else if (sort === "price_desc") {
    orderBy = {
      variants: {
        _min: {
          price: "desc",
        },
      },
    };
  }

  try {
    const [total, products] = await Promise.all([
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
  } catch (error: any) {
    console.error("[getProductsService] Primary Query Failed:", error.message);
    
    // Fallback if aggregate sort or complex where failed
    const [total, products] = await Promise.all([
      prisma.product.count({ where: { status: "ACTIVE" } }),
      prisma.product.findMany({
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: productSelect,
      }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return apiResponse("Products fetched successfully (safe mode)", {
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
  }
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
  // If name or description changed, regenerate embedding
  let embedding: number[] | null = null;
  if (data.name !== undefined || data.description !== undefined) {
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      select: { name: true, description: true },
    });
    
    if (existingProduct) {
      const name = data.name ?? existingProduct.name;
      const description = data.description ?? existingProduct.description;
      embedding = await generateEmbedding(`${name} ${description || ""}`);
    }
  }

  const updated = await prisma.$transaction(async (tx) => {
    const existing = await tx.product.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing)
      throw new ApiError("Product not found", StatusCodes.NOT_FOUND);

    // update product core
    const updatedProduct = await tx.product.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.description !== undefined
          ? { description: data.description ?? null }
          : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
      },
      select: { id: true, name: true, description: true },
    });

    if (embedding && embedding.length > 0) {
      const index = getPineconeIndex();
      await index.upsert({
        records: [
          {
            id: id,
            values: embedding,
            metadata: { 
              name: updatedProduct.name, 
              description: updatedProduct.description || "" 
            },
          },
        ]
      });
    }

    if (data.categoryId !== undefined) {
      await tx.productCategory.deleteMany({ where: { productId: id } });
      if (data.categoryId) {
        await tx.productCategory.create({
          data: {
            productId: id,
            categoryId: data.categoryId,
          },
        });
      }
    }

    if (data.images !== undefined) {
      await tx.productImage.deleteMany({ where: { productId: id } });
      if (data.images.length > 0) {
        await tx.productImage.createMany({
          data: data.images.map((img, index) => ({
            productId: id,
            url: img.url,
            publicId: img.id,
            position: index,
          })),
        });

        // Set first image as main product image
        await tx.product.update({
          where: { id },
          data: { image: data.images[0].url },
        });
      }
    }

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

  // Remove from Pinecone
  try {
    const index = getPineconeIndex();
    await index.deleteOne(id);
  } catch (error) {
    console.error("Failed to delete from Pinecone:", error);
  }

  return apiResponse("Product deleted successfully", null);
};
