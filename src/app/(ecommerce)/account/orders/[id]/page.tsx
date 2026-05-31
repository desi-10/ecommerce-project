// app/account/orders/[id]/page.tsx
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetUserOrderDetail } from "@/hooks/use-account";
import { Loader2, Package, ArrowLeft, Calendar, Tag, CreditCard, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Wrapper from "@/components/wrapper";

export default function OrderDetailPage() {
    const { id } = useParams() as { id: string };
    const { data: orderResponse, isLoading, isError } = useGetUserOrderDetail(id);
    const order = orderResponse?.data;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
                <p className="text-neutral-500 font-medium animate-pulse">Loading order details...</p>
            </div>
        );
    }

    if (isError || !order) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                    <ArrowLeft className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900">Order not found</h3>
                <p className="text-sm text-neutral-600 mt-2 max-w-xs">
                    We couldn&apos;t find the order you&apos;re looking for. It may have been deleted or belongs to another account.
                </p>
                <Button asChild variant="outline" className="mt-8 rounded-xl">
                    <Link href="/account/orders">Back to Orders</Link>
                </Button>
            </div>
        );
    }

    const subtotal = parseFloat(order.subtotal);
    const discount = parseFloat(order.discountTotal);
    const total = parseFloat(order.total);

    return (
        <main className="bg-white py-8 md:py-12">
            <Wrapper>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                <div>
                    <Button variant="ghost" asChild className="p-0 h-auto hover:bg-transparent text-blue-600 hover:text-blue-700 font-medium mb-4">
                        <Link href="/account/orders" className="flex items-center gap-1.5">
                            <ArrowLeft className="h-4 w-4" />
                            Back to orders
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold text-neutral-900">
                        Order #{order.id.slice(-8).toUpperCase()}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                        <div className="flex items-center gap-1.5 text-sm text-neutral-500">
                            <Calendar className="h-4 w-4" />
                            {order.createdAt ? new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(order.createdAt)) : "Date N/A"}
                        </div>
                        <div className="h-1 w-1 rounded-full bg-neutral-300" />
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-blue-600">
                            {order.status}
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl border-neutral-200">
                        Download Invoice
                    </Button>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
                {/* Items List */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-neutral-100 bg-neutral-50/30">
                            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                                <Package className="h-5 w-5 text-neutral-400" />
                                Order Items ({order.items.length})
                            </h2>
                        </div>
                        <div className="divide-y divide-neutral-100">
                            {order.items.map((item: any, idx: number) => (
                                <div key={idx} className="p-6 flex items-center gap-4 hover:bg-neutral-50/50 transition-colors">
                                    <div className="h-20 w-20 rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0 flex items-center justify-center">
                                        {item.variant.product.image ? (
                                            <img 
                                                src={item.variant.product.image} 
                                                alt={item.variant.product.name} 
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <Package className="h-8 w-8 text-neutral-300" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-bold text-neutral-900 line-clamp-1">
                                            {item.variant.product.name}
                                        </h3>
                                        <p className="text-sm text-neutral-500 mt-0.5">
                                            {item.variant.name} • Qty: {item.qty}
                                        </p>
                                        <div className="flex items-center gap-4 mt-2">
                                            <p className="text-sm font-bold text-blue-600">
                                                {order.currency} {parseFloat(item.unitPrice).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right hidden sm:block">
                                        <p className="text-base font-bold text-neutral-900">
                                            {order.currency} {parseFloat(item.lineTotal).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-neutral-100 bg-neutral-50/30">
                            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-neutral-400" />
                                Payment Information
                            </h2>
                        </div>
                        <div className="p-6">
                            {order.payments?.length > 0 ? (
                                <div className="space-y-4">
                                    {order.payments.map((p: any) => (
                                        <div key={p.id} className="flex items-center justify-between p-4 rounded-xl border border-neutral-100 bg-neutral-50/50">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center">
                                                    <CreditCard className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-neutral-900">{p.provider} Payment</p>
                                                    <p className="text-xs text-neutral-500 uppercase tracking-wide mt-0.5">Ref: {p.reference?.slice(-12)}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-neutral-900">{order.currency} {parseFloat(p.amount).toFixed(2)}</p>
                                                <p className="text-[10px] font-bold text-green-600 uppercase mt-0.5">{p.status}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-neutral-500 italic">No payment information available.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Summary Sidebar */}
                <aside className="space-y-6">
                    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm h-fit">
                        <div className="p-6 border-b border-neutral-100 bg-neutral-50/30">
                            <h2 className="text-lg font-bold text-neutral-900">Order Summary</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-500">Subtotal</span>
                                <span className="font-semibold text-neutral-900">{order.currency} {subtotal.toFixed(2)}</span>
                            </div>

                            {discount > 0 && (
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-1.5 text-green-600">
                                        <Tag className="h-3.5 w-3.5" />
                                        <span>Discount</span>
                                    </div>
                                    <span className="font-semibold text-green-600">-{order.currency} {discount.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-500">Shipping</span>
                                <span className="font-semibold text-neutral-900 text-xs italic">Calculated at checkout</span>
                            </div>

                            <div className="h-px bg-neutral-100 my-2" />

                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Grand Total</p>
                                    <p className="text-2xl font-black text-neutral-900 mt-1">
                                        <span className="text-sm font-bold mr-1">{order.currency}</span>
                                        {total.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-neutral-50 border-t border-neutral-100">
                            <p className="text-[10px] text-neutral-400 text-center leading-relaxed italic">
                                Thank you for shopping with us! Taxes are included in the final price.
                            </p>
                        </div>
                    </div>
                </aside>
            </div>
            </Wrapper>
        </main>
    );
}
