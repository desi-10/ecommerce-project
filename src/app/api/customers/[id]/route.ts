import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { handleApiError } from "@/lib/api-handler";
import { apiResponse } from "@/lib/api-response";
import { requireAdminServerSession } from "@/lib/auth-guards";

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
