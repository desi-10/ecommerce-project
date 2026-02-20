"use client";

import Wrapper from "@/components/wrapper";
import { DataTable } from "@/components/data-table";
import { useGetOrders } from "@/hooks/use-order";
import { orderColumns } from "@/columns/orders.columns";


export default function OrdersDashboardPage() {
  const { data: productsData } = useGetOrders()
  const orders = productsData?.data.orders || []

  return (
    <main>
      <Wrapper>
        <div className="flex justify-between items-center">
          <h1>Orders</h1>
          {/* <CreateProductDialog /> */}
        </div>
        <DataTable columns={orderColumns} data={{ items: orders }} />
      </Wrapper>
    </main>
  );
}
