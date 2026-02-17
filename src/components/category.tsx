export default function CategorySection() {
    return (
        <section className="container mx-auto px-4 py-12">
            <h2 className="text-xl font-bold mb-6">
                Top categories of the month
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {["Smartphone", "Tablets", "Laptops", "Sounds", "Toys", "Accessories"].map(
                    (cat) => (
                        <div
                            key={cat}
                            className="bg-white p-4 text-center border rounded hover:border-blue-600"
                        >
                            <img src="/category.png" className="h-16 mx-auto" />
                            <p className="mt-3 text-sm">{cat}</p>
                        </div>
                    )
                )}
            </div>
        </section>
    );
}
