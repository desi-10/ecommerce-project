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

    const discount = await prisma.discount.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });

    if (!discount) {
      return NextResponse.json(
        { status: "error", message: "Discount not found" },
        { status: 404 }
      );
    }

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

    const discount = await prisma.discount.update({
      where: { id },
      data: {
        ...(valid.discountPercent !== undefined && { discountPercent: valid.discountPercent }),
        ...(valid.startDate && { startDate: new Date(valid.startDate) }),
        ...(valid.endDate && { endDate: new Date(valid.endDate) }),
        ...(valid.status && { status: valid.status }),
      },
      include: {
        product: true,
      },
    });

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

    await prisma.discount.delete({
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
