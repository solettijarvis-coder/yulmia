"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search, Phone } from "lucide-react";

const navLinks = [
  { href: "/search", label: "Properties" },
  { href: "/compare", label: "Compare" },
  { href: "/calculators", label: "Calculators" },
  { href: "/neighborhoods", label: "Neighborhoods" },
  { href: "/invest", label: "E2 Visa" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo — Revolut-style bold wordmark */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-serif font-bold tracking-tight text-gold-gradient">
            YULMIA
          </span>
        </Link>

        {/* Desktop Nav — Revolut 20px weight 500 style */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-[--radius-pill] hover:bg-muted tracking-wide"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions — Revolut pill buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/search">
            <Button variant="ghost" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </Link>
          <a href="tel:+13057868001">
            <Button variant="outline" size="sm" className="font-medium tracking-wide">
              <Phone className="mr-2 h-4 w-4" />
              (305) 786-8001
            </Button>
          </a>
          <Button size="sm" className="font-semibold tracking-wide">
            Book Consultation
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-[--radius-pill] hover:bg-muted hover:text-foreground size-9">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] bg-background border-border">
            <div className="flex flex-col gap-6 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-border" />
              <a href="tel:+13057868001">
                <Button variant="outline" className="w-full font-medium tracking-wide">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Us
                </Button>
              </a>
              <Button className="w-full font-semibold tracking-wide">
                Book Consultation
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
