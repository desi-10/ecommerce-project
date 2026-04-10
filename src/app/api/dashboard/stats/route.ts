import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { handleApiError } from "@/lib/api-handler";
import { apiResponse } from "@/lib/api-response";

export const GET = async () => {
  try {
    // 1. Total Revenue (Sum of PAID orders)
    const revenueResult = await prisma.order.aggregate({
      where: { status: "PAID" },
      _sum: { total: true },
    });
    const totalRevenue = revenueResult._sum.total?.toNumber() || 0;

    // 2. Total Sales (Count of PAID orders)
    const totalSales = await prisma.order.count({
      where: { status: "PAID" },
    });

    // 3. Active Users (Count of all users)
    const activeUsers = await prisma.user.count();

    // 4. Average Order Value
    const avgOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

    // 5. Recent Orders (Last 5)
    const recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Formatting metrics to match display
    const metrics = [
      {
        title: "Total Revenue",
        value: `$${totalRevenue.toLocaleString()}`,
        change: "+0%", // To be implemented with historical data if needed
        trend: "up",
        icon: "DollarSign",
      },
      {
        title: "Active Users",
        value: `+${activeUsers.toLocaleString()}`,
        change: "+0%",
        trend: "up",
        icon: "Users",
      },
      {
        title: "Sales",
        value: `+${totalSales.toLocaleString()}`,
        change: "+0%",
        trend: "up",
        icon: "CreditCard",
      },
      {
        title: "Avg Order Value",
        value: `$${avgOrderValue.toFixed(2)}`,
        change: "+0%",
        trend: "up",
        icon: "Activity",
      },
    ];

    return NextResponse.json(apiResponse("Stats fetched successfully", {
        metrics,
        recentOrders
    }));
  } catch (err) {
    return handleApiError(err);
  }
};
