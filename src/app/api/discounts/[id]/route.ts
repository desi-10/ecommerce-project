import { NextResponse } from "next/server";
import { validateOrThrow } from "@/lib/validator";
import { handleApiError } from "@/lib/api-handler";
import prisma from "@/lib/db";
import { z } from "zod";

const updateDiscountSchema = z.object({
  discountPercent: z.number().min(0).max(100).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const d = await prisma.productDiscount.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });

    if (!d) {
      return NextResponse.json(
        { status: "error", message: "Discount not found" },
        { status: 404 }
      );
    }

    const discount = {
      id: d.id,
      productId: d.productId,
      discountPercent: Number(d.value),
      startDate: d.startsAt,
      endDate: d.endsAt,
      status: d.status,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      product: d.product,
    };

    return NextResponse.json({
      status: "success",
      message: "Discount fetched successfully",
      data: { discount },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const valid = validateOrThrow(updateDiscountSchema, body);

    const updatedDiscount = await prisma.productDiscount.update({
      where: { id },
      data: {
        ...(valid.discountPercent !== undefined && { value: valid.discountPercent }),
        ...(valid.startDate && { startsAt: new Date(valid.startDate) }),
        ...(valid.endDate && { endsAt: new Date(valid.endDate) }),
        ...(valid.status && { status: valid.status }),
      },
      include: {
        product: true,
      },
    });

    const discount = {
      id: updatedDiscount.id,
      productId: updatedDiscount.productId,
      discountPercent: Number(updatedDiscount.value),
      startDate: updatedDiscount.startsAt,
      endDate: updatedDiscount.endsAt,
      status: updatedDiscount.status,
      createdAt: updatedDiscount.createdAt,
      updatedAt: updatedDiscount.updatedAt,
      product: updatedDiscount.product,
    };

    return NextResponse.json({
      status: "success",
      message: "Discount updated successfully",
      data: { discount },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    await prisma.productDiscount.delete({
      where: { id },
    });

    return NextResponse.json({
      status: "success",
      message: "Discount deleted successfully",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
