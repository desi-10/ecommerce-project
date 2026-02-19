"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DashboardDataTable } from "../_components/dashboard-data-table";
import { DashboardShell } from "../_components/dashboard-shell";
import { SummaryCards } from "../_components/summary-cards";

type DiscountRow = {
  id: string;
  code: string;
  type: "PERCENT" | "AMOUNT";
  value: string;
  usage: string;
  status: "ACTIVE" | "INACTIVE";
  expiresAt: string;
};

const discountRows: DiscountRow[] = [
  {
    id: "d_001",
    code: "WELCOME10",
    type: "PERCENT",
    value: "10%",
    usage: "128 / 500",
    status: "ACTIVE",
    expiresAt: "2026-03-15",
  },
  {
    id: "d_002",
    code: "SHIPFREE",
    type: "AMOUNT",
    value: "$5.00",
    usage: "74 / 200",
    status: "ACTIVE",
    expiresAt: "2026-02-28",
  },
  {
    id: "d_003",
    code: "FLASH20",
    type: "PERCENT",
    value: "20%",
    usage: "200 / 200",
    status: "INACTIVE",
    expiresAt: "2026-02-10",
  },
];

const columns: ColumnDef<DiscountRow>[] = [
  { accessorKey: "code", header: "Code" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "value", header: "Value" },
  { accessorKey: "usage", header: "Usage" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) =>
      row.original.status === "ACTIVE" ? (
        <Badge variant="secondary">ACTIVE</Badge>
      ) : (
        <Badge variant="outline">INACTIVE</Badge>
      ),
  },
  { accessorKey: "expiresAt", header: "Expires" },
];

export default function DiscountsDashboardPage() {
  const activeCount = discountRows.filter((row) => row.status === "ACTIVE").length;

  return (
    <DashboardShell
      title="Discounts"
      description="Manage coupon campaigns and monitor usage against limits."
    >
      <SummaryCards
        cards={[
          { title: "Total Discounts", value: String(discountRows.length) },
          { title: "Active", value: String(activeCount) },
          { title: "Redeemed", value: "402" },
          { title: "Expiring Soon", value: "1" },
        ]}
      />

      <section className="rounded-xl border p-4">
        <h2 className="text-base font-medium">Coupon Campaigns</h2>
        <DashboardDataTable columns={columns} rows={discountRows} />
      </section>
    </DashboardShell>
  );
}
