import Image from "next/image";

export default function CategorySection() {
    return (
        <section className="container mx-auto px-4 py-12">
            <h2 className="mozilla-text text-xl lg:text-2xl font-bold mb-6">
                Top categories of the month
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {["Smartphone", "Tablets", "Laptops", "Sounds", "Toys", "Accessories"].map(
                    (cat) => (
                        <div
                            key={cat}
                            className="bg-white p-4 text-center border rounded hover:border-blue-600"
                        >
                            <Image src="/category.png" alt={cat} className="h-20 mx-auto" width={1000} height={1000} />
                            <p className="mt-3 text-sm">{cat}</p>
                        </div>
                    )
                )}
            </div>
        </section>
    );
}
