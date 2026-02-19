// app/account/orders/page.tsx
import Link from "next/link";

const orders = [
    { id: "1001", date: "2026-02-18", total: 199.9, status: "Paid" },
    { id: "1002", date: "2026-02-10", total: 59.5, status: "Processing" },
];

export default function OrdersPage() {
    return (
        <main className="min-h-screen bg-white">
            <div className="mx-auto max-w-4xl px-4 py-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-neutral-900">Orders</h1>
                        <p className="text-sm text-neutral-600">View your order history.</p>
                    </div>

                    <Link
                        href="/account/profile"
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Profile →
                    </Link>
                </div>

                <div className="mt-6 overflow-hidden rounded-lg border border-neutral-200">
                    <div className="grid grid-cols-4 gap-2 bg-neutral-50 px-4 py-3 text-xs font-semibold text-neutral-600">
                        <div>Order</div>
                        <div>Date</div>
                        <div>Status</div>
                        <div className="text-right">Total</div>
                    </div>

                    <div className="divide-y divide-neutral-200">
                        {orders.map((o) => (
                            <Link
                                key={o.id}
                                href={`/account/orders/${o.id}`}
                                className="grid grid-cols-4 gap-2 px-4 py-4 text-sm hover:bg-neutral-50"
                            >
                                <div className="font-semibold text-neutral-900">#{o.id}</div>
                                <div className="text-neutral-700">{o.date}</div>
                                <div className="text-neutral-700">{o.status}</div>
                                <div className="text-right font-semibold text-neutral-900">
                                    ${o.total.toFixed(2)}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
