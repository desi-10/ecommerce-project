"use client";

import Wrapper from "@/components/wrapper";
import { ProductForm } from "@/components/product/product-form";

export default function NewProductPage() {
    return (
        <main>
            <Wrapper>
                <div className="max-w-5xl mx-auto py-6">
                    <ProductForm />
                </div>
            </Wrapper>
        </main>
    );
}
