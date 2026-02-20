"use client";

import { categoryColumns } from "@/columns/category.column";
import { CreateCategoryDialog } from "@/components/category/add-category";
import { DataTable } from "@/components/data-table";
import Wrapper from "@/components/wrapper";
import { useGetCategories } from "@/hooks/use-category";


export default function CategoriesDashboardPage() {
  const { data: productsData } = useGetCategories()
  const categories = productsData?.data.categories || []
  return (
    <main>
      <Wrapper>
        <div className="flex justify-between items-center">
          <h1>Categories</h1>
          <CreateCategoryDialog />
        </div>
        <DataTable columns={categoryColumns} data={{ items: categories }} />
      </Wrapper>
    </main>
  );
}
