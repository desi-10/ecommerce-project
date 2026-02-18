import Link from "next/link";

export default function Breadcrumbs() {
    return (
        <nav className="text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground cursor-pointer">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-foreground cursor-pointer">Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Sound Intone I65 Earphone White Version</span>
        </nav>
    );
}
