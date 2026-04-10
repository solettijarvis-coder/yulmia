"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Properties", href: "/search" },
  { label: "Neighborhoods", href: "/neighborhoods" },
  { label: "Calculators", href: "/calculators" },
  { label: "E-2 Visa", href: "/e2-visa" },
  { label: "About", href: "/about" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-light tracking-[-0.06em] text-foreground">
              YULMIA
            </span>
            <span className="hidden sm:inline text-[10px] font-medium tracking-[0.15em] uppercase text-gold mt-1">
              Investments
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 text-[13px] tracking-[0.02em] transition-colors rounded-sm ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/invest"
              className="text-[13px] tracking-[0.02em] text-muted-foreground hover:text-foreground transition-colors gold-underline"
            >
              Private Access
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center gap-1.5 h-9 px-5 bg-foreground text-background text-[13px] font-medium tracking-[0.01em] rounded-sm hover:bg-foreground/90 transition-colors"
            >
              Browse
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center text-foreground"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="md:hidden fixed inset-x-0 top-16 bg-background/95 backdrop-blur-md border-b border-border"
          >
            <div className="px-6 py-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2.5 text-[15px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-border mt-4">
                <Link
                  href="/search"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center gap-1.5 h-10 px-6 bg-foreground text-background text-sm font-medium rounded-sm"
                >
                  Browse Properties
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
