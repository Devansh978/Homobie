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
      className={`bg-gray-800 border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-102 hover:shadow-xl ${
        isSelected 
          ? 'border-[#4f46e5] bg-blue-400/30' 
          : 'border-gray-600 hover:border-[#4f46e5]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">{loan.name}</h3>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
          isSelected ? 'border-[#4f46e5] bg-[#4f46e5]' : 'border-gray-400'
        }`}>
          {isSelected && <div className="text-white text-xs">✓</div>}
        </div>
      </div>

      {/* Key Metrics */}
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
          <p className="text-gray-400 text-sm">Processing Fee</p>
          <p className="text-white font-bold">{loan.processingFee}%</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Total Cost</p>
          <p className="text-white font-bold">{formatCurrency(totalCost)}</p>
        </div>
      </div>

      {/* Additional Details */}
      <div className="border-t border-gray-600 pt-4">
        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div className="text-gray-300">
            <span className="text-gray-400">Term:</span> {loan.termYears} years
          </div>
          <div className="text-gray-300">
            <span className="text-gray-400">Credit Score:</span> {loan.creditScoreMin}+
          </div>
          <div className="text-gray-300">
            <span className="text-gray-400">Approval:</span> {loan.approvalTime}
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