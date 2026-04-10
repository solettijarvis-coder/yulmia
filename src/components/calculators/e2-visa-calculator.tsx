"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShieldCheck,
  CheckCircle,
  Circle,
  Clock,
  Globe,
  AlertTriangle,
  FileText,
  UserCheck,
  Briefcase,
} from "lucide-react";

interface E2VisaCalculatorProps {
  investmentAmount?: number;
}

type InvestmentType = "rental_property" | "business" | "mixed";
type Nationality = "canadian" | "british" | "german" | "french" | "japanese" | "korean" | "other";

const nationalityLabels: Record<Nationality, string> = {
  canadian: "Canadian",
  british: "British",
  german: "German",
  french: "French",
  japanese: "Japanese",
  korean: "South Korean",
  other: "Other Treaty Country",
};

const E2_THRESHOLD = 150000;
const E2_STRONG_THRESHOLD = 200000;

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

const nextStepsChecklist = [
  {
    step: "Engage an E-2 visa immigration attorney",
    description: "Professional legal guidance is essential for structuring your investment.",
  },
  {
    step: "Form a US business entity (LLC or Corporation)",
    description: "Establish a Florida-based entity for your investment property.",
  },
  {
    step: "Open a US bank account",
    description: "Required for business operations and fund transfers.",
  },
  {
    step: "Document the investment source of funds",
    description: "Trace and document where investment capital originates.",
  },
  {
    step: "Prepare a comprehensive business plan",
    description: "Detail how the investment will generate income and create jobs.",
  },
  {
    step: "File the E-2 visa application (DS-160)",
    description: "Submit the application through the US embassy or consulate.",
  },
];

export function E2VisaCalculator({ investmentAmount = 500000 }: E2VisaCalculatorProps) {
  const [amount, setAmount] = useState(investmentAmount);
  const [nationality, setNationality] = useState<Nationality>("canadian");
  const [investmentType, setInvestmentType] = useState<InvestmentType>("rental_property");
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());

  const meetsThreshold = amount >= E2_THRESHOLD;
  const meetsStrongThreshold = amount >= E2_STRONG_THRESHOLD;
  const progressPct = Math.min((amount / E2_STRONG_THRESHOLD) * 100, 100);
  const thresholdPct = (E2_THRESHOLD / E2_STRONG_THRESHOLD) * 100;

  const processingTime = meetsStrongThreshold
    ? "3-4 months"
    : meetsThreshold
      ? "4-6 months"
      : "N/A — Below threshold";

  const investmentTypeLabels: Record<InvestmentType, string> = {
    rental_property: "Rental Property",
    business: "Business",
    mixed: "Mixed (Property + Business)",
  };

  const toggleStep = (index: number) => {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          E-2 Visa Investment Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Investment Amount */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5 text-primary" />
            Investment Amount
          </label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value) || 0)}
          />
          <p className="text-xs text-muted-foreground">{formatCurrency(amount)}</p>
        </div>

        {/* Nationality */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-primary" />
            Nationality
          </label>
          <Select
            value={nationality}
            onValueChange={(val) => val && setNationality(val as Nationality)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(nationalityLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Investment Type */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Investment Type</label>
          <Select
            value={investmentType}
            onValueChange={(val) => val && setInvestmentType(val as InvestmentType)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(investmentTypeLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* E-2 Threshold Progress */}
        <div className="space-y-3">
          <h3 className="font-serif font-bold text-foreground">E-2 Threshold Status</h3>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="relative h-6 rounded-full bg-muted overflow-hidden">
              {/* Threshold marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-muted-foreground/50 z-10"
                style={{ left: `${thresholdPct}%` }}
              />
              {/* Progress fill */}
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  meetsStrongThreshold
                    ? "bg-success"
                    : meetsThreshold
                      ? "bg-primary"
                      : "bg-destructive/60"
                }`}
                style={{ width: `${progressPct}%` }}
              />
              {/* Labels on bar */}
              <div className="absolute inset-0 flex items-center justify-between px-3 text-[10px] font-medium">
                <span className={meetsThreshold ? "text-background" : "text-foreground"}>
                  {formatCurrency(amount)}
                </span>
                <span className="text-muted-foreground">
                  Goal: {formatCurrency(E2_STRONG_THRESHOLD)}
                </span>
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>{formatCurrency(0)}</span>
              <span className="text-primary font-medium">
                Min: {formatCurrency(E2_THRESHOLD)}
              </span>
              <span>{formatCurrency(E2_STRONG_THRESHOLD)}+</span>
            </div>
          </div>

          {/* Status badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant={meetsThreshold ? "default" : "destructive"}
              className="text-xs"
            >
              {meetsThreshold ? (
                <CheckCircle className="h-3 w-3 mr-1" />
              ) : (
                <AlertTriangle className="h-3 w-3 mr-1" />
              )}
              {meetsThreshold
                ? "Meets $150K+ Threshold"
                : "Below $150K Threshold"}
            </Badge>
            {meetsStrongThreshold && (
              <Badge variant="default" className="text-xs bg-success border-success">
                <CheckCircle className="h-3 w-3 mr-1" />
                Strong Application Position
              </Badge>
            )}
          </div>
        </div>

        {/* Processing Time */}
        <div className="p-3 rounded-lg bg-card border border-border">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" />
              Estimated Processing Time
            </span>
            <span className="font-medium text-foreground">{processingTime}</span>
          </div>
        </div>

        <Separator />

        {/* E-2 Requirements Text */}
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
          <h4 className="text-sm font-semibold text-primary flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            E-2 Visa Requirements
          </h4>
          <ul className="space-y-1 text-xs text-muted-foreground leading-relaxed">
            <li>
              <span className="text-primary font-medium">Treaty Country:</span> Investor must be a
              national of an E-2 treaty country (Canada, UK, Germany, France, Japan, Korea, and 70+
              others).
            </li>
            <li>
              <span className="text-primary font-medium">Substantial Investment:</span> Minimum
              $150,000+ investment capital; $200,000+ strengthens the application significantly.
            </li>
            <li>
              <span className="text-primary font-medium">Active Investment:</span> Funds must be
              actively invested in a bona fide enterprise, not passive (e.g., real estate must be
              actively managed).
            </li>
            <li>
              <span className="text-primary font-medium">At-Risk:</span> Investment capital must be
              committed and at risk in the commercial enterprise.
            </li>
            <li>
              <span className="text-primary font-medium">Not Marginal:</span> The enterprise must
              have the capacity to generate more than enough income to provide a minimal living for
              the investor and family, or make a significant economic contribution.
            </li>
            <li>
              <span className="text-primary font-medium">Intent to Depart:</span> Investor must
              demonstrate intent to depart the US when the E-2 status ends.
            </li>
          </ul>
        </div>

        <Separator />

        {/* Next Steps Checklist */}
        <div className="space-y-3">
          <h3 className="font-serif font-bold text-foreground flex items-center gap-1.5">
            <UserCheck className="h-4 w-4 text-primary" />
            Next Steps Checklist
          </h3>
          <p className="text-xs text-muted-foreground">
            {checkedSteps.size} of {nextStepsChecklist.length} completed
          </p>
          <div className="space-y-2">
            {nextStepsChecklist.map((item, index) => {
              const isChecked = checkedSteps.has(index);
              return (
                <button
                  key={index}
                  onClick={() => toggleStep(index)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    isChecked
                      ? "bg-success/5 border-success/20"
                      : "bg-card border-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {isChecked ? (
                      <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isChecked ? "text-success" : "text-foreground"
                        }`}
                      >
                        {item.step}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
