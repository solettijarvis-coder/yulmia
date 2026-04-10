"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  TrendingUp,
  DollarSign,
  Percent,
  Clock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Info,
  ArrowLeft,
  Share2,
  Heart,
  Calculator,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

// Mock property data - will be replaced with real data from Supabase
const mockProperty = {
  slug: "1420-sw-8th-st-miami-33135",
  address: "1420 SW 8th St",
  city: "Miami",
  state: "FL",
  zip: "33135",
  neighborhood: "Little Havana",
  price: 485000,
  beds: 3,
  baths: 2,
  sqft: 1650,
  lotSize: 6000,
  yearBuilt: 1965,
  propertyType: "SINGLE_FAMILY",
  hoaFee: 0,
  annualTax: 6840,
  daysOnMarket: 22,
  description:
    "Charming 3-bedroom, 2-bathroom single-family home in the heart of Little Havana. This property offers excellent investment potential with strong rental demand in one of Miami's most culturally vibrant neighborhoods. The home features a spacious layout, original terrazzo floors, and a large backyard perfect for entertaining. Located walking distance to Calle Ocho, with easy access to Downtown Miami and Brickell.",
  financials: {
    estimatedRentMonthly: 3200,
    capRate: 7.2,
    cashOnCashReturn: 5.8,
    monthlyCashFlow: 820,
    onePercentRule: true, // $3,200 >= $4,850 (1% of $485,000)
    grossRentMultiplier: 12.6,
    pricePerSqft: 294,
    neighborhoodAvgPricePerSqft: 310,
    annualInsurance: 4800,
    annualMaintenance: 4850,
    monthlyMortgage: 2380,
    downPaymentPercent: 20,
    interestRate: 7.0,
  },
  aiInsight: {
    summary:
      "This 3BR/2BA single-family home in Little Havana represents a strong investment opportunity. At $485,000 with an estimated monthly rent of $3,200, the property meets the 1% rule and offers a 7.2% cap rate — well above the Miami-Dade average of 6.8%. Little Havana's rental market is tight, with vacancy rates under 3% and growing demand from young professionals priced out of Brickell and Wynwood. The property's 1965 construction means maintenance costs should be budgeted at 1% of value annually, and flood insurance is mandatory in this zone.",
    pros: [
      "Strong cap rate (7.2%) exceeding neighborhood average",
      "Passes the 1% rule with $3,200/month estimated rent",
      "Little Havana vacancy rate under 3% — strong rental demand",
      "Walking distance to Calle Ocho cultural corridor",
      "No HOA fees — full control over the property",
      "E2 visa eligible at this price point for Canadian investors",
    ],
    risks: [
      "1965 construction — budget $4,850/yr for maintenance",
      "Flood zone AE — mandatory flood insurance ($400/mo est.)",
      "Property taxes may increase as area appreciates",
      "Limited parking in this neighborhood",
      "Hurricane risk requires adequate insurance coverage",
    ],
    e2Eligible: true,
    e2Notes:
      "At $485,000, this property exceeds the typical E-2 visa investment threshold. Combined with active property management, this investment would support a strong E-2 application. We recommend consulting with an immigration attorney to structure the investment properly.",
    verdict: "STRONG" as const,
  },
  detail: {
    floodZone: "AE",
    floodRiskScore: 6,
    walkScore: 82,
    transitScore: 68,
    bikeScore: 71,
    schoolRatingAvg: 5.8,
    neighborhoodScore: 78,
  },
};

const verdictConfig = {
  STRONG: { label: "Strong Investment", color: "text-success", bg: "bg-success/10 border-success/20" },
  MODERATE: { label: "Moderate Investment", color: "text-warning", bg: "bg-warning/10 border-warning/20" },
  CAUTIOUS: { label: "Proceed with Caution", color: "text-destructive", bg: "bg-destructive/10 border-destructive/20" },
};

