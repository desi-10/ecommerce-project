import ProductPageBody from "@/components/product/product-body";

export default function Page() {
    // later: load by slug
    return (
        <div className="bg-white py-20">
            {/* Navbar already exists above */}
            <ProductPageBody />
            {/* Footer already exists below */}
        </div>
    );
}
