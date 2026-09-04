"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetUserOrderDetail, usePayOrder } from "@/hooks/use-account";
import { 
    Package, 
    ArrowLeft, 
    Calendar, 
    Tag, 
    CreditCard, 
    Printer, 
    MapPin, 
    Mail, 
    Phone, 
    AlertTriangle, 
    Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Wrapper from "@/components/wrapper";
import { OrderDetailSkeleton } from "@/components/ui/skeletons";
import { formatGHS } from "@/lib/currency";
import { toast } from "sonner";

export default function OrderDetailPage() {
    const { id } = useParams() as { id: string };
    const { data: orderResponse, isLoading, isError } = useGetUserOrderDetail(id);
    const { mutate: payOrder, isPending: isPaying } = usePayOrder();
    const [selectedGateway, setSelectedGateway] = useState<"paystack" | "stripe" | "crypto">("paystack");

    const order = orderResponse?.data;

    if (isLoading) {
        return (
            <main className="bg-white py-8 md:py-12">
                <Wrapper>
                    <OrderDetailSkeleton />
                </Wrapper>
            </main>
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
                <Button asChild variant="outline" className="mt-8 rounded-md shadow-sm">
                    <Link href="/account/orders">Back to Orders</Link>
                </Button>
            </div>
        );
    }

    const paymentWithMeta = order.payments?.find((p: any) => p.metadata);
    let checkoutMeta: {
        email?: string;
        firstName?: string;
        lastName?: string;
        address?: string;
        phone?: string;
        country?: string;
        state?: string;
    } | null = null;

    if (paymentWithMeta?.metadata) {
        try {
            checkoutMeta = typeof paymentWithMeta.metadata === "string"
                ? JSON.parse(paymentWithMeta.metadata)
                : paymentWithMeta.metadata;
        } catch (e) {
            console.error("Failed to parse payment metadata", e);
        }
    }

    const subtotal = parseFloat(order.subtotal);
    const discount = parseFloat(order.discountTotal);
    const total = parseFloat(order.total);

    const orderStatusColors: Record<string, string> = {
        PENDING: "bg-amber-50 text-amber-700 border-amber-200",
        PAID: "bg-blue-50 text-blue-700 border-blue-200",
        FULFILLED: "bg-emerald-50 text-emerald-700 border-emerald-200",
        CANCELLED: "bg-red-50 text-red-700 border-red-200",
        REFUNDED: "bg-purple-50 text-purple-700 border-purple-200",
        FAILED: "bg-rose-50 text-rose-700 border-rose-200",
    };

    const handlePayOrder = () => {
        payOrder(
            { orderId: order.id, gateway: selectedGateway },
            {
                onSuccess: (data) => {
                    const authUrl = data?.data?.authorizationUrl || data?.authorizationUrl;
                    if (authUrl) {
                        window.location.href = authUrl;
                    } else {
                        toast.error("Failed to retrieve payment authorization link.");
                    }
                },
                onError: (err: any) => {
                    toast.error(err.message || "Failed to initiate payment. Please try again.");
                },
            }
        );
    };

    return (
        <>
            <main className="bg-white py-8 md:py-12 print:hidden">
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
                                <span className={`px-2.5 py-0.5 rounded-md border text-xs font-bold uppercase tracking-wider ${orderStatusColors[order.status] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button 
                                variant="outline" 
                                onClick={() => window.print()}
                                className="rounded-md border-neutral-200 shadow-sm flex items-center gap-2 font-semibold hover:bg-neutral-50"
                            >
                                <Printer className="h-4 w-4 text-neutral-500" />
                                Download Invoice
                            </Button>
                        </div>
                    </div>

                    {/* Pending Payment Alert & Action Banner */}
                    {order.status === "PENDING" && (
                        <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50 border border-amber-200 rounded-md p-6 mb-8 shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-1 max-w-xl">
                                    <div className="flex items-center gap-2 text-amber-800 font-bold text-lg">
                                        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                                        Payment Pending ({formatGHS(total)})
                                    </div>
                                    <p className="text-sm text-amber-700 leading-relaxed">
                                        Your order is currently pending payment. Select your preferred payment method below to complete the transaction.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                    <select 
                                        value={selectedGateway} 
                                        onChange={(e) => setSelectedGateway(e.target.value as "paystack" | "stripe" | "crypto")}
                                        className="px-3 py-2.5 bg-white border border-amber-200 rounded-md text-sm font-semibold text-neutral-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    >
                                        <option value="paystack">Paystack (MoMo / Card)</option>
                                        <option value="stripe">Stripe (Card)</option>
                                        <option value="crypto">Crypto (BTC / USDT / etc.)</option>
                                    </select>
                                    <Button 
                                        onClick={handlePayOrder} 
                                        disabled={isPaying}
                                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2.5 rounded-md shadow-sm transition-all flex items-center justify-center gap-2 shrink-0"
                                    >
                                        {isPaying ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="h-4 w-4" />
                                                Make Payment Now
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
                        {/* Items List */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-md border border-neutral-200 overflow-hidden shadow-sm">
                                <div className="p-6 border-b border-neutral-100 bg-neutral-50/30">
                                    <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                                        <Package className="h-5 w-5 text-neutral-400" />
                                        Order Items ({order.items.length})
                                    </h2>
                                </div>
                                <div className="divide-y divide-neutral-100">
                                    {order.items.map((item: any, idx: number) => {
                                        const imageUrl = item.variant.product.image || item.variant.product.images?.[0]?.url;
                                        return (
                                            <div key={idx} className="p-6 flex items-center gap-4 hover:bg-neutral-50/50 transition-colors">
                                                <div className="h-20 w-20 rounded-md bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0 flex items-center justify-center">
                                                    {imageUrl ? (
                                                        <img 
                                                            src={imageUrl} 
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
                                                            {formatGHS(item.unitPrice)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right hidden sm:block">
                                                    <p className="text-base font-bold text-neutral-900">
                                                        {formatGHS(item.lineTotal)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Shipping & Customer Info */}
                            {(checkoutMeta || order.user) && (
                                <div className="bg-white rounded-md border border-neutral-200 overflow-hidden shadow-sm">
                                    <div className="p-6 border-b border-neutral-100 bg-neutral-50/30">
                                        <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-neutral-400" />
                                            Shipping Details
                                        </h2>
                                    </div>
                                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                                        <div>
                                            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Recipient</p>
                                            <p className="font-bold text-neutral-900">
                                                {[checkoutMeta?.firstName, checkoutMeta?.lastName].filter(Boolean).join(" ") || order.user?.name || "Customer"}
                                            </p>
                                            {(checkoutMeta?.email || order.user?.email) && (
                                                <p className="text-neutral-500 mt-1 flex items-center gap-2 text-xs">
                                                    <Mail className="h-3.5 w-3.5 text-neutral-400" />
                                                    {checkoutMeta?.email || order.user?.email}
                                                </p>
                                            )}
                                            {checkoutMeta?.phone && (
                                                <p className="text-neutral-500 mt-1 flex items-center gap-2 text-xs">
                                                    <Phone className="h-3.5 w-3.5 text-neutral-400" />
                                                    {checkoutMeta.phone}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Delivery Address</p>
                                            {checkoutMeta?.address ? (
                                                <div className="text-neutral-700 leading-relaxed">
                                                    <p>{checkoutMeta.address}</p>
                                                    {(checkoutMeta.state || checkoutMeta.country) && (
                                                        <p className="text-neutral-500 text-xs mt-0.5">
                                                            {[checkoutMeta.state, checkoutMeta.country].filter(Boolean).join(", ")}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-neutral-400 italic">No delivery address provided.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Payment Info */}
                            <div className="bg-white rounded-md border border-neutral-200 overflow-hidden shadow-sm">
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
                                                <div key={p.id} className="flex items-center justify-between p-4 rounded-md border border-neutral-100 bg-neutral-50/50">
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
                                                        <p className="text-sm font-bold text-neutral-900">{formatGHS(p.amount)}</p>
                                                        <p className={`text-[10px] font-bold uppercase mt-0.5 ${p.status === "SUCCEEDED" || p.status === "SUCCESS" ? "text-green-600" : "text-amber-600"}`}>
                                                            {p.status}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-neutral-500 italic">No payment transactions recorded.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Summary Sidebar */}
                        <aside className="space-y-6">
                            <div className="bg-white rounded-md border border-neutral-200 overflow-hidden shadow-sm h-fit">
                                <div className="p-6 border-b border-neutral-100 bg-neutral-50/30">
                                    <h2 className="text-lg font-bold text-neutral-900">Order Summary</h2>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-neutral-500">Subtotal</span>
                                        <span className="font-semibold text-neutral-900">{formatGHS(subtotal)}</span>
                                    </div>

                                    {discount > 0 && (
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-1.5 text-green-600">
                                                <Tag className="h-3.5 w-3.5" />
                                                <span>Discount</span>
                                            </div>
                                            <span className="font-semibold text-green-600">-{formatGHS(discount)}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-neutral-500">Shipping</span>
                                        <span className="font-semibold text-neutral-900 text-xs italic">Free</span>
                                    </div>

                                    <div className="h-px bg-neutral-100 my-2" />

                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Grand Total</p>
                                            <p className="text-2xl font-black text-neutral-900 mt-1">
                                                {formatGHS(total)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {order.status === "PENDING" && (
                                    <div className="p-4 bg-amber-50 border-t border-amber-100 text-center">
                                        <Button 
                                            onClick={handlePayOrder} 
                                            disabled={isPaying}
                                            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-md py-2 text-sm shadow-sm flex items-center justify-center gap-2"
                                        >
                                            {isPaying ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                "Pay Pending Order"
                                            )}
                                        </Button>
                                    </div>
                                )}
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

            {/* Printable Invoice Container */}
            <div className="hidden print:block p-8 bg-white text-gray-900 font-sans max-w-4xl mx-auto">
                {/* Printable Invoice Header */}
                <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-200">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-gray-900">INVOICE</h1>
                        <p className="text-xs text-gray-500 mt-1 font-mono uppercase">
                            Invoice #{order.id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Status: <span className="font-bold text-gray-900 uppercase">{order.status}</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-bold text-gray-900">MartFury Store</h2>
                        <p className="text-xs text-gray-500 mt-1">support@martfury.com</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Date: {new Date(order.createdAt).toLocaleDateString("en-US", { dateStyle: "long" })}
                        </p>
                    </div>
                </div>

                {/* Customer & Shipping Details */}
                <div className="grid grid-cols-2 gap-8 mb-8 pb-6 border-b border-gray-200">
                    <div>
                        <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Billed To</h3>
                        <p className="font-bold text-base text-gray-900">
                            {[checkoutMeta?.firstName, checkoutMeta?.lastName].filter(Boolean).join(" ") || order.user?.name || "Customer"}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">{checkoutMeta?.email || order.user?.email || "N/A"}</p>
                        {checkoutMeta?.phone && <p className="text-xs text-gray-600 mt-0.5">Phone: {checkoutMeta.phone}</p>}
                    </div>
                    <div>
                        <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Shipping Address</h3>
                        {checkoutMeta?.address ? (
                            <>
                                <p className="font-medium text-xs text-gray-900">{checkoutMeta.address}</p>
                                {(checkoutMeta.state || checkoutMeta.country) && (
                                    <p className="text-xs text-gray-600 mt-0.5">
                                        {[checkoutMeta.state, checkoutMeta.country].filter(Boolean).join(", ")}
                                    </p>
                                )}
                            </>
                        ) : (
                            <p className="text-xs text-gray-400 italic">No shipping address recorded</p>
                        )}
                    </div>
                </div>

                {/* Order Items Table */}
                <table className="w-full text-left border-collapse mb-8">
                    <thead>
                        <tr className="border-b-2 border-gray-200 text-[10px] font-bold uppercase text-gray-500">
                            <th className="py-3 px-2">Item</th>
                            <th className="py-3 px-2">Variant</th>
                            <th className="py-3 px-2 text-right">Unit Price</th>
                            <th className="py-3 px-2 text-center">Qty</th>
                            <th className="py-3 px-2 text-right">Line Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs">
                        {order.items.map((item: any) => (
                            <tr key={item.id}>
                                <td className="py-3 px-2 font-bold text-gray-900">{item.variant.product.name}</td>
                                <td className="py-3 px-2 text-gray-500 uppercase text-[11px]">{item.variant.name}</td>
                                <td className="py-3 px-2 text-right font-medium">{formatGHS(item.unitPrice)}</td>
                                <td className="py-3 px-2 text-center">{item.qty}</td>
                                <td className="py-3 px-2 text-right font-bold text-gray-900">{formatGHS(item.lineTotal)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals Summary */}
                <div className="flex justify-end mb-12">
                    <div className="w-64 space-y-2 text-xs">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal:</span>
                            <span className="font-bold text-gray-900">{formatGHS(subtotal)}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-red-600">
                                <span>Discounts:</span>
                                <span className="font-bold">-{formatGHS(discount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm font-black text-gray-900 border-t border-gray-300 pt-2">
                            <span>Total Amount:</span>
                            <span className="text-blue-600">{formatGHS(total)}</span>
                        </div>
                    </div>
                </div>

                {/* Invoice Footer */}
                <div className="border-t border-gray-200 pt-6 text-center text-[11px] text-gray-400">
                    Thank you for shopping with MartFury! If you have questions regarding this invoice, please contact support@martfury.com.
                </div>
            </div>
        </>
    );
}
