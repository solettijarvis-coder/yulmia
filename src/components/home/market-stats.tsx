import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface MarketStatsData {
  totalProperties: number;
  avgCapRate: number;
  medianPrice: number;
  avgRent: number;
  strongCount: number;
  e2Count: number;
  onePercentRuleCount?: number;
  avgCashFlow?: number;
}

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
}

async function getMarketStats(): Promise<MarketStatsData | null> {
  try {
    const fs = await import("fs");
    const path = await import("path");
    const dataPath = path.join(process.cwd(), "public", "data", "market-stats.json");
    const raw = fs.readFileSync(dataPath, "utf-8");
    return JSON.parse(raw);
  } catch {}
  return null;
}

async function getNeighborhoods(): Promise<NeighborhoodData[]> {
  try {
    const fs = await import("fs");
    const path = await import("path");
    const dataPath = path.join(process.cwd(), "public", "data", "neighborhoods.json");
    const raw = fs.readFileSync(dataPath, "utf-8");
    return JSON.parse(raw);
  } catch {}
  return [];
}

function formatPrice(price: number) {
  if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
  if (price >= 1000) return `$${Math.round(price / 1000)}K`;
  return `$${price.toLocaleString()}`;
}

export async function MarketStats() {
  const [stats, neighborhoods] = await Promise.all([getMarketStats(), getNeighborhoods()]);

  if (!stats) return null;

  const topCapRateAreas = neighborhoods
    .filter((n) => n.totalListings >= 10)
    .sort((a, b) => b.avgCapRate - a.avgCapRate)
    .slice(0, 8);

  return (
    <section className="py-24 px-6 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        {/* Section header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-gold">
              Market Data
            </span>
            <h2 className="mt-2 text-3xl lg:text-4xl font-light tracking-[-0.03em] text-foreground">
              South Florida at a glance
            </h2>
          </div>
          <Link
            href="/search"
            className="hidden sm:flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors gold-underline"
          >
            View all properties
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Stats grid — flat tiles, no cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border mb-16">
          {[
            { label: "Properties", value: stats.totalProperties.toLocaleString(), sub: "Live MLS data" },
            { label: "Median Price", value: formatPrice(stats.medianPrice), sub: "Single-family & multi-family" },
            { label: "Avg Cap Rate", value: `${stats.avgCapRate}%`, sub: `${stats.strongCount} STRONG deals` },
            { label: "Avg Rent", value: `$${stats.avgRent.toLocaleString()}/mo`, sub: `${stats.e2Count} E-2 eligible` },
          ].map((stat) => (
            <div key={stat.label} className="bg-card p-6 lg:p-8">
              <div className="text-[11px] tracking-[0.12em] uppercase text-muted-foreground mb-3">
                {stat.label}
              </div>
              <div className="text-2xl lg:text-3xl font-light tracking-[-0.03em] text-foreground tabular-nums">
                {stat.value}
              </div>
              <div className="text-[12px] text-muted-foreground/60 mt-2 tracking-[0.01em]">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Top cap rate areas — editorial table */}
        <div className="border-t border-border pt-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-medium tracking-[0.02em] text-foreground">
              Highest Cap Rate Areas
            </h3>
            <Link href="/neighborhoods" className="text-[12px] text-muted-foreground hover:text-foreground transition-colors gold-underline">
              All cities
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
            {topCapRateAreas.map((area, i) => (
              <Link
                key={area.id}
                href={`/neighborhoods/${area.slug}`}
                className="group flex items-baseline justify-between py-3 px-1 border-b border-border/50 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-[11px] text-muted-foreground/40 tabular-nums w-4">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-foreground group-hover:text-gold transition-colors">
                    {area.name}
                  </span>
                </div>
                <span className="text-sm font-light tabular-nums text-gold">
                  {area.avgCapRate}%
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
