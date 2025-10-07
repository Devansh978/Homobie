import React from 'react';
import { calculateEMI, calculateTotalInterest, calculateProcessingFee, calculateTotalCost, formatCurrency } from './utils';

const LoanCard = ({ loan, isSelected, onSelect }) => {
  const emi = calculateEMI(loan.principal, loan.interestRate, loan.termYears);
  const totalInterest = calculateTotalInterest(loan.principal, emi, loan.termYears);
  const processingFee = calculateProcessingFee(loan.principal, loan.processingFee);
  const totalCost = calculateTotalCost(loan.principal, totalInterest, processingFee);

  return (
    <div
      onClick={() => onSelect(loan)}
      className={`text-left backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 ${
        isSelected 
          ? 'border-[#4f46e5] bg-blue-400/30' 
          : 'border-gray-600 hover:border-[#4f46e5]'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">{loan.name}</h3>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
          isSelected ? 'border-[#4f46e5] bg-[#4f46e5]' : 'border-gray-400'
        }`}>
          {isSelected && <div className="text-white text-xs">✓</div>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-gray-400 text-sm">Interest Rate</p>
          <p className="text-white font-bold text-lg">{loan.interestRate}%</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Monthly EMI</p>
          <p className="text-green-400 font-bold text-lg">{formatCurrency(emi)}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Total Cost</p>
          <p className="text-white font-bold">{formatCurrency(totalCost)}</p>
        </div>
      </div>

      <div className="border-t border-gray-600 pt-4">
        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div className="text-gray-300">
            <span className="text-gray-400">Max Tenure:</span> {loan.termYears} years
          </div>
          <div className="text-gray-300">
            <span className="text-gray-400">Credit Score:</span> {loan.creditScoreMin}+
          </div>
          <div className="text-gray-300">
            <span className="text-gray-400">Max Amount:</span> {formatCurrency(loan.maxLoanAmount)}
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoanCard;