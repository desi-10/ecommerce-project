"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardDataTable } from "../_components/dashboard-data-table";
import { DashboardShell } from "../_components/dashboard-shell";
import { SummaryCards } from "../_components/summary-cards";
import { useGetDiscounts } from "@/hooks/use-discount";
import { discountColumns } from "@/columns/discounts.columns";
import { AddDiscountDialog } from "@/components/discount/add-discount";
import { Plus } from "lucide-react";

export default function DiscountsDashboardPage() {
  const [addOpen, setAddOpen] = useState(false);
  const { data: discountsData, refetch } = useGetDiscounts();
  
  const discounts = discountsData?.data?.discounts || [];
  const activeCount = discounts.filter((d: any) => d.status === "ACTIVE").length;

  return (
    <DashboardShell
      title="Discounts"
      description="Manage product discounts and monitor active campaigns."
    >
      <SummaryCards
        cards={[
          { title: "Total Discounts", value: String(discounts.length) },
          { title: "Active", value: String(activeCount) },
          { title: "Inactive", value: String(discounts.length - activeCount) },
          { title: "Total Products", value: String(new Set(discounts.map((d: any) => d.productId)).size) },
        ]}
      />

      <section className="rounded-xl border p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium">Active Discounts</h2>
          <Button onClick={() => setAddOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Discount
          </Button>
        </div>
        <DashboardDataTable columns={discountColumns} rows={discounts} />
      </section>

      <AddDiscountDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSuccess={() => refetch()}
      />
    </DashboardShell>
  );
}
