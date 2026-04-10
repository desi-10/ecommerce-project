"use client";

import { inventoryColumns } from "@/columns/inventory";
import { DataTable } from "@/components/data-table";
import Wrapper from "@/components/wrapper";
import { useGetInventories } from "@/hooks/inventory";
import { AlertCircle, Package, AlertTriangle } from "lucide-react";

export default function InventoryDashboardPage() {
  const { data: InventoriesData, isLoading, isError, error } = useGetInventories();
  const inventories = InventoriesData?.data.data || [];

  // Calculate inventory stats
  const totalItems = inventories.reduce((sum, i: any) => sum + (Number(i.quantity) || Number(i.stock) || 0), 0);
  const lowStock = inventories.filter((i: any) => {
    const quantity = Number(i.quantity) || Number(i.stock) || 0;
    return quantity > 0 && quantity <= 10;
  }).length;
  const outOfStock = inventories.filter((i: any) => {
    const quantity = Number(i.quantity) || Number(i.stock) || 0;
    return quantity === 0;
  }).length;

  return (
    <main>
      <Wrapper>
        <div className="mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Inventory</h1>
            <p className="text-sm text-gray-600 mt-2">Monitor and manage your stock levels</p>
          </div>

          {/* Inventory Stats Cards */}
          {!isLoading && inventories.length > 0 && (
            <div className="grid gap-4 md:grid-cols-3 mt-6 mb-6">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Total Items</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{totalItems.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-xl border border-yellow-200 p-4">
                <p className="text-xs font-medium text-yellow-600 uppercase tracking-wide">Low Stock</p>
                <div className="flex items-center gap-2 mt-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <p className="text-2xl font-bold text-yellow-600">{lowStock}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-red-200 p-4">
                <p className="text-xs font-medium text-red-600 uppercase tracking-wide">Out of Stock</p>
                <div className="flex items-center gap-2 mt-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <p className="text-2xl font-bold text-red-600">{outOfStock}</p>
                </div>
              </div>
            </div>
          )}

          {isError && (
            <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4 border border-red-200 mb-6">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Failed to load inventory</p>
                <p className="text-sm text-red-700 mt-1">
                  {error?.message || "Unable to fetch inventory. Please try again later."}
                </p>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : inventories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-dashed border-gray-300 bg-gray-50">
              <Package className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No inventory items</h3>
              <p className="text-sm text-gray-600 mb-6 text-center max-w-sm">
                Inventory will appear here once you have products with stock tracking enabled
              </p>
            </div>
          ) : (
            <DataTable columns={inventoryColumns} data={{ items: inventories }} />
          )}
        </div>
      </Wrapper>
    </main>
  );
}
