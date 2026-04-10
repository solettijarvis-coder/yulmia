import Link from "next/link";
import { serviceAreas } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

const areaDescriptions: Record<string, string> = {
  miami: "Miami's diverse neighborhoods offer strong rental demand and appreciation potential for house and multifamily investors.",
  brickell: "Miami's financial district. Higher entry price, strong corporate housing demand and professional tenants.",
  wynwood: "Arts district with rapidly appreciating properties and growing rental demand from creative professionals.",
  "little-havana": "Affordable entry point with some of the highest cap rates in Miami-Dade. Strong cultural demand.",
  "coconut-grove": "Upscale village atmosphere with premium properties and stable demand from affluent tenants.",
  edgewater: "Growing neighborhood between Wynwood and the Bay with increasing investor opportunity.",
  "fort-lauderdale": "Broward County's urban core with excellent multifamily opportunities and growing demand.",
  "west-palm-beach": "Palm Beach County hub with affordable investment properties and rising cap rates.",
  "boca-raton": "Premium South Palm Beach market with stable demand and appreciation potential.",
};

export default function NeighborhoodsPage() {
  return (
    <div className="min-h-screen">
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground">
            Investment Areas
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            South Florida neighborhoods with the best investment potential for houses and multifamily properties.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceAreas.map((area) => (
              <Link
                key={area.slug}
                href={`/neighborhoods/${area.slug}`}
                className="group block p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-serif font-semibold text-foreground group-hover:text-primary transition-colors">
                    {area.name}
                  </h2>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-xs text-primary font-medium">{area.county} County</p>
                <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                  {areaDescriptions[area.slug] || "Explore investment opportunities in this South Florida market."}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}