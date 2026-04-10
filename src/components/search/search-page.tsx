"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { propertyTypeLabels } from "@/lib/utils";
import { SearchAutofill } from "./search-autofill";
import type { PropertyType, InvestmentVerdict } from "@/types/property";
import { PropertyCard } from "./property-card";

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
  onePercentRule: boolean;
  daysOnMarket: number;
  yearBuilt: number | null;
  hoaFee: number;
  photos: string[];
}

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

const cashFlowOptions = [
  { value: "any", label: "Any" },
  { value: "positive", label: "Positive" },
  { value: "500", label: "$500+/mo" },
  { value: "1000", label: "$1,000+/mo" },
  { value: "2000", label: "$2,000+/mo" },
] as const;

const bedsOptions = [
  { value: "any", label: "Any" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
  { value: "5", label: "5+" },
] as const;

export function SearchPage() {
  const [allProperties, setAllProperties] = useState<SearchProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<PropertyType[]>([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [capRateSlider, setCapRateSlider] = useState(0);
  const [bedsMin, setBedsMin] = useState("any");
  const [cashFlowMin, setCashFlowMin] = useState("any");
  const [e2Only, setE2Only] = useState(false);
  const [onePercentOnly, setOnePercentOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("cap_rate");
  const [page, setPage] = useState(1);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);

  // Load data once
  useEffect(() => {
    fetch("/data/search.json")
      .then((r) => r.json())
      .then((raw: any[]) => {
        const data: SearchProperty[] = raw.map((p) => ({
          ...p,
          photos: (p.photos && p.photos.length > 0) ? p.photos : (p.photo ? [p.photo] : []),
        }));
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

    // Cap rate slider
    if (capRateSlider > 0) {
      results = results.filter((p) => p.capRate >= capRateSlider);
    }

    // Beds
    if (bedsMin !== "any") {
      const min = parseInt(bedsMin);
      if (min > 0) results = results.filter((p) => p.beds >= min);
    }

    // Cash flow
    if (cashFlowMin !== "any") {
      if (cashFlowMin === "positive") {
        results = results.filter((p) => p.cashFlow > 0);
      } else {
        const min = parseInt(cashFlowMin);
        if (min > 0) results = results.filter((p) => p.cashFlow >= min);
      }
    }

    // E-2 eligible
    if (e2Only) {
      results = results.filter((p) => p.e2Eligible);
    }

    // 1% Rule
    if (onePercentOnly) {
      results = results.filter((p) => p.onePercentRule);
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
  }, [allProperties, searchQuery, selectedTypes, selectedCities, priceMin, priceMax, capRateSlider, bedsMin, cashFlowMin, e2Only, onePercentOnly, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedTypes, selectedCities, priceMin, priceMax, capRateSlider, bedsMin, cashFlowMin, e2Only, onePercentOnly, sortBy]);

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
    setCapRateSlider(0);
    setBedsMin("any");
    setCashFlowMin("any");
    setE2Only(false);
    setOnePercentOnly(false);
  }, []);

  const hasActiveFilters = searchQuery || selectedTypes.length > 0 || selectedCities.length > 0 || priceMin || priceMax || capRateSlider > 0 || bedsMin !== "any" || cashFlowMin !== "any" || e2Only || onePercentOnly;

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
            <SearchAutofill
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={setSearchQuery}
              placeholder="Search by city, address, or ZIP..."
            />
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

          {/* Investor Toggle Pills */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                e2Only
                  ? "border-[#C8A960] bg-[#C8A960]/15 text-[#C8A960]"
                  : "border-border text-muted-foreground hover:border-[#C8A960]/50"
              }`}
              onClick={() => setE2Only(!e2Only)}
            >
              E-2 Eligible
            </button>
            <button
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                onePercentOnly
                  ? "border-[#C8A960] bg-[#C8A960]/15 text-[#C8A960]"
                  : "border-border text-muted-foreground hover:border-[#C8A960]/50"
              }`}
              onClick={() => setOnePercentOnly(!onePercentOnly)}
            >
              1% Rule
            </button>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Active:</span>
              {e2Only && (
                <Badge
                  variant="secondary"
                  className="gap-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setE2Only(false)}
                >
                  E-2 Eligible
                  <X className="h-3 w-3" />
                </Badge>
              )}
              {onePercentOnly && (
                <Badge
                  variant="secondary"
                  className="gap-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setOnePercentOnly(false)}
                >
                  1% Rule
                  <X className="h-3 w-3" />
                </Badge>
              )}
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
              {capRateSlider > 0 && (
                <Badge variant="secondary" className="gap-1">
                  Cap ≥ {capRateSlider.toFixed(1)}%
                </Badge>
              )}
              {bedsMin !== "any" && (
                <Badge
                  variant="secondary"
                  className="gap-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setBedsMin("any")}
                >
                  {bedsMin}+ Beds
                  <X className="h-3 w-3" />
                </Badge>
              )}
              {cashFlowMin !== "any" && (
                <Badge
                  variant="secondary"
                  className="gap-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setCashFlowMin("any")}
                >
                  {cashFlowMin === "positive" ? "Positive Cash Flow" : `$${cashFlowMin}+/mo Cash Flow`}
                  <X className="h-3 w-3" />
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
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 space-y-5">
              {/* Row 1: Property Type + City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              </div>

              {/* Row 2: Investor filters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Price range */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Price Range
                  </label>
                  <div className="mt-2 space-y-2">
                    <Input placeholder="Min price" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} className="h-9 text-sm" />
                    <Input placeholder="Max price" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} className="h-9 text-sm" />
                  </div>
                </div>

                {/* Cap Rate slider */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {capRateSlider > 0
                      ? `Min ${capRateSlider.toFixed(1)}% cap rate`
                      : "Cap Rate"}
                  </label>
                  <div className="mt-2 px-1">
                    <Slider
                      value={[capRateSlider]}
                      onValueChange={(v) => setCapRateSlider(Array.isArray(v) ? v[0] : v)}
                      min={0}
                      max={30}
                      step={0.5}
                    />
                    <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                      <span>0%</span>
                      <span>15%</span>
                      <span>30%</span>
                    </div>
                  </div>
                </div>

                {/* Cash Flow dropdown */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Cash Flow
                  </label>
                  <select
                    value={cashFlowMin}
                    onChange={(e) => setCashFlowMin(e.target.value)}
                    className="mt-2 w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground"
                  >
                    {cashFlowOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Beds dropdown */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Beds / Sort
                  </label>
                  <div className="mt-2 space-y-2">
                    <select
                      value={bedsMin}
                      onChange={(e) => setBedsMin(e.target.value)}
                      className="w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground"
                    >
                      {bedsOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
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
              {paginated.map((property) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  slug={property.slug}
                  address={property.address}
                  city={property.city}
                  zip={property.zip}
                  price={property.price}
                  beds={property.beds}
                  baths={property.baths}
                  sqft={property.sqft}
                  propertyType={property.propertyType}
                  photos={property.photos}
                  capRate={property.capRate}
                  cashFlow={property.cashFlow}
                  cocReturn={property.cocReturn}
                  rent={property.rent}
                  verdict={property.verdict}
                  e2Eligible={property.e2Eligible}
                  daysOnMarket={property.daysOnMarket}
                  yearBuilt={property.yearBuilt}
                  hoaFee={property.hoaFee}
                />
              ))}
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
