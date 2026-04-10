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

    const [total, discounts] = await prisma.$transaction([
      prisma.discount.count(),
      prisma.discount.findMany({
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        include: {
          product: true,
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

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

    const discount = await prisma.discount.create({
      data: {
        productId: valid.productId,
        discountPercent: valid.discountPercent,
        startDate: new Date(valid.startDate),
        endDate: new Date(valid.endDate),
        status: valid.status,
      },
      include: {
        product: true,
      },
    });

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
