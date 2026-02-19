"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DashboardDataTable } from "../_components/dashboard-data-table";
import { DashboardShell } from "../_components/dashboard-shell";
import { SummaryCards } from "../_components/summary-cards";

type PaymentRow = {
  id: string;
  reference: string;
  customer: string;
  provider: "CARD" | "MOMO" | "BANK";
  amount: string;
  status: "SUCCEEDED" | "PENDING" | "FAILED";
  createdAt: string;
};

const paymentRows: PaymentRow[] = [
  {
    id: "pay_001",
    reference: "TXN-6G71A",
    customer: "Ama Boateng",
    provider: "CARD",
    amount: "$148.00",
    status: "SUCCEEDED",
    createdAt: "2026-02-18",
  },
  {
    id: "pay_002",
    reference: "TXN-6G71B",
    customer: "Kwame Mensah",
    provider: "MOMO",
    amount: "$59.00",
    status: "PENDING",
    createdAt: "2026-02-18",
  },
  {
    id: "pay_003",
    reference: "TXN-6G71C",
    customer: "Esi Owusu",
    provider: "BANK",
    amount: "$215.00",
    status: "FAILED",
    createdAt: "2026-02-17",
  },
];

const columns: ColumnDef<PaymentRow>[] = [
  { accessorKey: "reference", header: "Reference" },
  { accessorKey: "customer", header: "Customer" },
  { accessorKey: "provider", header: "Provider" },
  { accessorKey: "amount", header: "Amount" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      if (status === "SUCCEEDED") return <Badge variant="secondary">SUCCEEDED</Badge>;
      if (status === "PENDING") return <Badge variant="outline">PENDING</Badge>;
      return <Badge variant="destructive">FAILED</Badge>;
    },
  },
  { accessorKey: "createdAt", header: "Date" },
];

export default function PaymentsDashboardPage() {
  const completedCount = paymentRows.filter(
    (row) => row.status === "SUCCEEDED",
  ).length;
  const pendingCount = paymentRows.filter((row) => row.status === "PENDING").length;

  return (
    <DashboardShell
      title="Payments"
      description="Track payment references, settlement status, and failures."
    >
      <SummaryCards
        cards={[
          { title: "Transactions", value: String(paymentRows.length) },
          { title: "Succeeded", value: String(completedCount) },
          { title: "Pending", value: String(pendingCount) },
          { title: "Failed", value: "1" },
        ]}
      />

      <section className="rounded-xl border p-4">
        <h2 className="text-base font-medium">Recent Transactions</h2>
        <DashboardDataTable columns={columns} rows={paymentRows} />
      </section>
    </DashboardShell>
  );
}
