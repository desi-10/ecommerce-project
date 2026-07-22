"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import Wrapper from "@/components/wrapper";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart.store";
import {
  CheckCircle2,
  ChevronRight,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatGHS } from "@/lib/currency";

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (!reference) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/orders/reference/${reference}`);
        setOrder(res.data.data);
        clearCart();
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to fetch order details",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [reference]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (!reference || error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-md shadow-sm p-8 text-center border border-gray-100">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            We couldn't find an order associated with this reference. If you
            believe this is an error, please contact support.
          </p>
          <Button
            asChild
            className="w-full rounded-xl py-6 bg-indigo-600 hover:bg-indigo-700"
          >
            <Link href="/">Return to Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20">
      <Wrapper>
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-500">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Thank You for Your Order!
            </h1>
            <p className="text-lg text-gray-600 max-w-lg mx-auto leading-relaxed">
              Your payment was successful and your order has been confirmed.
              We've sent a receipt to your email.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center gap-3">
                  <Package className="h-5 w-5 text-indigo-600" />
                  <h2 className="font-bold text-lg text-gray-900">
                    Order Summary
                  </h2>
                </div>
                <div className="divide-y divide-gray-50">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="p-6 flex gap-4 sm:gap-6">
                      <div className="relative h-20 w-20 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                        <Image
                          src={
                            item.variant.product.image ||
                            "https://images.unsplash.com/photo-1581448670546-538183049b80?q=80&w=200"
                          }
                          alt={item.variant.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate text-lg mb-1">
                          {item.variant.product.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          Variant:{" "}
                          <span className="text-gray-700 font-medium">
                            {item.variant.name}
                          </span>
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600">
                            Qty:{" "}
                            <span className="text-gray-900 font-semibold">
                              {item.qty}
                            </span>
                          </p>
                          <p className="font-bold text-indigo-600">
                            {formatGHS(Number(item.lineTotal))}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Progress Mockup */}
              <div className="bg-white rounded-md shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Truck className="h-5 w-5 text-indigo-600" />
                  <h2 className="font-bold text-lg text-gray-900">
                    Next Steps
                  </h2>
                </div>
                <div className="relative">
                  <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100"></div>
                  <div className="space-y-8 relative">
                    <div className="flex gap-4">
                      <div className="relative z-10 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          Order Confirmed
                        </p>
                        <p className="text-sm text-gray-500">
                          Your order is being processed.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 opacity-50">
                      <div className="relative z-10 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          In Preparation
                        </p>
                        <p className="text-sm text-gray-500">
                          We're packing your items.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 opacity-50">
                      <div className="relative z-10 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          Out for Delivery
                        </p>
                        <p className="text-sm text-gray-500">
                          Your order will arrive soon.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Details */}
            <div className="space-y-6">
              <div className="bg-white rounded-md shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 mb-4 pb-4 border-b border-gray-50">
                  Order Information
                </h2>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Order Date</span>
                    <span className="text-gray-900 font-medium">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Order Status</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold uppercase text-[10px]">
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment Ref</span>
                    <span
                      className="text-gray-900 font-mono text-[11px] truncate max-w-[120px]"
                      title={reference}
                    >
                      {reference}
                    </span>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatGHS(Number(order.subtotal))}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>Discount</span>
                    <span className="text-green-600">
                      -{formatGHS(Number(order.discountTotal))}
                    </span>
                  </div>
                  <div className="flex justify-between text-xl font-extrabold text-gray-900 pt-2 border-t border-gray-50">
                    <span>Total</span>
                    <span className="text-indigo-600">
                      {formatGHS(Number(order.total))}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-600 rounded-md p-6 text-white text-center shadow-sm">
                <h3 className="font-bold text-lg mb-1">Need Assistance?</h3>
                <p className="text-indigo-100 text-sm mb-4">
                  Have questions about your order? Our support team is here to help 24/7.
                </p>
                <Button variant="secondary" className="bg-white text-indigo-600 hover:bg-indigo-50 rounded-md font-semibold">
                  Contact Support
                </Button>
              </div>

              <Button
                variant="outline"
                asChild
                className="w-full py-6 rounded-md border-gray-200 hover:bg-gray-50 font-semibold text-gray-700 shadow-sm"
              >
                <Link href="/">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
