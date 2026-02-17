import Image from "next/image";
import Link from "next/link";
import Wrapper from "./wrapper";
import { ChevronRight } from "lucide-react";

const categories = [
    "Smartphone",
    "Tablets",
    "Laptops",
    "Sounds",
    "Technology Toys",
    "Accessories",
    "Health & Beauty",
    "Home & Garden",
    "Fashion",
];

export function HeroWithCategories() {
    return (
        <section className="">
            <Wrapper>
                <div className="py-6 md:py-8 grid gap-4 md:grid-cols-[280px_1fr]">
                    {/* Left categories */}
                    <aside className="hidden md:block border border-neutral-200 bg-white">
                        <div className="px-4 py-3 text-sm font-semibold border-b">
                            Shop by Department
                        </div>
                        <ul className="py-2 ">
                            {categories.map((c) => (
                                <li key={c}>
                                    <Link
                                        href={`/shop?category=${encodeURIComponent(c)}`}
                                        className="px-4 py-2 flex items-center justify-between text-sm text-neutral-700 hover:bg-neutral-50"
                                    >
                                        <span>{c}</span>
                                        <ChevronRight className="h-4 w-4 text-neutral-400" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    {/* Right banner */}
                    <div className="bg-white border border-neutral-200 bg-[linear-gradient(120deg,#f7f7f8,transparent)] overflow-hidden">
                        <div className="grid md:grid-cols-2 items-center gap-6 p-5 md:p-10">
                            <div>
                                <p className="text-xs text-blue-600 font-semibold">
                                    Weekend Promotions
                                </p>
                                <h1 className="mt-2 text-3xl md:text-4xl font-bold leading-tight">
                                    Mini Helicopter <br /> Mini Helicopter
                                </h1>
                                <p className="mt-2 text-lg text-green-600 font-semibold">
                                    sale 40% Off
                                </p>
                                <Link
                                    href="/shop"
                                    className="inline-flex mt-5 rounded-sm bg-blue-600 px-5 py-2.5 text-white font-semibold hover:bg-blue-700"
                                >
                                    Shop Now
                                </Link>
                            </div>

                            <div className="relative h-44 md:h-56">
                                <Image
                                    src="/martfury/drone.png"
                                    alt="Hero product"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Wrapper>
        </section>
    );
}
