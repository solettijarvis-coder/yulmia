import Link from "next/link";

const footerLinks = {
  Platform: [
    { label: "Properties", href: "/search" },
    { label: "Neighborhoods", href: "/neighborhoods" },
    { label: "Calculators", href: "/calculators" },
    { label: "Compare", href: "/compare" },
  ],
  Services: [
    { label: "Investment Acquisition", href: "/search" },
    { label: "Commercial Real Estate", href: "/search?type=commercial" },
    { label: "E-2 Visa", href: "/e2-visa" },
    { label: "Property Management", href: "/about" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Private Access", href: "/invest" },
    { label: "Contact", href: "/about" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-xl font-light tracking-[-0.06em] text-foreground">
                YULMIA
              </span>
            </Link>
            <p className="mt-4 text-[12px] text-muted-foreground leading-relaxed tracking-[0.01em] max-w-[240px]">
              Investment properties across South Florida. 
              Built for Canadian and international investors.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <div className="text-[11px] font-medium tracking-[0.15em] uppercase text-muted-foreground/50 mb-4">
                {category}
              </div>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-muted-foreground hover:text-foreground transition-colors tracking-[0.01em]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-[11px] text-muted-foreground/40 tracking-[0.01em]">
            &copy; {new Date().getFullYear()} YULMIA Investments. All rights reserved.
          </div>
          <div className="text-[11px] text-muted-foreground/40 tracking-[0.01em]">
            Montreal &rarr; Miami
          </div>
        </div>
      </div>
    </footer>
  );
}
