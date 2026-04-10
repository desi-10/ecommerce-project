"use client";

import { productColumns } from "@/columns/products";
import { DataTable } from "@/components/data-table";
import Wrapper from "@/components/wrapper";
import { useGetProducts } from "@/hooks/use-product";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function ProductsDashboardPage() {

  const { data: productsData } = useGetProducts()
  const products = productsData?.data.products || []

  return (
    <main>
      <Wrapper>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <Button asChild>
            <Link href="/dashboard/products/new" className="gap-2">
              <Plus className="w-4 h-4" /> New Product
            </Link>
          </Button>
        </div>
        <DataTable columns={productColumns} data={{ items: products }} />
      </Wrapper>
    </main>
  );
}
