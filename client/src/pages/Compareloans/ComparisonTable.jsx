import React from 'react';
import RecommendationCard from './RecommendationCard';
import { 
  calculateEMI, 
  calculateTotalInterest, 
  calculateProcessingFee, 
  calculateTotalCost, 
  formatCurrency 
} from './utils';

const ComparisonTable = ({ 
  selectedLoans, 
  sortBy, 
  setSortBy, 
  onBack, 
  getCategoryDisplayName 
}) => {
  const sortedSelectedLoans = [...selectedLoans].sort((a, b) => {
    const aEMI = calculateEMI(a.principal, a.interestRate, a.termYears);
    const bEMI = calculateEMI(b.principal, b.interestRate, b.termYears);
    const aTotalInterest = calculateTotalInterest(a.principal, aEMI, a.termYears);
    const bTotalInterest = calculateTotalInterest(b.principal, bEMI, b.termYears);
    const aProcessingFee = calculateProcessingFee(a.principal, a.processingFee);
    const bProcessingFee = calculateProcessingFee(b.principal, b.processingFee);
    const aTotalCost = calculateTotalCost(a.principal, aTotalInterest, aProcessingFee);
    const bTotalCost = calculateTotalCost(b.principal, bTotalInterest, bProcessingFee);

    switch (sortBy) {
      case 'emi':
        return aEMI - bEMI;
      case 'interestRate':
        return a.interestRate - b.interestRate;
      case 'totalCost':
        return aTotalCost - bTotalCost;
      case 'processingFee':
        return a.processingFee - b.processingFee;
      default:
        return 0;
    }
  });

  const getRecommendations = () => {
    const bestEMI = sortedSelectedLoans[0];
    const lowestRate = [...sortedSelectedLoans].sort((a, b) => a.interestRate - b.interestRate)[0];
    const fastestApproval = [...sortedSelectedLoans].sort((a, b) => {
      const aTime = a.approvalTime.includes('hour') ? 1 : parseInt(a.approvalTime.split('-')[0]);
      const bTime = b.approvalTime.includes('hour') ? 1 : parseInt(b.approvalTime.split('-')[0]);
      return aTime - bTime;
    })[0];

    return { bestEMI, lowestRate, fastestApproval };
  };

  const recommendations = getRecommendations();

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
              ← Back to Loan Selection
            </button>
            <h1 className="text-4xl font-bold text-[#4f46e5] mb-2">
              Comparing {getCategoryDisplayName()}s 
            </h1>
            <p className="text-gray-300 text-lg">Comparing {selectedLoans.length} selected loans</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-600">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-3">
              <label className="text-[#4f46e5] font-semibold">Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:border-[#4f46e5] focus:outline-none transition-colors duration-300"
              >
                <option value="emi">Monthly EMI (Low to High)</option>
                <option value="interestRate">Interest Rate (Low to High)</option>
                <option value="totalCost">Total Cost (Low to High)</option>
                <option value="processingFee">Processing Fee (Low to High)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transposed Comparison Table */}
        <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-600 mb-8">
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-gray-700">
                  <th className="text-left p-4 text-[#4f46e5] font-semibold sticky left-0 bg-gray-700 min-w-[140px] border-r-2 border-gray-500">Features</th>
                  {sortedSelectedLoans.map((loan, index) => (
                    <th key={loan.id} className={`text-center p-4 text-[#4f46e5] font-semibold min-w-[150px] ${index < sortedSelectedLoans.length - 1 ? 'border-r-2 border-gray-500' : ''}`}>
                      {loan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Lender Row */}
                <tr className="bg-gray-800 hover:bg-gray-700 transition-colors duration-300">
                  <td className="p-4 font-semibold text-white bg-gray-800 sticky left-0 border-r-2 border-gray-500 border-b border-gray-600">
                    Lender
                  </td>
                  {sortedSelectedLoans.map((loan, index) => (
                    <td key={loan.id} className={`p-4 text-center border-b border-gray-600 ${index < sortedSelectedLoans.length - 1 ? 'border-r-2 border-gray-500' : ''}`}>
                      <div className="font-semibold text-white">{loan.name}</div>
                      <div className="text-sm text-gray-400">Max: {formatCurrency(loan.maxLoanAmount)}</div>
                    </td>
                  ))}
                </tr>

                {/* Loan Amount Row */}
                <tr className="bg-gray-750 hover:bg-gray-700 transition-colors duration-300">
                  <td className="p-4 font-semibold text-white bg-gray-750 sticky left-0 border-r-2 border-gray-500 border-b border-gray-600">
                    Loan Amount
                  </td>
                  {sortedSelectedLoans.map((loan, index) => (
                    <td key={loan.id} className={`p-4 text-center border-b border-gray-600 ${index < sortedSelectedLoans.length - 1 ? 'border-r-2 border-gray-500' : ''}`}>
                      <div className="font-semibold text-green-400">{formatCurrency(loan.principal)}</div>
                    </td>
                  ))}
                </tr>

                {/* Interest Rate Row */}
                <tr className="bg-gray-800 hover:bg-gray-700 transition-colors duration-300">
                  <td className="p-4 font-semibold text-white bg-gray-800 sticky left-0 border-r-2 border-gray-500 border-b border-gray-600">
                    Interest Rate
                  </td>
                  {sortedSelectedLoans.map((loan, index) => (
                    <td key={loan.id} className={`p-4 text-center border-b border-gray-600 ${index < sortedSelectedLoans.length - 1 ? 'border-r-2 border-gray-500' : ''}`}>
                      <div className="font-semibold text-white">{loan.interestRate}% p.a.</div>
                    </td>
                  ))}
                </tr>

                {/* Term Row */}
                <tr className="bg-gray-750 hover:bg-gray-700 transition-colors duration-300">
                  <td className="p-4 font-semibold text-white bg-gray-750 sticky left-0 border-r-2 border-gray-500 border-b border-gray-600">
                    Term
                  </td>
                  {sortedSelectedLoans.map((loan, index) => (
                    <td key={loan.id} className={`p-4 text-center border-b border-gray-600 ${index < sortedSelectedLoans.length - 1 ? 'border-r-2 border-gray-500' : ''}`}>
                      <div className="text-white">{loan.termYears} years</div>
                    </td>
                  ))}
                </tr>

                {/* Monthly EMI Row */}
                <tr className="bg-gray-800 hover:bg-gray-700 transition-colors duration-300">
                  <td className="p-4 font-semibold text-white bg-gray-800 sticky left-0 border-r-2 border-gray-500 border-b border-gray-600">
                    Monthly EMI
                  </td>
                  {sortedSelectedLoans.map((loan, index) => {
                    const emi = calculateEMI(loan.principal, loan.interestRate, loan.termYears);
                    return (
                      <td key={loan.id} className={`p-4 text-center border-b border-gray-600 ${index < sortedSelectedLoans.length - 1 ? 'border-r-2 border-gray-500' : ''}`}>
                        <div className="font-bold text-[#4f46e5] text-lg">{formatCurrency(emi)}</div>
                      </td>
                    );
                  })}
                </tr>

                {/* Total Interest Row */}
                <tr className="bg-gray-750 hover:bg-gray-700 transition-colors duration-300">
                  <td className="p-4 font-semibold text-white bg-gray-750 sticky left-0 border-r-2 border-gray-500 border-b border-gray-600">
                    Total Interest
                  </td>
                  {sortedSelectedLoans.map((loan, index) => {
                    const emi = calculateEMI(loan.principal, loan.interestRate, loan.termYears);
                    const totalInterest = calculateTotalInterest(loan.principal, emi, loan.termYears);
                    return (
                      <td key={loan.id} className={`p-4 text-center border-b border-gray-600 ${index < sortedSelectedLoans.length - 1 ? 'border-r-2 border-gray-500' : ''}`}>
                        <div className="font-semibold text-white">{formatCurrency(totalInterest)}</div>
                      </td>
                    );
                  })}
                </tr>

                {/* Processing Fee Row */}
                <tr className="bg-gray-800 hover:bg-gray-700 transition-colors duration-300">
                  <td className="p-4 font-semibold text-white bg-gray-800 sticky left-0 border-r-2 border-gray-500 border-b border-gray-600">
                    Processing Fee
                  </td>
                  {sortedSelectedLoans.map((loan, index) => {
                    const processingFee = calculateProcessingFee(loan.principal, loan.processingFee);
                    return (
                      <td key={loan.id} className={`p-4 text-center border-b border-gray-600 ${index < sortedSelectedLoans.length - 1 ? 'border-r-2 border-gray-500' : ''}`}>
                        <div className="text-orange-400">{formatCurrency(processingFee)}</div>
                        <div className="text-xs text-gray-400">({loan.processingFee}%)</div>
                      </td>
                    );
                  })}
                </tr>

                {/* Total Cost Row */}
                <tr className="bg-gray-750 hover:bg-gray-700 transition-colors duration-300">
                  <td className="p-4 font-semibold text-white bg-gray-750 sticky left-0 border-r-2 border-gray-500 border-b border-gray-600">
                    Total Cost
                  </td>
                  {sortedSelectedLoans.map((loan, index) => {
                    const emi = calculateEMI(loan.principal, loan.interestRate, loan.termYears);
                    const totalInterest = calculateTotalInterest(loan.principal, emi, loan.termYears);
                    const processingFee = calculateProcessingFee(loan.principal, loan.processingFee);
                    const totalCost = calculateTotalCost(loan.principal, totalInterest, processingFee);
                    return (
                      <td key={loan.id} className={`p-4 text-center border-b border-gray-600 ${index < sortedSelectedLoans.length - 1 ? 'border-r-2 border-gray-500' : ''}`}>
                        <div className="font-bold text-white text-lg">{formatCurrency(totalCost)}</div>
                      </td>
                    );
                  })}
                </tr>

                {/* Credit Score Row */}
                <tr className="bg-gray-800 hover:bg-gray-700 transition-colors duration-300">
                  <td className="p-4 font-semibold text-white bg-gray-800 sticky left-0 border-r-2 border-gray-500 border-b border-gray-600">
                    Credit Score
                  </td>
                  {sortedSelectedLoans.map((loan, index) => (
                    <td key={loan.id} className={`p-4 text-center border-b border-gray-600 ${index < sortedSelectedLoans.length - 1 ? 'border-r-2 border-gray-500' : ''}`}>
                      <div className="text-gray-300"><span className="text-white">{loan.creditScoreMin}+</span></div>
                    </td>
                  ))}
                </tr>

                {/* Approval Time Row */}
                <tr className="bg-gray-750 hover:bg-gray-700 transition-colors duration-300">
                  <td className="p-4 font-semibold text-white bg-gray-750 sticky left-0 border-r-2 border-gray-500">
                    Approval Time
                  </td>
                  {sortedSelectedLoans.map((loan, index) => (
                    <td key={loan.id} className={`p-4 text-center ${index < sortedSelectedLoans.length - 1 ? 'border-r-2 border-gray-500' : ''}`}>
                      <div className="text-[#4f46e5]">{loan.approvalTime}</div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RecommendationCard
            title="Best EMI"
            loan={recommendations.bestEMI}
            value={formatCurrency(calculateEMI(recommendations.bestEMI.principal, recommendations.bestEMI.interestRate, recommendations.bestEMI.termYears))}
            subtitle="per month"
          />
          <RecommendationCard
            title="Lowest Rate"
            loan={recommendations.lowestRate}
            value={`${recommendations.lowestRate.interestRate}%`}
            subtitle="per annum"
          />
          <RecommendationCard
            title="Fastest Approval"
            loan={recommendations.fastestApproval}
            value={recommendations.fastestApproval.approvalTime}
            subtitle="processing time"
          />
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;