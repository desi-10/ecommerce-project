"use client";

import { useGetCustomer } from "@/hooks/use-customer";
import { useParams, useRouter } from "next/navigation";
import Wrapper from "@/components/wrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    ArrowLeft, 
    ShoppingBag, 
    User,
    Calendar,
    XCircle,
    Loader2,
    DollarSign,
    MapPin,
    Phone,
    Mail,
    ChevronRight,
    ShoppingBagIcon
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatGHS } from "@/lib/currency";
import Link from "next/link";

export default function CustomerProfilePage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const { data: response, isLoading, isError } = useGetCustomer(id);

    const user = response?.data;
    const orders = user?.orders || [];
    const profile = user?.profile;

    // Calculate metrics
    const totalOrders = orders.length;
    const completedOrders = orders.filter((o: any) => o.status === "FULFILLED" || o.status === "PAID").length;
    const totalSpent = orders
        .filter((o: any) => o.status === "FULFILLED" || o.status === "PAID")
        .reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0);

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (isError || !user) {
        return (
            <Wrapper>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <XCircle className="h-12 w-12 text-red-500 mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 leading-tight">Customer Not Found</h2>
                    <p className="text-gray-600 mt-2">The customer account you're looking for does not exist.</p>
                    <Button onClick={() => router.push("/dashboard/customers")} className="mt-6 border border-gray-200">Go Back</Button>
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
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => router.push("/dashboard/customers")}
                            className="bg-white"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{user.name || "Unnamed Customer"}</h1>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>Joined {new Date(user.createdAt).toLocaleDateString("en-US", { dateStyle: "long" })}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-3 mb-8">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl text-white bg-indigo-50 text-indigo-600">
                                <DollarSign className="h-6 w-6 text-indigo-600" />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Total Lifetime Spent</p>
                        <p className="text-2xl font-bold text-gray-900">{formatGHS(totalSpent)}</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl text-white bg-blue-50 text-blue-600">
                                <ShoppingBag className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-900">{totalOrders} orders</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl text-white bg-emerald-50 text-emerald-600">
                                <ShoppingBagIcon className="h-6 w-6 text-emerald-600" />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Completed Purchases</p>
                        <p className="text-2xl font-bold text-gray-900">{completedOrders} orders</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Order History */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <ShoppingBag className="h-4 w-4 text-indigo-500" />
                                    Order History
                                </h3>
                                <Badge variant="secondary" className="bg-white shadow-sm">{orders.length} orders</Badge>
                            </div>
                            
                            {orders.length === 0 ? (
                                <div className="p-12 text-center text-gray-500 italic text-sm">
                                    No purchase history records found for this customer.
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {orders.map((order: any) => (
                                        <div key={order.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs font-black text-blue-600">#{order.id.slice(0, 8).toUpperCase()}</span>
                                                    <Badge variant="outline" className={`${orderStatusColors[order.status]} text-[9px] uppercase tracking-wider px-2 py-0.5 font-bold`}>
                                                        {order.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1 font-medium">
                                                    {order.items?.length || 0} product(s) ordered
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="font-bold text-gray-900 text-sm">
                                                    {formatGHS(order.total, false)}
                                                </span>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={() => router.push(`/dashboard/orders/${order.id}`)}
                                                    className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl"
                                                >
                                                    View Details
                                                    <ChevronRight className="h-4 w-4 ml-1" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Customer profile and contact */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                                <User className="h-4 w-4 text-indigo-500" />
                                Contact Information
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email Address</p>
                                        <p className="text-xs text-gray-700 font-medium truncate">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Phone Number</p>
                                        <p className="text-xs text-gray-700 font-medium">{profile?.phone || "Not provided"}</p>
                                    </div>
                                </div>
                            </div>

                            <Separator className="my-6" />

                            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                                <MapPin className="h-4 w-4 text-emerald-500" />
                                Delivery Address
                            </h3>
                            {profile?.addressLine1 ? (
                                <div className="space-y-2 text-xs text-gray-600">
                                    <p className="font-medium text-gray-800">{user.name}</p>
                                    <p>{profile.addressLine1}</p>
                                    {profile.addressLine2 && <p>{profile.addressLine2}</p>}
                                    <p>{profile.city}, {profile.state || ""}</p>
                                    <p>{profile.country} {profile.postalCode ? `(${profile.postalCode})` : ""}</p>
                                </div>
                            ) : (
                                <p className="text-xs text-gray-500 italic">No delivery address registered yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </Wrapper>
        </main>
    );
}
