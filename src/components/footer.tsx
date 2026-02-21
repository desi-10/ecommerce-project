"use client";

import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Wrapper from "./wrapper";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: data.message || "Failed to subscribe",
                });
                return;
            }

            toast({
                title: "Success",
                description: "Successfully subscribed to newsletter",
            });

            setEmail("");
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to subscribe to newsletter",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer className=" bg-white border-t">
            <Wrapper>
                <div className="py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="font-semibold mb-3">Quick links</div>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary">Policy</Link></li>
                            <li><Link href="#" className="hover:text-primary">Term & Condition</Link></li>
                            <li><Link href="#" className="hover:text-primary">Shipping</Link></li>
                            <li><Link href="#" className="hover:text-primary">Return</Link></li>
                            <li><Link href="#" className="hover:text-primary">FAQs</Link></li>
                        </ul>
                    </div>

                    <div>
                        <div className="font-semibold mb-3">Company</div>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
                            <li><Link href="#" className="hover:text-primary">Affiliate</Link></li>
                            <li><Link href="#" className="hover:text-primary">Career</Link></li>
                            <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <div className="font-semibold mb-3">Business</div>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary">Our Press</Link></li>
                            <li><Link href="/shop" className="hover:text-primary">Checkout</Link></li>
                            <li><Link href="/account" className="hover:text-primary">My account</Link></li>
                            <li><Link href="/shop" className="hover:text-primary">Shop</Link></li>
                        </ul>
                    </div>

                    <div>
                        <div className="font-semibold mb-3">Newsletter</div>
                        <form onSubmit={handleNewsletterSubmit} className="flex">
                            <Input
                                placeholder="Email Address"
                                className="rounded-r-none"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Button
                                className="rounded-l-none bg-blue-600 hover:bg-blue-700"
                                disabled={loading}
                                type="submit"
                            >
                                {loading ? "..." : "Subscribe"}
                            </Button>
                        </form>
                        <div className="mt-3 text-xs text-muted-foreground">
                            Subscribe to get special offers and updates
                        </div>
                    </div>
                </div>

                <Separator />
                <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground flex items-center justify-between">
                    <span>©2024 Martfury. All Rights Reserved.</span>
                    <span className="hidden sm:inline">We Using Safe Payment For</span>
                </div>
            </Wrapper>
        </footer>
    );
}
