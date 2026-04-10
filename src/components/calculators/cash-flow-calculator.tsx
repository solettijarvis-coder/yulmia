"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import {
  DollarSign,
  Percent,
  TrendingUp,
  TrendingDown,
  Home,
  ShieldCheck,
  Building2,
} from "lucide-react";

interface CashFlowCalculatorProps {
  purchasePrice?: number;
  downPaymentPct?: number;
  interestRate?: number;
  monthlyRent?: number;
  annualPropertyTax?: number;
  annualInsurance?: number;
  monthlyHOA?: number;
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
  years: number = 30
): number {
  if (principal <= 0 || annualRate <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  return (
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
    (Math.pow(1 + monthlyRate, numPayments) - 1)
  );
}

export function CashFlowCalculator({
  purchasePrice = 500000,
  downPaymentPct: initialDownPayment = 25,
  interestRate: initialRate = 7,
  monthlyRent: initialRent = 3000,
  annualPropertyTax: initialTax = 8000,
  annualInsurance: initialInsurance = 3500,
  monthlyHOA: initialHOA = 0,
}: CashFlowCalculatorProps) {
  const [price, setPrice] = useState(purchasePrice);
  const [downPct, setDownPct] = useState(initialDownPayment);
  const [rate, setRate] = useState(initialRate);
  const [rent, setRent] = useState(initialRent);
  const [annualTax, setAnnualTax] = useState(initialTax);
  const [annualInsurance, setAnnualInsurance] = useState(initialInsurance);
  const [hoa, setHoa] = useState(initialHOA);
  const [vacancyRate, setVacancyRate] = useState(5);
  const [mgmtFee, setMgmtFee] = useState(8);

  const downPayment = price * (downPct / 100);
  const loanAmount = price - downPayment;
  const monthlyMortgage = calculateMortgage(loanAmount, rate);

  // Monthly expense breakdown
  const monthlyTax = annualTax / 12;
  const monthlyInsurance = annualInsurance / 12;
  const monthlyMaintenance = (price * 0.01) / 12; // 1% rule for maintenance
  const monthlyMgmt = rent * (mgmtFee / 100);
  const monthlyVacancy = rent * (vacancyRate / 100);

  const totalMonthlyExpenses =
    monthlyMortgage +
    monthlyTax +
    monthlyInsurance +
    monthlyMaintenance +
    monthlyMgmt +
    monthlyVacancy +
    hoa;

  const effectiveMonthlyRent = rent - monthlyVacancy;
  const monthlyCashFlow = effectiveMonthlyRent - totalMonthlyExpenses + monthlyVacancy;
  // Recalculate: cash flow = gross rent - vacancy loss - all expenses
  const netMonthlyCashFlow = rent - totalMonthlyExpenses - monthlyVacancy;
  const annualCashFlow = netMonthlyCashFlow * 12;

  // Cash on cash return
  const cashOnCash = downPayment > 0 ? (annualCashFlow / downPayment) * 100 : 0;

  const isPositive = netMonthlyCashFlow >= 0;

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          Cash Flow Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Purchase Price */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Home className="h-3.5 w-3.5 text-primary" />
            Purchase Price
          </label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value) || 0)}
          />
        </div>

        {/* Down Payment % */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Percent className="h-3.5 w-3.5 text-primary" />
              Down Payment
            </span>
            <span className="text-primary font-medium">{downPct}%</span>
          </label>
          <Slider
            value={[downPct]}
            onValueChange={(val) => setDownPct(Array.isArray(val) ? val[0] : val)}
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
            <span>Interest Rate</span>
            <span className="text-primary font-medium">{rate}%</span>
          </label>
          <Slider
            value={[rate]}
            onValueChange={(val) => setRate(Array.isArray(val) ? val[0] : val)}
            min={3}
            max={10}
            step={0.125}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>3%</span>
            <span>10%</span>
          </div>
        </div>

        {/* Monthly Rent */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Estimated Monthly Rent</label>
          <Input
            type="number"
            value={rent}
            onChange={(e) => setRent(Number(e.target.value) || 0)}
          />
        </div>

        {/* Annual Tax & Insurance */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Annual Property Tax</label>
            <Input
              type="number"
              value={annualTax}
              onChange={(e) => setAnnualTax(Number(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-primary" />
              Annual Insurance
            </label>
            <Input
              type="number"
              value={annualInsurance}
              onChange={(e) => setAnnualInsurance(Number(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* Monthly HOA */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground flex items-center gap-1">
            <Building2 className="h-3.5 w-3.5 text-primary" />
            Monthly HOA
          </label>
          <Input
            type="number"
            value={hoa}
            onChange={(e) => setHoa(Number(e.target.value) || 0)}
          />
        </div>

        {/* Vacancy Rate */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground flex items-center justify-between">
            <span>Vacancy Rate</span>
            <span className="text-primary font-medium">{vacancyRate}%</span>
          </label>
          <Slider
            value={[vacancyRate]}
            onValueChange={(val) => setVacancyRate(Array.isArray(val) ? val[0] : val)}
            min={0}
            max={20}
            step={1}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>20%</span>
          </div>
        </div>

        {/* Management Fee */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground flex items-center justify-between">
            <span>Management Fee</span>
            <span className="text-primary font-medium">{mgmtFee}%</span>
          </label>
          <Slider
            value={[mgmtFee]}
            onValueChange={(val) => setMgmtFee(Array.isArray(val) ? val[0] : val)}
            min={0}
            max={20}
            step={1}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>20%</span>
          </div>
        </div>

        <Separator />

        {/* Results */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-foreground">Cash Flow Summary</h3>

          {/* Monthly mortgage */}
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Monthly Mortgage</span>
              <span className="font-medium text-primary">{formatCurrency(monthlyMortgage)}</span>
            </div>
          </div>

          {/* Expenses breakdown */}
          <div className="p-3 rounded-lg bg-card border border-border space-y-1.5">
            <p className="text-xs text-muted-foreground font-medium mb-2">Monthly Expenses Breakdown</p>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Mortgage</span>
              <span className="font-medium text-foreground">{formatCurrency(monthlyMortgage)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Property Tax</span>
              <span className="font-medium text-foreground">{formatCurrency(monthlyTax)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Insurance</span>
              <span className="font-medium text-foreground">{formatCurrency(monthlyInsurance)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Maintenance (1%)</span>
              <span className="font-medium text-foreground">{formatCurrency(monthlyMaintenance)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Management ({mgmtFee}%)</span>
              <span className="font-medium text-foreground">{formatCurrency(monthlyMgmt)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Vacancy Loss ({vacancyRate}%)</span>
              <span className="font-medium text-foreground">{formatCurrency(monthlyVacancy)}</span>
            </div>
            {hoa > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">HOA</span>
                <span className="font-medium text-foreground">{formatCurrency(hoa)}</span>
              </div>
            )}
            <Separator className="my-1" />
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-foreground">Total Monthly Expenses</span>
              <span className="text-foreground">{formatCurrency(totalMonthlyExpenses)}</span>
            </div>
          </div>

          {/* Cash flow results */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className={`p-3 rounded-lg border text-center ${
                isPositive
                  ? "bg-success/10 border-success/20"
                  : "bg-destructive/10 border-destructive/20"
              }`}
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
              </div>
              <p
                className={`text-xl font-serif font-bold ${
                  isPositive ? "text-success" : "text-destructive"
                }`}
              >
                {formatCurrency(netMonthlyCashFlow)}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">Monthly Cash Flow</p>
            </div>
            <div
              className={`p-3 rounded-lg border text-center ${
                annualCashFlow >= 0
                  ? "bg-success/10 border-success/20"
                  : "bg-destructive/10 border-destructive/20"
              }`}
            >
              <p
                className={`text-xl font-serif font-bold ${
                  annualCashFlow >= 0 ? "text-success" : "text-destructive"
                }`}
              >
                {formatCurrency(annualCashFlow)}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">Annual Cash Flow</p>
            </div>
          </div>

          {/* Cash on Cash Return */}
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Cash on Cash Return</span>
              <Badge
                variant={cashOnCash >= 5 ? "default" : cashOnCash >= 0 ? "secondary" : "destructive"}
              >
                {cashOnCash.toFixed(2)}%
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
