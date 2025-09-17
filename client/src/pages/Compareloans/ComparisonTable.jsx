import React from "react";
import RecommendationCard from "./RecommendationCard";
import {
  calculateEMI,
  calculateTotalInterest,
  calculateProcessingFee,
  calculateTotalCost,
  formatCurrency,
} from "./utils";

const ComparisonTable = ({
  selectedLoans,
  sortBy,
  setSortBy,
  onBack,
  getCategoryDisplayName,
}) => {
  const sortedSelectedLoans = [...selectedLoans].sort((a, b) => {
    const aEMI = calculateEMI(a.principal, a.interestRate, a.termYears);
    const bEMI = calculateEMI(b.principal, b.interestRate, b.termYears);
    const aTotalInterest = calculateTotalInterest(
      a.principal,
      aEMI,
      a.termYears
    );
    const bTotalInterest = calculateTotalInterest(
      b.principal,
      bEMI,
      b.termYears
    );
    const aProcessingFee = calculateProcessingFee(a.principal, a.processingFee);
    const bProcessingFee = calculateProcessingFee(b.principal, b.processingFee);
    const aTotalCost = calculateTotalCost(
      a.principal,
      aTotalInterest,
      aProcessingFee
    );
    const bTotalCost = calculateTotalCost(
      b.principal,
      bTotalInterest,
      bProcessingFee
    );

    switch (sortBy) {
      case "emi":
        return aEMI - bEMI;
      case "interestRate":
        return a.interestRate - b.interestRate;
      case "totalCost":
        return aTotalCost - bTotalCost;
      case "processingFee":
        return a.processingFee - b.processingFee;
      default:
        return 0;
    }
  });

  const getRecommendations = () => {
    const bestEMI = sortedSelectedLoans[0];
    const lowestRate = [...sortedSelectedLoans].sort(
      (a, b) => a.interestRate - b.interestRate
    )[0];
    const fastestApproval = [...sortedSelectedLoans].sort((a, b) => {
      const aTime = a.approvalTime.includes("hour")
        ? 1
        : parseInt(a.approvalTime.split("-")[0]);
      const bTime = b.approvalTime.includes("hour")
        ? 1
        : parseInt(b.approvalTime.split("-")[0]);
      return aTime - bTime;
    })[0];

    return { bestEMI, lowestRate, fastestApproval };
  };

  const recommendations = getRecommendations();

  return (
    <div className="min-h-screen bg-black text-white p-6 relative overflow-hidden">
      {/* Background blur elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/2 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto pt-20 relative z-10">
        {/* Header with Back Button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <button
              onClick={onBack}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg mb-4 transition duration-300 backdrop-blur-sm"
            >
              ← Back to Loan Selection
            </button>
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
              Comparing {getCategoryDisplayName()}
            </h1>
            <p className="text-white/70 text-lg">
              Comparing {selectedLoans.length} selected loans
            </p>
          </div>

          {/* Sort Controls */}
          <div>
            <label className="text-white/70 font-semibold mr-2">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition duration-300"
              style={{ color: "white", backgroundColor: "black" }} 
            >
              <option
                value="emi"
                style={{ backgroundColor: "black", color: "white" }}
              >
                Monthly EMI (Low to High)
              </option>
              <option
                value="interestRate"
                style={{ backgroundColor: "black", color: "white" }}
              >
                Interest Rate (Low to High)
              </option>
              <option
                value="totalCost"
                style={{ backgroundColor: "black", color: "white" }}
              >
                Total Cost (Low to High)
              </option>
              <option
                value="processingFee"
                style={{ backgroundColor: "black", color: "white" }}
              >
                Processing Fee (Low to High)
              </option>
            </select>
          </div>
        </div>

        {/* Transposed Comparison Table */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden mb-8 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-0 text-center">
              <thead>
                <tr className="bg-white/10 backdrop-blur-sm">
                  <th className="p-4 text-white/80 font-semibold sticky text-center border-r border-white/20 min-w-[140px]">
                    Features
                  </th>
                  {sortedSelectedLoans.map((loan, index) => (
                    <th
                      key={loan.id}
                      className={`text-center p-4 text-white/80 font-semibold min-w-[150px] ${
                        index < sortedSelectedLoans.length - 1
                          ? "border-r border-white/20"
                          : ""
                      }`}
                    >
                      {loan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Lender Row */}
                <tr className="hover:bg-white/10 transition-colors duration-300 border-b border-white/20">
                  <td className="p-4 font-semibold text-white sticky left-0 border-r border-white/20 bg-white/5">
                    Lender
                  </td>
                  {sortedSelectedLoans.map((loan, index) => (
                    <td
                      key={loan.id}
                      className={`p-4 text-center border-r border-white/20 border-b border-white/20`}
                    >
                      <div className="font-semibold text-white">
                        {loan.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        Max: {formatCurrency(loan.maxLoanAmount)}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Loan Amount Row */}
                <tr className="hover:bg-white/10 transition-colors duration-300 border-b border-white/20">
                  <td className="p-4 font-semibold text-white sticky left-0 border-r border-white/20 bg-white/5">
                    Loan Amount
                  </td>
                  {sortedSelectedLoans.map((loan, index) => (
                    <td
                      key={loan.id}
                      className={`p-4 text-center border-r border-white/20 border-b border-white/20`}
                    >
                      <div className="font-semibold text-green-400">
                        {formatCurrency(loan.principal)}
                      </div>
                    </td>
                  ))}
                </tr>
                {/* Interest Rate Row */}
                <tr className="hover:bg-white/10 transition-colors duration-300 border-b border-white/20">
                  <td className="p-4 font-semibold text-white sticky left-0 border-r border-white/20 bg-white/5">
                    Interest Rate
                  </td>
                  {sortedSelectedLoans.map((loan, index) => (
                    <td
                      key={loan.id}
                      className={`p-4 text-center border-r border-white/20 border-b border-white/20`}
                    >
                      <div className="font-semibold text-white">
                        {loan.interestRate}% p.a.
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Term Row */}
                <tr className="hover:bg-white/10 transition-colors duration-300 border-b border-white/20">
                  <td className="p-4 font-semibold text-white sticky left-0 border-r border-white/20 bg-white/5">
                    Term
                  </td>
                  {sortedSelectedLoans.map((loan, index) => (
                    <td
                      key={loan.id}
                      className={`p-4 text-center border-r border-white/20 border-b border-white/20`}
                    >
                      <div className="text-white">{loan.termYears} years</div>
                    </td>
                  ))}
                </tr>

                {/* Monthly EMI Row */}
                <tr className="hover:bg-white/10 transition-colors duration-300 border-b border-white/20">
                  <td className="p-4 font-semibold text-white sticky left-0 border-r border-white/20 bg-white/5">
                    Monthly EMI
                  </td>
                  {sortedSelectedLoans.map((loan, index) => {
                    const emi = calculateEMI(
                      loan.principal,
                      loan.interestRate,
                      loan.termYears
                    );
                    return (
                      <td
                        key={loan.id}
                        className={`p-4 text-center border-r border-white/20 border-b border-white/20`}
                      >
                        <div className="font-bold text-[#4f46e5] text-lg">
                          {formatCurrency(emi)}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Total Interest Row */}
                <tr className="hover:bg-white/10 transition-colors duration-300 border-b border-white/20">
                  <td className="p-4 font-semibold text-white sticky left-0 border-r border-white/20 bg-white/5">
                    Total Interest
                  </td>
                  {sortedSelectedLoans.map((loan, index) => {
                    const emi = calculateEMI(
                      loan.principal,
                      loan.interestRate,
                      loan.termYears
                    );
                    const totalInterest = calculateTotalInterest(
                      loan.principal,
                      emi,
                      loan.termYears
                    );
                    return (
                      <td
                        key={loan.id}
                        className={`p-4 text-center border-r border-white/20 border-b border-white/20`}
                      >
                        <div className="font-semibold text-white">
                          {formatCurrency(totalInterest)}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Processing Fee Row */}
                <tr className="hover:bg-white/10 transition-colors duration-300 border-b border-white/20">
                  <td className="p-4 font-semibold text-white sticky left-0 border-r border-white/20 bg-white/5">
                    Processing Fee
                  </td>
                  {sortedSelectedLoans.map((loan, index) => {
                    const processingFee = calculateProcessingFee(
                      loan.principal,
                      loan.processingFee
                    );
                    return (
                      <td
                        key={loan.id}
                        className={`p-4 text-center border-r border-white/20 border-b border-white/20`}
                      >
                        <div className="text-orange-400">
                          {formatCurrency(processingFee)}
                        </div>
                        <div className="text-xs text-gray-400">
                          ({loan.processingFee}%)
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Total Cost Row */}
                <tr className="hover:bg-white/10 transition-colors duration-300 border-b border-white/20">
                  <td className="p-4 font-semibold text-white sticky left-0 border-r border-white/20 bg-white/5">
                    Total Cost
                  </td>
                  {sortedSelectedLoans.map((loan, index) => {
                    const emi = calculateEMI(
                      loan.principal,
                      loan.interestRate,
                      loan.termYears
                    );
                    const totalInterest = calculateTotalInterest(
                      loan.principal,
                      emi,
                      loan.termYears
                    );
                    const processingFee = calculateProcessingFee(
                      loan.principal,
                      loan.processingFee
                    );
                    const totalCost = calculateTotalCost(
                      loan.principal,
                      totalInterest,
                      processingFee
                    );
                    return (
                      <td
                        key={loan.id}
                        className={`p-4 text-center border-r border-white/20 border-b border-white/20`}
                      >
                        <div className="font-bold text-white text-lg">
                          {formatCurrency(totalCost)}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Credit Score Row */}
                <tr className="hover:bg-white/10 transition-colors duration-300 border-b border-white/20">
                  <td className="p-4 font-semibold text-white sticky left-0 border-r border-white/20 bg-white/5">
                    Credit Score
                  </td>
                  {sortedSelectedLoans.map((loan, index) => (
                    <td
                      key={loan.id}
                      className={`p-4 text-center border-r border-white/20 border-b border-white/20`}
                    >
                      <div className="text-gray-300">
                        <span className="text-white">
                          {loan.creditScoreMin}+
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Approval Time Row */}
                <tr className="hover:bg-white/10 transition-colors duration-300">
                  <td className="p-4 font-semibold text-white sticky left-0 border-r border-white/20 bg-white/5">
                    Approval Time
                  </td>
                  {sortedSelectedLoans.map((loan, index) => (
                    <td
                      key={loan.id}
                      className={`p-4 text-center border-r border-white/20`}
                    >
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
            value={formatCurrency(
              calculateEMI(
                recommendations.bestEMI.principal,
                recommendations.bestEMI.interestRate,
                recommendations.bestEMI.termYears
              )
            )}
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
