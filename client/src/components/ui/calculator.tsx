import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatPercentage } from "@/lib/utils";

const LOAN_TYPES = [
  { id: "home-loan", label: "Home Loan", baseRate: 8.5 },
  { id: "lap", label: "Loan Against Property", baseRate: 9.5 },
  { id: "bt-topup", label: "Balance Transfer Top-Up", baseRate: 8.0 },
];

interface LoanCalculatorProps {
  onApply?: (loanDetails: {
    loanType: string;
    amount: number;
    interestRate: number;
    tenure: number;
    emi: number;
  }) => void;
}

export function LoanCalculator({ onApply }: LoanCalculatorProps) {
  const [loanType, setLoanType] = useState(LOAN_TYPES[0].id);
  const [amount, setAmount] = useState(2500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [interestPercentage, setInterestPercentage] = useState(0);

  useEffect(() => {
    calculateLoanDetails();
  }, [amount, interestRate, tenure]);

  const calculateLoanDetails = () => {
    const monthlyRate = interestRate / 12 / 100;
    const totalMonths = tenure * 12;

    const emiAmount =
      (amount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const totalPayment = emiAmount * totalMonths;
    const totalInterestAmount = totalPayment - amount;
    const interestPercent = (totalInterestAmount / amount) * 100;

    setEmi(Math.round(emiAmount));
    setTotalInterest(Math.round(totalInterestAmount));
    setTotalAmount(Math.round(totalPayment));
    setInterestPercentage(interestPercent);
  };

  const handleLoanTypeChange = (value: string) => {
    setLoanType(value);
    const selectedLoanType = LOAN_TYPES.find((type) => type.id === value);
    if (selectedLoanType) {
      setInterestRate(selectedLoanType.baseRate);
    }
  };

  const handleApply = () => {
    if (onApply) {
      onApply({
        loanType,
        amount,
        interestRate,
        tenure,
        emi,
      });
    }
  };

  return (
    <Card className=" text-white rounded-xl shadow-lg border border-gray-800 ">
      <CardContent className="p-6">
        <h2 className="text-primary text-xl font-semibold mb-4">
          EMI Calculator
        </h2>

        <div className="space-y-6">
          {/* Loan Type */}
          <div>
            <Label className="text-gray-300 mb-1 text-sm font-medium">
              Loan Type
            </Label>
            <Select value={loanType} onValueChange={handleLoanTypeChange}>
              <SelectTrigger className="w-full p-3 border border-gray-700 rounded-lg bg-gray-900 text-white">
                <SelectValue placeholder="Select Loan Type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 text-white border border-gray-700">
                {LOAN_TYPES.map((type) => (
                  <SelectItem
                    key={type.id}
                    value={type.id}
                    className="hover:bg-gray-800"
                  >
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Loan Amount */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label className="text-gray-300 text-sm font-medium">
                Loan Amount
              </Label>
              <span className="text-primary font-medium">
                {formatCurrency(amount)}
              </span>
            </div>
            <Slider
              min={100000}
              max={100000000}
              step={100000}
              value={[amount]}
              onValueChange={(values) => setAmount(values[0])}
              className="h-2 bg-gray-700"
            />
            <div className="flex justify-between text-xs text-white mt-1">
              <span>₹1L</span>
              <span>₹10Cr</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label className="text-gray-300 text-sm font-medium">
                Interest Rate
              </Label>
              <span className="text-primary font-medium">
                {formatPercentage(interestRate)}
              </span>
            </div>
            <Slider
              min={5}
              max={30}
              step={0.1}
              value={[interestRate]}
              onValueChange={(values) => setInterestRate(values[0])}
              className="h-2 bg-gray-700"
            />
            <div className="flex justify-between text-xs text-white mt-1">
              <span>5%</span>
              <span>30%</span>
            </div>
          </div>

          {/* Loan Tenure */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label className="text-gray-300 text-sm font-medium">
                Loan Tenure
              </Label>
              <span className="text-primary font-medium">{tenure} Years</span>
            </div>
            <Slider
              min={1}
              max={30}
              step={1}
              value={[tenure]}
              onValueChange={(values) => setTenure(values[0])}
              className="h-2 bg-gray-700"
            />
            <div className="flex justify-between text-xs text-white mt-1">
              <span>1 Year</span>
              <span>30 Years</span>
            </div>
          </div>

          {/* Results Box */}
          <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-white">Monthly EMI</p>
                <p className="text-xl font-semibold text-primary">
                  {formatCurrency(emi)}
                </p>
              </div>
              <div>
                <p className="text-sm text-white">Interest Payable</p>
                <p className="text-xl font-semibold text-primary">
                  {formatCurrency(totalInterest)}
                </p>
              </div>
              <div>
                <p className="text-sm text-white">Total Amount</p>
                <p className="text-xl font-semibold text-primary">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-white">Interest %</p>
                <p className="text-xl font-semibold text-primary">
                  {interestPercentage.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <Button
            onClick={handleApply}
            className="md:w-[25%] md:ml-[300px] py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            Apply Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
export default LoanCalculator;
