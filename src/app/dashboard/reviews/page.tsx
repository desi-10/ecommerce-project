"use client";

import { useGetReviews } from "@/client/reviews";
import { DataTable } from "@/components/data-table";
import { reviewColumns } from "@/columns/reviews";
import Wrapper from "@/components/wrapper";
import { AlertCircle, MessageSquare, Loader2 } from "lucide-react";

export default function ReviewsDashboardPage() {
  const { 
    data: response, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useGetReviews({ page: 1, limit: 100 });

  const reviews = response?.data?.reviews || [];

  return (
    <main>
      <Wrapper>
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Product Reviews</h1>
              <p className="text-sm text-gray-600 mt-2">
                Manage and respond to customer feedback for your products.
              </p>
            </div>
          </div>

          {isError && (
            <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4 border border-red-200 mb-6 font-medium text-red-900">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p>Failed to load reviews</p>
                <p className="text-sm text-red-700 mt-1">{(error as Error)?.message}</p>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
                <p className="text-neutral-500 font-medium animate-pulse">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">No reviews found</h3>
              <p className="text-sm text-gray-500 mt-2">Reviews will appear here once customers provide feedback on your products.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 font-sans">
              <DataTable 
                columns={reviewColumns(refetch)} 
                data={{ 
                    items: reviews,
                    pagination: response?.data?.pagination 
                }} 
              />
            </div>
          )}
        </div>
      </Wrapper>
    </main>
  );
}
