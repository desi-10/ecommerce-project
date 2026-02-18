import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Wrapper from "./wrapper";

export default function Footer() {
    return (
        <footer className=" bg-white border-t">
            <Wrapper>
                <div className="py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="font-semibold mb-3">Quick links</div>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>Policy</li>
                            <li>Term & Condition</li>
                            <li>Shipping</li>
                            <li>Return</li>
                            <li>FAQs</li>
                        </ul>
                    </div>

                    <div>
                        <div className="font-semibold mb-3">Company</div>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>About Us</li>
                            <li>Affiliate</li>
                            <li>Career</li>
                            <li>Contact</li>
                        </ul>
                    </div>

                    <div>
                        <div className="font-semibold mb-3">Business</div>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>Our Press</li>
                            <li>Checkout</li>
                            <li>My account</li>
                            <li>Shop</li>
                        </ul>
                    </div>

                    <div>
                        <div className="font-semibold mb-3">Newsletter</div>
                        <div className="flex">
                            <Input placeholder="Email Address" className="rounded-r-none" />
                            <Button className="rounded-l-none bg-blue-600 hover:bg-blue-700">
                                Subscribe
                            </Button>
                        </div>
                        <div className="mt-3 text-xs text-muted-foreground">
                            We use safe payment for
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
