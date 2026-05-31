import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { handleApiError } from "@/lib/api-handler";
import { apiResponse } from "@/lib/api-response";
import { requireAdminServerSession } from "@/lib/auth-guards";

export const GET = async () => {
  try {
    await requireAdminServerSession();

    // Fetch all users with their orders count and total spent amount
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        orders: {
          select: {
            total: true,
            status: true,
          },
        },
      },
    });

    const formattedCustomers = users.map((user) => {
      const orderCount = user.orders.length;
      const totalSpent = user.orders
        .filter((o) => o.status === "PAID" || o.status === "FULFILLED")
        .reduce((sum, o) => sum + (o.total?.toNumber() || 0), 0);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        createdAt: user.createdAt,
        orderCount,
        totalSpent,
      };
    });

    return NextResponse.json(apiResponse("Customers fetched successfully", formattedCustomers));
  } catch (err) {
    return handleApiError(err);
  }
};
