"use client";

import Wrapper from "@/components/wrapper";
import { DataTable } from "@/components/data-table";
import { useGetCustomers } from "@/hooks/use-customer";
import { customerColumns } from "@/columns/customers.columns";
import { AlertCircle, Users } from "lucide-react";

export default function CustomersDashboardPage() {
  const { data: response, isLoading, isError, error } = useGetCustomers();
  const customers = response?.data || [];

  return (
    <main>
      <Wrapper>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Customers</h1>
              <p className="text-sm text-gray-600 mt-2">View and manage customer accounts and order histories</p>
            </div>
          </div>

          {isError && (
            <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4 border border-red-200 mb-6">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Failed to load customers</p>
                <p className="text-sm text-red-700 mt-1">
                  {error?.message || "Unable to fetch customers. Please try again later."}
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
          ) : customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-dashed border-gray-300 bg-gray-50">
              <Users className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No customers yet</h3>
              <p className="text-sm text-gray-600 mb-6 text-center max-w-sm">
                Customers will appear here once users register or checkout on your store
              </p>
            </div>
          ) : (
            <DataTable columns={customerColumns} data={{ items: customers }} />
          )}
        </div>
      </Wrapper>
    </main>
  );
}
