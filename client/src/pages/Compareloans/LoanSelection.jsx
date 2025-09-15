import React from 'react';
import LoanCard from './LoanCard';

const LoanSelection = ({ 
  selectedCategory, 
  availableLoans, 
  selectedLoans, 
  onLoanSelect, 
  onCompare, 
  onBack, 
  getCategoryDisplayName 
}) => {
  return (
    <div className="min-h-screen bg-black to-blue-900 text-white p-6">
      <div className="max-w-7xl mx-auto pt-20 md:w-[90%]">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={onBack}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg mb-4 transition-colors duration-300"
            >
              ← Back to Categories
            </button>
            <h1 className="text-4xl font-bold text-[#4f46e5] mb-2">
              {getCategoryDisplayName()}s
            </h1>
            <p className="text-gray-300 text-lg">Choose 2 or more loans to compare</p>
          </div>
        </div>

        {/* Selection Summary */}
        <div className="mb-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={onCompare}
              disabled={selectedLoans.length < 2}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                selectedLoans.length >= 2 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Compare ({selectedLoans.length})
            </button>
          </div>
        </div>

        {/* Loan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableLoans.map((loan) => (
            <LoanCard
              key={loan.id}
              loan={loan}
              isSelected={selectedLoans.find(l => l.id === loan.id)}
              onSelect={onLoanSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoanSelection;