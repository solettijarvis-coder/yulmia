import type { Metadata } from "next";
import { CalculatorsPage } from "@/components/calculators/calculators-page";

export const metadata: Metadata = {
  title: "Investment Calculators — YULMIA",
  description: "Free mortgage, cash flow, cap rate, and E-2 visa calculators for South Florida real estate investors. Evaluate investment properties before you buy.",
  keywords: "real estate investment calculator,mortgage calculator,cash flow calculator,cap rate calculator,E2 visa calculator,South Florida investment",
};

export default function CalculatorsRoutePage() {
  return <CalculatorsPage />;
}
