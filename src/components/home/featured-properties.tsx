import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface FeaturedProperty {
  id: string;
  slug: string;
  address: string;
  city: string;
  zip: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  propertyType: string;
  photo: string | null;
  photos?: string[];
  capRate: number;
  cashFlow: number;
  cocReturn: number;
  rent: number;
  verdict: "STRONG" | "MODERATE" | "CAUTIOUS";
  e2Eligible: boolean;
  summary?: string;
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

export async function FeaturedProperties() {
  const properties = await getFeaturedProperties();

  if (properties.length === 0) return null;

  return (
    <section className="py-24 px-6 lg:px-10 border-t border-border">
      <div className="mx-auto max-w-[1400px]">
        {/* Section header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-gold">
              Featured
            </span>
            <h2 className="mt-2 text-3xl lg:text-4xl font-light tracking-[-0.03em] text-foreground">
              Strong investments
            </h2>
          </div>
          <Link
            href="/search"
            className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors gold-underline"
          >
            All properties
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Horizontal scroll carousel */}
        <div className="-mx-6 lg:-mx-10 overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 px-6 lg:px-10 pb-4" style={{ minWidth: "min-content" }}>
            {properties.map((property) => {
              const photo = property.photos?.[0] || property.photo;
              const grossYield = ((property.rent * 12) / property.price * 100).toFixed(1);

              return (
                <Link
                  key={property.slug}
                  href={`/property/${property.slug}`}
                  className="group flex-shrink-0 w-[300px] lg:w-[340px]"
                >
                  {/* Image — no rounded corners */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-card">
                    {photo ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url(${photo})` }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
                        No image
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                    
                    {/* Verdict + E2 badges — minimal */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`text-[10px] font-medium tracking-[0.08em] uppercase px-2 py-1 ${
                        property.verdict === "STRONG"
                          ? "bg-success/15 text-success"
                          : property.verdict === "MODERATE"
                          ? "bg-warning/15 text-warning"
                          : "bg-destructive/15 text-destructive"
                      }`}>
                        {property.verdict}
                      </span>
                      {property.e2Eligible && (
                        <span className="text-[10px] font-medium tracking-[0.08em] uppercase px-2 py-1 bg-gold/10 text-gold">
                          E-2
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="absolute bottom-3 left-3">
                      <span className="text-xl font-light tracking-[-0.02em] text-foreground tabular-nums">
                        {formatPrice(property.price)}
                      </span>
                    </div>
                  </div>

                  {/* Details — Bloomberg tile style */}
                  <div className="pt-3">
                    <div className="text-[13px] text-foreground tracking-[0.01em] truncate">
                      {property.address}
                    </div>
                    <div className="text-[12px] text-muted-foreground mt-0.5">
                      {property.city}, FL {property.zip}
                    </div>
                    
                    {/* Metrics row */}
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/50">
                      <div>
                        <div className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground/50">Cap</div>
                        <div className="text-sm font-light tabular-nums text-gold">{property.capRate}%</div>
                      </div>
                      <div>
                        <div className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground/50">Cash Flow</div>
                        <div className={`text-sm font-light tabular-nums ${property.cashFlow >= 0 ? "text-success" : "text-muted-foreground"}`}>
                          {property.cashFlow >= 0 ? "+" : ""}${property.cashFlow.toLocaleString()}/mo
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground/50">Beds</div>
                        <div className="text-sm font-light tabular-nums text-foreground">{property.beds}bd</div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
