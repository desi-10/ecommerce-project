import Image from "next/image";

const cats = [
    "Smartphone",
    "Tablets",
    "Laptops",
    "Sounds",
    "Technology Toys",
    "Accessories",
];

export default function CategoryMonth() {
    return (
        <section className="mt-8 bg-white border rounded-sm p-4">
            <div className="font-bold mb-4">Top categories of the month</div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {cats.map((c) => (
                    <button
                        key={c}
                        className="border rounded-sm bg-white p-4 text-center hover:border-blue-600 transition"
                    >
                        <div className="relative mx-auto h-12 w-14">
                            <Image src="/martfury/category.png" alt={c} fill className="object-contain" />
                        </div>
                        <div className="mt-3 text-xs text-muted-foreground">{c}</div>
                    </button>
                ))}
            </div>
        </section>
    );
}
