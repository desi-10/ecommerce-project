import { NextResponse } from "next/server";
import { validateOrThrow } from "@/lib/validator";
import { handleApiError } from "@/lib/api-handler";
import { z } from "zod";
import prisma from "@/lib/db";

const listDiscountsSchema = z.object({
  page: z
    .preprocess((v) => parseInt(String(v)), z.number().int().min(1))
    .default(1),
  limit: z
    .preprocess((v) => parseInt(String(v)), z.number().int().min(1).max(100))
    .default(20),
});

const createDiscountSchema = z.object({
  productId: z.string().min(1),
  discountPercent: z.number().min(0).max(100),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const rawQuery = Object.fromEntries(url.searchParams.entries());
    const query = validateOrThrow(listDiscountsSchema, rawQuery);

    const [total, productDiscounts] = await prisma.$transaction([
      prisma.productDiscount.count(),
      prisma.productDiscount.findMany({
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        include: {
          product: true,
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const discounts = productDiscounts.map((d) => ({
      id: d.id,
      productId: d.productId,
      discountPercent: Number(d.value),
      startDate: d.startsAt,
      endDate: d.endsAt,
      status: d.status,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      product: d.product,
    }));

    const totalPages = Math.max(1, Math.ceil(total / query.limit));

    return NextResponse.json({
      status: "success",
      message: "Discounts fetched successfully",
      data: {
        discounts,
        pagination: {
          page: query.page,
          limit: query.limit,
          total,
          totalPages,
          hasNext: query.page < totalPages,
          hasPrev: query.page > 1,
        },
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const valid = validateOrThrow(createDiscountSchema, body);

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: valid.productId },
    });

    if (!product) {
      return NextResponse.json(
        { status: "error", message: "Product not found" },
        { status: 404 },
      );
    }

    const createdDiscount = await prisma.productDiscount.create({
      data: {
        productId: valid.productId,
        type: "PERCENT",
        value: valid.discountPercent,
        startsAt: new Date(valid.startDate),
        endsAt: new Date(valid.endDate),
        status: valid.status,
      },
      include: {
        product: true,
      },
    });

    const discount = {
      id: createdDiscount.id,
      productId: createdDiscount.productId,
      discountPercent: Number(createdDiscount.value),
      startDate: createdDiscount.startsAt,
      endDate: createdDiscount.endsAt,
      status: createdDiscount.status,
      createdAt: createdDiscount.createdAt,
      updatedAt: createdDiscount.updatedAt,
      product: createdDiscount.product,
    };

    return NextResponse.json(
      {
        status: "success",
        message: "Discount created successfully",
        data: { discount },
      },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
