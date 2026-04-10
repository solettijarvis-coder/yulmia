"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, ShieldCheck, MapPin, ChevronDown, ArrowRight } from "lucide-react";

const propertyTypes = [
  { value: "", label: "All Types" },
  { value: "single-family", label: "Single Family" },
  { value: "multifamily", label: "Multifamily" },
  { value: "distressed", label: "Distressed" },
];

const priceRanges = [
  { value: "", label: "Any Price" },
  { value: "0-200000", label: "Under $200K" },
  { value: "200000-500000", label: "$200K - $500K" },
  { value: "500000-1000000", label: "$500K - $1M" },
  { value: "1000000+", label: "$1M+" },
];

const cities = [
  { value: "", label: "All Cities" },
  { value: "Miami", label: "Miami" },
  { value: "Fort Lauderdale", label: "Fort Lauderdale" },
  { value: "West Palm Beach", label: "West Palm Beach" },
  { value: "Boca Raton", label: "Boca Raton" },
  { value: "Hollywood", label: "Hollywood" },
  { value: "Pompano Beach", label: "Pompano Beach" },
];

export function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [city, setCity] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (propertyType) params.set("type", propertyType);
    if (priceRange) params.set("price", priceRange);
    if (city) params.set("city", city);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background — Revolut flat style */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background">
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Revolut-style pill badge */}
        <div className="inline-flex items-center gap-2 rounded-[--radius-pill] border border-primary/30 bg-primary/5 px-5 py-2 text-sm text-primary mb-8 tracking-wide">
          <MapPin className="h-3.5 w-3.5" />
          Montreal to Miami — Investment Properties for Canadians
        </div>

        {/* Display headline — Revolut tight tracking on serif */}
        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-serif font-bold tracking-tight text-foreground leading-none">
          South Florida{" "}
          <span className="text-gold-gradient">Investment</span>
          <br />
          Properties
        </h1>

        <p className="mt-8 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed tracking-wide">
          Houses, multifamily, and distressed properties with AI-powered
          investment analysis. Built for investors, not condo buyers.
        </p>

        {/* Revolut-style CTA row */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button
            onClick={handleSearch}
            size="lg"
            className="font-semibold"
          >
            Explore Properties
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push("/e2-visa")}
            className="font-semibold"
          >
            E-2 Visa Guide
          </Button>
        </div>

        {/* Integrated Search Bar — flat Revolut card */}
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="rounded-[--radius-xl] border border-border bg-card/95 backdrop-blur-sm p-5 sm:p-6">
            {/* Main search row */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by city, address, or ZIP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full h-12 rounded-[--radius-md] border border-border bg-background pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm tracking-wide"
                />
              </div>
              <Button
                onClick={handleSearch}
                size="lg"
                className="h-12 shrink-0 font-semibold"
              >
                <Search className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Search</span>
              </Button>
            </div>

            {/* Filter dropdowns — Revolut pill-style selects */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { value: propertyType, setter: setPropertyType, options: propertyTypes },
                { value: priceRange, setter: setPriceRange, options: priceRanges },
                { value: city, setter: setCity, options: cities },
              ].map(({ value, setter, options }, i) => (
                <div key={i} className="relative">
                  <select
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    className="w-full h-10 rounded-[--radius-md] border border-border bg-background px-3 pr-8 text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary tracking-wide"
                  >
                    {options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick links — Revolut pill chips */}
          <div className="mt-4 flex items-center justify-center gap-3 text-xs text-muted-foreground">
            <span>Popular:</span>
            {["Miami multifamily", "West Palm Beach under $300K", "E-2 eligible properties"].map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchQuery(term);
                  router.push(`/search?q=${encodeURIComponent(term)}`);
                }}
                className="px-3 py-1.5 rounded-[--radius-pill] border border-border hover:border-primary/50 hover:text-primary transition-colors tracking-wide"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats — Revolut flat cards */}
        <div className="mt-16 grid grid-cols-3 gap-3 sm:gap-6 max-w-md mx-auto">
          {[
            { value: "5,826", label: "Investment Properties" },
            { value: "6.8%", label: "Avg Cap Rate" },
            { value: "AI", label: "Investment Insights", icon: TrendingUp },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-serif font-bold text-primary tracking-tight">
                {stat.value}
                {stat.icon && <stat.icon className="inline h-5 w-5 ml-1" />}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1 tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges — Revolut pill chips */}
        <div className="mt-10 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          {["No Condos", "Investor Data", "E2 Visa Guidance"].map((badge) => (
            <span key={badge} className="flex items-center gap-1.5 px-3 py-1.5 rounded-[--radius-pill] border border-border tracking-wide">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
