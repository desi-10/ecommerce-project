import ShopResultsWithSidebar from "@/components/shop/shop-results";
import Wrapper from "@/components/wrapper";

export default function Page() {
    return (
        <div className="bg-gray-100 py-20">
            <Wrapper>

                <ShopResultsWithSidebar />
            </Wrapper>
        </div>
    );
}
