import Image from "next/image";
import Link from "next/link";
import { useGetProducts } from "@/hooks/use-product";

import { ProductListSkeleton } from "@/components/ui/skeletons";

type Props = {
    product?: any;
    selectedVariant?: any;
};

export default function RightSidebar({ product }: Props) {
    const mainCategory = product?.categories?.[0]?.category;
    const isBrandAvailable = !!product?.brand;
    
    // Attempt to fetch from same category (or fallback to recent)
    const { data: relatedData, isLoading } = useGetProducts({ 
        category: mainCategory?.slug,
        limit: 4 
    });

    // Filter out the current product so it doesn't show in its own sidebar
    const relatedProducts = relatedData?.data?.products
        ?.filter((p: any) => p.id !== product?.id)
        .slice(0, 3) || [];

    const formatPrice = (price?: string | number) => {
        if (!price) return "$0.00";
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(Number(price));
    };

    return (
        <div className="space-y-4">
            {/* Service box */}
            <div className="border border-neutral-200 bg-white p-4 rounded-md shadow-sm">
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
            <div className="border border-neutral-200 bg-white p-4 rounded-md shadow-sm">
                <div className="relative h-36 w-full">
                    <Image
                        src="/martfury/p/sidebar-ad.png"
                        alt="Sidebar ad"
                        fill
                        className="object-contain"
                    />
                </div>
            </div>

            {/* Same category / Brand */}
            <div className="border border-neutral-200 bg-white rounded-md shadow-sm overflow-hidden">
                <div className="px-4 py-3 font-semibold text-sm border-b">
                    {mainCategory ? `More from ${mainCategory.name}` : (isBrandAvailable ? "Same Brand" : "Related Products")}
                </div>

                <div className="divide-y relative min-h-[100px]">
                    {isLoading ? (
                        <div className="p-3">
                            <ProductListSkeleton count={2} />
                        </div>
                    ) : relatedProducts.length > 0 ? (
                        relatedProducts.map((p: any) => (
                            <Link href={`/shop/${p.id}`} key={p.id} className="block p-4 hover:bg-slate-50 transition-colors group">
                                <div className="relative h-28 w-full bg-white">
                                    <Image
                                        src={p.image || "/martfury/product.png"}
                                        alt={p.name}
                                        fill
                                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                <div className="mt-3 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                                    {p.brand || p.vendor?.name || "Martfury"}
                                </div>
                                <div className="mt-1 text-xs font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    {p.name}
                                </div>

                                <div className="mt-1 flex items-center text-amber-500 text-xs">
                                    ★★★★☆ <span className="mx-1 text-muted-foreground">({p.reviews?.length || 0})</span>
                                </div>
                                <div className="mt-1.5 flex items-center gap-2">
                                    <span className="text-sm font-bold text-gray-900">
                                        {formatPrice(p.variants?.[0]?.salePrice || p.variants?.[0]?.price)}
                                    </span>
                                    {p.variants?.[0]?.salePrice && (
                                        <span className="text-xs text-gray-400 line-through">
                                            {formatPrice(p.variants?.[0]?.price)}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="p-4 text-center text-xs text-muted-foreground">
                            No related products found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
