import Image from "next/image";

const sameBrand = [
    { id: 1, name: "Acrylic Cover Case for iPhone X (Clear)", price: "$16.99" },
    { id: 2, name: "Anna Sui Putty Mask Perfection", price: "$89.99" },
    { id: 3, name: "Apple TV 4K — 32 GB (4th Generation)", price: "$96.99" },
];

export default function RightSidebar() {
    return (
        <div className="space-y-4">
            {/* Service box */}
            <div className="border border-neutral-200 bg-white p-4">
                <ul className="space-y-3 text-xs text-muted-foreground">
                    <li className="flex gap-3">
                        <span className="mt-0.5">🌐</span> Shipping worldwide
                    </li>
                    <li className="flex gap-3">
                        <span className="mt-0.5">↩️</span> Free 7-day return if eligible, so easy
                    </li>
                    <li className="flex gap-3">
                        <span className="mt-0.5">🧾</span> Supplier give bills for this product.
                    </li>
                    <li className="flex gap-3">
                        <span className="mt-0.5">💳</span> Pay online or when receiving goods
                    </li>
                </ul>
                <div className="mt-4 text-xs text-muted-foreground">
                    Sell on Martfury? <span className="text-blue-600 cursor-pointer">Register Now !</span>
                </div>
            </div>

            {/* Ad block */}
            <div className="border border-neutral-200 bg-white p-4">
                <div className="relative h-36 w-full">
                    <Image
                        src="/martfury/p/sidebar-ad.png"
                        alt="Sidebar ad"
                        fill
                        className="object-contain"
                    />
                </div>
            </div>

            {/* Same brand */}
            <div className="border border-neutral-200 bg-white">
                <div className="px-4 py-3 font-semibold text-sm border-b">Same Brand</div>

                <div className="divide-y">
                    {sameBrand.map((p) => (
                        <div key={p.id} className="p-4">
                            <div className="relative h-28 w-full">
                                <Image
                                    src="/martfury/product.png"
                                    alt={p.name}
                                    fill
                                    className="object-contain"
                                />
                            </div>

                            <div className="mt-2 text-[11px] text-muted-foreground">YOUNG SHOP</div>
                            <div className="mt-1 text-xs font-medium line-clamp-2">{p.name}</div>

                            <div className="mt-1 text-yellow-500 text-xs">★★★★☆ <span className="text-muted-foreground">(2)</span></div>
                            <div className="mt-1 text-sm font-semibold">{p.price}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
