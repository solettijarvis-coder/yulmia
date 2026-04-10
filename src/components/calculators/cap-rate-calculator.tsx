"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { TrendingUp, DollarSign, BarChart3, Percent } from "lucide-react";

interface CapRateCalculatorProps {
  purchasePrice?: number;
  annualGrossRent?: number;
  annualOperatingExpenses?: number;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function CapRateCalculator({
  purchasePrice = 500000,
  annualGrossRent: initialRent = 36000,
  annualOperatingExpenses: initialExpenses = 12000,
}: CapRateCalculatorProps) {
  const [price, setPrice] = useState(purchasePrice);
  const [grossRent, setGrossRent] = useState(initialRent);
  const [opExpenses, setOpExpenses] = useState(initialExpenses);

  const noi = grossRent - opExpenses;
  const capRate = price > 0 ? (noi / price) * 100 : 0;
  const grm = grossRent > 0 ? price / grossRent : 0;

  const capRateColor =
    capRate >= 7
      ? "text-success"
      : capRate >= 5
        ? "text-warning"
        : "text-destructive";

  const capRateLabel =
    capRate >= 7
      ? "Strong"
      : capRate >= 5
        ? "Moderate"
        : "Below Average";

  const capRateBg =
    capRate >= 7
      ? "bg-success/10 border-success/20"
      : capRate >= 5
        ? "bg-warning/10 border-warning/20"
        : "bg-destructive/10 border-destructive/20";

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          Cap Rate Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Purchase Price */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-primary" />
            Purchase Price
          </label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value) || 0)}
          />
          <p className="text-xs text-muted-foreground">{formatCurrency(price)}</p>
        </div>

        {/* Annual Gross Rental Income */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            Annual Gross Rental Income
          </label>
          <Input
            type="number"
            value={grossRent}
            onChange={(e) => setGrossRent(Number(e.target.value) || 0)}
          />
          <p className="text-xs text-muted-foreground">
            {formatCurrency(grossRent / 12)}/month
          </p>
        </div>

        {/* Annual Operating Expenses */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Percent className="h-3.5 w-3.5 text-primary" />
            Annual Operating Expenses
          </label>
          <Input
            type="number"
            value={opExpenses}
            onChange={(e) => setOpExpenses(Number(e.target.value) || 0)}
          />
          <p className="text-xs text-muted-foreground">
            Tax + Insurance + Maintenance + Management + HOA
          </p>
        </div>

        <Separator />

        {/* Results */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-foreground">Results</h3>

          {/* NOI */}
          <div className="p-4 rounded-lg bg-card border border-border">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Net Operating Income (NOI)
                </p>
                <p className="text-2xl font-serif font-bold text-foreground">
                  {formatCurrency(noi)}
                </p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p>{formatCurrency(grossRent)} income</p>
                <p>- {formatCurrency(opExpenses)} expenses</p>
              </div>
            </div>
          </div>

          {/* Cap Rate */}
          <div className={`p-4 rounded-lg border ${capRateBg}`}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Cap Rate</p>
                <p className={`text-3xl font-serif font-bold ${capRateColor}`}>
                  {capRate.toFixed(2)}%
                </p>
              </div>
              <Badge
                variant={
                  capRate >= 7 ? "default" : capRate >= 5 ? "secondary" : "destructive"
                }
              >
                {capRateLabel}
              </Badge>
            </div>
            <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  capRate >= 7
                    ? "bg-success"
                    : capRate >= 5
                      ? "bg-warning"
                      : "bg-destructive"
                }`}
                style={{ width: `${Math.min((capRate / 12) * 100, 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5">
              South Florida avg: 6.8%
            </p>
          </div>

          {/* Gross Rent Multiplier */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Gross Rent Multiplier (GRM)
                </p>
                <p className="text-2xl font-serif font-bold text-primary">
                  {grm.toFixed(1)}x
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground">
                  {grm <= 15
                    ? "Excellent"
                    : grm <= 20
                      ? "Good"
                      : "High"}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Lower is better
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
