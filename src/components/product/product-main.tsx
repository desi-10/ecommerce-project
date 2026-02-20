import MobileStickyBuyBar from "./mobile-sticky-bar";
import ProductGallery from "./product-gallery";
import ProductInfo from "./product-info";
import ProductTabs from "./products-tab";
import RightSidebar from "./right-sidebar";


export default function ProductMain() {
    return (
        <>
            <section className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_320px]">
                {/* Left block: gallery + info */}
                <div>
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[420px_1fr]">
                        <ProductGallery />
                        {/* <ProductInfo /> */}
                    </div>
                    <div className="mt-8 pb-16 md:pb-10 w-full">
                        <ProductTabs />
                    </div>
                </div>
                {/* Right sidebar (desktop only) */}
                <aside className="hidden md:block">
                    <div className="sticky top-36">
                        <RightSidebar />
                    </div>
                </aside>
            </section>

            {/* Mobile sticky buy bar (like screenshot) */}
            <MobileStickyBuyBar />
        </>
    );
}
