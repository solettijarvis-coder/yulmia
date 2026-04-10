"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MortgageCalculator } from "@/components/calculators/mortgage-calculator";
import { CashFlowCalculator } from "@/components/calculators/cash-flow-calculator";
import { CapRateCalculator } from "@/components/calculators/cap-rate-calculator";
import { E2VisaCalculator } from "@/components/calculators/e2-visa-calculator";
import { Calculator } from "lucide-react";

interface CalculatorsPageProps {
  homePrice?: number;
  purchasePrice?: number;
  monthlyRent?: number;
  annualPropertyTax?: number;
  annualInsurance?: number;
  monthlyHOA?: number;
}

export function CalculatorsPage({
  homePrice = 500000,
  purchasePrice,
  monthlyRent,
  annualPropertyTax,
  annualInsurance,
  monthlyHOA,
}: CalculatorsPageProps) {
  const effectivePurchasePrice = purchasePrice ?? homePrice;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calculator className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            Investment Calculators
          </h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Essential tools for evaluating South Florida investment properties.
          </p>
        </div>

        {/* Tabbed Calculators */}
        <Tabs defaultValue="mortgage">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="mortgage">Mortgage</TabsTrigger>
            <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
            <TabsTrigger value="caprate">Cap Rate</TabsTrigger>
            <TabsTrigger value="e2visa">E-2 Visa</TabsTrigger>
          </TabsList>

          <TabsContent value="mortgage">
            <MortgageCalculator homePrice={homePrice} />
          </TabsContent>

          <TabsContent value="cashflow">
            <CashFlowCalculator
              purchasePrice={effectivePurchasePrice}
              monthlyRent={monthlyRent}
              annualPropertyTax={annualPropertyTax}
              annualInsurance={annualInsurance}
              monthlyHOA={monthlyHOA}
            />
          </TabsContent>

          <TabsContent value="caprate">
            <CapRateCalculator
              purchasePrice={effectivePurchasePrice}
            />
          </TabsContent>

          <TabsContent value="e2visa">
            <E2VisaCalculator investmentAmount={effectivePurchasePrice} />
          </TabsContent>
        </Tabs>

        {/* Disclaimer */}
        <p className="mt-8 text-center text-[10px] text-muted-foreground leading-relaxed max-w-lg mx-auto">
          These calculators provide estimates for educational purposes only and should not be
          considered financial advice. Interest rates, taxes, insurance, and market conditions vary.
          Consult with a licensed financial advisor and immigration attorney before making
          investment decisions.
        </p>
      </div>
    </div>
  );
}
