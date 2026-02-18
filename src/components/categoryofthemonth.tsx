import Image from "next/image";
import { Button } from "./ui/button";

const cats = [
    {
        name: "Smartphones",
        image:
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
    },
    {
        name: "Tablets",
        image:
            "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=400&q=80",
    },
    {
        name: "Laptops",
        image:
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
    },
    {
        name: "Headphones",
        image:
            "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?auto=format&fit=crop&w=400&q=80",
    },
    {
        name: "Gaming",
        image:
            "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=400&q=80",
    },
    {
        name: "Accessories",
        image:
            "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=400&q=80",
    },
];

export default function CategoryMonth() {
    return (
        <section className="mt-8 bg-white border rounded-sm p-4">
            <div className="mozilla-text text-xl lg:text-2xl font-bold mb-4">
                Top categories of the month
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {cats.map((c) => (
                    <div
                        key={c.name}
                        className="border rounded-sm bg-white p-4 text-center hover:border-blue-600 hover:shadow-sm transition cursor-pointer"
                    >
                        <div className="relative mx-auto h-24 w-24">
                            <Image
                                src={c.image}
                                alt={c.name}
                                fill
                                className="object-contain"
                            />
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
