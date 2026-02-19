"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DashboardDataTable } from "../_components/dashboard-data-table";
import { DashboardShell } from "../_components/dashboard-shell";
import { SummaryCards } from "../_components/summary-cards";

type OrderRow = {
  id: string;
  orderNo: string;
  customer: string;
  items: number;
  amount: string;
  status: "PENDING" | "PAID" | "FULFILLED" | "REFUNDED";
};

const orderRows: OrderRow[] = [
  {
    id: "o_1001",
    orderNo: "ORD-1001",
    customer: "Nana Asante",
    items: 3,
    amount: "$180.00",
    status: "PAID",
  },
  {
    id: "o_1002",
    orderNo: "ORD-1002",
    customer: "Adwoa Yeboah",
    items: 1,
    amount: "$42.00",
    status: "PENDING",
  },
  {
    id: "o_1003",
    orderNo: "ORD-1003",
    customer: "Daniel Tetteh",
    items: 2,
    amount: "$99.00",
    status: "FULFILLED",
  },
  {
    id: "o_1004",
    orderNo: "ORD-1004",
    customer: "Mavis Koranteng",
    items: 1,
    amount: "$29.00",
    status: "REFUNDED",
  },
];

const columns: ColumnDef<OrderRow>[] = [
  { accessorKey: "orderNo", header: "Order" },
  { accessorKey: "customer", header: "Customer" },
  { accessorKey: "items", header: "Items" },
  { accessorKey: "amount", header: "Amount" },
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
];

export default function OrdersDashboardPage() {
  const paidOrders = orderRows.filter((row) => row.status === "PAID").length;
  const pendingOrders = orderRows.filter(
    (row) => row.status === "PENDING",
  ).length;

  return (
    <DashboardShell
      title="Orders"
      description="Monitor order flow from pending payment to fulfillment."
    >
      <SummaryCards
        cards={[
          { title: "Total Orders", value: String(orderRows.length) },
          { title: "Paid", value: String(paidOrders) },
          { title: "Pending", value: String(pendingOrders) },
          { title: "Refunded", value: "1" },
        ]}
      />

      <section className="rounded-xl border p-4">
        <h2 className="text-base font-medium">Order Activity</h2>
        <DashboardDataTable columns={columns} rows={orderRows} />
      </section>
    </DashboardShell>
  );
}
