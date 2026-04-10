"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { InvestorContactForm } from "@/components/forms/investor-contact-form";
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
  ArrowLeft,
  Calculator,
  Loader2,
  Building2,
  CalendarDays,
  TreePine,
  Car,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { InvestmentVerdict } from "@/types/property";
import { ImageGallery } from "@/components/property/image-gallery";
import { WalkScores } from "@/components/property/walk-scores";
import { NearbyPlaces } from "@/components/property/nearby-places";
import { PropertyFeatures } from "@/components/property/property-features";
import { getMockWalkScores, getMockNearbyPlaces } from "@/lib/mock-data";

interface PropertyData {
  source_id: string;
  slug: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  neighborhood: string | null;
  county: string | null;
  price: number;
  beds: number;
  baths: number;
  half_baths: number;
  sqft: number;
  lot_size: number | null;
  year_built: number | null;
  property_type: string;
  hoa_fee: number;
  days_on_market: number;
  description: string | null;
  status: string;
  mls_id: string | null;
  listing_url: string;
  photos: string[];
  assessed_value: number | null;
  estimated_value: number | null;
  new_construction: boolean;
  financials: {
    estimated_rent_monthly: number;
    cap_rate: number;
    cash_on_cash_return: number;
    monthly_cash_flow: number;
    monthly_mortgage_estimate: number;
    one_percent_rule: boolean;
    gross_rent_multiplier: number;
    price_per_sqft: number;
    annual_property_tax: number;
    annual_insurance_estimate: number;
    annual_maintenance_estimate: number;
    annual_management_estimate: number;
    annual_hoa: number;
    down_payment_percent: number;
    interest_rate: number;
  };
  verdict: InvestmentVerdict;
  e2_eligible: boolean;
}

const verdictConfig = {
  STRONG: { label: "Strong Investment", color: "text-success", bg: "bg-success/10 border-success/20" },
  MODERATE: { label: "Moderate Investment", color: "text-warning", bg: "bg-warning/10 border-warning/20" },
  CAUTIOUS: { label: "Proceed with Caution", color: "text-destructive", bg: "bg-destructive/10 border-destructive/20" },
};

function generatePros(p: PropertyData): string[] {
  const f = p.financials;
  const pros: string[] = [];
  if (f.cap_rate >= 7) pros.push(`Strong cap rate (${f.cap_rate}%) exceeding South Florida average`);
  if (f.one_percent_rule) pros.push(`Passes the 1% rule with $${f.estimated_rent_monthly.toLocaleString()}/month estimated rent`);
  if (f.cash_on_cash_return >= 5) pros.push(`Cash on cash return of ${f.cash_on_cash_return}% is strong`);
  if (p.e2_eligible) pros.push("E-2 visa eligible for Canadian/international investors");
  if (p.hoa_fee === 0) pros.push("No HOA fees — full control over the property");
  if (p.year_built && p.year_built >= 2000) pros.push(`Modern construction (${p.year_built}) — lower maintenance costs`);
  if (p.beds >= 3) pros.push(`${p.beds} bedrooms appeals to families — stronger rental demand`);
  if (p.price < 400000) pros.push("Lower entry price reduces investment risk");
  if (p.new_construction) pros.push("New construction — minimal maintenance for years");
  return pros.slice(0, 6);
}

function generateRisks(p: PropertyData): string[] {
  const f = p.financials;
  const risks: string[] = [];
  if (p.year_built && p.year_built < 1970) risks.push(`Built in ${p.year_built} — budget ~1% of value annually for maintenance`);
  risks.push("South Florida flood zone — mandatory flood insurance may be required");
  risks.push("Hurricane risk requires adequate insurance coverage");
  if (p.price > 500000) risks.push("Higher price point means larger down payment required");
  if (f.cap_rate < 6) risks.push(`Cap rate (${f.cap_rate}%) is below market average — limited margin`);
  if (!f.one_percent_rule) risks.push("Does not meet 1% rule — rent may not cover expenses comfortably");
  if (f.monthly_cash_flow < 0) risks.push("Negative monthly cash flow — property costs more than it earns");
  risks.push("Property taxes may increase as area appreciates");
  if (p.hoa_fee > 0) risks.push(`$${p.hoa_fee}/month HOA fees reduce net returns`);
  return risks.slice(0, 6);
}

