"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { propertyTypeLabels, formatPrice, formatPercent } from "@/lib/utils";
import type { PropertyType } from "@/types/property";

// Mock search results - will be replaced with real data
const mockResults = Array.from({ length: 12 }, (_, i) => ({
  id: `mock-${i + 1}`,
  slug: `property-${i + 1}-miami-fl`,
  address: `${1000 + i * 100} SW ${8 + i}th St`,
  city: i < 6 ? "Miami" : i < 9 ? "Fort Lauderdale" : "West Palm Beach",
  neighborhood: ["Little Havana", "Wynwood", "Brickell", "Edgewater", "Coconut Grove", "Design District", "Victoria Park", "Pompano Beach", "Coral Springs", "Downtown", "Flamingo Park", "Northwood"][i],
  price: [385000, 420000, 680000, 440000, 750000, 590000, 475000, 350000, 395000, 310000, 520000, 455000][i],
  beds: [3, 2, 4, 3, 5, 4, 3, 3, 2, 3, 4, 3][i],
  baths: [2, 1, 3, 2, 4, 3, 2, 2, 2, 2, 3, 2][i],
  sqft: [1650, 1200, 2100, 1450, 3200, 2400, 1800, 1400, 1100, 1350, 2800, 1900][i],
  propertyType: (["SINGLE_FAMILY", "MULTIFAMILY_2_4", "SINGLE_FAMILY", "DISTRESSED", "SINGLE_FAMILY", "MULTIFAMILY_5PLUS", "SINGLE_FAMILY", "DISTRESSED", "SINGLE_FAMILY", "SINGLE_FAMILY", "SINGLE_FAMILY", "MULTIFAMILY_2_4"] as const)[i],
  capRate: [7.8, 7.1, 5.2, 8.2, 5.5, 6.8, 7.4, 8.5, 6.5, 8.1, 5.9, 6.2][i],
  estimatedRent: [2600, 2900, 4200, 2800, 4800, 6800, 3100, 2500, 2200, 2400, 3500, 3800][i],
  verdict: (["STRONG", "STRONG", "MODERATE", "STRONG", "MODERATE", "STRONG", "STRONG", "STRONG", "MODERATE", "STRONG", "MODERATE", "MODERATE"] as const)[i],
  daysOnMarket: [22, 14, 45, 8, 52, 30, 18, 5, 35, 28, 48, 20][i],
  image: `https://images.unsplash.com/photo-1600${58000000 + i * 10000000}?w=400&q=80`,
}));

const verdictConfig = {
  STRONG: { label: "Strong", className: "bg-success/10 text-success border-success/20" },
  MODERATE: { label: "Moderate", className: "bg-warning/10 text-warning border-warning/20" },
  CAUTIOUS: { label: "Cautious", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<PropertyType[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
  const [sortBy, setSortBy] = useState("cap_rate_desc");

  const toggleType = (type: PropertyType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="min-h-screen">
      {/* Search Header */}
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            Investment Properties
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Houses, multifamily, and distressed properties in South Florida
          </p>

          {/* Search Bar */}
          <div className="mt-4 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by city, neighborhood, or address..."
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
          {selectedTypes.length > 0 && (
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
              <button
                className="text-xs text-muted-foreground hover:text-primary"
                onClick={() => setSelectedTypes([])}
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
                    Price Range
                  </label>
                  <div className="mt-2 space-y-2">
                    <Input placeholder="Min price" className="h-9 text-sm" />
                    <Input placeholder="Max price" className="h-9 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Min Cap Rate
                  </label>
                  <div className="mt-2">
                    <Input placeholder="e.g. 5%" className="h-9 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Sort By
                  </label>
                  <div className="mt-2">
                    <select className="w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground">
                      <option value="cap_rate_desc">Highest Cap Rate</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="newest">Newest Listings</option>
                      <option value="days_on_market">Days on Market</option>
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
            Showing <span className="text-foreground font-medium">2,400+</span> investment properties
          </p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-border bg-background rounded-md px-3 py-1.5 text-foreground"
          >
            <option value="cap_rate_desc">Highest Cap Rate</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest</option>
            <option value="days_on_market">Days on Market</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {mockResults.map((property) => {
            const verdict = verdictConfig[property.verdict];
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
                      style={{
                        backgroundImage: `url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80)`,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <Badge className={`${verdict.className} border text-xs font-semibold`}>
                        {verdict.label}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="text-xl font-serif font-bold text-white">
                        {formatPrice(property.price)}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <Badge variant="secondary" className="text-xs bg-black/50 text-white border-0">
                        {property.daysOnMarket} days
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
                          {property.neighborhood}, {property.city}
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
                        <p className="text-sm font-bold text-primary">{formatPrice(property.estimatedRent)}</p>
                        <p className="text-[10px] text-muted-foreground">Est. Rent</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-primary">
                          {formatPercent((property.estimatedRent * 12) / property.price * 100)}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Gross Yield</p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <Button variant="outline" size="lg" className="px-8">
            Load More Properties
          </Button>
        </div>
      </div>
    </div>
  );
}