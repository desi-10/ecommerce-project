"use client";

import { useGetProduct } from "@/hooks/use-product";
import { ProductForm } from "@/components/product/product-form";
import Wrapper from "@/components/wrapper";
import { Loader2, AlertCircle } from "lucide-react";
import { useParams } from "next/navigation";

export default function EditProductPage() {
    const params = useParams();
    const id = params.id as string;
    
    const { data: productData, isLoading, isError, error } = useGetProduct(id);

    return (
        <main>
            <Wrapper>
                <div className="max-w-5xl mx-auto py-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
                            <p className="text-gray-500 font-medium">Loading product details...</p>
                        </div>
                    ) : isError ? (
                        <div className="flex items-start gap-3 rounded-lg bg-red-50 p-6 border border-red-200">
                            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-lg font-semibold text-red-900">Error loading product</h3>
                                <p className="text-red-700 mt-1">{(error as Error)?.message || "The product could not be found or there was a server error."}</p>
                            </div>
                        </div>
                    ) : (
                        <ProductForm initialData={productData?.data} isEdit={true} />
                    )}
                </div>
            </Wrapper>
        </main>
    );
}
