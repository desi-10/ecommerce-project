// app/account/orders/page.tsx
"use client";

import Link from "next/link";
import { useGetUserOrders } from "@/hooks/use-account";
import { Package, ChevronRight, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { ProductListSkeleton } from "../ui/skeletons";

export default function OrdersPage() {
  const { data: ordersData, isLoading, isError } = useGetUserOrders();
  const orders = ordersData?.data || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
      case "FULFILLED":
        return "text-green-600 bg-green-50 border-green-100";
      case "PENDING":
        return "text-amber-600 bg-amber-50 border-amber-100";
      case "CANCELLED":
      case "FAILED":
        return "text-red-600 bg-red-50 border-red-100";
      default:
        return "text-neutral-600 bg-neutral-50 border-neutral-100";
    }
  };

  if (isLoading) {
    return <ProductListSkeleton count={4} />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-neutral-900">
          Failed to load orders
        </h3>
        <p className="text-sm text-neutral-600 mt-1">
          There was an error fetching your order history.
        </p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="mt-6 rounded-md shadow-sm"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <main className="bg-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Order History</h1>
          <p className="text-sm text-neutral-600 mt-1">
            Track and manage your recent purchases.
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-md border-2 border-dashed border-neutral-200 bg-neutral-50/30 shadow-sm">
          <div className="h-20 w-20 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
            <Package className="h-10 w-10 text-neutral-300" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900">No orders yet</h3>
          <p className="text-neutral-500 text-sm mt-2 max-w-xs text-center">
            Looks like you haven&apos;t placed any orders yet. Start shopping to
            build your history!
          </p>
          <Button
            asChild
            className="mt-8 rounded-md bg-blue-600 hover:bg-blue-700 px-8 shadow-sm"
          >
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="group block bg-white border border-neutral-200 rounded-md p-5 shadow-sm hover:border-blue-200 hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-md bg-neutral-50 flex items-center justify-center border border-neutral-100 shrink-0">
                    <Package className="h-6 w-6 text-neutral-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-900">
                      Order #{order.id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {order.createdAt ? new Intl.DateTimeFormat("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }).format(new Date(order.createdAt)) : "Date N/A"}{" "}
                      • {order._count?.items ?? order.items?.length ?? 0}{" "}
                      {(order._count?.items ?? order.items?.length ?? 0) === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      Total
                    </p>
                    <p className="text-base font-bold text-neutral-900 mt-0.5">
                      {order.currency} {parseFloat(order.total).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div
                      className={`px-3 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wide ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </div>
                    <ChevronRight className="h-5 w-5 text-neutral-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
