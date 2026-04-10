import { Brain, TrendingUp, ShieldCheck, DollarSign, Plane } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Investment Analysis",
    description:
      "Every property gets an AI-powered investment assessment with cap rates, cash flow projections, and risk analysis. Not just photos and price — real investor data.",
  },
  {
    icon: TrendingUp,
    title: "Investor-First Metrics",
    description:
      "Cap rate, cash-on-cash return, 1% rule, gross yield — calculated automatically. We show you what matters for investment decisions, not just bedroom counts.",
  },
  {
    icon: Plane,
    title: "E2 Visa Pathway",
    description:
      "Canadian investors can use property investment as a path to US residency. We identify E2-eligible properties and connect you with immigration attorneys.",
  },
  {
    icon: ShieldCheck,
    title: "Houses & Multifamily Only",
    description:
      "No condos. We focus exclusively on income-producing houses, multifamily properties, and distressed opportunities. The market every other site ignores.",
  },
];

export function WhyYulmia() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            Why <span className="text-gold-gradient">YULMIA</span>
          </h2>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            The only South Florida real estate platform built for investors, not condo browsers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-serif font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* E2 Visa CTA Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-xl border border-primary/20 bg-primary/5">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg font-serif font-semibold text-foreground">
                Canadian Investor? Your E2 Visa Starts Here
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Investment properties starting at $150K can qualify you for an E-2 Treaty Investor Visa.
                We identify eligible properties and connect you with immigration attorneys.
              </p>
            </div>
            <a
              href="/invest"
              className="shrink-0 mt-3 sm:mt-0 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              Learn About E2 Visa
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}