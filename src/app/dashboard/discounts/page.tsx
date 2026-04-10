"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetDiscounts } from "@/hooks/use-discount";
import { discountColumns } from "@/columns/discounts.columns";
import { AddDiscountDialog } from "@/components/discount/add-discount";
import { Plus, AlertCircle, BadgePercent } from "lucide-react";
import { DataTable } from "@/components/data-table";
import Wrapper from "@/components/wrapper";

export default function DiscountsDashboardPage() {
  const [addOpen, setAddOpen] = useState(false);
  const { data: discountsData, refetch, isLoading, isError, error } = useGetDiscounts();

  const discounts = discountsData?.data?.discounts || [];
  const activeDiscounts = discounts.filter((d: any) => d.status === "ACTIVE").length;

  return (
    <main>
      <Wrapper>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Discounts</h1>
              <p className="text-sm text-gray-600 mt-2">Create and manage promotional discounts</p>
            </div>
            <Button 
              onClick={() => setAddOpen(true)} 
              className="text-white rounded-xl gap-2"
              style={{ backgroundColor: 'var(--primary-600)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-700)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-600)'}
            >
              <Plus className="h-4 w-4" />
              Add Discount
            </Button>
          </div>

          {/* Active Discounts Card */}
          {!isLoading && discounts.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Active Discounts</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{activeDiscounts}</p>
            </div>
          )}

          {isError && (
            <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4 border border-red-200 mb-6">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Failed to load discounts</p>
                <p className="text-sm text-red-700 mt-1">
                  {error?.message || "Unable to fetch discounts. Please try again later."}
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
          ) : discounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-dashed border-gray-300 bg-gray-50">
              <BadgePercent className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No discounts yet</h3>
              <p className="text-sm text-gray-600 mb-6 text-center max-w-sm">
                Create discounts to boost sales and attract more customers
              </p>
              <Button 
                onClick={() => setAddOpen(true)} 
                className="text-white rounded-xl gap-2"
                style={{ backgroundColor: 'var(--primary-600)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-700)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-600)'}
              >
                <Plus className="h-4 w-4" />
                Create First Discount
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border bg-white p-4">
              <DataTable columns={discountColumns} data={{ items: discounts }} />
            </div>
          )}
        </div>

        <AddDiscountDialog
          // open={addOpen}
          // onOpenChange={setAddOpen}
          onSuccess={() => refetch()}
        />
      </Wrapper>
    </main>
  )
}
