"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, SlidersHorizontal, MapPin, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { propertyTypeLabels, formatPrice, formatPercent } from "@/lib/utils";
import type { PropertyType, InvestmentVerdict } from "@/types/property";

interface SearchProperty {
  id: string;
  slug: string;
  address: string;
  city: string;
  zip: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  propertyType: PropertyType;
  photo: string | null;
  capRate: number;
  cashFlow: number;
  cocReturn: number;
  rent: number;
  verdict: InvestmentVerdict;
  e2Eligible: boolean;
  daysOnMarket: number;
  yearBuilt: number | null;
  hoaFee: number;
}

const verdictConfig = {
  STRONG: { label: "Strong", className: "bg-success/10 text-success border-success/20" },
  MODERATE: { label: "Moderate", className: "bg-warning/10 text-warning border-warning/20" },
  CAUTIOUS: { label: "Cautious", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const PAGE_SIZE = 24;

const sortOptions = [
  { value: "cap_rate", label: "Highest Cap Rate" },
  { value: "cash_flow", label: "Best Cash Flow" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest Listings" },
  { value: "days_on_market", label: "Days on Market" },
] as const;

type SortBy = (typeof sortOptions)[number]["value"];

export function SearchPage() {
  const [allProperties, setAllProperties] = useState<SearchProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<PropertyType[]>([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [capRateMin, setCapRateMin] = useState("");
  const [bedsMin, setBedsMin] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("cap_rate");
  const [page, setPage] = useState(1);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);

  // Load data once
  useEffect(() => {
    fetch("/data/search.json")
      .then((r) => r.json())
      .then((data: SearchProperty[]) => {
        setAllProperties(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Available cities from data
  const cities = useMemo(() => {
    const set = new Set(allProperties.map((p) => p.city));
    return Array.from(set).sort();
  }, [allProperties]);

  // Filter + sort
  const filtered = useMemo(() => {
    let results = [...allProperties];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (p) =>
          p.address.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.zip.includes(q)
      );
    }

    // Property type
    if (selectedTypes.length > 0) {
      results = results.filter((p) => selectedTypes.includes(p.propertyType));
    }

    // Cities
    if (selectedCities.length > 0) {
      results = results.filter((p) => selectedCities.includes(p.city));
    }

    // Price
    if (priceMin) {
      const min = parseInt(priceMin.replace(/[^0-9]/g, ""));
      if (min > 0) results = results.filter((p) => p.price >= min);
    }
    if (priceMax) {
      const max = parseInt(priceMax.replace(/[^0-9]/g, ""));
      if (max > 0) results = results.filter((p) => p.price <= max);
    }

    // Cap rate
    if (capRateMin) {
      const min = parseFloat(capRateMin);
      if (min > 0) results = results.filter((p) => p.capRate >= min);
    }

    // Beds
    if (bedsMin) {
      const min = parseInt(bedsMin);
      if (min > 0) results = results.filter((p) => p.beds >= min);
    }

    // Sort
    switch (sortBy) {
      case "cap_rate":
        results.sort((a, b) => b.capRate - a.capRate);
        break;
      case "cash_flow":
        results.sort((a, b) => b.cashFlow - a.cashFlow);
        break;
      case "price_asc":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        results.sort((a, b) => b.price - a.price);
        break;
      case "days_on_market":
        results.sort((a, b) => a.daysOnMarket - b.daysOnMarket);
        break;
      case "newest":
      default:
        break;
    }

    return results;
  }, [allProperties, searchQuery, selectedTypes, selectedCities, priceMin, priceMax, capRateMin, bedsMin, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedTypes, selectedCities, priceMin, priceMax, capRateMin, bedsMin, sortBy]);

  const toggleType = useCallback((type: PropertyType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }, []);

  const toggleCity = useCallback((city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedTypes([]);
    setSelectedCities([]);
    setPriceMin("");
    setPriceMax("");
    setCapRateMin("");
    setBedsMin("");
  }, []);

  const hasActiveFilters = searchQuery || selectedTypes.length > 0 || selectedCities.length > 0 || priceMin || priceMax || capRateMin || bedsMin;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Search Header */}
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            Investment Properties
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {allProperties.length.toLocaleString()} houses, multifamily, and distressed properties across South Florida — real MLS data
          </p>

          {/* Search Bar */}
          <div className="mt-4 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by city, address, or ZIP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-10 bg-background border-border"
              />
            </div>
            <Button
              variant="outline"
              size="lg"
              className="h-12 gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Active:</span>
              {selectedTypes.map((type) => (
                <Badge
                  key={type}
                  variant="secondary"
                  className="gap-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => toggleType(type)}
                >
                  {propertyTypeLabels[type]}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
              {selectedCities.map((city) => (
                <Badge
                  key={city}
                  variant="secondary"
                  className="gap-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => toggleCity(city)}
                >
                  {city}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
              {priceMin && (
                <Badge variant="secondary" className="gap-1">
                  Min: ${parseInt(priceMin.replace(/[^0-9]/g, "")).toLocaleString()}
                </Badge>
              )}
              {priceMax && (
                <Badge variant="secondary" className="gap-1">
                  Max: ${parseInt(priceMax.replace(/[^0-9]/g, "")).toLocaleString()}
                </Badge>
              )}
              {capRateMin && (
                <Badge variant="secondary" className="gap-1">
                  Cap ≥ {capRateMin}%
                </Badge>
              )}
              <button
                className="text-xs text-muted-foreground hover:text-primary"
                onClick={clearFilters}
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="border-t border-border bg-card">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Property Type
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Object.entries(propertyTypeLabels).map(([type, label]) => (
                      <button
                        key={type}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          selectedTypes.includes(type as PropertyType)
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                        onClick={() => toggleType(type as PropertyType)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    City
                  </label>
                  <div className="mt-2 max-h-32 overflow-y-auto flex flex-wrap gap-1.5">
                    {cities.map((city) => (
                      <button
                        key={city}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                          selectedCities.includes(city)
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                        onClick={() => toggleCity(city)}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Price / Cap Rate
                  </label>
                  <div className="mt-2 space-y-2">
                    <Input placeholder="Min price" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} className="h-9 text-sm" />
                    <Input placeholder="Max price" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} className="h-9 text-sm" />
                    <Input placeholder="Min cap rate %" value={capRateMin} onChange={(e) => setCapRateMin(e.target.value)} className="h-9 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Beds / Sort
                  </label>
                  <div className="mt-2 space-y-2">
                    <Input placeholder="Min beds" value={bedsMin} onChange={(e) => setBedsMin(e.target.value)} className="h-9 text-sm" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortBy)}
                      className="w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground"
                    >
                      {sortOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="text-foreground font-medium">
              {filtered.length.toLocaleString()}
            </span>{" "}
            investment properties
          </p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="text-sm border border-border bg-background rounded-md px-3 py-1.5 text-foreground"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No properties match your filters.</p>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginated.map((property) => {
                const verdict = verdictConfig[property.verdict];
                const grossYield = ((property.rent * 12) / property.price * 100).toFixed(1);
                return (
                  <a
                    key={property.id}
                    href={`/property/${property.slug}`}
                    className="group block"
                  >
                    <div className="rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <div
                          className="absolute inset-0 bg-cover bg-center bg-gray-800 transition-transform duration-500 group-hover:scale-105"
                          style={property.photo ? { backgroundImage: `url(${property.photo})` } : undefined}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute top-3 left-3">
                          <Badge className={`${verdict.className} border text-xs font-semibold`}>
                            {verdict.label}
                          </Badge>
                        </div>
                        {property.e2Eligible && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-primary/20 text-primary border-primary/30 border text-[10px] font-semibold">
                              E-2
                            </Badge>
                          </div>
                        )}
                        <div className="absolute bottom-3 left-3">
                          <span className="text-xl font-serif font-bold text-white">
                            {formatPrice(property.price)}
                          </span>
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <Badge variant="secondary" className="text-xs bg-black/50 text-white border-0">
                            {property.daysOnMarket}d on market
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <div>
                            <p className="font-medium text-foreground text-sm">{property.address}</p>
                            <p className="text-xs text-muted-foreground">
                              {property.city}, FL {property.zip}
                            </p>
                          </div>
                        </div>

                        <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{property.beds} bd</span>
                          <span className="text-border">|</span>
                          <span>{property.baths} ba</span>
                          <span className="text-border">|</span>
                          <span>{property.sqft.toLocaleString()} sqft</span>
                        </div>

                        <div className="mt-3 pt-3 border-t border-border grid grid-cols-3 gap-2">
                          <div className="text-center">
                            <p className="text-sm font-bold text-primary">{formatPercent(property.capRate)}</p>
                            <p className="text-[10px] text-muted-foreground">Cap Rate</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-primary">{formatPrice(property.rent)}</p>
                            <p className="text-[10px] text-muted-foreground">Est. Rent</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-primary">{formatPercent(parseFloat(grossYield))}</p>
                            <p className="text-[10px] text-muted-foreground">Gross Yield</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground px-4">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
