"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useGetProducts } from "@/hooks/use-product";
import { useGetCategories } from "@/hooks/use-category";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SearchSheetContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  
  const { data: categoriesData } = useGetCategories();
  const categories = categoriesData?.data?.categories || [];
  
  const { data: productsData } = useGetProducts({
    q: searchQuery,
    category: selectedCategory || undefined,
    limit: 10,
  });

  const products = productsData?.data?.products || [];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Filter by category
        </label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          {searchQuery || selectedCategory
            ? "No products found."
            : "Type to search products."}
        </p>
      ) : (
        <div className="space-y-2">
          {products.map((p) => {
            const variant = p.variants?.[0];
            const price = variant?.salePrice || variant?.price || "0";
            return (
              <Link
                key={p.id}
                href={`/shop/${p.id}`}
                className="flex gap-3 p-2 rounded hover:bg-muted transition cursor-pointer"
              >
                <div className="w-12 h-12 flex-shrink-0 bg-muted rounded flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">No img</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">{p.name}</p>
                  <p className="text-xs text-muted-foreground">${price}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