export function PropertyDetailPage({ slug }: { slug: Promise<{ slug: string }> }) {
  const p = mockProperty;
  const f = p.financials;
  const verdict = verdictConfig[p.aiInsight.verdict];

  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <Link
            href="/search"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to properties
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Placeholder */}
            <div className="aspect-[16/9] rounded-xl overflow-hidden bg-card border border-border">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80)",
                }}
              />
            </div>

            {/* Title + Verdict */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge className={`${verdict.bg} border font-semibold`}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {verdict.label}
                </Badge>
                {f.onePercentRule && (
                  <Badge className="bg-success/10 text-success border-success/20 border">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Passes 1% Rule
                  </Badge>
                )}
                {p.aiInsight.e2Eligible && (
                  <Badge className="bg-primary/10 text-primary border-primary/20 border">
                    E2 Eligible
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
                {formatPrice(p.price)}
              </h1>
              <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{p.address}, {p.city}, {p.state} {p.zip}</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5"><Bed className="h-4 w-4 text-primary" /> {p.beds} Beds</span>
              <span className="text-border">|</span>
              <span className="flex items-center gap-1.5"><Bath className="h-4 w-4 text-primary" /> {p.baths} Baths</span>
              <span className="text-border">|</span>
              <span className="flex items-center gap-1.5"><Square className="h-4 w-4 text-primary" /> {p.sqft.toLocaleString()} sqft</span>
              <span className="text-border">|</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" /> {p.daysOnMarket} days on market</span>
              {p.hoaFee > 0 && (
                <>
                  <span className="text-border">|</span>
                  <span>HOA: {formatPrice(p.hoaFee)}/mo</span>
                </>
              )}
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-xl font-serif font-semibold text-foreground mb-3">
                About This Property
              </h2>
              <p className="text-muted-foreground leading-relaxed">{p.description}</p>
            </div>

            <Separator />

            {/* Property Details Grid */}
            <div>
              <h2 className="text-xl font-serif font-semibold text-foreground mb-4">
                Property Details
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: "Property Type", value: "Single Family Home" },
                  { label: "Year Built", value: p.yearBuilt?.toString() || "N/A" },
                  { label: "Lot Size", value: p.lotSize ? `${p.lotSize.toLocaleString()} sqft` : "N/A" },
                  { label: "Price/sqft", value: `$${f.pricePerSqft}/sqft` },
                  { label: "Annual Tax", value: formatPrice(p.annualTax) },
                  { label: "Insurance Est.", value: `${formatPrice(f.annualInsurance)}/yr` },
                  { label: "Flood Zone", value: p.detail?.floodZone || "N/A" },
                  { label: "Walk Score", value: p.detail?.walkScore?.toString() || "N/A" },
                  { label: "School Rating", value: `${p.detail?.schoolRatingAvg}/10` },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-lg border border-border bg-card">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* AI Investment Insights */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calculator className="h-5 w-5 text-primary" />
                  </div>
                  AI Investment Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">{p.aiInsight.summary}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Pros */}
                  <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                    <h4 className="text-sm font-semibold text-success flex items-center gap-1.5 mb-2">
                      <CheckCircle className="h-4 w-4" />
                      Investment Pros
                    </h4>
                    <ul className="space-y-1.5">
                      {p.aiInsight.pros.map((pro, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-success mt-0.5">+</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Risks */}
                  <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                    <h4 className="text-sm font-semibold text-destructive flex items-center gap-1.5 mb-2">
                      <AlertTriangle className="h-4 w-4" />
                      Investment Risks
                    </h4>
                    <ul className="space-y-1.5">
                      {p.aiInsight.risks.map((risk, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-destructive mt-0.5">!</span>
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {p.aiInsight.e2Eligible && (
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <h4 className="text-sm font-semibold text-primary flex items-center gap-1.5 mb-2">
                      <ShieldCheck className="h-4 w-4" />
                      E2 Visa Eligibility
                    </h4>
                    <p className="text-sm text-muted-foreground">{p.aiInsight.e2Notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Financial Sidebar */}
          <div className="space-y-6">
            {/* Investor Metrics Card */}
            <Card className="border-primary/20 sticky top-20">
              <CardHeader>
                <CardTitle className="text-lg">Investor Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-success/10 border border-success/20 text-center">
                    <p className="text-2xl font-serif font-bold text-success">{f.capRate}%</p>
                    <p className="text-xs text-muted-foreground">Cap Rate</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
                    <p className="text-2xl font-serif font-bold text-primary">{formatPrice(f.estimatedRentMonthly)}</p>
                    <p className="text-xs text-muted-foreground">Est. Rent/mo</p>
                  </div>
                  <div className="p-3 rounded-lg bg-card border border-border text-center">
                    <p className="text-2xl font-serif font-bold text-foreground">{f.cashOnCashReturn}%</p>
                    <p className="text-xs text-muted-foreground">Cash on Cash</p>
                  </div>
                  <div className="p-3 rounded-lg bg-card border border-border text-center">
                    <p className="text-2xl font-serif font-bold text-foreground">{formatPrice(f.monthlyCashFlow)}</p>
                    <p className="text-xs text-muted-foreground">Cash Flow/mo</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Purchase Price</span>
                    <span className="font-medium text-foreground">{formatPrice(p.price)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Down Payment ({f.downPaymentPercent}%)</span>
                    <span className="font-medium text-foreground">{formatPrice(p.price * (f.downPaymentPercent / 100))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Est. Mortgage ({f.interestRate}%)</span>
                    <span className="font-medium text-foreground">{formatPrice(f.monthlyMortgage)}/mo</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Annual Tax</span>
                    <span className="font-medium text-foreground">{formatPrice(p.annualTax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Annual Insurance</span>
                    <span className="font-medium text-foreground">{formatPrice(f.annualInsurance)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Maintenance (1%)</span>
                    <span className="font-medium text-foreground">{formatPrice(f.annualMaintenance)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Gross Rent Multiplier</span>
                  <span className="font-medium text-foreground">{f.grossRentMultiplier}x</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">1% Rule</span>
                  <span className={`font-medium ${f.onePercentRule ? "text-success" : "text-destructive"}`}>
                    {f.onePercentRule ? "PASS" : "FAIL"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price/sqft</span>
                  <span className="font-medium text-foreground">${f.pricePerSqft}/sqft</span>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
                    Book Investment Consultation
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    Request Private Deal Access
                  </Button>
                </div>

                <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
                  Investment metrics are estimates based on market data and should not be considered financial advice.
                  Consult with a licensed financial advisor before making investment decisions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}