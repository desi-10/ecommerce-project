import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AccountSheetContent({
    isLoggedIn,
}: {
    isLoggedIn: boolean;
}) {
    if (!isLoggedIn) {
        return (
            <div className="space-y-3">
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 rounded-sm">
                    <Link href="/auth/sign-in">Sign In</Link>
                </Button>
                <Button asChild variant="outline" className="w-full rounded-sm">
                    <Link href="/auth/sign-up">Register</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <Link href="/account/profile" className="block border p-3 text-sm rounded-sm">
                My Profile
            </Link>
            <Link href="/account/orders" className="block border p-3 text-sm rounded-sm">
                My Orders
            </Link>
            <Button variant="destructive" className="w-full rounded-sm">
                Logout
            </Button>
        </div>
    );
}
