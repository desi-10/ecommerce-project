"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "tw";

export const translations = {
  en: {
    // Navigation & Topbar
    "nav.home": "Home",
    "nav.shop": "Shop",
    "nav.about": "About Us",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "nav.dashboard": "Dashboard",
    "nav.admin_dashboard": "Admin Dashboard",
    "topbar.shopping_center": "Shopping center for all orders over GH₵100",
    "topbar.store_location": "Store Location",
    "topbar.track_order": "Track Your Order",

    // Header & Search
    "search.all_categories": "All Categories",
    "search.placeholder": "I'm shopping for...",
    "search.mobile_placeholder": "Search something...",
    "search.button": "Search",
    "auth.login": "Login",
    "auth.register": "Register",
    "nav.navigation": "Navigation",

    // Hero Banner
    "hero.exclusive_deals": "Exclusive Deals",
    "hero.up_to_50_off": "Up to 50% Off",
    "hero.shop_now": "Shop Now",
    "hero.view_all_deals": "View all deals",
    "hero.new_arrival": "New Arrival",
    "hero.discover_now": "Discover Now →",
    "hero.limited_time": "Limited Time",
    "hero.save_big": "Save Big Today →",

    // Cart & Wishlist
    "cart.title": "Cart",
    "cart.your_cart": "Your Cart",
    "cart.empty": "Your cart is empty",
    "cart.empty_desc": "Add items to your cart to see them here.",
    "cart.checkout": "Checkout",
    "cart.subtotal": "Subtotal",
    "cart.total": "Total",
    "cart.add": "Add to cart",
    "cart.in_cart": "In Cart",
    "cart.continue_shopping": "Continue shopping",
    "wishlist.title": "Wishlist",
    "wishlist.your_wishlist": "Your Wishlist",
    "wishlist.empty": "Your wishlist is empty",
    "wishlist.empty_desc": "Save items you love for later.",
    "wishlist.view": "View",

    // Features
    "feature.free_delivery.title": "Free Delivery",
    "feature.free_delivery.desc": "For all orders over GH₵50",
    "feature.return.title": "90 Days Return",
    "feature.return.desc": "If goods have problems",
    "feature.payment.title": "Secure Payment",
    "feature.payment.desc": "100% secure payment",
    "feature.support.title": "24/7 Support",
    "feature.support.desc": "Dedicated support",

    // Sections & Products
    "section.category_month": "Top categories of the month",
    "section.deal_of_day": "Deal of the day",
    "section.end_in": "End in:",
    "section.view_all": "View All",
    "section.groceries": "Fresh Groceries & Daily Essentials",
    "section.electronics": "Digital Electronics & Accessories",
    "banner.summer_fashion": "Summer Fashion",
    "banner.summer_discount": "Up to 40% off selected styles",
    "status.fetching_styles": "Fetching the latest styles...",
    "status.failed_load": "Failed to load products.",
    "status.no_products": "No products found.",
    "product.each": "each",
    "product.out_of_stock": "Out of stock",
    "product.in_cart_badge": "In cart ✓",
    "product.add_to_cart": "Add to cart",
    "product.buy_now": "Buy Now",
    "product.wishlisted": "Wishlisted",
    "product.add_to_wishlist": "Add to wishlist",
    "product.sale": "Sale",

    // Footer
    "footer.quick_links": "Quick links",
    "footer.company": "Company",
    "footer.business": "Business",
    "footer.newsletter": "Newsletter",
    "footer.subscribe": "Subscribe",
    "footer.email_placeholder": "Email Address",
    "footer.newsletter_desc": "Subscribe to get special offers and updates",
    "footer.rights": "©2026 Martfury. All Rights Reserved.",
    "footer.safe_payment": "We Using Safe Payment For",
    "footer.policy": "Policy",
    "footer.terms": "Terms & Conditions",
    "footer.shipping": "Shipping",
    "footer.returns": "Returns",
    "footer.faqs": "FAQs",
    "footer.about": "About Us",
    "footer.affiliate": "Affiliate",
    "footer.careers": "Careers",
    "footer.contact": "Contact",
    "footer.our_press": "Our Press",
    "footer.checkout": "Checkout",
    "footer.my_account": "My account",
    "footer.shop": "Shop",

    // Account & Mobile
    "account.title": "Account",
    "language.title": "Language",
    "language.en": "English",
    "language.tw": "Twi",
  },
  tw: {
    // Navigation & Topbar
    "nav.home": "Ahyaseɛ",
    "nav.shop": "Guadwam",
    "nav.about": "Yɛn Ho Asɛm",
    "nav.blog": "Nsɛm Kwa",
    "nav.contact": "Nkitahodi",
    "nav.dashboard": "Panin Krasiam",
    "nav.admin_dashboard": "Panin Krasiam",
    "topbar.shopping_center": "Guadwam kɛseɛ ma mpotamu nneɛma a ɛboro GH₵100 nyinaa",
    "topbar.store_location": "Beaeɛ a Yɛwɔ",
    "topbar.track_order": "Di Wo Nneɛma Akyi",

    // Header & Search
    "search.all_categories": "Nneɛma Mmoa Nyinaa",
    "search.placeholder": "Rɛhwehwɛ nneɛma bi a wobɛtɔ...",
    "search.mobile_placeholder": "Hwehwɛ adeɛ bi...",
    "search.button": "Hwehwɛ",
    "auth.login": "Wura Mu",
    "auth.register": "Kyerɛ Wo Dzin Mu",
    "nav.navigation": "Akwanmuka",

    // Hero Banner
    "hero.exclusive_deals": "Nneɛma a Ɛsom Boɔ soronko",
    "hero.up_to_50_off": "So ate kɔsi 50%",
    "hero.shop_now": "Tɔ Seesei",
    "hero.view_all_deals": "Hwɛ nneɛma a agye boɔ nyinaa",
    "hero.new_arrival": "Deɛ Ɛbaaeɛ Foforɔ",
    "hero.discover_now": "Hwehwɛ Mu Seesei →",
    "hero.limited_time": "Bere Tiawa",
    "hero.save_big": "Gye Sika Kɛseɛ Nnɛ →",

    // Cart & Wishlist
    "cart.title": "Kɛntɛn",
    "cart.your_cart": "Wo Kɛntɛn",
    "cart.empty": "Gye sɛ nneɛma biara nni wo kɛntɛn mu",
    "cart.empty_desc": "De nneɛma gu wo kɛntɛn mu na hwɛ wɔ ha.",
    "cart.checkout": "Tua Ka",
    "cart.subtotal": "Sika Aka Nyinaa",
    "cart.total": "Ka a Wɔtua Nyinaa",
    "cart.add": "De Gu Kɛntɛn Mu",
    "cart.in_cart": "Egu Kɛntɛn Mu Dadaw",
    "cart.continue_shopping": "Kɔ So Tɔ Nneɛma",
    "wishlist.title": "Deɛ Me Pɛ",
    "wishlist.your_wishlist": "Deɛ Me Pɛ Nyinaa",
    "wishlist.empty": "Gye sɛ nneɛma biara nni deɛ wo pɛ mu",
    "wishlist.empty_desc": "Kora nneɛma a wo pɛ ma daakye.",
    "wishlist.view": "Hwɛ",

    // Features
    "feature.free_delivery.title": "De Kɔ Ma Wo Kwa",
    "feature.free_delivery.desc": "Wɔ nneɛma a ɛboro GH₵50 nyinaa so",
    "feature.return.title": "Nda 90 San De Brɛ Yɛn",
    "feature.return.desc": "Sɛ nneɛma no nni kwan so a",
    "feature.payment.title": "Banbɔ Akatua",
    "feature.payment.desc": "100% banbɔ akatua pa",
    "feature.support.title": "Nkitahodi Bere Nyinaa (24/7)",
    "feature.support.desc": "Nkitahodi a ɛyɛ fɛ",

    // Sections & Products
    "section.category_month": "Nneɛma Mmoa a Ɛsom Boɔ Wɔ Bosome Mu",
    "section.deal_of_day": "Adeɛ a Ɛsom Boɔ Nnɛ",
    "section.end_in": "Ɛtwam wɔ:",
    "section.view_all": "Hwɛ Ne Nyinaa",
    "section.groceries": "Aduan Foforɔ & Da Biara Nneɛma",
    "section.electronics": "Elektrɔniks & Nneɛma Nketewa",
    "banner.summer_fashion": "Ahuhuro Bere Ntadeɛ",
    "banner.summer_discount": "So ate kɔsi 40% wɔ ntadeɛ bi so",
    "status.fetching_styles": "Rɛwefɛ ntadeɛ foforɔ no...",
    "status.failed_load": "Nneɛma no amba yie.",
    "status.no_products": "Amanya nneɛma biara.",
    "product.each": "biara",
    "product.out_of_stock": "Nsene nni hɔ",
    "product.in_cart_badge": "Egu kɛntɛn mu ✓",
    "product.add_to_cart": "De gu kɛntɛn mu",
    "product.buy_now": "Tɔ Seesei",
    "product.wishlisted": "Ekora Mu Dadaw",
    "product.add_to_wishlist": "De ka deɛ me pɛ ho",
    "product.sale": "So Ate",

    // Footer
    "footer.quick_links": "Nkitahodi Ntɛm",
    "footer.company": "Kɔmpani",
    "footer.business": "Dwa / Adwuma",
    "footer.newsletter": "Krasiam Nsɛm",
    "footer.subscribe": "Mene Ho Dzin",
    "footer.email_placeholder": "Wo Email Beaeɛ",
    "footer.newsletter_desc": "Mene wo dzin na nya nneɛma a agye boɔ ne afoforɔ",
    "footer.rights": "©2026 Martfury. Wɔabɔ ne nyinaa ho ban.",
    "footer.safe_payment": "Yɛde Banbɔ Tua Ka Di Dwuma Ma",
    "footer.policy": "Mmara & Nhyehyɛeɛ",
    "footer.terms": "Mmara ne Ahyɛdeɛ",
    "footer.shipping": "De Kɔ Ma Wo",
    "footer.returns": "De San Brɛ Yɛn",
    "footer.faqs": "Nsemmisa ne Mmuaeɛ",
    "footer.about": "Yɛn Ho Asɛm",
    "footer.affiliate": "Nkitahodi Dwuma",
    "footer.careers": "Adwuma Beaeɛ",
    "footer.contact": "Nkitahodi",
    "footer.our_press": "Yɛn Dawurbɔ",
    "footer.checkout": "Tua Ka",
    "footer.my_account": "Me Akawnt",
    "footer.shop": "Guadwam",

    // Account & Mobile
    "account.title": "Me Akawnt",
    "language.title": "Kasa",
    "language.en": "English",
    "language.tw": "Twi",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey | string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "martfury_lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY) as Language;
      if (stored === "en" || stored === "tw") {
        setLanguageState(stored);
      }
    } catch {
      // localStorage read failed or not available
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    } catch {
      // localStorage write failed
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "tw" : "en");
  };

  const t = (key: TranslationKey | string, fallback?: string): string => {
    const langDict = translations[language];
    if (key in langDict) {
      return langDict[key as TranslationKey];
    }
    return fallback ?? key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
