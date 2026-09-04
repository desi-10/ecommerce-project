"use client";

import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Wrapper from "./wrapper";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/context/language-context";

export default function Footer() {
    const { t } = useLanguage();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            await res.json();
            setEmail("");
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    return (
        <footer className=" bg-white border-t">
            <Wrapper>
                <div className="py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="font-semibold mb-3">{t("footer.quick_links", "Quick links")}</div>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/privacy-policy" className="hover:text-primary">{t("footer.policy", "Policy")}</Link></li>
                            <li><Link href="/terms" className="hover:text-primary">{t("footer.terms", "Terms & Conditions")}</Link></li>
                            <li><Link href="/refund-policy" className="hover:text-primary">{t("footer.shipping", "Shipping")}</Link></li>
                            <li><Link href="/refund-policy" className="hover:text-primary">{t("footer.returns", "Returns")}</Link></li>
                            <li><Link href="/contact" className="hover:text-primary">{t("footer.faqs", "FAQs")}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <div className="font-semibold mb-3">{t("footer.company", "Company")}</div>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary">{t("footer.about", "About Us")}</Link></li>
                            <li><Link href="/about" className="hover:text-primary">{t("footer.affiliate", "Affiliate")}</Link></li>
                            <li><Link href="/about" className="hover:text-primary">{t("footer.careers", "Careers")}</Link></li>
                            <li><Link href="/contact" className="hover:text-primary">{t("footer.contact", "Contact")}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <div className="font-semibold mb-3">{t("footer.business", "Business")}</div>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/blog" className="hover:text-primary">{t("footer.our_press", "Our Press")}</Link></li>
                            <li><Link href="/checkout" className="hover:text-primary">{t("footer.checkout", "Checkout")}</Link></li>
                            <li><Link href="/account" className="hover:text-primary">{t("footer.my_account", "My account")}</Link></li>
                            <li><Link href="/shop" className="hover:text-primary">{t("footer.shop", "Shop")}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <div className="font-semibold mb-3">{t("footer.newsletter", "Newsletter")}</div>
                        <form onSubmit={handleNewsletterSubmit} className="flex">
                            <Input
                                placeholder={t("footer.email_placeholder", "Email Address")}
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
                                {loading ? "..." : t("footer.subscribe", "Subscribe")}
                            </Button>
                        </form>
                        <div className="mt-3 text-xs text-muted-foreground">
                            {t("footer.newsletter_desc", "Subscribe to get special offers and updates")}
                        </div>
                    </div>
                </div>

                <Separator />
                <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground flex items-center justify-between">
                    <span>{t("footer.rights", "©2026 Martfury. All Rights Reserved.")}</span>
                    <span className="hidden sm:inline">{t("footer.safe_payment", "We Using Safe Payment For")}</span>
                </div>
            </Wrapper>
        </footer>
    );
}
