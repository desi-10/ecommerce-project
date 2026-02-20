"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

type CategoryApiItem = {
  id: string;
  name: string;
  slug: string;
  status: "ACTIVE" | "INACTIVE";
  updatedAt: string;
  _count?: {
    products?: number;
  };
};

export default function CategoriesDashboardPage() {
  const [rows, setRows] = useState<CategoryRow[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    const response = await fetch("/api/categories?page=1&limit=50", {
      credentials: "include",
    });
    const result = await response.json();

    if (!response.ok) {
      setError(result.message || "Unable to fetch categories");
      setLoading(false);
      return;
    }

    const source = (result?.data?.items || []) as CategoryApiItem[];

    setRows(
      source.map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        products: Number(item._count?.products ?? 0),
        status: item.status,
        updatedAt: new Date(item.updatedAt).toISOString().slice(0, 10),
      })),
    );

    setError(null);
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchCategories();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const createCategory = async () => {
    const response = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name,
        status: "ACTIVE",
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      setError(result.message || "Unable to create category");
      return;
    }

    setName("");
    await fetchCategories();
  };

  const updateCategory = async (id: string, payload: Record<string, unknown>) => {
    const response = await fetch(`/api/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) {
      setError(result.message || "Unable to update category");
      return;
    }

    await fetchCategories();
  };

  const deleteCategory = async (id: string) => {
    const response = await fetch(`/api/categories/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const result = await response.json();
    if (!response.ok) {
      setError(result.message || "Unable to delete category");
      return;
    }

    await fetchCategories();
  };

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
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              size="xs"
              variant="outline"
              onClick={() => {
                const nextStatus =
                  row.original.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
                updateCategory(row.original.id, { status: nextStatus });
              }}
            >
              Toggle
            </Button>
            <Button
              size="xs"
              variant="outline"
              onClick={() => {
                const nextName = window.prompt("New category name", row.original.name);
                if (nextName && nextName.trim()) {
                  updateCategory(row.original.id, { name: nextName.trim() });
                }
              }}
            >
              Edit
            </Button>
            <Button
              size="xs"
              variant="destructive"
              onClick={() => deleteCategory(row.original.id)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ];

  const activeCount = rows.filter((row) => row.status === "ACTIVE").length;
  const totalProducts = rows.reduce((sum, row) => sum + row.products, 0);

  return (
    <DashboardShell
      title="Categories"
      description="Manage category CRUD and status directly from dashboard."
    >
      <SummaryCards
        cards={[
          { title: "Total Categories", value: String(rows.length) },
          { title: "Active", value: String(activeCount) },
          { title: "Products Assigned", value: String(totalProducts) },
          { title: "Inactive", value: String(rows.length - activeCount) },
        ]}
      />

      <section className="rounded-xl border p-4">
        <h2 className="text-base font-medium">Create Category</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <Input placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} />
          <div />
          <Button onClick={createCategory} disabled={!name.trim()}>
            Add Category
          </Button>
        </div>
      </section>

      <section className="rounded-xl border p-4">
        <h2 className="text-base font-medium">Category Registry</h2>
        {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
        {loading ? <p className="mt-4 text-sm text-muted-foreground">Loading...</p> : null}
        {!loading ? <DashboardDataTable columns={columns} rows={rows} /> : null}
      </section>
    </DashboardShell>
  );
}
