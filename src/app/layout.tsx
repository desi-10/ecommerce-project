import type { Metadata } from "next";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactQuery } from "@/components/react-query";
import { FloatingAssistant } from "@/components/ai/floating-assistant";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/context/language-context";

export const metadata: Metadata = {
  title: "MartFury",
  description: "MartFury is an e-commerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <ReactQuery>
          <LanguageProvider>
            <TooltipProvider>
              {children}
              <FloatingAssistant />
              <Toaster richColors closeButton position="top-center" />
            </TooltipProvider>
          </LanguageProvider>
        </ReactQuery>
      </body>
    </html>
  );
}

