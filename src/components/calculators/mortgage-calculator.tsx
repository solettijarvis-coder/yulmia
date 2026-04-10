"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Calculator, DollarSign, Percent, Clock } from "lucide-react";

interface MortgageCalculatorProps {
  homePrice?: number;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function calculateMortgage(
  principal: number,
  annualRate: number,
  years: number
): { monthlyPayment: number; totalInterest: number; totalCost: number } {
  if (principal <= 0 || annualRate <= 0 || years <= 0) {
    return { monthlyPayment: 0, totalInterest: 0, totalCost: 0 };
  }
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  const monthlyPayment =
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);
  const totalCost = monthlyPayment * numPayments;
  const totalInterest = totalCost - principal;
  return { monthlyPayment, totalInterest, totalCost };
}

export function MortgageCalculator({ homePrice = 500000 }: MortgageCalculatorProps) {
  const [price, setPrice] = useState(homePrice);
  const [downPaymentPct, setDownPaymentPct] = useState(25);
  const [interestRate, setInterestRate] = useState(7);
  const [loanTerm, setLoanTerm] = useState<15 | 30>(30);

  const downPayment = price * (downPaymentPct / 100);
  const loanAmount = price - downPayment;
  const { monthlyPayment, totalInterest, totalCost } = calculateMortgage(
    loanAmount,
    interestRate,
    loanTerm
  );

  const principalPct = totalCost > 0 ? (loanAmount / totalCost) * 100 : 50;
  const interestPct = totalCost > 0 ? (totalInterest / totalCost) * 100 : 50;

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Calculator className="h-5 w-5 text-primary" />
          </div>
          Mortgage Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Home Price */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-primary" />
            Home Price
          </label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value) || 0)}
            className="text-foreground"
          />
          <p className="text-xs text-muted-foreground">{formatCurrency(price)}</p>
        </div>

        {/* Down Payment % */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Percent className="h-3.5 w-3.5 text-primary" />
              Down Payment
            </span>
            <span className="text-primary font-medium">{downPaymentPct}%</span>
          </label>
          <Slider
            value={[downPaymentPct]}
            onValueChange={(val) => setDownPaymentPct(Array.isArray(val) ? val[0] : val)}
            min={3}
            max={50}
            step={1}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>3%</span>
            <span className="text-primary">{formatCurrency(downPayment)}</span>
            <span>50%</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Percent className="h-3.5 w-3.5 text-primary" />
              Interest Rate
            </span>
            <span className="text-primary font-medium">{interestRate}%</span>
          </label>
          <Slider
            value={[interestRate]}
            onValueChange={(val) => setInterestRate(Array.isArray(val) ? val[0] : val)}
            min={3}
            max={10}
            step={0.125}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>3%</span>
            <span>10%</span>
          </div>
        </div>

        {/* Loan Term Toggle */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-primary" />
            Loan Term
          </label>
          <div className="flex gap-2">
            <Button
              variant={loanTerm === 15 ? "default" : "outline"}
              onClick={() => setLoanTerm(15)}
              className="flex-1"
            >
              15 Years
            </Button>
            <Button
              variant={loanTerm === 30 ? "default" : "outline"}
              onClick={() => setLoanTerm(30)}
              className="flex-1"
            >
              30 Years
            </Button>
          </div>
        </div>

        <Separator />

        {/* Results */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-foreground">Payment Summary</h3>

          {/* Visual breakdown bar */}
          <div className="space-y-2">
            <div className="h-4 rounded-full overflow-hidden bg-muted flex">
              <div
                className="bg-primary h-full transition-all duration-500"
                style={{ width: `${principalPct}%` }}
              />
              <div
                className="bg-destructive/60 h-full transition-all duration-500"
                style={{ width: `${interestPct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-primary" />
                Principal ({principalPct.toFixed(1)}%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-destructive/60" />
                Interest ({interestPct.toFixed(1)}%)
              </span>
            </div>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
              <p className="text-xl font-serif font-bold text-primary">
                {formatCurrency(monthlyPayment)}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">Monthly Payment</p>
            </div>
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-center">
              <p className="text-xl font-serif font-bold text-destructive">
                {formatCurrency(totalInterest)}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">Total Interest</p>
            </div>
            <div className="p-3 rounded-lg bg-card border border-border text-center">
              <p className="text-xl font-serif font-bold text-foreground">
                {formatCurrency(totalCost)}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">Total Cost</p>
            </div>
          </div>

          {/* Loan details */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Loan Amount</span>
              <span className="font-medium text-foreground">{formatCurrency(loanAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Down Payment</span>
              <span className="font-medium text-primary">{formatCurrency(downPayment)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Rate / Term</span>
              <span className="font-medium text-foreground">{interestRate}% / {loanTerm}yr</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
