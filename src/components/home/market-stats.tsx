"use client";

const stats = [
  { label: "Median House Price", value: "$412,000", change: "+4.2%", positive: true },
  { label: "Average Cap Rate", value: "6.8%", change: "+0.3%", positive: true },
  { label: "Average Days on Market", value: "34", change: "-8%", positive: true },
  { label: "Avg Rent (3BR House)", value: "$3,200/mo", change: "+5.1%", positive: true },
];

const marketHighlights = [
  { area: "Little Havana", cap: "7.8%", price: "$380K", trend: "↑ Hot" },
  { area: "Wynwood", cap: "7.1%", price: "$420K", trend: "↑ Rising" },
  { area: "Pompano Beach", cap: "8.5%", price: "$350K", trend: "↑ Strong" },
  { area: "West Palm Beach", cap: "8.1%", price: "$310K", trend: "↑ Growing" },
];

export function MarketStats() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            South Florida Market Data
          </h2>
          <p className="mt-3 text-muted-foreground">
            Real-time investment metrics for houses and multifamily properties
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((stat) => (
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
                {stat.change} YoY
              </p>
            </div>
          ))}
        </div>

        {/* Best Cap Rates Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Highest Cap Rate Areas
            </h3>
          </div>
          <div className="divide-y divide-border">
            {marketHighlights.map((area) => (
              <div
                key={area.area}
                className="flex items-center justify-between px-5 py-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium text-foreground text-sm">
                    {area.area}
                  </span>
                  <span className="text-xs text-primary font-semibold">
                    {area.cap} cap
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    Avg {area.price}
                  </span>
                  <span className="text-xs text-success font-medium">
                    {area.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}