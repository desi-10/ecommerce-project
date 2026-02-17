import Image from "next/image";

export default function ProductGridCard({
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
        <div className="border border-neutral-200 bg-white p-3 hover:shadow-sm transition">
            <div className="relative aspect-square w-full">
                <Image src={p.image} alt={p.name} fill className="object-contain p-4" />
            </div>

            <div className="mt-2 text-[11px] text-muted-foreground">{p.brand}</div>

            <div className="mt-1 text-xs font-medium text-blue-600 line-clamp-2 hover:underline cursor-pointer">
                {p.name}
            </div>

            <div className="mt-1 text-xs text-yellow-500">
                {"★★★★☆"} <span className="text-muted-foreground">({p.reviews})</span>
            </div>

            <div className="mt-1 flex items-center gap-2">
                <div className="text-sm font-semibold">${p.price.toFixed(2)}</div>
                {p.oldPrice && (
                    <div className="text-xs text-muted-foreground line-through">
                        ${p.oldPrice.toFixed(2)}
                    </div>
                )}
            </div>
        </div>
    );
}
