import Link from "next/link";
import { Hero } from "@/components/home/hero";
import { FeaturedProperties } from "@/components/home/featured-properties";
import { WhyYulmia } from "@/components/home/why-yulmia";
import { NeighborhoodHighlights } from "@/components/home/neighborhood-highlights";
import { MarketStats } from "@/components/home/market-stats";
import { CTASection } from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <FeaturedProperties />
      <WhyYulmia />
      <NeighborhoodHighlights />
      <MarketStats />
      <CTASection />
    </div>
  );
}