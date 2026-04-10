import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { serviceAreas } from "@/lib/utils";

const areaImages: Record<string, string> = {
  miami: "https://images.unsplash.com/photo-1514214246283-c59a3d312634?w=600&q=80",
  brickell: "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=600&q=80",
  wynwood: "https://images.unsplash.com/photo-1504280926730-8f4d3f6e1e0b?w=600&q=80",
  "little-havana": "https://images.unsplash.com/photo-1545641796-4c97e16a4a2c?w=600&q=80",
  "coconut-grove": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
  edgewater: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
  "design-district": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
  "fort-lauderdale": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
  "west-palm-beach": "https://images.unsplash.com/photo-1600047509807-bdf8383d9994?w=600&q=80",
  "boca-raton": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
};

const areaStats: Record<string, { avgCapRate: string; avgPrice: string }> = {
  miami: { avgCapRate: "6.8%", avgPrice: "$520K" },
  brickell: { avgCapRate: "5.2%", avgPrice: "$680K" },
  wynwood: { avgCapRate: "7.1%", avgPrice: "$420K" },
  "little-havana": { avgCapRate: "7.8%", avgPrice: "$380K" },
  "coconut-grove": { avgCapRate: "5.5%", avgPrice: "$750K" },
  edgewater: { avgCapRate: "6.2%", avgPrice: "$440K" },
  "design-district": { avgCapRate: "5.8%", avgPrice: "$590K" },
  "fort-lauderdale": { avgCapRate: "7.4%", avgPrice: "$450K" },
  "west-palm-beach": { avgCapRate: "8.1%", avgPrice: "$310K" },
  "boca-raton": { avgCapRate: "5.9%", avgPrice: "$520K" },
};

export function NeighborhoodHighlights() {
  const featured = serviceAreas.filter((area) =>
    ["miami", "wynwood", "fort-lauderdale", "west-palm-beach", "little-havana", "brickell"].includes(area.slug)
  );

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
              Investment Areas
            </h2>
            <p className="mt-2 text-muted-foreground">
              South Florida neighborhoods with the best investment potential
            </p>
          </div>
          <Link
            href="/neighborhoods"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            All areas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((area) => {
            const image = areaImages[area.slug] || areaImages.miami;
            const stats = areaStats[area.slug] || { avgCapRate: "6.5%", avgPrice: "$400K" };
            return (
              <Link
                key={area.slug}
                href={`/neighborhoods/${area.slug}`}
                className="group relative overflow-hidden rounded-xl aspect-[4/3]"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {area.county}
                    </span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-white">
                    {area.name}
                  </h3>
                  <div className="mt-2 flex items-center gap-4 text-sm">
                    <span className="text-primary font-semibold">
                      Avg Cap: {stats.avgCapRate}
                    </span>
                    <span className="text-white/70">
                      Avg: {stats.avgPrice}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}