import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs({ 
    productName, 
    categoryName, 
    categorySlug 
}: { 
    productName: string; 
    categoryName?: string; 
    categorySlug?: string;
}) {
    return (
        <nav className="flex items-center gap-2 text-xs text-muted-foreground py-4">
            <Link href="/" className="hover:text-blue-600 transition">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/shop" className="hover:text-blue-600 transition">Shop</Link>
            
            {categoryName && (
                <>
                    <ChevronRight className="h-3 w-3" />
                    <Link 
                        href={`/shop?category=${categorySlug}`} 
                        className="hover:text-blue-600 transition"
                    >
                        {categoryName}
                    </Link>
                </>
            )}
            
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium truncate max-w-[200px] md:max-w-none">
                {productName}
            </span>
        </nav>
    );
}
