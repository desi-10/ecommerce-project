"use client";

import { useGetOrder, useUpdateOrderStatus } from "@/hooks/use-order";
import { useParams, useRouter } from "next/navigation";
import Wrapper from "@/components/wrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    ArrowLeft, 
    MoreHorizontal, 
    Truck, 
    CheckCircle2, 
    Clock, 
    XCircle, 
    Package, 
    CreditCard, 
    User,
    ShoppingBag,
    Calendar,
    ExternalLink,
    AlertCircle,
    Loader2
} from "lucide-react";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { formatGHS } from "@/lib/currency";
import axios from "axios";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function OrderManagementPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data: orderResponse, isLoading, isError } = useGetOrder(id);
    const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateOrderStatus();
    const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);

    const order = orderResponse?.data;

    const getAllowedTransitions = (currentStatus: string): string[] => {
        switch (currentStatus) {
            case "PENDING":
                return ["PAID", "CANCELLED"];
            case "PAID":
                return ["SHIPPED", "FULFILLED", "CANCELLED"];
            case "SHIPPED":
                return ["FULFILLED", "CANCELLED"];
            case "FULFILLED":
            case "CANCELLED":
            default:
                return [];
        }
    };

    const handleUpdatePaymentStatus = async (paymentId: string, status: string) => {
        try {
            setIsUpdatingPayment(true);
            await axios.patch(`/api/payments/${paymentId}`, { status });
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["orders"] }),
                queryClient.invalidateQueries({ queryKey: ["payments"] }),
                queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] }),
            ]);
        } catch (error) {
            console.error("Failed to update payment status", error);
        } finally {
            setIsUpdatingPayment(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (isError || !order) {
        return (
            <Wrapper>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <XCircle className="h-12 w-12 text-red-500 mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 leading-tight">Order Not Found</h2>
                    <p className="text-gray-600 mt-2">The order you're looking for doesn't exist or you don't have access.</p>
                    <Button onClick={() => router.back()} className="mt-6 border border-gray-200">Go Back</Button>
                </div>
            </Wrapper>
        );
    }

    const orderStatusColors: Record<string, string> = {
        PENDING: "bg-amber-50 text-amber-700 border-amber-200",
        PAID: "bg-blue-50 text-blue-700 border-blue-200",
        SHIPPED: "bg-indigo-50 text-indigo-700 border-indigo-200",
        FULFILLED: "bg-emerald-50 text-emerald-700 border-emerald-200",
        CANCELLED: "bg-red-50 text-red-700 border-red-200",
    };

    return (
        <main className="pb-12">
            <Wrapper>
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => router.push("/dashboard/orders")}
                            className="bg-white"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-2xl font-bold text-gray-900 leading-tight">Order #{order.id.slice(0, 8).toUpperCase()}</h1>
                                <Badge variant="outline" className={`${orderStatusColors[order.status]} uppercase text-[10px] font-bold tracking-wider px-2`}>
                                    {order.status}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{new Date(order.createdAt).toLocaleDateString("en-US", { dateStyle: "long" })}</span>
                                <span>•</span>
                                <Clock className="h-3.5 w-3.5" />
                                <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    </div>

                    {getAllowedTransitions(order.status).length > 0 && (
                        <div className="flex items-center gap-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl px-5 transition-all">
                                        {isUpdatingStatus ? "Updating..." : "Update Order Status"}
                                        <MoreHorizontal className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-100 shadow-xl rounded-xl p-1">
                                    {getAllowedTransitions(order.status).map((status) => (
                                        <DropdownMenuItem 
                                            key={status}
                                            onClick={() => updateStatus({ id: order.id, status })}
                                            className="rounded-lg cursor-pointer text-sm py-2"
                                        >
                                            Mark as {status}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Order details & Products */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <ShoppingBag className="h-4 w-4 text-blue-500" />
                                    Order Items
                                </h3>
                                <Badge variant="secondary" className="bg-white shadow-sm">{order.items.length} items</Badge>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="p-6 flex items-center gap-4 hover:bg-gray-50/30 transition-colors">
                                        <div className="h-16 w-16 rounded-xl border border-gray-100 bg-gray-50 flex-shrink-0 overflow-hidden shadow-inner">
                                            {item.variant.product.images?.[0] ? (
                                                <img src={item.variant.product.images[0].url} alt={item.variant.product.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center">
                                                    <Package className="h-6 w-6 text-gray-300" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h4 className="font-bold text-gray-900 leading-tight truncate">{item.variant.product.name}</h4>
                                            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide font-medium">{item.variant.name}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-sm font-bold text-gray-900">{formatGHS(item.unitPrice)}</p>
                                            <p className="text-xs text-gray-500 mt-1">Qty: {item.qty}</p>
                                        </div>
                                        <div className="text-right min-w-[100px] flex-shrink-0">
                                            <p className="text-sm font-black text-gray-900">{formatGHS(item.lineTotal)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-gray-50/30 px-6 py-6 border-t border-gray-100">
                                <div className="space-y-2 max-w-sm ml-auto">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 font-medium">Subtotal</span>
                                        <span className="font-bold text-gray-900">{formatGHS(order.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 font-medium text-red-600">Discounts</span>
                                        <span className="font-bold text-red-600">-{formatGHS(order.discountTotal)}</span>
                                    </div>
                                    <Separator className="my-3" />
                                    <div className="flex justify-between">
                                        <span className="font-black text-gray-900">Total Amount</span>
                                        <span className="text-xl font-black text-blue-600">{formatGHS(order.total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Transactions */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-emerald-500" />
                                    Payment Transactions
                                </h3>
                            </div>
                            {order.payments?.length > 0 ? (
                                <div className="divide-y divide-gray-50">
                                    {order.payments.map((payment: any) => (
                                        <div key={payment.id} className="p-6">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-black text-gray-900 uppercase tracking-wide">{payment.provider}</span>
                                                        <Badge variant="outline" className={
                                                            payment.status === "SUCCESS" 
                                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                                                : "bg-amber-50 text-amber-700 border-amber-200 uppercase text-[10px]"
                                                        }>
                                                            {payment.status}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-[11px] font-mono text-gray-500">Ref: {payment.reference}</p>
                                                    <p className="text-[11px] text-gray-400 font-medium tracking-wide">
                                                        {new Date(payment.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                                {payment.status !== "SUCCESS" && payment.status !== "SUCCEEDED" && (
                                                    <div className="flex items-center gap-3">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs font-bold border-gray-200">
                                                                    {isUpdatingPayment ? "Processing..." : "Update Payment"}
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="bg-white border rounded-xl shadow-lg p-1">
                                                                <DropdownMenuItem onClick={() => handleUpdatePaymentStatus(payment.id, "SUCCESS")} className="rounded-lg cursor-pointer">
                                                                    Mark as Completed
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleUpdatePaymentStatus(payment.id, "FAILED")} className="rounded-lg cursor-pointer text-red-600 hover:text-red-700">
                                                                    Mark as Failed
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center text-gray-500 italic text-sm">
                                    No transaction records found for this order.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Customer & Status */}
                    <div className="space-y-6">
                        {/* Customer Info */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                                <User className="h-4 w-4 text-purple-500" />
                                Customer Details
                            </h3>
                            {order.user ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-black text-lg shadow-sm ring-2 ring-white">
                                            {order.user.name?.[0] || "U"}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-gray-900 leading-none truncate">{order.user.name || "Unnamed Customer"}</p>
                                            <p className="text-[11px] text-gray-500 mt-1.5 truncate">{order.user.email}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="text-xs">
                                            <p className="text-gray-400 font-bold uppercase tracking-wider mb-1 text-[9px]">Customer ID</p>
                                            <p className="font-mono text-gray-600 bg-gray-50 p-1 rounded border border-gray-100 truncate">{order.user.id}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-3">
                                    <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                                    <p className="text-xs text-amber-900 font-medium">Guest Checkout. No associated user account.</p>
                                </div>
                            )}
                        </div>

                        {/* Timeline / Additional Info Placeholder */}
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
                            <h3 className="font-bold flex items-center gap-2 mb-4">
                                <Truck className="h-4 w-4" />
                                Quick Actions
                            </h3>
                            <div className="space-y-2">
                                <Button onClick={() => window.print()} variant="secondary" className="w-full bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold h-10 rounded-xl transition-all shadow-lg hover:shadow-xl">
                                    Print Invoice
                                </Button>
                                <Button onClick={() => window.print()} variant="secondary" className="w-full bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold h-10 rounded-xl transition-all shadow-lg hover:shadow-xl">
                                    Download Packing Slip
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Wrapper>
        </main>
    );
}
