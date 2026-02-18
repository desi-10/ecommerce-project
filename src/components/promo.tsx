import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PromoBanners() {
    return (
        <section className="mt-6 grid md:grid-cols-2 gap-4">

            {/* Banner 1 */}
            <div className="relative h-64 rounded-sm overflow-hidden border">
                <Image
                    src="https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1200&q=80"
                    alt="iQOS"
                    fill
                    className="object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Content */}
                <div className="relative z-10 p-6 flex flex-col justify-center h-full text-white">
                    <div className="text-lg font-semibold">iQOS 2.4 Holder</div>
                    <div className="text-sm mt-1 opacity-90">Just $159.99</div>

                    <Link href="/product">
                        <Button
                            size="sm"
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white w-fit"
                        >
                            Shop Now
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Banner 2 */}
            <div className="relative h-64 rounded-sm overflow-hidden border">
                <Image
                    src="https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?auto=format&fit=crop&w=1200&q=80"
                    alt="iPhone"
                    fill
                    className="object-cover"
                />

                <div className="absolute inset-0 bg-black/40" />

                <div className="relative z-10 p-6 flex flex-col justify-center h-full text-white">
                    <div className="text-lg font-semibold">iPhone X 128GB</div>
                    <div className="text-sm mt-1 opacity-90">Discount 25% Off</div>

                    <Link href="/product">
                        <Button
                            size="sm"
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white w-fit"
                        >
                            Shop Now
                        </Button>
                    </Link>
                </div>
            </div>

        </section>
    );
}
