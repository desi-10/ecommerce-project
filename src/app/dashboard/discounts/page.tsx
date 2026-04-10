"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetDiscounts } from "@/hooks/use-discount";
import { discountColumns } from "@/columns/discounts.columns";
import { AddDiscountDialog } from "@/components/discount/add-discount";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/data-table";

export default function DiscountsDashboardPage() {
  const [addOpen, setAddOpen] = useState(false);
  const { data: discountsData, refetch } = useGetDiscounts();

  const discounts = discountsData?.data?.discounts || [];

  return (
    <main>


      <section className="rounded-xl border p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium">Active Discounts</h2>
          <Button onClick={() => setAddOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Discount
          </Button>
        </div>
        <DataTable columns={discountColumns} data={{ items: discounts }} />
      </section>

      <AddDiscountDialog
        // open={addOpen}
        // onOpenChange={setAddOpen}
        onSuccess={() => refetch()}
      />
    </main>
  )
}
