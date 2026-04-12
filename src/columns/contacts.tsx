"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Inquiry } from "@/types/contacts";
import { format } from "date-fns";
import { InquiryActions } from "@/components/contacts/inquiry-actions";
import { Badge } from "@/components/ui/badge";

export const contactColumns = (onRefresh: () => void): ColumnDef<Inquiry>[] => [
    {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => (
            <span className="text-gray-500 whitespace-nowrap">
                {format(new Date(row.original.createdAt), "MMM d, yyyy")}
            </span>
        ),
    },
    {
        id: "sender",
        header: "Sender",
        cell: ({ row }) => (
            <div className="min-w-[150px]">
                <div className="font-medium text-gray-900">{row.original.name}</div>
                <div className="text-gray-500 text-xs lowercase">{row.original.email}</div>
            </div>
        ),
    },
    {
        accessorKey: "subject",
        header: "Subject",
        cell: ({ row }) => (
            <div className="font-medium text-gray-800 truncate max-w-[200px]">
                {row.original.subject}
            </div>
        ),
    },
    {
        accessorKey: "message",
        header: "Message Snapshot",
        cell: ({ row }) => (
            <div className="text-gray-600 truncate max-w-[300px]">
                {row.original.message}
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            return (
                <Badge 
                    variant={status === "RESOLVED" ? "secondary" : "outline"}
                    className={`${
                        status === 'UNREAD' ? 'bg-red-50 text-red-700 border-red-100' : 
                        status === 'READ' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                        'bg-green-50 text-green-700 border-green-100'
                    }`}
                >
                    {status}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <InquiryActions inquiry={row.original} onRefresh={onRefresh} />,
    },
];
