"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DashboardDataTable } from "../_components/dashboard-data-table";
import { DashboardShell } from "../_components/dashboard-shell";
import { SummaryCards } from "../_components/summary-cards";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  products: number;
  status: "ACTIVE" | "INACTIVE";
  updatedAt: string;
};

const categoryRows: CategoryRow[] = [
  {
    id: "cat_001",
    name: "Electronics",
    slug: "electronics",
    products: 124,
    status: "ACTIVE",
    updatedAt: "2026-02-18",
  },
  {
    id: "cat_002",
    name: "Fashion",
    slug: "fashion",
    products: 88,
    status: "ACTIVE",
    updatedAt: "2026-02-16",
  },
  {
    id: "cat_003",
    name: "Home",
    slug: "home",
    products: 41,
    status: "ACTIVE",
    updatedAt: "2026-02-14",
  },
  {
    id: "cat_004",
    name: "Seasonal",
    slug: "seasonal",
    products: 0,
    status: "INACTIVE",
    updatedAt: "2026-01-30",
  },
];

const columns: ColumnDef<CategoryRow>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "slug", header: "Slug" },
  { accessorKey: "products", header: "Products" },
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
  { accessorKey: "updatedAt", header: "Updated" },
];

export default function CategoriesDashboardPage() {
  const activeCount = categoryRows.filter((row) => row.status === "ACTIVE").length;
  const totalProducts = categoryRows.reduce((sum, row) => sum + row.products, 0);

  return (
    <DashboardShell
      title="Categories"
      description="Organize catalog groups and monitor category activity."
    >
      <SummaryCards
        cards={[
          { title: "Total Categories", value: String(categoryRows.length) },
          { title: "Active", value: String(activeCount) },
          { title: "Products Assigned", value: String(totalProducts) },
          { title: "Inactive", value: "1" },
        ]}
      />

      <section className="rounded-xl border p-4">
        <h2 className="text-base font-medium">Category Registry</h2>
        <DashboardDataTable columns={columns} rows={categoryRows} />
      </section>
    </DashboardShell>
  );
}
