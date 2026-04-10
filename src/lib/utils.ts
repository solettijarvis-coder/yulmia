import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { PropertyType, InvestmentVerdict } from "@/types/property";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Property type labels for display
export const propertyTypeLabels: Record<PropertyType, string> = {
  SINGLE_FAMILY: "Single Family Home",
  MULTIFAMILY_2_4: "2-4 Unit Multifamily",
  MULTIFAMILY_5PLUS: "5+ Unit Multifamily",
  DISTRESSED: "Distressed Property",
  LAND: "Investment Land",
  COMMERCIAL: "Commercial Property",
};

export const propertyTypeShortLabels: Record<PropertyType, string> = {
  SINGLE_FAMILY: "House",
  MULTIFAMILY_2_4: "2-4 Unit",
  MULTIFAMILY_5PLUS: "5+ Unit",
  DISTRESSED: "Distressed",
  LAND: "Land",
  COMMERCIAL: "Commercial",
};

export const verdictColors: Record<InvestmentVerdict, string> = {
  STRONG: "text-success",
  MODERATE: "text-warning",
  CAUTIOUS: "text-destructive",
};

export const verdictBgColors: Record<InvestmentVerdict, string> = {
  STRONG: "bg-success/10 border-success/20 text-success",
  MODERATE: "bg-warning/10 border-warning/20 text-warning",
  CAUTIOUS: "bg-destructive/10 border-destructive/20 text-destructive",
};

export const verdictLabels: Record<InvestmentVerdict, string> = {
  STRONG: "Strong Investment",
  MODERATE: "Moderate Investment",
  CAUTIOUS: "Proceed with Caution",
};

// South Florida cities we serve
export const serviceAreas = [
  { slug: "miami", name: "Miami", county: "Miami-Dade" },
  { slug: "brickell", name: "Brickell", county: "Miami-Dade" },
  { slug: "wynwood", name: "Wynwood", county: "Miami-Dade" },
  { slug: "little-havana", name: "Little Havana", county: "Miami-Dade" },
  { slug: "coconut-grove", name: "Coconut Grove", county: "Miami-Dade" },
  { slug: "edgewater", name: "Edgewater", county: "Miami-Dade" },
  { slug: "design-district", name: "Design District", county: "Miami-Dade" },
  { slug: "fort-lauderdale", name: "Fort Lauderdale", county: "Broward" },
  { slug: "hollywood-fl", name: "Hollywood", county: "Broward" },
  { slug: "pompano-beach", name: "Pompano Beach", county: "Broward" },
  { slug: "davie", name: "Davie", county: "Broward" },
  { slug: "west-palm-beach", name: "West Palm Beach", county: "Palm Beach" },
  { slug: "boca-raton", name: "Boca Raton", county: "Palm Beach" },
  { slug: "delray-beach", name: "Delray Beach", county: "Palm Beach" },
  { slug: "boynton-beach", name: "Boynton Beach", county: "Palm Beach" },
] as const;

// Format helpers
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

export function formatPercent(num: number | null, decimals = 1): string {
  if (num === null) return "N/A";
  return `${num.toFixed(decimals)}%`;
}

export function calculateCapRate(
  annualRent: number,
  price: number,
  annualExpenses: number = 0
): number {
  const noi = annualRent - annualExpenses;
  return (noi / price) * 100;
}

export function calculateCashOnCash(
  annualRent: number,
  price: number,
  downPaymentPercent: number = 20,
  annualExpenses: number = 0,
  annualDebtService: number = 0
): number {
  const downPayment = price * (downPaymentPercent / 100);
  const annualCashFlow = annualRent - annualExpenses - annualDebtService;
  return (annualCashFlow / downPayment) * 100;
}

export function checkOnePercentRule(
  monthlyRent: number,
  price: number
): boolean {
  return monthlyRent >= price * 0.01;
}