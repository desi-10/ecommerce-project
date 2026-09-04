"use client";

import Wrapper from "./wrapper";
import { useLanguage } from "@/context/language-context";
import { LanguageSwitcher } from "./language-switcher";

export default function TopMiniBar() {
  const { t } = useLanguage();

  return (
    <div className="hidden md:block bg-neutral-50 border-b">
      <Wrapper>
        <div className="py-2 text-xs text-muted-foreground flex items-center justify-between">
          <div>
            {t("topbar.shopping_center", "Shopping center for all orders over $100")}
          </div>
          <div className="flex items-center gap-6">
            <button className="hover:text-foreground transition">
              {t("topbar.store_location", "Store Location")}
            </button>
            <button className="hover:text-foreground transition">
              {t("topbar.track_order", "Track Your Order")}
            </button>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-foreground">GHS (GH₵)</span>
              <span className="text-muted-foreground">|</span>
              <LanguageSwitcher variant="dropdown" />
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
