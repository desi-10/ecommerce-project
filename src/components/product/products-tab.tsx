"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
    variants: Variant[];
};

type Props = {
    product: Product;
    selectedVariant?: Variant;
};

export default function ProductTabs({ product, selectedVariant }: Props) {
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
                <TabsContent value="reviews" className="pt-6">
                    <div className="text-sm text-muted-foreground p-8 text-center border rounded-md">
                        <p className="font-medium text-foreground">No reviews yet</p>
                        <p>Purchased this product? Be the first to share your thoughts!</p>
                        <Button variant="outline" className="mt-4">Write a Review</Button>
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