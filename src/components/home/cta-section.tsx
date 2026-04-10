import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { InvestorContactForm } from "@/components/forms/investor-contact-form";

export function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            Ready to Invest in South Florida?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you&apos;re a Canadian investor looking for your E2 visa pathway, or a
            local investor seeking cash-flow properties — we have the data, the insights,
            and the properties.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left - Quick links */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors text-lg"
              >
                Browse Investment Properties
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/invest"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-border bg-card text-foreground font-semibold hover:border-primary/50 transition-colors text-lg"
              >
                E2 Visa Information
              </Link>
            </div>

            <div className="pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground text-center">
                YUL + MIA — Montreal to Miami. Investment properties for Canadian and international investors.
              </p>
            </div>
          </div>

          {/* Right - Contact form */}
          <InvestorContactForm />
        </div>
      </div>
    </section>
  );
}
