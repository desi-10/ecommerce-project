import Link from "next/link";
import { ShieldCheck, Truck, BadgePercent } from "lucide-react";

const highlights = [
  { icon: Truck, text: "Free delivery on orders over GH₵100" },
  { icon: BadgePercent, text: "Exclusive member-only deals" },
  { icon: ShieldCheck, text: "Secure checkout, every time" },
];

/**
 * Shared split-screen shell for every /auth page (sign-in, sign-up,
 * forgot-password, reset-password) — one branding panel + form card,
 * so the four pages read as one consistent flow instead of four
 * independently-styled pages.
 */
export default function AuthShell({
  children,
  eyebrow,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="min-h-screen w-full bg-white lg:grid lg:grid-cols-2">
      {/* Branding panel — hidden on small screens, left column on large */}
      <div
        className="relative hidden flex-col justify-between overflow-hidden p-12 text-white lg:flex"
        style={{
          background:
            "linear-gradient(135deg, var(--primary-700) 0%, var(--primary-600) 45%, var(--primary-500) 100%)",
        }}
      >
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          mart<span className="text-white/80">fury</span>
        </Link>

        <div className="max-w-sm">
          <h2 className="text-3xl font-bold leading-tight">
            Your one-stop shop for everything you need.
          </h2>
          <p className="mt-4 text-sm text-white/80">
            Join thousands of shoppers getting the best deals on groceries,
            electronics, fashion and more.
          </p>

          <ul className="mt-8 space-y-4">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-white/90">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/15">
                  <Icon className="h-4 w-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-white/60">
          &copy; {new Date().getFullYear()} Martfury. All rights reserved.
        </p>

        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Form panel */}
      <div className="flex min-h-screen flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Link
            href="/"
            className="mb-8 flex items-center gap-2 text-lg font-bold tracking-tight text-neutral-900 lg:hidden"
          >
            mart<span style={{ color: "var(--primary-600)" }}>fury</span>
          </Link>

          <p
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--primary-600)" }}
          >
            {eyebrow}
          </p>
          <h1 className="mt-2 text-2xl font-bold text-neutral-900">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
