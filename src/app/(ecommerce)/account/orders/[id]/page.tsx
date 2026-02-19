// app/account/orders/[id]/page.tsx
import Link from "next/link";

type Params = { params: { id: string } };

export default function OrderDetailPage({ params }: Params) {
    const id = params.id;

    // demo data (replace with fetch by id)
    const order = {
        id,
        date: "2026-02-18",
        status: "Paid",
        currency: "AUD",
        shipping: "Calculated at checkout",
        items: [
            { name: "Cypress Wallet - Dark Chocolate", qty: 1, price: 99.95 },
            { name: "Ashford Unisex Sandal - Brown", qty: 1, price: 99.95 },
        ],
    };

    const subtotal = order.items.reduce((s, i) => s + i.qty * i.price, 0);

    return (
        <main className="min-h-screen bg-white">
            <div className="mx-auto max-w-4xl px-4 py-10">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <Link href="/account/orders" className="text-sm text-blue-600 hover:underline">
                            ‹ Back to orders
                        </Link>
                        <h1 className="mt-2 text-2xl font-semibold text-neutral-900">
                            Order #{order.id}
                        </h1>
                        <p className="text-sm text-neutral-600">
                            {order.date} • {order.status}
                        </p>
                    </div>

                    <Link href="/account/profile" className="text-sm text-blue-600 hover:underline">
                        Profile →
                    </Link>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
                    {/* Items */}
                    <div className="rounded-lg border border-neutral-200 p-5">
                        <h2 className="text-lg font-semibold text-neutral-900">Items</h2>

                        <div className="mt-4 divide-y divide-neutral-200">
                            {order.items.map((i, idx) => (
                                <div key={idx} className="flex items-center justify-between py-4">
                                    <div>
                                        <div className="text-sm font-semibold text-neutral-900">
                                            {i.name}
                                        </div>
                                        <div className="text-xs text-neutral-500">Qty: {i.qty}</div>
                                    </div>

                                    <div className="text-sm font-semibold text-neutral-900">
                                        ${(i.price * i.qty).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <aside className="rounded-lg border border-neutral-200 p-5 h-fit">
                        <h2 className="text-lg font-semibold text-neutral-900">Summary</h2>

                        <div className="mt-4 space-y-2 text-sm">
                            <div className="flex items-center justify-between text-neutral-700">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>

                            <div className="flex items-center justify-between text-neutral-700">
                                <span>Shipping</span>
                                <span className="text-xs text-neutral-500">{order.shipping}</span>
                            </div>

                            <div className="border-t border-neutral-200 my-3" />

                            <div className="flex items-end justify-between">
                                <div className="text-base font-semibold text-neutral-900">Total</div>
                                <div className="text-right">
                                    <div className="text-xs text-neutral-500">{order.currency}</div>
                                    <div className="text-xl font-semibold text-neutral-900">
                                        ${subtotal.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
