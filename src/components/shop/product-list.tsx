import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProductListRow({
    p,
}: {
    p: {
        brand: string;
        name: string;
        price: number;
        oldPrice: number | null;
        rating: number;
        reviews: number;
        image: string;
    };
}) {
    return (
        <div className="border border-neutral-200 bg-white p-4">
            <div className="grid grid-cols-[120px_1fr_160px] gap-4 items-start">
                <div className="relative aspect-square w-full">
                    <Image src={p.image} alt={p.name} fill className="object-contain p-2" />
                </div>

                <div className="min-w-0">
                    <div className="text-[11px] text-muted-foreground">{p.brand}</div>
                    <Link href="/shop/1" className="mt-1 text-sm font-medium text-blue-600 hover:underline cursor-pointer line-clamp-2">
                        {p.name}
                    </Link>

                    <div className="mt-2 text-xs text-yellow-500">
                        {"★★★★☆"} <span className="text-muted-foreground">({p.reviews})</span>
                    </div>

                    <ul className="mt-3 text-xs text-muted-foreground list-disc pl-4 space-y-1">
                        <li>Portable and lightweight</li>
                        <li>High quality build</li>
                        <li>Fast delivery</li>
                    </ul>
                </div>

                <div className="text-right">
                    <div className="text-sm font-semibold">${p.price.toFixed(2)}</div>
                    {p.oldPrice && (
                        <div className="text-xs text-muted-foreground line-through">
                            ${p.oldPrice.toFixed(2)}
                        </div>
                    )}
                    <Button className="">
                        Add to cart
                    </Button>
                </div>
            </div>
        </div>
    );
}
