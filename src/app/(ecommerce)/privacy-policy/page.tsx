import Link from "next/link";
import { Lock, HelpCircle, ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-white py-16 px-4">
      <div className="mx-auto max-w-3xl">
        <Link 
          href="/shop" 
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Shop
        </Link>
        
        <div className="bg-white border border-neutral-100 p-8 md:p-12 rounded-2xl shadow-sm space-y-8">
          <div className="border-b pb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Lock className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Privacy & Security</span>
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Privacy Policy</h1>
            <p className="text-xs text-neutral-400 mt-2">Last Updated: May 2026</p>
          </div>

          <p className="text-sm text-neutral-600 leading-relaxed">
            MartFury ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by MartFury.
          </p>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-800">1. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-600">
              <li>
                <strong className="text-neutral-900">Personal Information</strong>: When you make a purchase or sign up, we collect personal information such as your name, email address, shipping address, billing address, phone number, and payment details.
              </li>
              <li>
                <strong className="text-neutral-900">Usage Data</strong>: We may collect information about how you access and use our store, including IP address, browser type, and pages visited.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-800">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-600">
              <li>To process and deliver your orders.</li>
              <li>To manage payments, fees, and charges via secure processors (Stripe/Paystack).</li>
              <li>To communicate with you regarding your orders, inquiries, or promotions.</li>
              <li>To improve our website performance, layout, and user experience.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-800">3. Sharing Your Information</h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              We do not sell, rent, or trade your personal information. We only share information with trusted third-party services necessary for store operation, such as payment processors (Stripe and Paystack) for secure transactions.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-800">4. Security of Your Information</h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              We implement state-of-the-art security measures (SSL encryption, secure APIs) to protect your personal data. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <div className="border-t pt-8 mt-12 bg-neutral-50/50 p-6 rounded-xl flex items-start gap-4">
            <HelpCircle className="w-6 h-6 text-neutral-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-neutral-900 text-sm">Have Questions?</h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                If you have any questions or concerns about our Privacy Policy or your data, reach out to us at <a href="mailto:support@martfury.com" className="text-primary hover:underline font-medium">support@martfury.com</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
