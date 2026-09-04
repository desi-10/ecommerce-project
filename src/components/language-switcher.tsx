"use client";

import { useLanguage, Language } from "@/context/language-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe, Check } from "lucide-react";

interface LanguageSwitcherProps {
  variant?: "dropdown" | "pills" | "compact";
  className?: string;
}

export function LanguageSwitcher({
  variant = "dropdown",
  className = "",
}: LanguageSwitcherProps) {
  const { language, setLanguage, toggleLanguage } = useLanguage();

  if (variant === "pills") {
    return (
      <div className={`inline-flex items-center p-1 bg-neutral-100 dark:bg-neutral-800 rounded-full border border-neutral-200 dark:border-neutral-700 text-xs ${className}`}>
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all font-medium ${
            language === "en"
              ? "bg-white dark:bg-neutral-900 text-foreground shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>🇬🇧</span>
          <span>English</span>
        </button>
        <button
          type="button"
          onClick={() => setLanguage("tw")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all font-medium ${
            language === "tw"
              ? "bg-blue-600 text-white shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>🇬🇭</span>
          <span>Twi</span>
        </button>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={toggleLanguage}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium transition-all hover:bg-neutral-50 active:scale-95 ${className}`}
        aria-label="Toggle language between English and Twi"
      >
        <Globe className="h-3.5 w-3.5 text-blue-600" />
        <span className="font-semibold">{language === "en" ? "EN" : "TW"}</span>
        <span className="text-[10px] text-muted-foreground">
          ({language === "en" ? "🇬🇧" : "🇬🇭"})
        </span>
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={`flex items-center gap-1.5 text-xs font-medium hover:text-primary transition outline-none cursor-pointer ${className}`}
        >
          <Globe className="h-3.5 w-3.5 text-blue-600" />
          <span>{language === "en" ? "English" : "Twi"}</span>
          <span className="text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600 font-semibold border">
            {language === "en" ? "🇬🇧 EN" : "🇬🇭 TW"}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36 z-50">
        <DropdownMenuItem
          onClick={() => setLanguage("en")}
          className="flex items-center justify-between cursor-pointer text-xs"
        >
          <div className="flex items-center gap-2">
            <span>🇬🇧</span>
            <span>English</span>
          </div>
          {language === "en" && <Check className="h-3.5 w-3.5 text-blue-600" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("tw")}
          className="flex items-center justify-between cursor-pointer text-xs"
        >
          <div className="flex items-center gap-2">
            <span>🇬🇭</span>
            <span>Twi</span>
          </div>
          {language === "tw" && <Check className="h-3.5 w-3.5 text-blue-600" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
