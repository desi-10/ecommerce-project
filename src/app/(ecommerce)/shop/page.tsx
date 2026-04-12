import { Suspense } from "react";
import ShopResultsWithSidebar from "@/components/shop/shop-results";
import Wrapper from "@/components/wrapper";

export default function Page() {
    return (
        <div className="bg-gray-100 py-20">
            <Wrapper>
                <Suspense fallback={<div className="py-20 text-center">Loading shop...</div>}>
                    <ShopResultsWithSidebar />
                </Suspense>
            </Wrapper>
        </div>
    );
}
