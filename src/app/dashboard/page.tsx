"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DashboardDataTable } from "./_components/dashboard-data-table";
import { DashboardShell } from "./_components/dashboard-shell";
import { SummaryCards } from "./_components/summary-cards";

type RecentOrderRow = {
  id: string;
  orderNo: string;
  customer: string;
  total: string;
  status: "PENDING" | "PAID" | "FULFILLED" | "CANCELLED";
  createdAt: string;
};

const recentOrders: RecentOrderRow[] = [
  {
    id: "ord_001",
    orderNo: "ORD-1024",
    customer: "Ama Boateng",
    total: "$148.00",
    status: "PAID",
    createdAt: "2026-02-18",
  },
  {
    id: "ord_002",
    orderNo: "ORD-1025",
    customer: "Kwame Mensah",
    total: "$59.00",
    status: "PENDING",
    createdAt: "2026-02-18",
  },
  {
    id: "ord_003",
    orderNo: "ORD-1026",
    customer: "Esi Owusu",
    total: "$215.00",
    status: "FULFILLED",
    createdAt: "2026-02-17",
  },
  {
    id: "ord_004",
    orderNo: "ORD-1027",
    customer: "Kojo Antwi",
    total: "$32.00",
    status: "CANCELLED",
    createdAt: "2026-02-16",
  },
];

const columns: ColumnDef<RecentOrderRow>[] = [
  {
    accessorKey: "orderNo",
    header: "Order",
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "total",
    header: "Total",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      if (status === "PAID" || status === "FULFILLED") {
        return <Badge variant="secondary">{status}</Badge>;
      }
      if (status === "PENDING") {
        return <Badge variant="outline">{status}</Badge>;
      }
      return <Badge variant="destructive">{status}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
];

export default function DashboardOverviewPage() {
  return (
    <DashboardShell
      title="Overview"
      description="Quick snapshot of your store performance and recent orders."
    >
      <SummaryCards
        cards={[
          {
            title: "Revenue (30d)",
            value: "$42,860",
            subtitle: "+8.2% vs last month",
          },
          { title: "Orders (30d)", value: "1,248", subtitle: "42 pending" },
          { title: "Active Products", value: "386", subtitle: "17 low stock" },
          { title: "Refund Rate", value: "1.2%", subtitle: "Healthy range" },
        ]}
      />

      <section className="rounded-xl border p-4">
        <h2 className="text-base font-medium">Recent Orders</h2>
        <DashboardDataTable columns={columns} rows={recentOrders} />
      </section>
    </DashboardShell>
  );
}
