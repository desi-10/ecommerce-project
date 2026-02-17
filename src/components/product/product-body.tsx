import Wrapper from "../wrapper";
import Breadcrumbs from "./breadcrumbs";
import ProductMain from "./product-main";


export default function ProductPageBody() {
    return (
        <main className="bg-white">
            <Wrapper>
                <div className="py-3">
                    <Breadcrumbs />
                </div>

                {/* Top: gallery + details + right sidebar */}
                <ProductMain />

            </Wrapper>
        </main>
    );
}
