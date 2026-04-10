import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, TrendingUp, DollarSign, Percent, MapPin } from "lucide-react";

interface FeaturedProperty {
  id: string;
  slug: string;
  address: string;
  city: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  propertyType: string;
  photo: string | null;
  capRate: number;
  cashFlow: number;
  cocReturn: number;
  rent: number;
  verdict: "STRONG" | "MODERATE" | "CAUTIOUS";
  e2Eligible: boolean;
}

async function getFeaturedProperties(): Promise<FeaturedProperty[]> {
  try {
    const fs = await import("fs");
    const path = await import("path");
    const dataPath = path.join(process.cwd(), "public", "data", "featured.json");
    const raw = fs.readFileSync(dataPath, "utf-8");
    return JSON.parse(raw);
  } catch {}
  return [];
}

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

export async function FeaturedProperties() {
  const properties = await getFeaturedProperties();

  if (properties.length === 0) return null;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
              Featured Investments
            </h2>
            <p className="mt-2 text-muted-foreground">
              Hand-picked properties with strong investment potential from real MLS data
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
          {properties.map((property) => {
            const verdict = verdictConfig[property.verdict];
            const grossYield = ((property.rent * 12) / property.price * 100).toFixed(1);
            return (
              <Link key={property.slug} href={`/property/${property.slug}`}>
                <Card className="group property-card overflow-hidden border-border bg-card hover:border-primary/40 transition-all duration-300">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 bg-gray-800"
                      style={property.photo ? { backgroundImage: `url(${property.photo})` } : undefined}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Verdict Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className={`${verdict.className} border text-xs font-semibold`}>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {verdict.label}
                      </Badge>
                    </div>

                    {/* E2 Badge */}
                    {property.e2Eligible && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-primary/20 text-primary border-primary/30 border text-[10px] font-semibold">
                          E-2 Eligible
                        </Badge>
                      </div>
                    )}

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
                          {property.city}, FL
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
                            {formatPrice(property.rent)}
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
                            {grossYield}%
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
