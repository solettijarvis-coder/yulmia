import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, TrendingUp, DollarSign, Percent, MapPin } from "lucide-react";

// Mock featured properties - will be replaced with real data
const featuredProperties = [
  {
    slug: "1420-sw-8th-st-miami-33135",
    address: "1420 SW 8th St",
    city: "Miami",
    neighborhood: "Little Havana",
    price: 485000,
    beds: 3,
    baths: 2,
    sqft: 1650,
    propertyType: "SINGLE_FAMILY" as const,
    capRate: 7.2,
    estimatedRent: 3200,
    verdict: "STRONG" as const,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
  },
  {
    slug: "3210-ne-2nd-ave-fort-lauderdale-33334",
    address: "3210 NE 2nd Ave",
    city: "Fort Lauderdale",
    neighborhood: "Victoria Park",
    price: 625000,
    beds: 4,
    baths: 3,
    sqft: 2100,
    propertyType: "SINGLE_FAMILY" as const,
    capRate: 5.8,
    estimatedRent: 3800,
    verdict: "MODERATE" as const,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  },
  {
    slug: "7850-dixie-hwy-pompano-beach-33064",
    address: "7850 Dixie Hwy",
    city: "Pompano Beach",
    neighborhood: "Pompano Beach",
    price: 375000,
    beds: 3,
    baths: 2,
    sqft: 1400,
    propertyType: "DISTRESSED" as const,
    capRate: 8.5,
    estimatedRent: 2800,
    verdict: "STRONG" as const,
    image: "https://images.unsplash.com/photo-1605276374104-dee33a769aa2?w=800&q=80",
  },
  {
    slug: "5520-brickell-key-dr-miami-33131",
    address: "5520 Brickell Key Dr",
    city: "Miami",
    neighborhood: "Brickell",
    price: 890000,
    beds: 2,
    baths: 2,
    sqft: 1200,
    propertyType: "MULTIFAMILY_2_4" as const,
    capRate: 6.1,
    estimatedRent: 5500,
    verdict: "MODERATE" as const,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
  },
  {
    slug: "2100-s-military-trail-west-palm-beach-33409",
    address: "2100 S Military Trail",
    city: "West Palm Beach",
    neighborhood: "West Palm Beach",
    price: 295000,
    beds: 3,
    baths: 2,
    sqft: 1350,
    propertyType: "SINGLE_FAMILY" as const,
    capRate: 7.8,
    estimatedRent: 2400,
    verdict: "STRONG" as const,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  },
  {
    slug: "4400-n-ocean-blvd-boca-raton-33431",
    address: "4400 N Ocean Blvd",
    city: "Boca Raton",
    neighborhood: "Boca Raton",
    price: 1100000,
    beds: 5,
    baths: 4,
    sqft: 3200,
    propertyType: "SINGLE_FAMILY" as const,
    capRate: 4.9,
    estimatedRent: 6200,
    verdict: "MODERATE" as const,
    image: "https://images.unsplash.com/photo-1600047509807-bdf8383d9994?w=800&q=80",
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

const verdictConfig = {
  STRONG: { label: "Strong Investment", className: "bg-success/10 text-success border-success/20" },
  MODERATE: { label: "Moderate", className: "bg-warning/10 text-warning border-warning/20" },
  CAUTIOUS: { label: "Cautious", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export function FeaturedProperties() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
              Featured Investments
            </h2>
            <p className="mt-2 text-muted-foreground">
              Hand-picked properties with strong investment potential
            </p>
          </div>
          <Link
            href="/search"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View all properties
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((property) => {
            const verdict = verdictConfig[property.verdict];
            return (
              <Link key={property.slug} href={`/property/${property.slug}`}>
                <Card className="group property-card overflow-hidden border-border bg-card hover:border-primary/40 transition-all duration-300">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${property.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Verdict Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className={`${verdict.className} border text-xs font-semibold`}>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {verdict.label}
                      </Badge>
                    </div>

                    {/* Price */}
                    <div className="absolute bottom-3 left-3">
                      <span className="text-2xl font-serif font-bold text-white">
                        {formatPrice(property.price)}
                      </span>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    {/* Address */}
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {property.address}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {property.neighborhood}, {property.city}
                        </p>
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{property.beds} bd</span>
                      <span className="text-border">|</span>
                      <span>{property.baths} ba</span>
                      <span className="text-border">|</span>
                      <span>{property.sqft.toLocaleString()} sqft</span>
                    </div>

                    {/* Investor Metrics */}
                    <div className="mt-3 pt-3 border-t border-border grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Percent className="h-3 w-3 text-primary" />
                          <span className="text-sm font-bold text-primary">
                            {property.capRate}%
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Cap Rate
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <DollarSign className="h-3 w-3 text-primary" />
                          <span className="text-sm font-bold text-primary">
                            {formatPrice(property.estimatedRent)}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Est. Rent/mo
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <TrendingUp className="h-3 w-3 text-primary" />
                          <span className="text-sm font-bold text-primary">
                            {(property.estimatedRent * 12 / property.price * 100).toFixed(1)}%
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Gross Yield
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/search"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
          >
            View all properties
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}