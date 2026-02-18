export default function OrdersSection() {
    const orders = [
        {
            id: "#1024",
            date: "Feb 10, 2026",
            total: 129.99,
            status: "Delivered",
        },
        {
            id: "#1023",
            date: "Feb 02, 2026",
            total: 89.99,
            status: "Processing",
        },
    ];

    return (
        <div>
            <h1 className="text-xl font-semibold">My Orders</h1>
            <p className="mt-1 text-sm text-muted-foreground">
                View your recent purchases.
            </p>

            <div className="mt-6 border border-neutral-200">
                <div className="grid grid-cols-4 text-xs font-semibold border-b p-3 bg-neutral-50">
                    <div>Order</div>
                    <div>Date</div>
                    <div>Total</div>
                    <div>Status</div>
                </div>

                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="grid grid-cols-4 text-sm p-3 border-b last:border-b-0"
                    >
                        <div className="text-blue-600 cursor-pointer">
                            {order.id}
                        </div>
                        <div>{order.date}</div>
                        <div>${order.total.toFixed(2)}</div>
                        <div>
                            <span
                                className={`px-2 py-1 text-xs rounded ${order.status === "Delivered"
                                    ? "bg-green-100 text-green-600"
                                    : "bg-yellow-100 text-yellow-600"
                                    }`}
                            >
                                {order.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
