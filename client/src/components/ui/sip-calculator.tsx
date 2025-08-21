import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface SipCalculatorProps {
  onStart?: (sipDetails: {
    monthlyAmount: number;
    investmentPeriod: number;
    expectedReturnRate: number;
    totalInvestment: number;
    estimatedReturns: number;
    totalValue: number;
  }) => void;
}

export function SipCalculator({ onStart }: SipCalculatorProps) {
  const [monthlyAmount, setMonthlyAmount] = useState(5000);
  const [investmentPeriod, setInvestmentPeriod] = useState(10);
  const [expectedReturnRate, setExpectedReturnRate] = useState(12);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [estimatedReturns, setEstimatedReturns] = useState(0);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    calculateSipReturns();
  }, [monthlyAmount, investmentPeriod, expectedReturnRate]);

  const calculateSipReturns = () => {
    // SIP calculation formula: FV = P × ((1 + i)^n - 1) × (1 + i) / i
    // Where:
    // FV = Future Value (Total Value)
    // P = Monthly Investment Amount
    // i = Monthly Interest Rate (Annual Rate / 12 / 100)
    // n = Total Number of Months

    const monthlyRate = expectedReturnRate / 12 / 100;
    const months = investmentPeriod * 12;
    const invested = monthlyAmount * months;

    const futureValue =
      monthlyAmount *
      (((Math.pow(1 + monthlyRate, months) - 1) * (1 + monthlyRate)) /
        monthlyRate);

    const returns = futureValue - invested;

    setTotalInvestment(invested);
    setEstimatedReturns(Math.round(returns));
    setTotalValue(Math.round(futureValue));
  };

  const handleStart = () => {
    if (onStart) {
      onStart({
        monthlyAmount,
        investmentPeriod,
        expectedReturnRate,
        totalInvestment,
        estimatedReturns,
        totalValue,
      });
    }
  };

  return (
    <Card className="bg-neutral-900 rounded-xl border border-neutral-800 shadow-sm">
  <CardContent className="p-6">
    <h3 className="text-xl font-semibold mb-4 text-white">SIP Calculator</h3>

    <div className="space-y-6">
      {/* Monthly Investment */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <Label className="text-white text-sm font-medium">
            Monthly Investment
          </Label>
          <span className="text-primary font-medium">
            {formatCurrency(monthlyAmount)}
          </span>
        </div>
        <Slider
          min={500}
          max={50000}
          step={500}
          value={[monthlyAmount]}
          onValueChange={(values) => setMonthlyAmount(values[0])}
          className="h-2 bg-neutral-700"
        />
        <div className="flex justify-between text-xs text-white mt-1">
          <span>₹500</span>
          <span>₹50,000</span>
        </div>
      </div>

      {/* Investment Period */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <Label className="text-white text-sm font-medium">
            Investment Period
          </Label>
          <span className="text-primary font-medium">
            {investmentPeriod} Years
          </span>
        </div>
        <Slider
          min={1}
          max={30}
          step={1}
          value={[investmentPeriod]}
          onValueChange={(values) => setInvestmentPeriod(values[0])}
          className="h-2 bg-neutral-700"
        />
        <div className="flex justify-between text-xs text-white mt-1">
          <span>1 Year</span>
          <span>30 Years</span>
        </div>
      </div>

      {/* Expected Return Rate */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <Label className="text-white text-sm font-medium">
            Expected Return Rate
          </Label>
          <span className="text-primary font-medium">
            {expectedReturnRate}%
          </span>
        </div>
        <Slider
          min={6}
          max={18}
          step={0.5}
          value={[expectedReturnRate]}
          onValueChange={(values) => setExpectedReturnRate(values[0])}
          className="h-2 bg-neutral-700"
        />
        <div className="flex justify-between text-xs text-white mt-1">
          <span>6%</span>
          <span>18%</span>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 gap-6">
        <div className="p-4 bg-neutral-800 rounded-lg border border-neutral-700 text-center">
          <p className="text-sm text-white mb-1">Invested Amount</p>
          <p className="text-xl font-semibold text-primary">
            {formatCurrency(totalInvestment)}
          </p>
        </div>

        <div className="p-4 bg-neutral-800 rounded-lg border border-neutral-700 text-center">
          <p className="text-sm text-white mb-1">Estimated Returns</p>
          <p className="text-xl font-semibold text-primary">
            {formatCurrency(estimatedReturns)}
          </p>
        </div>

        <div className="p-4 bg-neutral-800 rounded-lg border border-neutral-700 text-center col-span-2">
          <p className="text-sm text-white mb-1">Total Value</p>
          <p className="text-2xl font-bold text-primary">
            {formatCurrency(totalValue)}
          </p>
        </div>
      </div>

      {/* Start Button */}
      <div className="pt-3">
        <Button
          onClick={handleStart}
          className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
        >
          Start SIP Now
        </Button>
      </div>
    </div>
  </CardContent>
</Card>

  );
}
