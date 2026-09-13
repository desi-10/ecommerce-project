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

// Ghana's four most widely spoken languages here (English, Twi, Ewe, Ga)
// plus French — West Africa's other major lingua franca and Ghana's
// nearest cross-border language (Côte d'Ivoire, Togo, Burkina Faso).
const LANGUAGES: { code: Language; flag: string; label: string }[] = [
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "tw", flag: "🇬🇭", label: "Twi" },
  { code: "ga", flag: "🇬🇭", label: "Ga" },
  { code: "ewe", flag: "🇬🇭", label: "Ewe" },
  { code: "fr", flag: "🇫🇷", label: "Français" },
];

export function LanguageSwitcher({
  variant = "dropdown",
  className = "",
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();
  const current = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  if (variant === "pills") {
    return (
      <div className={`inline-flex items-center flex-wrap gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-full border border-neutral-200 dark:border-neutral-700 text-xs ${className}`}>
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setLanguage(l.code)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all font-medium ${
              language === l.code
                ? "bg-white dark:bg-neutral-900 text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{l.flag}</span>
            <span>{l.label}</span>
          </button>
        ))}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium transition-all hover:bg-neutral-50 active:scale-95 ${className}`}
            aria-label="Change language"
          >
            <Globe className="h-3.5 w-3.5 text-blue-600" />
            <span className="font-semibold">{current.code.toUpperCase()}</span>
            <span className="text-[10px] text-muted-foreground">({current.flag})</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 z-50">
          {LANGUAGES.map((l) => (
            <DropdownMenuItem
              key={l.code}
              onClick={() => setLanguage(l.code)}
              className="flex items-center justify-between cursor-pointer text-xs"
            >
              <div className="flex items-center gap-2">
                <span>{l.flag}</span>
                <span>{l.label}</span>
              </div>
              {language === l.code && <Check className="h-3.5 w-3.5 text-blue-600" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
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
          <span>{current.label}</span>
          <span className="text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600 font-semibold border">
            {current.flag} {current.code.toUpperCase()}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 z-50">
        {LANGUAGES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLanguage(l.code)}
            className="flex items-center justify-between cursor-pointer text-xs"
          >
            <div className="flex items-center gap-2">
              <span>{l.flag}</span>
              <span>{l.label}</span>
            </div>
            {language === l.code && <Check className="h-3.5 w-3.5 text-blue-600" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
