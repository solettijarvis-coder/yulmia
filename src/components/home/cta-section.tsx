import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 px-6 lg:px-10 border-t border-border">
      <div className="mx-auto max-w-[1400px]">
        <div className="max-w-2xl">
          <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-gold">
            Get Started
          </span>
          <h2 className="mt-2 text-3xl lg:text-5xl font-light tracking-[-0.04em] text-foreground leading-[1.05]">
            Ready to invest in South Florida?
          </h2>
          <p className="mt-6 text-sm text-muted-foreground leading-relaxed tracking-[0.01em] max-w-md">
            Whether you&apos;re a Canadian looking for E-2 visa qualification or an 
            experienced investor seeking income properties, we have deals waiting.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 h-11 px-7 bg-foreground text-background text-sm font-medium tracking-[0.01em] hover:bg-foreground/90 transition-colors"
            >
              Browse Properties
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/invest"
              className="inline-flex items-center gap-2 h-11 px-7 border border-border text-sm text-foreground tracking-[0.01em] hover:border-foreground/30 transition-colors"
            >
              Private Access
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
