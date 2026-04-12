"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Review } from "@/types/reviews";
import { ReviewActions } from "@/components/reviews/review-actions";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import Image from "next/image";

export const reviewColumns = (onRefresh: () => void): ColumnDef<Review>[] => [
    {
        id: "product",
        header: "Product",
        cell: ({ row }) => {
            const product = row.original.product;
            return (
                <div className="flex items-center gap-3 min-w-[200px]">
                    <div className="h-10 w-10 relative rounded-md border bg-gray-50 overflow-hidden shrink-0">
                        <Image 
                            src={product?.image || "/martfury/product.png"} 
                            alt={product?.name || "Product"} 
                            fill
                            className="object-contain p-1"
                        />
                    </div>
                    <span className="font-medium text-gray-900 line-clamp-1">{product?.name || "Unknown Product"}</span>
                </div>
            );
        },
    },
    {
        id: "customer",
        header: "Customer",
        cell: ({ row }) => (
            <div className="min-w-[150px]">
                <div className="font-medium text-gray-900">{row.original.user?.name || "Anonymous"}</div>
                <div className="text-gray-500 text-xs">{row.original.user?.email || "No email"}</div>
            </div>
        ),
    },
    {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => (
            <div className="flex items-center gap-0.5 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                        key={i} 
                        className={`h-3.5 w-3.5 ${i < row.original.rating ? "fill-current" : "text-gray-200"}`} 
                    />
                ))}
            </div>
        ),
    },
    {
        accessorKey: "comment",
        header: "Comment",
        cell: ({ row }) => (
            <div className="text-gray-600 truncate max-w-[250px] italic">
                {row.original.comment || "No comment provided"}
            </div>
        ),
    },
    {
        id: "status",
        header: "Status",
        cell: ({ row }) => (
            row.original.reply ? (
                <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-100">Replied</Badge>
            ) : (
                <Badge variant="outline" className="text-gray-500 border-gray-200">Pending</Badge>
            )
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <ReviewActions review={row.original} onRefresh={onRefresh} />,
    },
];
