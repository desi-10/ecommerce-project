"use client";

import { productColumns } from "@/columns/products";
import { DataTable } from "@/components/data-table";
import { CreateProductDialog } from "@/components/product/add-product";
import Wrapper from "@/components/wrapper";
import { useGetProducts } from "@/hooks/use-product";




export default function ProductsDashboardPage() {

  const { data: productsData } = useGetProducts()
  const products = productsData?.data.products || []

  return (
    <main>
      <Wrapper>
        <div className="flex justify-between items-center">
          <h1>Products</h1>
          <CreateProductDialog />
        </div>
        <DataTable columns={productColumns} data={{ items: products }} />
      </Wrapper>
    </main>
  );
}
