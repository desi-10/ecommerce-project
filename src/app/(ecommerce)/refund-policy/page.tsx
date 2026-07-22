import Link from "next/link";
import { ShieldCheck, HelpCircle, ArrowLeft } from "lucide-react";

export default function RefundPolicyPage() {
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
        
        <div className="bg-white border border-neutral-200 p-8 md:p-12 rounded-md shadow-sm space-y-8">
          <div className="border-b pb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">MartFury Trust</span>
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Refund Policy</h1>
            <p className="text-xs text-neutral-400 mt-2">Last Updated: May 2026</p>
          </div>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-800">1. Returns</h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              You have <strong className="text-neutral-900 font-semibold">30 calendar days</strong> to return an item from the date you received it.
              To be eligible for a return, your item must be unused, in the same condition that you received it, and in its original packaging.
              Your item must have the receipt or proof of purchase.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-800">2. Refunds</h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed">
              If your return is approved, we will initiate a refund to your original payment method (Stripe/Paystack).
              You will receive the credit within a certain amount of days, depending on your card issuer's policies (usually 5-10 business days).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-800">3. Shipping</h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable.
              If you receive a refund, the cost of return shipping will be deducted from your refund.
            </p>
          </section>

          <div className="border-t pt-8 mt-12 bg-neutral-50/50 p-6 rounded-xl flex items-start gap-4">
            <HelpCircle className="w-6 h-6 text-neutral-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-neutral-900 text-sm">Need Help or Have Questions?</h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                If you have any questions on how to return your item to us, please feel free to reach out to our dedicated support team at <a href="mailto:support@martfury.com" className="text-primary hover:underline font-medium">support@martfury.com</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
