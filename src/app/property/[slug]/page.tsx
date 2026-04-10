import { PropertyDetailPage } from "@/components/property/property-detail-page";

export const metadata = {
  title: "Property Details — YULMIA",
  description: "Investment property analysis with AI-powered insights.",
};

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <PropertyDetailPage slug={params} />;
}