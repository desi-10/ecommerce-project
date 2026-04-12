"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useCreateReview } from "@/client/reviews";

type Variant = {
    id: string;
    name: string;
    sku: string | null;
    price: string;
    salePrice: string;
    options?: Record<string, string> | null;
};

type Product = {
    id: string;
    name: string;
    description?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    user?: {
        name?: string | null;
        email?: string;
    } | null;
    vendor?: {
        name?: string | null;
    } | null;
    reviews?: any[];
    variants: Variant[];
};

type Props = {
    product: Product;
    selectedVariant?: Variant;
};

export default function ProductTabs({ product, selectedVariant }: Props) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const reviewMutation = useCreateReview();

    const handleSubmitReview = () => {
        reviewMutation.mutate({ productId: product.id, rating, comment }, {
            onSuccess: () => {
                setRating(5);
                setComment("");
            }
        });
    };

    return (
        <section className="border-t border-neutral-200">
            <Tabs defaultValue="description">
                <div className="p-4 border-b overflow-x-auto">
                    <TabsList className="bg-transparent flex gap-6 min-w-max">
                        {[
                            ["description", "Description"],
                            ["spec", "Specification"],
                            ["vendor", "Vendor"],
                            ["reviews", "Reviews"],
                            ["qa", "Questions & Answers"],
                        ].map(([v, label]) => (
                            <TabsTrigger
                                key={v}
                                value={v}
                                className="p-5 whitespace-nowrap"
                            >
                                {label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {/* ================= Description ================= */}
                <TabsContent value="description" className="pt-6">
                    <div className="prose prose-sm max-w-none">
                        {product.description ? (
                            <p>{product.description}</p>
                        ) : (
                            <p className="text-muted-foreground">
                                No description available for this product.
                            </p>
                        )}

                        {/* Optional banner */}
                        <div className="mt-6 border border-neutral-200">
                            <Image
                                src="/martfury/p/description-banner.png"
                                alt="Description banner"
                                className="w-full h-20 object-cover"
                                width={1000}
                                height={200}
                            />
                        </div>
                    </div>
                </TabsContent>

                {/* ================= Specification ================= */}
                <TabsContent value="spec" className="pt-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border border-neutral-200">
                            <tbody>
                                <tr className="border-b">
                                    <td className="p-3 font-medium w-40">Product Name</td>
                                    <td className="p-3">{product.name}</td>
                                </tr>

                                {selectedVariant?.sku && (
                                    <tr className="border-b">
                                        <td className="p-3 font-medium">SKU</td>
                                        <td className="p-3">{selectedVariant.sku}</td>
                                    </tr>
                                )}

                                <tr className="border-b">
                                    <td className="p-3 font-medium">Price</td>
                                    <td className="p-3">
                                        {selectedVariant?.salePrice ?? selectedVariant?.price}
                                    </td>
                                </tr>

                                {selectedVariant?.options &&
                                    Object.entries(selectedVariant.options).map(
                                        ([key, value]) => (
                                            <tr key={key} className="border-b">
                                                <td className="p-3 font-medium capitalize">{key}</td>
                                                <td className="p-3">{value}</td>
                                            </tr>
                                        )
                                    )}

                                <tr>
                                    <td className="p-3 font-medium">Created</td>
                                    <td className="p-3">
                                        {new Date(product.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </TabsContent>

                {/* ================= Vendor ================= */}
                <TabsContent value="vendor" className="pt-6">
                    {product.vendor ? (
                        <div className="space-y-2 text-sm">
                            <p>
                                <span className="font-medium text-blue-600 underline">Vendor:</span>{" "}
                                {product.vendor.name ?? "Unnamed Store"}
                                <p className="text-secondary-foreground">
                                    Trusted seller on Martfury
                                </p>
                            </p>
                        </div>
                    ) : (
                        <div className="text-sm text-muted-foreground">
                            Martfury Official Store
                        </div>
                    )}
                </TabsContent>

                {/* ================= Reviews ================= */}
                <TabsContent value="reviews" className="pt-6 space-y-8">
                    <div className="border p-6 rounded-xl bg-slate-50/50 shadow-sm">
                        <h3 className="font-semibold mb-4 text-gray-900 border-b pb-2">Write a Review</h3>
                        <div className="flex gap-1 text-2xl mb-4">
                            {[1, 2, 3, 4, 5].map(v => (
                                <button
                                    key={v}
                                    onClick={() => setRating(v)}
                                    className={`transition-colors ${v <= rating ? "text-amber-500 hover:text-amber-600" : "text-gray-200 hover:text-amber-300"}`}
                                >★</button>
                            ))}
                        </div>
                        <textarea
                            className="w-full p-4 border border-gray-200 rounded-lg mb-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            rows={3}
                            placeholder="Share your thoughts about this product..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <Button 
                            onClick={handleSubmitReview} 
                            disabled={reviewMutation.isPending}
                            className="bg-blue-600 hover:bg-blue-700 font-semibold"
                        >
                            {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
                        </Button>
                    </div>

                    <div className="space-y-6">
                        <h3 className="font-bold text-xl text-gray-900">
                            Customer Reviews ({product.reviews?.length || 0})
                        </h3>
                        
                        {product.reviews && product.reviews.length > 0 ? (
                            <div className="space-y-6">
                                {product.reviews.map((rev: any) => (
                                    <div key={rev.id} className="border-b border-gray-100 pb-6 last:border-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="h-10 w-10 bg-gray-100 text-gray-600 font-bold rounded-full flex items-center justify-center">
                                                {rev.user?.name?.[0]?.toUpperCase() || "C"}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-gray-900">{rev.user?.name || "Customer"}</span>
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(rev.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="text-amber-500 flex text-sm">
                                                    {Array.from({length: 5}).map((_, i) => (
                                                        <span key={i} className={i < rev.rating ? "opacity-100" : "opacity-30"}>★</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-700 leading-relaxed max-w-3xl ml-14">
                                            {rev.comment}
                                        </p>
                                        
                                        {rev.reply && (
                                            <div className="bg-blue-50/50 border-l-4 border-blue-600 p-4 mt-4 ml-14 rounded-r-lg max-w-3xl">
                                                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1.5 block flex items-center gap-2">
                                                    Store Response
                                                </span>
                                                <p className="text-sm text-gray-800">{rev.reply}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 border border-dashed rounded-xl border-gray-200">
                                <p className="text-muted-foreground text-sm">No reviews yet. Be the first to share your thoughts!</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* ================= Q&A ================= */}
                <TabsContent value="qa" className="pt-6">
                    <div className="text-sm text-muted-foreground text-center p-8 border rounded-md">
                        Have a question about this product? 
                        <br />
                        <Link href="/contact" className="text-blue-600 font-medium">Ask our support team</Link>
                    </div>
                </TabsContent>
            </Tabs>
        </section>
    );
}