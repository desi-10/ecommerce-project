"use client";

import Wrapper from "@/components/wrapper";
import { AddProductForm } from "@/components/product/add-product-form";

export default function NewProductPage() {
    return (
        <main>
            <Wrapper>
                <div className="max-w-5xl mx-auto py-6">
                    <AddProductForm />
                </div>
            </Wrapper>
        </main>
    );
}
