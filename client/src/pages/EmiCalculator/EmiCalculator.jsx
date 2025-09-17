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

export function EmiCalculator({ onApply,background = "black"}) {
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

  const handleLoanTypeChange = (value) => {
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

  // Redirect based on loanType
  switch (loanType) {
    case "home-loan":
      window.location.href="/loan-application?type=home-loan";
      break;
    case "lap":
      window.location.href="/loan-application?type=lap";
      break;
    case "bt-topup":
      window.location.href="/loan-application?type=bt-topup";
      break;
    default:
      window.location.href="/loan-application?type=home-loan";
  }
};


  return (
    <div className='pt-24 pb-10' style={{ backgroundColor: background }}>
    <Card className=" text-white rounded-xl shadow-lg mx-8 md:mx-36">
      <CardContent className="p-6">
        <h2 className="text-white text-2xl font-semibold mb-4">
          EMI Calculator
        </h2>

        <div className="space-y-6">
          {/* Loan Type */}
          <div>
            <Label className="text-white mb-1 text-md font-medium">
              Loan Type
            </Label>
            <Select value={loanType} onValueChange={handleLoanTypeChange}>
              <SelectTrigger className="w-full p-3 border border-white/30 rounded-lg  text-white">
                <SelectValue placeholder="Select Loan Type" />
              </SelectTrigger>
              <SelectContent className=" text-white border border-white/30">
                {LOAN_TYPES.map((type) => (
                  <SelectItem
                    key={type.id}
                    value={type.id}
                    className="hover:bg-white/10"
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
              <Label className="text-white text-md font-medium">
                Loan Amount
              </Label>
              <span className="text-white font-medium">
                {formatCurrency(amount)}
              </span>
            </div>
            <Slider
              min={100000}
              max={100000000}
              step={100000}
              value={[amount]}
              onValueChange={(values) => setAmount(values[0])}
              className="h-2 bg-white/20"
            />
            <div className="flex justify-between text-md text-white/70 mt-1">
              <span>₹1L</span>
              <span>₹10Cr</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label className="text-white text-md font-medium">
                Interest Rate
              </Label>
              <span className="text-white font-medium">
                {formatPercentage(interestRate)}
              </span>
            </div>
            <Slider
              min={5}
              max={30}
              step={0.1}
              value={[interestRate]}
              onValueChange={(values) => setInterestRate(values[0])}
              className="h-2 bg-white/20"
            />
            <div className="flex justify-between text-md text-white/70 mt-1">
              <span>5%</span>
              <span>30%</span>
            </div>
          </div>

          {/* Loan Tenure */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label className="text-white text-md font-medium">
                Loan Tenure
              </Label>
              <span className="text-white font-medium">{tenure} Years</span>
            </div>
            <Slider
              min={1}
              max={30}
              step={1}
              value={[tenure]}
              onValueChange={(values) => setTenure(values[0])}
              className="h-2 bg-white/20"
            />
            <div className="flex justify-between text-md text-white/70 mt-1">
              <span>1 Year</span>
              <span>30 Years</span>
            </div>
          </div>

          {/* Results */}
          <div className="p-4  border border-white/30 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-md text-white/70">Monthly EMI</p>
                <p className="text-xl font-semibold text-white">
                  {formatCurrency(emi)}
                </p>
              </div>
              <div>
                <p className="text-md text-white/70">Interest Payable</p>
                <p className="text-xl font-semibold text-white">
                  {formatCurrency(totalInterest)}
                </p>
              </div>
              <div>
                <p className="text-md text-white/70">Total Amount</p>
                <p className="text-xl font-semibold text-white">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
              <div>
                <p className="text-md text-white/70">Interest %</p>
                <p className="text-xl font-semibold text-white">
                  {interestPercentage.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleApply}
            className="md:w-[25%] py-3 relative md:left-[38%] text-white font-medium rounded-lg hover:bg-white/90 hover:text-black transition-colors md:text-[18px]"
          >
            Apply Now
          </Button>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}

export default EmiCalculator;
