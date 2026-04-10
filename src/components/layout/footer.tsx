import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-revolut-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="text-2xl font-serif font-bold text-gold-gradient">
              YULMIA
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed tracking-wide">
              South Florida investment properties for Canadian and international
              investors. Houses, multifamily, and distressed properties with
              AI-powered analysis.
            </p>
          </div>

          {/* Properties */}
          <div>
            <h4 className="text-sm font-medium text-foreground uppercase tracking-widest">
              Properties
            </h4>
            <ul className="mt-4 space-y-3">
              {[
                { href: "/search?type=single-family", label: "Single Family Homes" },
                { href: "/search?type=multifamily", label: "Multifamily (2-4 Units)" },
                { href: "/search?type=multifamily-large", label: "Multifamily (5+ Units)" },
                { href: "/search?type=distressed", label: "Distressed Properties" },
                { href: "/search?type=land", label: "Investment Land" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors tracking-wide"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas */}
          <div>
            <h4 className="text-sm font-medium text-foreground uppercase tracking-widest">
              Areas
            </h4>
            <ul className="mt-4 space-y-3">
              {[
                { href: "/neighborhoods/miami", label: "Miami" },
                { href: "/neighborhoods/fort-lauderdale", label: "Fort Lauderdale" },
                { href: "/neighborhoods/west-palm-beach", label: "West Palm Beach" },
                { href: "/neighborhoods/brickell", label: "Brickell" },
                { href: "/neighborhoods/wynwood", label: "Wynwood" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors tracking-wide"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-medium text-foreground uppercase tracking-widest">
              Services
            </h4>
            <ul className="mt-4 space-y-3">
              {[
                { href: "/invest", label: "E2 Visa Pathway" },
                { href: "/invest#relocation", label: "Business Relocation" },
                { href: "/invest#renovation", label: "Renovation Brokerage" },
                { href: "/invest#management", label: "Property Management" },
                { href: "/invest#financing", label: "Financing Support" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors tracking-wide"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground tracking-wide">
              &copy; {new Date().getFullYear()} YULMIA. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground tracking-wide">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms
              </Link>
              <span>Montreal &bull; Miami &bull; South Florida</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
