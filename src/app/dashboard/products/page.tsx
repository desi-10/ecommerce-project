"use client";

import { productColumns } from "@/columns/products";
import { DataTable } from "@/components/data-table";
import Wrapper from "@/components/wrapper";
import { useGetProducts } from "@/hooks/use-product";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, AlertCircle, Package } from "lucide-react";

export default function ProductsDashboardPage() {
  const { data: productsData, isLoading, isError, error } = useGetProducts();
  const products = productsData?.data.products || [];

  return (
    <main>
      <Wrapper>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Products</h1>
              <p className="text-sm text-gray-600 mt-2">Manage your product catalog</p>
            </div>
            <Button 
              asChild 
              className="text-white rounded-md shadow-sm"
              style={{ backgroundColor: 'var(--primary-600)' }}
            >
              <Link 
                href="/dashboard/products/new" 
                className="gap-2"
                onMouseEnter={(e) => {
                  const btn = e.currentTarget.closest('button') as HTMLButtonElement;
                  if (btn) btn.style.backgroundColor = 'var(--primary-700)';
                }}
                onMouseLeave={(e) => {
                  const btn = e.currentTarget.closest('button') as HTMLButtonElement;
                  if (btn) btn.style.backgroundColor = 'var(--primary-600)';
                }}
              >
                <Plus className="w-4 h-4" /> Add Product
              </Link>
            </Button>
          </div>

          {isError && (
            <div className="flex items-start gap-3 rounded-md bg-red-50 p-4 border border-red-200 mb-6 shadow-sm">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Failed to load products</p>
                <p className="text-sm text-red-700 mt-1">
                  {error?.message || "Unable to fetch products. Please try again later."}
                </p>
              </div>
            </div>
          )}

          {!isLoading && products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 rounded-md border border-dashed border-gray-300 bg-gray-50 shadow-sm">
              <Package className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
              <p className="text-sm text-gray-600 mb-6 text-center max-w-sm">
                Get started by creating your first product to begin selling online
              </p>
              <Button 
                asChild 
                className="text-white rounded-md shadow-sm"
                style={{ backgroundColor: 'var(--primary-600)' }}
              >
                <Link 
                  href="/dashboard/products/new" 
                  className="gap-2"
                  onMouseEnter={(e) => {
                    const btn = e.currentTarget.closest('button') as HTMLButtonElement;
                    if (btn) btn.style.backgroundColor = 'var(--primary-700)';
                  }}
                  onMouseLeave={(e) => {
                    const btn = e.currentTarget.closest('button') as HTMLButtonElement;
                    if (btn) btn.style.backgroundColor = 'var(--primary-600)';
                  }}
                >
                  <Plus className="w-4 h-4" /> Create First Product
                </Link>
              </Button>
            </div>
          ) : (
            <DataTable columns={productColumns} data={{ items: products }} isLoading={isLoading} />
          )}
        </div>
      </Wrapper>
    </main>
  );
}
