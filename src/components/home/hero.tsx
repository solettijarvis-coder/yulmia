"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, ShieldCheck, MapPin } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm text-primary mb-8">
          <MapPin className="h-3.5 w-3.5" />
          Montreal to Miami — Investment Properties for Canadians
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold tracking-tight text-foreground leading-tight">
          South Florida{" "}
          <span className="text-gold-gradient">Investment</span>
          <br />
          Properties
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Houses, multifamily, and distressed properties with AI-powered
          investment analysis. Built for investors, not condo buyers.
        </p>

        {/* Search Bar */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-3 max-w-2xl mx-auto">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by city, neighborhood, or address..."
              className="w-full h-14 rounded-xl border border-border bg-card pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
          <Link href="/search">
            <Button
              size="lg"
              className="h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-semibold"
            >
              Find Properties
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-primary">2,400+</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">
              Investment Properties
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-primary">6.8%</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">
              Avg Cap Rate
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-primary flex items-center justify-center gap-1">
              <TrendingUp className="h-5 w-5" />
              AI
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">
              Investment Insights
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-primary" />
            No Condos
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Investor Data
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-primary" />
            E2 Visa Guidance
          </span>
        </div>
      </div>
    </section>
  );
}