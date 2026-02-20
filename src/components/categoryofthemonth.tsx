"use client"

import { useGetCategories } from "@/hooks/use-category";

export default function CategoryMonth() {
    const { data: categoryData } = useGetCategories()
    const categories = categoryData?.data.categories || []

    return (
        <section className="mt-8 bg-white border rounded-sm p-4">
            <div className="mozilla-text text-xl lg:text-2xl font-bold mb-4">
                Top categories of the month
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {categories.map((c) => (
                    <div
                        key={c.name}
                        className="border rounded-sm bg-white p-4 text-center hover:border-blue-600 hover:shadow-sm transition cursor-pointer"
                    >
                        <div className="relative mx-auto h-24 w-24">
                            {/* <Image
                                src={c.image}
                                alt={c.name}
                                fill
                                className="object-contain"
                            /> */}
                        </div>

                        <div className="mt-3 text-xs font-medium text-gray-700">
                            {c.name}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
