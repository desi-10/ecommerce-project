"use client";

import { useGetCategories } from "../hooks/use-category";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";

export default function CategoryMonth() {
    const { t } = useLanguage();
    const { data: categoryData } = useGetCategories();
    const categories = categoryData?.data.categories || [];

    return (
        <section className="mt-8 bg-white border rounded-sm p-4">
            <div className="mozilla-text text-xl lg:text-2xl font-bold mb-4">
                {t("section.category_month", "Top categories of the month")}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {categories.map((c) => (
                    <Link
                        key={c.name}
                        href={`/shop?category=${c.slug}`}
                        className="border rounded-sm bg-white p-4 text-center hover:border-blue-600 hover:shadow-sm transition cursor-pointer"
                    >
                        <div className="relative mx-auto h-24 w-24">
                            <Image
                                src={c.image || "/martfury/product.png"}
                                alt={c.name}
                                fill
                                className="object-contain"
                            />
                        </div>

                        <div className="mt-3 text-xs font-medium text-gray-700">
                            {c.name}
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
