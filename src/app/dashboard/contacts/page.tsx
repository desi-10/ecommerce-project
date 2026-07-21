"use client";

import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/data-table";
import { contactColumns } from "@/columns/contacts";
import Wrapper from "@/components/wrapper";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";

export default function ContactsDashboardPage() {
    const { 
        data: response, 
        isLoading, 
        isError, 
        error, 
        refetch 
    } = useQuery({
        queryKey: ["contacts"],
        queryFn: async () => {
            const res = await fetch("/api/contact");
            if (!res.ok) throw new Error("Failed to fetch inquiries");
            return res.json();
        }
    });

    const inquiries = response?.data || [];

    return (
        <main>
            <Wrapper>
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Customer Inquiries</h1>
                            <p className="text-sm text-gray-600 mt-2">
                                Review and manage customer messages submitted through the website.
                            </p>
                        </div>
                    </div>

                    {isError && (
                        <div className="flex items-start gap-3 rounded-md bg-red-50 p-4 border border-red-200 mb-6 font-medium text-red-900 shadow-sm">
                            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p>Failed to load inquiries</p>
                                <p className="text-sm text-red-700 mt-1">{(error as Error)?.message}</p>
                            </div>
                        </div>
                    )}

                    {!isLoading && inquiries.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-md border border-dashed border-gray-300 shadow-sm">
                            <Inbox className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900">Inbox is empty</h3>
                            <p className="text-sm text-gray-500 mt-2">No customer inquiries have been received yet.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-md shadow-sm border border-gray-100 p-1">
                            <DataTable 
                                columns={contactColumns(refetch)} 
                                data={{ items: inquiries }} 
                                isLoading={isLoading}
                            />
                        </div>
                    )}
                </div>
            </Wrapper>
        </main>
    );
}
