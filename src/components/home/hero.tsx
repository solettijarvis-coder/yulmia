"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, ShieldCheck, MapPin, ChevronDown } from "lucide-react";

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

        {/* Integrated Search Bar with Filters */}
        <div className="mt-10 max-w-3xl mx-auto">
          <div className="rounded-2xl border border-border bg-card/95 backdrop-blur-sm p-4 sm:p-5 shadow-xl shadow-black/20">
            {/* Main search row */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by city, address, or ZIP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full h-12 rounded-lg border border-border bg-background pl-11 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                />
              </div>
              <Button
                onClick={handleSearch}
                size="lg"
                className="h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-semibold shrink-0"
              >
                <Search className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Search</span>
              </Button>
            </div>

            {/* Filter dropdowns */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="relative">
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full h-10 rounded-lg border border-border bg-background px-3 pr-8 text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                  {propertyTypes.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full h-10 rounded-lg border border-border bg-background px-3 pr-8 text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                  {priceRanges.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-10 rounded-lg border border-border bg-background px-3 pr-8 text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                  {cities.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="mt-3 flex items-center justify-center gap-3 text-xs text-muted-foreground">
            <span>Popular:</span>
            {["Miami multifamily", "West Palm Beach under $300K", "E-2 eligible properties"].map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchQuery(term);
                  router.push(`/search?q=${encodeURIComponent(term)}`);
                }}
                className="px-2.5 py-1 rounded-full border border-border hover:border-primary/50 hover:text-primary transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-primary">5,826</div>
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
