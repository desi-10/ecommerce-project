"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";

export default function MobileStickyBuyBar() {
    const { t } = useLanguage();

    return (
        <div className="md:hidden fixed left-0 right-0 bottom-16 z-40 border-t border-neutral-200 bg-yellow-500">
            <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
                <Button className="h-10 rounded-sm bg-black hover:bg-black/90 w-1/2">
                    {t("product.add_to_cart", "Add to cart")}
                </Button>
                <Button className="h-10 rounded-sm bg-white text-black hover:bg-white/90 w-1/2">
                    {t("product.buy_now", "Buy Now")}
                </Button>
            </div>
        </div>
    );
}
