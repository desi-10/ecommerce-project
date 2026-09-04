"use client";

import Wrapper from "./wrapper";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { useLanguage } from "@/context/language-context";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { t } = useLanguage();

  const isAdmin = session?.user?.role === "admin";

  const links = [
    {
      label: t("nav.home", "Home"),
      href: "/",
      url: "https://img.icons8.com/ios/50/home--v1.png",
      alt: "home--v1",
    },
    {
      label: t("nav.shop", "Shop"),
      href: "/shop",
      url: "https://img.icons8.com/dotty/80/shop.png",
      alt: "shop",
    },
    {
      label: t("nav.about", "About Us"),
      href: "/about",
      url: "https://img.icons8.com/ios/50/info--v1.png",
      alt: "info--v1",
    },
    {
      label: t("nav.contact", "Contact"),
      href: "/contact",
      url: "https://img.icons8.com/ios/50/phone--v1.png",
      alt: "phone--v1",
    },
    ...(isAdmin
      ? [
          {
            label: t("nav.dashboard", "Dashboard"),
            href: "/dashboard",
            url: "https://img.icons8.com/laces/64/web-design.png",
            alt: "web-design",
          },
        ]
      : []),
  ];

  return (
    <div className="hidden md:block bg-primary text-white border-b sticky top-0 z-40">
      <Wrapper>
        <nav className="flex items-center justify-center gap-8 font-semibold">
          <div className="flex items-center justify-center gap-8">
            {links.map((l) => (
              <div key={l.href}>
                <Link
                  href={l.href}
                  className="flex items-center justify-center gap-2 hover:opacity-90 transition p-4"
                >
                  <Image
                    src={l.url}
                    alt={l.alt}
                    width={100}
                    height={100}
                    className="h-5 w-5 brightness-150 invert"
                  />
                  {l.label}
                </Link>
                {l.href === pathname && (
                  <div className="h-1 w-full bg-white" />
                )}
              </div>
            ))}
          </div>
        </nav>
      </Wrapper>
    </div>
  );
}
