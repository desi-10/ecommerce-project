import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { handleApiError } from "@/lib/api-handler";
import { apiResponse } from "@/lib/api-response";

export const GET = async () => {
  try {
    // 1. Total Revenue (Sum of PAID, FULFILLED orders)
    const revenueResult = await prisma.order.aggregate({
      where: { status: { in: ["PAID", "FULFILLED"] } },
      _sum: { total: true },
    });
    const totalRevenue = revenueResult._sum?.total?.toNumber() || 0;

    // 2. Total Sales (Count of PAID, FULFILLED orders)
    const totalSales = await prisma.order.count({
      where: { status: { in: ["PAID", "FULFILLED"] } },
    });

    // 3. Total Orders (All orders in system)
    const totalOrders = await prisma.order.count();

    // 4. Active Users (Count of all users)
    const activeUsers = await prisma.user.count();

    // 5. Average Order Value
    const avgOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

    // 5.1. Pending Orders Count
    const pendingOrders = await prisma.order.count({
      where: { status: "PENDING" },
    });

    // 5.2. Cancelled Orders Count
    const cancelledOrders = await prisma.order.count({
      where: { status: "CANCELLED" },
    });

    // 6. Recent Orders (Last 5)
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
        value: totalRevenue,
        change: "+0%", // To be implemented with historical data if needed
        trend: "up",
        icon: "DollarSign",
      },
      {
        title: "Active Users",
        value: activeUsers,
        change: "+0%",
        trend: "up",
        icon: "Users",
      },
      {
        title: "Sales",
        value: totalSales,
        change: "+0%",
        trend: "up",
        icon: "CreditCard",
      },
      {
        title: "Avg Order Value",
        value: avgOrderValue,
        change: "+0%",
        trend: "up",
        icon: "Activity",
      },
    ];

    return NextResponse.json(apiResponse("Stats fetched successfully", {
        metrics,
        recentOrders,
        totalRevenue,
        totalSales,
        totalOrders,
        activeUsers,
        avgOrderValue,
        pendingOrders,
        cancelledOrders,
    }));
  } catch (err) {
    return handleApiError(err);
  }
};
