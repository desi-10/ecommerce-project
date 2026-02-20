"use client";

import { inventoryColumns } from "@/columns/inventory";
import { DataTable } from "@/components/data-table";
import Wrapper from "@/components/wrapper";
import { useGetInventories } from "@/hooks/inventory";



export default function InventoryDashboardPage() {

  const { data: InventoriesData } = useGetInventories()
  const inventories = InventoriesData?.data.data || []

  return (
    <main>
      <Wrapper>
        <div className="flex justify-between items-center">
          <h1>Inventories</h1>
          {/* <CreateProductDialog /> */}
        </div>
        <DataTable columns={inventoryColumns} data={{ items: inventories }} />
      </Wrapper>
    </main>
  );
}
