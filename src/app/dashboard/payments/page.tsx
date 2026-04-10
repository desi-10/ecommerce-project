"use client";

import { paymentColumns } from "@/columns/payment";
import { DataTable } from "@/components/data-table";
import Wrapper from "@/components/wrapper";
import { useGetPayments } from "@/hooks/use-payment";
import { AlertCircle, CreditCard } from "lucide-react";
import { formatGHS } from "@/lib/currency";

export default function PaymentsDashboardPage() {
  const { data: paymentsData, isLoading, isError, error } = useGetPayments();
  const payments = paymentsData?.data.payments || [];

  // Calculate payment stats
  const totalPayments = payments.reduce((sum, p: any) => sum + (Number(p.amount) || 0), 0);
  const successfulPayments = payments.filter((p: any) => p.status === "SUCCESS").length;
  const failedPayments = payments.filter((p: any) => p.status === "FAILED").length;

  return (
    <main>
      <Wrapper>
        <div className="mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Payments</h1>
            <p className="text-sm text-gray-600 mt-2">Track and manage customer payments</p>
          </div>

          {/* Payment Stats Cards */}
          {!isLoading && payments.length > 0 && (
            <div className="grid gap-4 md:grid-cols-3 mt-6 mb-6">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Total Payments</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{formatGHS(totalPayments, false)}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Successful</p>
                <p className="text-2xl font-bold text-emerald-600 mt-2">{successfulPayments}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-xs font-medium text-red-600 uppercase tracking-wide">Failed</p>
                <p className="text-2xl font-bold text-red-600 mt-2">{failedPayments}</p>
              </div>
            </div>
          )}

          {isError && (
            <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4 border border-red-200 mb-6">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Failed to load payments</p>
                <p className="text-sm text-red-700 mt-1">
                  {error?.message || "Unable to fetch payments. Please try again later."}
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
          ) : payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-dashed border-gray-300 bg-gray-50">
              <CreditCard className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No payments yet</h3>
              <p className="text-sm text-gray-600 mb-6 text-center max-w-sm">
                Payment records will appear here once transactions are processed
              </p>
            </div>
          ) : (
            <DataTable columns={paymentColumns} data={{ items: payments }} />
          )}
        </div>
      </Wrapper>
    </main>
  );
}
