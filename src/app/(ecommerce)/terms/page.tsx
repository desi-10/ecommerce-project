import Link from "next/link";
import { FileText, HelpCircle, ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
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
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-md">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Legal Agreement</span>
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Terms of Service</h1>
            <p className="text-xs text-neutral-400 mt-2">Last Updated: May 2026</p>
          </div>

          <p className="text-sm text-neutral-600 leading-relaxed">
            Welcome to MartFury. By accessing or using our website, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
          </p>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-800">1. Use of the Site</h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              You must be at least 18 years old or accessing the site under the supervision of a parent or guardian. You agree to use the site only for lawful purposes and in a way that does not infringe the rights of others.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-800">2. Products and Pricing</h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              All descriptions, images, and prices of products are subject to change at any time without notice. We reserve the right to limit the sales of our products to any person, geographic region, or jurisdiction.
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed">
              In the event a product is listed at an incorrect price, we reserve the right to refuse or cancel orders placed for that product.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-800">3. Payments</h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              All payments are processed securely. You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-800">4. Limitation of Liability</h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              MartFury shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the site or products purchased.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-800">5. Governing Law</h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              These Terms of Service shall be governed by and construed in accordance with local ecommerce regulations and laws.
            </p>
          </section>

          <div className="border-t pt-8 mt-12 bg-neutral-50/50 p-6 rounded-xl flex items-start gap-4">
            <HelpCircle className="w-6 h-6 text-neutral-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-neutral-900 text-sm">Need More Information?</h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                If you have questions about these Terms of Service or our conditions, reach out to us at <a href="mailto:support@martfury.com" className="text-primary hover:underline font-medium">support@martfury.com</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
