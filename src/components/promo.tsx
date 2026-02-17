import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function PromoBanners() {
    return (
        <section className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="bg-white border rounded-sm overflow-hidden flex items-center">
                <div className="p-5">
                    <div className="text-sm font-semibold">iQOS 2.4 Holder</div>
                    <div className="text-xs text-muted-foreground mt-1">Just $159.99</div>
                    <Button size="sm" className="mt-4 bg-blue-600 hover:bg-blue-700">
                        Shop Now
                    </Button>
                </div>
                <div className="relative ml-auto h-28 w-44">
                    <Image src="/martfury/banner1.png" alt="banner" fill className="object-contain" />
                </div>
            </div>

            <div className="bg-white border rounded-sm overflow-hidden flex items-center">
                <div className="p-5">
                    <div className="text-sm font-semibold">iPhone X 128GB</div>
                    <div className="text-xs text-muted-foreground mt-1">Discount 25% Off</div>
                    <Button size="sm" className="mt-4 bg-blue-600 hover:bg-blue-700">
                        Shop Now
                    </Button>
                </div>
                <div className="relative ml-auto h-28 w-44">
                    <Image src="/martfury/banner2.png" alt="banner" fill className="object-contain" />
                </div>
            </div>
        </section>
    );
}
