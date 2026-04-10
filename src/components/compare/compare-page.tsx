"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  ArrowLeftRight,
  X,
  GitCompareArrows,
  TrendingUp,
  DollarSign,
  Home,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  formatPrice,
  formatPercent,
  formatNumber,
  propertyTypeLabels,
} from "@/lib/utils";
import type { PropertyType, InvestmentVerdict } from "@/types/property";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CompareProperty {
  id: string;
  slug: string;
  address: string;
  city: string;
  zip: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  propertyType: PropertyType;
  photo: string | null;
  capRate: number;
  cashFlow: number;
  cocReturn: number;
  rent: number;
  verdict: InvestmentVerdict;
  e2Eligible: boolean;
  daysOnMarket: number;
  yearBuilt: number | null;
  hoaFee: number;
}

interface ComputedFinancials {
  downPayment: number;
  monthlyMortgage: number;
  annualTax: number;
  annualInsurance: number;
  annualMaintenance: number;
  annualManagement: number;
  hoaFeeMonthly: number;
  annualHoa: number;
  grossRentMultiplier: number;
  onePercentRule: boolean;
  pricePerSqft: number;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const DOWN_PCT = 0.2;
const INTEREST_RATE = 0.07;
const TAX_RATE = 0.012;
const INSURANCE_RATE = 0.005;
const MAINT_RATE = 0.01;
const MGMT_RATE = 0.08;

function computeFinancials(p: CompareProperty): ComputedFinancials {
  const downPayment = p.price * DOWN_PCT;
  const loanAmt = p.price - downPayment;
  const monthlyRate = INTEREST_RATE / 12;
  const n = 30 * 12;
  const monthlyMortgage =
    loanAmt > 0
      ? (loanAmt * (monthlyRate * Math.pow(1 + monthlyRate, n))) /
        (Math.pow(1 + monthlyRate, n) - 1)
      : 0;
  const annualTax = p.price * TAX_RATE;
  const annualInsurance = p.price * INSURANCE_RATE;
  const annualMaintenance = p.price * MAINT_RATE;
  const annualManagement = p.rent * 12 * MGMT_RATE;
  const hoaFeeMonthly = p.hoaFee ?? 0;
  const annualHoa = hoaFeeMonthly * 12;
  const grossRentMultiplier =
    p.rent * 12 > 0 ? p.price / (p.rent * 12) : 0;
  const onePercentRule = p.rent >= p.price * 0.01;
  const pricePerSqft = p.sqft > 0 ? p.price / p.sqft : 0;

  return {
    downPayment,
    monthlyMortgage,
    annualTax,
    annualInsurance,
    annualMaintenance,
    annualManagement,
    hoaFeeMonthly,
    annualHoa,
    grossRentMultiplier,
    onePercentRule,
    pricePerSqft,
  };
}

function fmt$(n: number): string {
  return formatPrice(n);
}

function fmtPct(n: number, d = 1): string {
  return formatPercent(n, d);
}

function fmtNum(n: number): string {
  return formatNumber(n);
}

const verdictConfig: Record<
  InvestmentVerdict,
  { label: string; cls: string }
> = {
  STRONG: { label: "Strong", cls: "bg-success/10 text-success border-success/20" },
  MODERATE: { label: "Moderate", cls: "bg-warning/10 text-warning border-warning/20" },
  CAUTIOUS: { label: "Cautious", cls: "bg-destructive/10 text-destructive border-destructive/20" },
};

/* ------------------------------------------------------------------ */
/*  Comparison rows                                                    */
/* ------------------------------------------------------------------ */

type CellValue = string | number | boolean;
type BestDir = "high" | "low" | "bool" | "none";

interface RowDef {
  label: string;
  key: string;
  dir: BestDir; // which extreme is "best"
  format: (v: CellValue) => string;
}

const OVERVIEW_ROWS: RowDef[] = [
  { label: "Address", key: "address", dir: "none", format: (v) => String(v) },
  { label: "City", key: "city", dir: "none", format: (v) => String(v) },
  { label: "Price", key: "price", dir: "low", format: (v) => fmt$(v as number) },
  { label: "Beds", key: "beds", dir: "none", format: (v) => String(v) },
  { label: "Baths", key: "baths", dir: "none", format: (v) => String(v) },
  { label: "Sqft", key: "sqft", dir: "none", format: (v) => fmtNum(v as number) },
  { label: "Year Built", key: "yearBuilt", dir: "high", format: (v) => (v ? String(v) : "N/A") },
  { label: "Type", key: "propertyType", dir: "none", format: (v) => propertyTypeLabels[v as PropertyType] ?? String(v) },
  { label: "Days on Market", key: "daysOnMarket", dir: "low", format: (v) => `${v} days` },
];

const INVESTMENT_ROWS: RowDef[] = [
  { label: "Cap Rate", key: "capRate", dir: "high", format: (v) => fmtPct(v as number) },
  { label: "Est. Rent/mo", key: "rent", dir: "high", format: (v) => fmt$(v as number) },
  { label: "Cash on Cash Return", key: "cocReturn", dir: "high", format: (v) => fmtPct(v as number) },
  { label: "Monthly Cash Flow", key: "cashFlow", dir: "high", format: (v) => fmt$(v as number) },
  { label: "Gross Rent Multiplier", key: "grossRentMultiplier", dir: "low", format: (v) => (v as number).toFixed(2) },
  { label: "1% Rule", key: "onePercentRule", dir: "bool", format: (v) => (v ? "Pass" : "Fail") },
  { label: "Price/sqft", key: "pricePerSqft", dir: "low", format: (v) => fmt$(Math.round(v as number)) },
];

const FINANCIAL_ROWS: RowDef[] = [
  { label: "Down Payment (20%)", key: "downPayment", dir: "low", format: (v) => fmt$(v as number) },
  { label: "Monthly Mortgage", key: "monthlyMortgage", dir: "low", format: (v) => fmt$(Math.round(v as number)) },
  { label: "Annual Tax", key: "annualTax", dir: "low", format: (v) => fmt$(Math.round(v as number)) },
  { label: "Annual Insurance", key: "annualInsurance", dir: "low", format: (v) => fmt$(Math.round(v as number)) },
  { label: "Annual Maintenance", key: "annualMaintenance", dir: "low", format: (v) => fmt$(Math.round(v as number)) },
  { label: "Annual Management", key: "annualManagement", dir: "low", format: (v) => fmt$(Math.round(v as number)) },
  { label: "HOA Fee", key: "hoaFeeMonthly", dir: "low", format: (v) => (v ? fmt$(Math.round(v as number)) + "/mo" : "$0") },
  { label: "Annual HOA", key: "annualHoa", dir: "low", format: (v) => (v ? fmt$(Math.round(v as number)) : "$0") },
];

const VALUE_ROWS: RowDef[] = [
  { label: "Verdict", key: "verdict", dir: "none", format: (v) => verdictConfig[v as InvestmentVerdict]?.label ?? String(v) },
  { label: "E2 Eligible", key: "e2Eligible", dir: "bool", format: (v) => (v ? "Yes" : "No") },
  { label: "Assessed Value", key: "assessedValue", dir: "none", format: (v) => (v ? fmt$(v as number) : "N/A") },
  { label: "Estimated Value", key: "estimatedValue", dir: "none", format: (v) => (v ? fmt$(v as number) : "N/A") },
  { label: "New Construction", key: "newConstruction", dir: "none", format: (v) => (v ? "Yes" : "No") },
];

interface SectionDef {
  title: string;
  icon: React.ReactNode;
  rows: RowDef[];
}

const SECTIONS: SectionDef[] = [
  { title: "Property Overview", icon: <Home className="size-4" />, rows: OVERVIEW_ROWS },
  { title: "Investment Metrics", icon: <TrendingUp className="size-4" />, rows: INVESTMENT_ROWS },
  { title: "Financial Details", icon: <DollarSign className="size-4" />, rows: FINANCIAL_ROWS },
  { title: "Value Indicators", icon: <ShieldCheck className="size-4" />, rows: VALUE_ROWS },
];

/* ------------------------------------------------------------------ */
/*  Extract value from property for a given row key                    */
/* ------------------------------------------------------------------ */

function getCellValue(p: CompareProperty, fin: ComputedFinancials, key: string): CellValue {
  // Check computed financials first
  if (key in fin) {
    return fin[key as keyof ComputedFinancials] as CellValue;
  }
  // Check base property
  if (key in p) {
    return p[key as keyof CompareProperty] as CellValue;
  }
  // Fields not in the search.json data
  if (key === "assessedValue") return 0;
  if (key === "estimatedValue") return 0;
  if (key === "newConstruction") return false;
  return "N/A";
}

/* ------------------------------------------------------------------ */
/*  Determine which column has the "best" value                        */
/* ------------------------------------------------------------------ */

function getBestIndex(
  values: CellValue[],
  dir: BestDir
): number | null {
  if (dir === "none") return null;
  const nums = values.map((v) => {
    if (typeof v === "boolean") return v ? 1 : 0;
    if (typeof v === "number") return v;
    return -Infinity;
  });

  if (dir === "high") {
    const max = Math.max(...nums);
    if (max === -Infinity) return null;
    return nums.indexOf(max);
  }
  if (dir === "low") {
    // Filter out zeros for some fields (like HOA=0, which just means no HOA)
    const valid = nums.filter((n) => n > -Infinity);
    if (valid.length === 0) return null;
    const min = Math.min(...nums);
    return nums.indexOf(min);
  }
  if (dir === "bool") {
    const trueIdx = nums.indexOf(1);
    // Only highlight if at least one passes and not all pass
    const trueCount = nums.filter((n) => n === 1).length;
    if (trueCount > 0 && trueCount < nums.length) return trueIdx;
    return null;
  }
  return null;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const NUM_SLOTS = 3;

export function ComparePage() {
  const [allProperties, setAllProperties] = useState<CompareProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<(string | null)[]>(
    Array(NUM_SLOTS).fill(null)
  );

  // Load data
  useEffect(() => {
    fetch("/data/search.json")
      .then((r) => r.json())
      .then((data: CompareProperty[]) => {
        setAllProperties(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Compute financials for selected properties
  const selectedProperties = useMemo(() => {
    return selectedIds.map((id) =>
      id ? allProperties.find((p) => p.id === id) ?? null : null
    );
  }, [selectedIds, allProperties]);

  const selectedFinancials = useMemo(() => {
    return selectedProperties.map((p) =>
      p ? computeFinancials(p) : null
    );
  }, [selectedProperties]);

  const hasSelection = selectedProperties.some((p) => p !== null);

  // Handlers
  function setSlot(index: number, id: string | null) {
    setSelectedIds((prev) => {
      const next = [...prev];
      next[index] = id;
      return next;
    });
  }

  function clearAll() {
    setSelectedIds(Array(NUM_SLOTS).fill(null));
  }

  function swapSlots(a: number, b: number) {
    setSelectedIds((prev) => {
      const next = [...prev];
      [next[a], next[b]] = [next[b], next[a]];
      return next;
    });
  }

  // Available options for a slot (exclude properties already selected in other slots)
  function availableForSlot(slotIndex: number): CompareProperty[] {
    const usedIds = selectedIds.filter((_, i) => i !== slotIndex && _ !== null);
    return allProperties.filter((p) => !usedIds.includes(p.id));
  }

  /* -------------------------------------------------------------- */
  /*  Render                                                         */
  /* -------------------------------------------------------------- */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <GitCompareArrows className="size-8 animate-pulse text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Loading properties...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
          Compare Properties
        </h1>
        <p className="mt-2 text-muted-foreground">
          Select up to 3 properties to compare investment metrics side by side.
        </p>
      </div>

      {/* Slot Selectors */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {selectedIds.map((selectedId, i) => (
          <Card key={i} className="relative">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Property {i + 1}
                </CardTitle>
                {selectedId && (
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setSlot(i, null)}
                  >
                    <X className="size-3" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedId ?? ""}
                onValueChange={(val: string | null) => setSlot(i, val || null)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a property..." />
                </SelectTrigger>
                <SelectContent>
                  {availableForSlot(i).map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      <span className="truncate">
                        {p.address}, {p.city} — {fmt$(p.price)}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Swap buttons */}
              {selectedId && i < NUM_SLOTS - 1 && selectedIds[i + 1] && (
                <div className="mt-2 flex justify-center">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => swapSlots(i, i + 1)}
                    className="gap-1 text-xs text-muted-foreground"
                  >
                    <ArrowLeftRight className="size-3" />
                    Swap with Property {i + 2}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      {hasSelection && (
        <div className="mb-6 flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={clearAll}>
            <X className="mr-1.5 size-3.5" />
            Clear All
          </Button>
          <span className="text-xs text-muted-foreground">
            {selectedProperties.filter(Boolean).length} of {NUM_SLOTS}{" "}
            slots filled
          </span>
        </div>
      )}

      {/* Empty state */}
      {!hasSelection && (
        <Card className="flex min-h-[40vh] items-center justify-center">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <GitCompareArrows className="size-8 text-primary" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-foreground">
                No Properties Selected
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Use the dropdowns above to select 2-3 properties for comparison.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison Table */}
      {hasSelection && (
        <div className="overflow-x-auto rounded-xl border border-border/50">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            {/* Column Headers */}
            <thead>
              <tr className="border-b border-border/50 bg-card">
                <th className="sticky left-0 z-10 w-48 min-w-48 border-r border-border/30 bg-card px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Metric
                </th>
                {selectedProperties.map((p, i) =>
                  p ? (
                    <th
                      key={p.id}
                      className="min-w-[200px] px-4 py-3 text-center"
                    >
                      <div className="flex flex-col items-center gap-2">
                        {p.photo && (
                          <div className="relative h-20 w-28 overflow-hidden rounded-md">
                            <Image
                              src={p.photo}
                              alt={p.address}
                              fill
                              className="object-cover"
                              sizes="112px"
                            />
                          </div>
                        )}
                        <span className="text-xs font-medium text-foreground">
                          {p.address}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {p.city}
                        </span>
                      </div>
                    </th>
                  ) : (
                    <th
                      key={`empty-${i}`}
                      className="min-w-[200px] px-4 py-3 text-center text-xs text-muted-foreground/50"
                    >
                      Not selected
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {SECTIONS.map((section, si) => (
                <SectionRows
                  key={section.title}
                  section={section}
                  selectedProperties={selectedProperties}
                  selectedFinancials={selectedFinancials}
                  isLast={si === SECTIONS.length - 1}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section rows sub-component                                         */
/* ------------------------------------------------------------------ */

function SectionRows({
  section,
  selectedProperties,
  selectedFinancials,
  isLast,
}: {
  section: SectionDef;
  selectedProperties: (CompareProperty | null)[];
  selectedFinancials: (ComputedFinancials | null)[];
  isLast: boolean;
}) {
  return (
    <>
      {/* Section header */}
      <tr className="border-b border-border/30 bg-muted/30">
        <td
          colSpan={1 + NUM_SLOTS}
          className={`px-4 py-2 ${isLast ? "" : ""}`}
        >
          <div className="flex items-center gap-2">
            <span className="text-primary">{section.icon}</span>
            <span className="font-serif text-sm font-semibold text-foreground">
              {section.title}
            </span>
          </div>
        </td>
      </tr>

      {/* Data rows */}
      {section.rows.map((row) => {
        const cellValues = selectedProperties.map((p, i) =>
          p && selectedFinancials[i]
            ? getCellValue(p, selectedFinancials[i]!, row.key)
            : null
        );

        const displayValues = cellValues.map((v) =>
          v !== null ? row.format(v) : "—"
        );

        const bestIdx = getBestIndex(
          cellValues.filter((v) => v !== null) as CellValue[],
          row.dir
        );

        // Map back to the real index (accounting for nulls)
        let bestRealIdx: number | null = null;
        if (bestIdx !== null) {
          let count = -1;
          for (let i = 0; i < cellValues.length; i++) {
            if (cellValues[i] !== null) {
              count++;
              if (count === bestIdx) {
                bestRealIdx = i;
                break;
              }
            }
          }
        }

        return (
          <tr
            key={row.key}
            className="border-b border-border/20 transition-colors hover:bg-muted/10"
          >
            <td className="sticky left-0 z-10 border-r border-border/30 bg-card px-4 py-2.5 text-xs font-medium text-muted-foreground">
              {row.label}
            </td>
            {selectedProperties.map((p, i) => {
              const isBest = bestRealIdx === i;
              const val = displayValues[i];
              const rawVal = cellValues[i];

              // Special styling for verdict
              if (row.key === "verdict" && rawVal) {
                const vc = verdictConfig[rawVal as InvestmentVerdict];
                return (
                  <td
                    key={i}
                    className="px-4 py-2.5 text-center"
                  >
                    <Badge
                      variant="outline"
                      className={vc?.cls}
                    >
                      {val}
                    </Badge>
                  </td>
                );
              }

              // Special styling for boolean pass/fail
              if (row.key === "onePercentRule" || row.key === "e2Eligible") {
                const isPass = rawVal === true;
                return (
                  <td
                    key={i}
                    className="px-4 py-2.5 text-center"
                  >
                    {rawVal !== null ? (
                      <Badge
                        variant="outline"
                        className={
                          isPass
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        }
                      >
                        {val}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground/50">—</span>
                    )}
                  </td>
                );
              }

              return (
                <td
                  key={i}
                  className={`px-4 py-2.5 text-center ${
                    isBest
                      ? "font-semibold text-success"
                      : "text-foreground"
                  }`}
                >
                  {val}
                </td>
              );
            })}
          </tr>
        );
      })}

      {/* Separator between sections */}
      {!isLast && (
        <tr>
          <td colSpan={1 + NUM_SLOTS} className="p-0">
            <Separator />
          </td>
        </tr>
      )}
    </>
  );
}
