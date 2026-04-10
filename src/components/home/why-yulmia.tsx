import Link from "next/link";
import { ArrowRight } from "lucide-react";

const services = [
  {
    number: "01",
    title: "Investment Acquisition",
    description: "Multi-family, single-family, distressed, and value-add properties. MLS + off-market deal sourcing with ROI analysis.",
  },
  {
    number: "02",
    title: "Commercial Real Estate",
    description: "Retail, office, industrial, and apartment buildings. Sales and leasing with tenant representation.",
  },
  {
    number: "03",
    title: "E-2 Visa Through Investment",
    description: "Guide Canadian and international investors through E-2 visa qualification using real estate investment properties.",
  },
  {
    number: "04",
    title: "Renovation Brokerage",
    description: "Strategy, contractor sourcing, and project coordination. ROI-focused improvements without performing construction work.",
  },
  {
    number: "05",
    title: "Property Management",
    description: "Full-service management including tenant placement, rent collection, maintenance, and performance tracking.",
  },
  {
    number: "06",
    title: "Private Investment Platform",
    description: "Gated access to curated off-market deals, early opportunities, and market intelligence for qualified clients.",
  },
];

export function WhyYulmia() {
  return (
    <section className="py-24 px-6 lg:px-10 border-t border-border">
      <div className="mx-auto max-w-[1400px]">
        {/* Section header */}
        <div className="grid lg:grid-cols-[1fr,1fr] gap-12 lg:gap-20 mb-16">
          <div>
            <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-gold">
              Services
            </span>
            <h2 className="mt-2 text-3xl lg:text-4xl font-light tracking-[-0.03em] text-foreground">
              Built for investors, not tourists
            </h2>
          </div>
          <div className="flex items-end">
            <p className="text-sm text-muted-foreground leading-relaxed tracking-[0.01em]">
              YULMIA is a full-service real estate investment platform operating across 
              South Florida. We source, analyze, and manage income-producing properties 
              for Canadian and international investors — with a specialization in E-2 
              visa qualification through real estate.
            </p>
          </div>
        </div>

        {/* Services grid — editorial numbered list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {services.map((service) => (
            <div key={service.number} className="bg-card p-6 lg:p-8 group">
              <div className="text-[11px] tracking-[0.15em] text-muted-foreground/40 tabular-nums mb-4">
                {service.number}
              </div>
              <h3 className="text-[15px] font-medium tracking-[-0.01em] text-foreground mb-3 group-hover:text-gold transition-colors">
                {service.title}
              </h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed tracking-[0.01em]">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
