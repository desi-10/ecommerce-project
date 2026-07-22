"use client";

import Wrapper from "@/components/wrapper";
import { DataTable } from "@/components/data-table";
import { useGetOrders } from "@/hooks/use-order";
import { orderColumns } from "@/columns/orders.columns";
import { AlertCircle, ShoppingBag } from "lucide-react";

export default function OrdersDashboardPage() {
  const { data: productsData, isLoading, isError, error } = useGetOrders();
  const orders = productsData?.data.orders || [];

  return (
    <main>
      <Wrapper>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Orders</h1>
              <p className="text-sm text-gray-600 mt-2">Manage and track customer orders</p>
            </div>
          </div>

          {isError && (
            <div className="flex items-start gap-3 rounded-md bg-red-50 p-4 border border-red-200 mb-6 shadow-sm">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Failed to load orders</p>
                <p className="text-sm text-red-700 mt-1">
                  {error?.message || "Unable to fetch orders. Please try again later."}
                </p>
              </div>
            </div>
          )}

          {!isLoading && orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 rounded-md border border-dashed border-gray-300 bg-gray-50 shadow-sm">
              <ShoppingBag className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
              <p className="text-sm text-gray-600 mb-6 text-center max-w-sm">
                Orders will appear here once your customers start making purchases
              </p>
            </div>
          ) : (
            <DataTable columns={orderColumns} data={{ items: orders }} isLoading={isLoading} />
          )}
        </div>
      </Wrapper>
    </main>
  );
}
