"use client";

import { useState } from "react";
import Wrapper from "@/components/wrapper";
import { DataTable } from "@/components/data-table";
import { useGetCoupons } from "@/hooks/use-coupon";
import { couponColumns } from "@/columns/coupons.columns";
import { Button } from "@/components/ui/button";
import { Plus, Ticket, AlertCircle, Loader2 } from "lucide-react";
import { AddCouponDialog } from "@/components/coupon/add-coupon-dialog";

export default function CouponsDashboardPage() {
  const [addOpen, setAddOpen] = useState(false);
  const { data: couponsData, isLoading, isError, error } = useGetCoupons();

  const coupons = couponsData?.data?.data || [];
  const activeCoupons = coupons.filter((c: any) => c.status === "ACTIVE").length;

  return (
    <main className="pb-12">
      <Wrapper>
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Coupons</h1>
            <p className="text-sm text-gray-500 mt-2 font-medium">Create and manage your promotional codes</p>
          </div>
          <Button 
            onClick={() => setAddOpen(true)}
            className="bg-blue-600 text-white hover:bg-blue-700 h-11 px-6 rounded-xl shadow-lg shadow-blue-100 transition-all font-bold gap-2"
          >
            <Plus className="h-5 w-5" />
            Create Coupon
          </Button>
        </div>

        {/* Quick Stats */}
        {!isLoading && coupons.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
               <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Ticket className="h-6 w-6" />
               </div>
               <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Coupons</p>
                  <p className="text-2xl font-black text-gray-900">{coupons.length}</p>
               </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-emerald-50 shadow-sm flex items-center gap-4">
               <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Plus className="h-6 w-6" />
               </div>
               <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-emerald-600/60">Active now</p>
                  <p className="text-2xl font-black text-gray-900">{activeCoupons}</p>
               </div>
            </div>
          </div>
        )}

        {isError && (
          <div className="flex items-start gap-3 rounded-2xl bg-red-50 p-6 border border-red-100 mb-8">
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-red-900">Failed to load coupons</p>
              <p className="text-sm text-red-700 mt-1">
                {error?.message || "There was an error fetching your promotional codes."}
              </p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-50 shadow-sm">
             <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
             <p className="text-gray-500 font-medium">Securing your promotions...</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="h-20 w-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
              <Ticket className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No coupons yet</h3>
            <p className="text-gray-500 mb-8 text-center max-w-sm font-medium px-4">
              Get started by creating your first promotional code to boost your sales
            </p>
            <Button 
                onClick={() => setAddOpen(true)}
                className="bg-blue-600 text-white hover:bg-blue-700 h-11 px-8 rounded-xl shadow-lg shadow-blue-100 transition-all font-bold gap-2"
            >
                <Plus className="h-5 w-5" />
                Add Your First Coupon
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
             <DataTable columns={couponColumns} data={{ items: coupons }} />
          </div>
        )}

        <AddCouponDialog 
          open={addOpen}
          onOpenChange={setAddOpen}
        />
      </Wrapper>
    </main>
  );
}
