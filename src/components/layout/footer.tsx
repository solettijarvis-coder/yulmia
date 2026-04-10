import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="text-2xl font-serif font-bold text-gold-gradient">
              YULMIA
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              South Florida investment properties for Canadian and international
              investors. Houses, multifamily, and distressed properties with
              AI-powered analysis.
            </p>
          </div>

          {/* Properties */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Properties
            </h3>
            <ul className="mt-4 space-y-2">
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
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Areas
            </h3>
            <ul className="mt-4 space-y-2">
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
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Services
            </h3>
            <ul className="mt-4 space-y-2">
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
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-border" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} YULMIA. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
    </footer>
  );
}