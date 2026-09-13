import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { handleApiError } from "@/lib/api-handler";
import { apiResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error";
import { requireAdminServerSession } from "@/lib/auth-guards";
import StatusCodes from "http-status-codes";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const GET = async (req: Request, context: RouteContext) => {
  try {
    await requireAdminServerSession();
    const { id } = await context.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          include: {
            items: {
              include: {
                variant: {
                  include: {
                    product: true,
                  },
                },
              },
            },
            payments: true,
          },
        },
        profile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json(apiResponse("Customer fetched successfully", user));
  } catch (err) {
    return handleApiError(err);
  }
};

const ASSIGNABLE_ROLES = ["customer", "vendor", "admin"] as const;

/**
 * Vendor management: this is how a store owner turns a signed-up customer
 * into a vendor (or back). Product/inventory/order scoping everywhere else
 * (products.service.ts, inventory.service.ts, orders.service.ts) keys off
 * this same role field.
 */
export const PATCH = async (req: Request, context: RouteContext) => {
  try {
    await requireAdminServerSession();
    const { id } = await context.params;

    const body = await req.json();
    const role = body?.role;

    if (!ASSIGNABLE_ROLES.includes(role)) {
      throw new ApiError(
        `role must be one of: ${ASSIGNABLE_ROLES.join(", ")}`,
        StatusCodes.BAD_REQUEST,
      );
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json(apiResponse("Customer role updated successfully", updated));
  } catch (err) {
    return handleApiError(err);
  }
};
