import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface NeighborhoodData {
  id: string;
  name: string;
  slug: string;
  state: string;
  totalListings: number;
  avgCapRate: number;
  avgPrice: number;
  avgRent: number;
  avgDaysOnMarket: number;
  investmentOverview?: string;
}

async function getNeighborhoods(): Promise<NeighborhoodData[]> {
  try {
    const fs = await import("fs");
    const path = await import("path");
    const dataPath = path.join(process.cwd(), "public", "data", "neighborhoods.json");
    const raw = fs.readFileSync(dataPath, "utf-8");
    const all: NeighborhoodData[] = JSON.parse(raw);
    return all.filter((n) => n.totalListings >= 20).slice(0, 6);
  } catch {}
  return [];
}

function formatPrice(price: number) {
  if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
  if (price >= 1000) return `$${Math.round(price / 1000)}K`;
  return `$${price.toLocaleString()}`;
}

export async function NeighborhoodHighlights() {
  const neighborhoods = await getNeighborhoods();

  if (neighborhoods.length === 0) return null;

  return (
    <section className="py-24 px-6 lg:px-10 border-t border-border">
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-gold">
              Neighborhoods
            </span>
            <h2 className="mt-2 text-3xl lg:text-4xl font-light tracking-[-0.03em] text-foreground">
              Where to invest
            </h2>
          </div>
          <Link
            href="/neighborhoods"
            className="hidden sm:flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors gold-underline"
          >
            All neighborhoods
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Grid — flat tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {neighborhoods.map((area) => (
            <Link
              key={area.id}
              href={`/neighborhoods/${area.slug}`}
              className="group bg-card p-6 lg:p-8 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-baseline justify-between mb-4">
                <h3 className="text-lg font-light tracking-[-0.02em] text-foreground group-hover:text-gold transition-colors">
                  {area.name}
                </h3>
                <span className="text-sm font-light tabular-nums text-gold">
                  {area.avgCapRate}%
                </span>
              </div>
              <div className="flex items-center gap-4 text-[12px] text-muted-foreground">
                <span className="tabular-nums">{area.totalListings} listings</span>
                <span className="tabular-nums">Avg {formatPrice(area.avgPrice)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