function generateSummary(p: PropertyData): string {
  const f = p.financials;
  const typeLabel = p.property_type === "SINGLE_FAMILY" ? "single-family home" : "multifamily property";
  const onePct = f.one_percent_rule ? "passes" : "does not meet";
  const capVs = f.cap_rate >= 6.8 ? "above" : f.cap_rate >= 5.5 ? "near" : "below";
  return `This ${p.beds}-bedroom ${typeLabel} in ${p.city}, FL is listed at $${p.price.toLocaleString()} with an estimated monthly rent of $${f.estimated_rent_monthly.toLocaleString()}. It ${onePct} the 1% rule, and its ${f.cap_rate}% cap rate is ${capVs} the South Florida average of 6.8%. Monthly cash flow is estimated at $${f.monthly_cash_flow.toLocaleString()}.`;
}

function generateE2Notes(p: PropertyData): string {
  if (!p.e2_eligible) return "Property price is below typical E-2 visa investment threshold ($200K+). Consider combining with additional investment.";
  return `At $${p.price.toLocaleString()}, this property meets the E-2 visa investment threshold. Combined with active property management, this investment would support a strong E-2 application for Canadian investors. We recommend consulting with an immigration attorney to structure the investment properly.`;
}

export function PropertyDetailPage({ slug }: { slug: Promise<{ slug: string }> }) {
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slugValue, setSlugValue] = useState<string>("");

  useEffect(() => {
    slug.then((s) => {
      setSlugValue(s.slug);
      fetch(`/api/properties/${s.slug}`)
        .then((r) => {
          if (!r.ok) throw new Error("Property not found");
          return r.json();
        })
        .then((data) => {
          setProperty(data);
          setLoading(false);
        })
        .catch((e) => {
          setError(e.message);
          setLoading(false);
        });
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-serif font-bold text-foreground">Property Not Found</h2>
          <p className="mt-2 text-muted-foreground">{error || "This property is no longer available."}</p>
          <Link href="/search">
            <Button className="mt-4">Back to Search</Button>
          </Link>
        </div>
      </div>
    );
  }

  const p = property;
  const f = p.financials;
  const verdict = verdictConfig[p.verdict];
  const pros = generatePros(p);
  const risks = generateRisks(p);
  const summary = generateSummary(p);
  const e2Notes = generateE2Notes(p);
  const typeLabel = p.property_type === "SINGLE_FAMILY" ? "Single Family Home" : p.property_type === "MULTIFAMILY_2_4" ? "Multifamily (2-4 Units)" : "Multifamily (5+ Units)";

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
            {/* Image Gallery */}
            {p.photos && p.photos.length > 0 ? (
              <ImageGallery photos={p.photos} />
            ) : (
              <div className="aspect-[16/9] rounded-xl overflow-hidden bg-card border border-border flex items-center justify-center text-muted-foreground">
                <Building2 className="h-16 w-16" />
              </div>
            )}

            {/* Title + Verdict */}
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <Badge className={`${verdict.bg} border font-semibold`}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {verdict.label}
                </Badge>
                {f.one_percent_rule && (
                  <Badge className="bg-success/10 text-success border-success/20 border">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Passes 1% Rule
                  </Badge>
                )}
                {p.e2_eligible && (
                  <Badge className="bg-primary/10 text-primary border-primary/20 border">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    E-2 Eligible
                  </Badge>
                )}
                {p.new_construction && (
                  <Badge className="bg-primary/10 text-primary border-primary/20 border">
                    New Construction
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
              {p.listing_url && (
                <a href={p.listing_url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs text-primary hover:underline">
                  View on Realtor.com
                </a>
              )}
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5"><Bed className="h-4 w-4 text-primary" /> {p.beds} Beds</span>
              <span className="text-border">|</span>
              <span className="flex items-center gap-1.5"><Bath className="h-4 w-4 text-primary" /> {p.baths}{p.half_baths > 0 ? ` + ${p.half_baths} half` : ""} Baths</span>
              <span className="text-border">|</span>
              <span className="flex items-center gap-1.5"><Square className="h-4 w-4 text-primary" /> {p.sqft.toLocaleString()} sqft</span>
              <span className="text-border">|</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" /> {p.days_on_market} days on market</span>
              {p.year_built && (
                <>
                  <span className="text-border">|</span>
                  <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-primary" /> Built {p.year_built}</span>
                </>
              )}
            </div>

            <Separator />

            {/* Description */}
            {p.description && (
              <div>
                <h2 className="text-xl font-serif font-semibold text-foreground mb-3">
                  About This Property
                </h2>
                <p className="text-muted-foreground leading-relaxed">{p.description}</p>
              </div>
            )}

            <Separator />

            {/* Property Details Grid */}
            <div>
              <h2 className="text-xl font-serif font-semibold text-foreground mb-4">
                Property Details
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: "Property Type", value: typeLabel, icon: Building2 },
                  { label: "Year Built", value: p.year_built?.toString() || "N/A", icon: CalendarDays },
                  { label: "Lot Size", value: p.lot_size ? `${p.lot_size.toLocaleString()} sqft` : "N/A", icon: TreePine },
                  { label: "Price/sqft", value: `$${f.price_per_sqft}/sqft`, icon: DollarSign },
                  { label: "Annual Tax", value: formatPrice(f.annual_property_tax), icon: DollarSign },
                  { label: "Insurance Est.", value: `${formatPrice(f.annual_insurance_estimate)}/yr`, icon: ShieldCheck },
                  { label: "HOA Fee", value: p.hoa_fee > 0 ? `${formatPrice(p.hoa_fee)}/mo` : "None", icon: DollarSign },
                  { label: "Management Est.", value: `${formatPrice(f.annual_management_estimate)}/yr`, icon: DollarSign },
                  { label: "Maintenance Est.", value: `${formatPrice(f.annual_maintenance_estimate)}/yr`, icon: DollarSign },
                  { label: "Assessed Value", value: p.assessed_value ? formatPrice(p.assessed_value) : "N/A", icon: DollarSign },
                  { label: "Est. Market Value", value: p.estimated_value ? formatPrice(p.estimated_value) : "N/A", icon: TrendingUp },
                  { label: "MLS ID", value: p.mls_id || "N/A", icon: Building2 },
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
                  Investment Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">{summary}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Pros */}
                  <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                    <h4 className="text-sm font-semibold text-success flex items-center gap-1.5 mb-2">
                      <CheckCircle className="h-4 w-4" />
                      Investment Pros
                    </h4>
                    <ul className="space-y-1.5">
                      {pros.map((pro, i) => (
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
                      {risks.map((risk, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-destructive mt-0.5">!</span>
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="text-sm font-semibold text-primary flex items-center gap-1.5 mb-2">
                    <ShieldCheck className="h-4 w-4" />
                    E2 Visa Eligibility
                  </h4>
                  <p className="text-sm text-muted-foreground">{e2Notes}</p>
                </div>
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
                  <div className={`p-3 rounded-lg ${p.verdict === "STRONG" ? "bg-success/10 border-success/20" : p.verdict === "MODERATE" ? "bg-warning/10 border-warning/20" : "bg-destructive/10 border-destructive/20"} border text-center`}>
                    <p className={`text-2xl font-serif font-bold ${verdict.color}`}>{f.cap_rate}%</p>
                    <p className="text-xs text-muted-foreground">Cap Rate</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
                    <p className="text-2xl font-serif font-bold text-primary">{formatPrice(f.estimated_rent_monthly)}</p>
                    <p className="text-xs text-muted-foreground">Est. Rent/mo</p>
                  </div>
                  <div className="p-3 rounded-lg bg-card border border-border text-center">
                    <p className="text-2xl font-serif font-bold text-foreground">{f.cash_on_cash_return}%</p>
                    <p className="text-xs text-muted-foreground">Cash on Cash</p>
                  </div>
                  <div className="p-3 rounded-lg bg-card border border-border text-center">
                    <p className={`text-2xl font-serif font-bold ${f.monthly_cash_flow >= 0 ? "text-success" : "text-destructive"}`}>{formatPrice(f.monthly_cash_flow)}</p>
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
                    <span className="text-muted-foreground">Down Payment ({f.down_payment_percent}%)</span>
                    <span className="font-medium text-foreground">{formatPrice(p.price * (f.down_payment_percent / 100))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Est. Mortgage ({f.interest_rate}%)</span>
                    <span className="font-medium text-foreground">{formatPrice(f.monthly_mortgage_estimate)}/mo</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Annual Tax</span>
                    <span className="font-medium text-foreground">{formatPrice(f.annual_property_tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Annual Insurance</span>
                    <span className="font-medium text-foreground">{formatPrice(f.annual_insurance_estimate)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Maintenance (1%)</span>
                    <span className="font-medium text-foreground">{formatPrice(f.annual_maintenance_estimate)}</span>
                  </div>
                  {p.hoa_fee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Annual HOA</span>
                      <span className="font-medium text-foreground">{formatPrice(f.annual_hoa)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Gross Rent Multiplier</span>
                  <span className="font-medium text-foreground">{f.gross_rent_multiplier}x</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">1% Rule</span>
                  <span className={`font-medium ${f.one_percent_rule ? "text-success" : "text-destructive"}`}>
                    {f.one_percent_rule ? "PASS" : "FAIL"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price/sqft</span>
                  <span className="font-medium text-foreground">${f.price_per_sqft}/sqft</span>
                </div>
                {p.assessed_value && p.assessed_value > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Assessed Value</span>
                    <span className="font-medium text-foreground">{formatPrice(p.assessed_value)}</span>
                  </div>
                )}
                {p.estimated_value && p.estimated_value > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Est. Market Value</span>
                    <span className={`font-medium ${p.estimated_value > p.price ? "text-success" : p.estimated_value < p.price * 0.9 ? "text-destructive" : "text-foreground"}`}>
                      {formatPrice(p.estimated_value)}
                      {p.estimated_value > p.price && " (below market!)"}
                    </span>
                  </div>
                )}

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

            {/* Investor Contact Form - compact */}
            <InvestorContactForm compact />

            {/* Walk Scores */}
            <WalkScores scores={getMockWalkScores(p.slug)} />

            {/* Nearby Places */}
            <NearbyPlaces places={getMockNearbyPlaces(p.slug)} />
          </div>
        </div>

        {/* Property Features - full width */}
        <PropertyFeatures
          propertyDetails={{
            beds: p.beds,
            baths: p.baths,
            halfBaths: p.half_baths,
            sqft: p.sqft,
            lotSize: p.lot_size,
            yearBuilt: p.year_built,
            propertyType: typeLabel,
            garage: p.hoa_fee > 0 ? "Attached" : "N/A",
            stories: 1,
          }}
          utility={{
            cooling: "Central A/C",
            heating: "Central",
            sewer: "Public",
            water: "Public",
            parking: p.hoa_fee > 0 ? "2 Spaces" : "Driveway",
          }}
          outdoor={{
            pool: "Community",
            patio: "Yes",
            fence: "Yes",
            sprinkler: "Auto",
            lawn: "Maintained",
          }}
          investment={{
            capRate: f.cap_rate,
            estimatedRent: f.estimated_rent_monthly,
            cashOnCashReturn: f.cash_on_cash_return,
            monthlyCashFlow: f.monthly_cash_flow,
            onePercentRule: f.one_percent_rule,
            grm: f.gross_rent_multiplier,
            e2Eligible: p.e2_eligible,
            verdict: p.verdict,
          }}
        />
      </div>
    </div>
  );
}
