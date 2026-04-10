"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

interface PropertyDetailsGroup {
  beds: number;
  baths: number;
  halfBaths: number;
  sqft: number;
  lotSize: number | null;
  yearBuilt: number | null;
  propertyType: string;
  newConstruction?: boolean;
  hoaFee?: number;
}

interface InvestmentGroup {
  capRate: number;
  estimatedRent: number;
  cashOnCashReturn: number;
  monthlyCashFlow: number;
  onePercentRule: boolean;
  grm: number;
  e2Eligible: boolean;
  verdict: string;
}

interface PropertyFeaturesProps {
  propertyDetails: PropertyDetailsGroup;
  investment: InvestmentGroup;
}

function FeatureGroup({
  title,
  items,
}: {
  title: string;
  items: { label: string; value: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-serif font-semibold text-primary mb-3">{title}</h3>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex justify-between py-1.5 border-b border-border/50">
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <span className="text-sm font-medium text-foreground text-right">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PropertyFeatures({
  propertyDetails,
  investment,
}: PropertyFeaturesProps) {
  const pd = propertyDetails;
  const detailItems = [
    { label: "Beds", value: String(pd.beds) },
    { label: "Baths", value: pd.halfBaths > 0 ? `${pd.baths} + ${pd.halfBaths} half` : String(pd.baths) },
    { label: "Sqft", value: pd.sqft.toLocaleString() },
    { label: "Lot Size", value: pd.lotSize ? `${pd.lotSize.toLocaleString()} sqft` : "N/A" },
    { label: "Year Built", value: pd.yearBuilt ? String(pd.yearBuilt) : "N/A" },
    { label: "Type", value: pd.propertyType },
    { label: "New Construction", value: pd.newConstruction ? "Yes" : "No" },
    { label: "HOA Fee", value: pd.hoaFee && pd.hoaFee > 0 ? `$${pd.hoaFee}/mo` : "None" },
  ];

  const verdictLabel =
    investment.verdict === "STRONG"
      ? "Strong Investment"
      : investment.verdict === "MODERATE"
        ? "Moderate Investment"
        : "Proceed with Caution";

  const investmentItems = [
    { label: "Cap Rate", value: `${investment.capRate}%` },
    { label: "Est. Rent", value: formatPrice(investment.estimatedRent) + "/mo" },
    { label: "Cash on Cash", value: `${investment.cashOnCashReturn}%` },
    { label: "Cash Flow", value: formatPrice(investment.monthlyCashFlow) + "/mo" },
    { label: "1% Rule", value: investment.onePercentRule ? "PASS" : "FAIL" },
    { label: "GRM", value: `${investment.grm}x` },
    { label: "E-2 Eligible", value: investment.e2Eligible ? "Yes" : "No" },
    { label: "Verdict", value: verdictLabel },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-serif">Property Features</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <FeatureGroup title="Property Details" items={detailItems} />
          <FeatureGroup title="Investment Details" items={investmentItems} />
        </div>
      </CardContent>
    </Card>
  );
}
