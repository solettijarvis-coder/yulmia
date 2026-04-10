import Link from "next/link";

interface MarketStatsData {
  totalProperties: number;
  avgCapRate: number;
  medianPrice: number;
  avgRent: number;
  strongCount: number;
  moderateCount: number;
  e2Count: number;
  cities: string[];
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

  // Top 6 cities by cap rate (min 10 listings)
  const topCapRateAreas = neighborhoods
    .filter((n) => n.totalListings >= 10)
    .sort((a, b) => b.avgCapRate - a.avgCapRate)
    .slice(0, 6);

  const statCards = [
    {
      label: "Total Properties",
      value: stats.totalProperties.toLocaleString(),
      change: "Live MLS Data",
      positive: true,
    },
    {
      label: "Median Price",
      value: formatPrice(stats.medianPrice),
      change: "Single-family + Multi-family",
      positive: true,
    },
    {
      label: "Average Cap Rate",
      value: `${stats.avgCapRate}%`,
      change: `${stats.strongCount} STRONG deals`,
      positive: stats.strongCount > 0,
    },
    {
      label: "Average Rent",
      value: `$${stats.avgRent.toLocaleString()}/mo`,
      change: `${stats.e2Count} E-2 eligible`,
      positive: true,
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            South Florida Market Data
          </h2>
          <p className="mt-3 text-muted-foreground">
            Real investment metrics from {stats.totalProperties.toLocaleString()} properties across {stats.cities.length} cities
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="p-5 rounded-xl border border-border bg-card"
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="mt-1 text-2xl sm:text-3xl font-serif font-bold text-foreground">
                {stat.value}
              </p>
              <p className={`mt-1 text-xs font-medium ${stat.positive ? "text-success" : "text-destructive"}`}>
                {stat.change}
              </p>
            </div>
          ))}
        </div>

        {/* Best Cap Rates Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Highest Cap Rate Areas
            </h3>
            <Link href="/neighborhoods" className="text-xs text-primary hover:underline">
              View all cities
            </Link>
          </div>
          <div className="divide-y divide-border">
            {topCapRateAreas.map((area) => (
              <Link
                key={area.id}
                href={`/neighborhoods/${area.slug}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium text-foreground text-sm">
                    {area.name}
                  </span>
                  <span className="text-xs text-primary font-semibold">
                    {area.avgCapRate}% cap
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    Avg {formatPrice(area.avgPrice)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {area.totalListings} listings
                  </span>
                  <span className="text-xs text-success font-medium">
                    {area.avgDaysOnMarket} DOM
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
