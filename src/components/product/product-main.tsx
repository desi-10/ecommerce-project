"use client";

import * as React from "react";
import { useParams } from "next/navigation";

import { useGetProduct } from "@/hooks/use-product";
import MobileStickyBuyBar from "./mobile-sticky-bar";
import ProductGallery from "./product-gallery";
import ProductInfo from "./product-info";
import ProductTabs from "./products-tab";
import RightSidebar from "./right-sidebar";

export default function ProductMain() {
    const params = useParams<{ id: string }>();
    const id = params?.id;

    const { data, isLoading, isError } = useGetProduct(id);
    const product = data?.data; // adjust if your hook returns {message,data}

    const [selectedVariantId, setSelectedVariantId] = React.useState<string>("");

    React.useEffect(() => {
        if (!product?.variants?.length) return;
        setSelectedVariantId((prev) => prev || product.variants[0].id);
    }, [product?.variants]);

    const selectedVariant =
        product?.variants?.find((v: any) => v.id === selectedVariantId) ??
        product?.variants?.[0];

    if (!id) return null;

    if (isLoading) return <div className="py-10">Loading…</div>;
    if (isError || !product) return <div className="py-10">Product not found</div>;

    return (
        <>
            <section className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_320px]">
                {/* Left */}
                <div>
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[420px_1fr]">
                        <ProductGallery
                            images={product.images}
                            mainImage={product.image}
                            variantId={selectedVariant?.id}
                        />

                        <ProductInfo
                            product={product}
                            selectedVariantId={selectedVariantId}
                            onSelectVariant={setSelectedVariantId}
                        />
                    </div>

                    <div className="mt-8 pb-16 md:pb-10 w-full">
                        <ProductTabs product={product} selectedVariant={selectedVariant} />
                    </div>
                </div>

                {/* Right sidebar */}
                <aside className="hidden md:block">
                    <div className="sticky top-36">
                        <RightSidebar product={product} selectedVariant={selectedVariant} />
                    </div>
                </aside>
            </section>

            {/* Mobile sticky buy bar */}
            {/* <MobileStickyBuyBar product={product} selectedVariant={selectedVariant} /> */}
        </>
    );
}