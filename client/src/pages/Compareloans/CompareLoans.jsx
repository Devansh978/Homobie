import React, { useState, useEffect } from "react";
import CategorySelection from "./CategorySelection";
import LoanSelection from "./LoanSelection";
import ComparisonTable from "./ComparisonTable";
import { loanCategories } from "./loanData";

const CompareLoans = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showComparison, setShowComparison] = useState(false);
  const [showLoanList, setShowLoanList] = useState(false);
  const [selectedLoans, setSelectedLoans] = useState([]);
  const [sortBy, setSortBy] = useState("emi");
  const [availableLoans, setAvailableLoans] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowLoanList(true);
    setSelectedLoans([]);
    setShowComparison(false);
  };

  const handleLoanSelection = (loan) => {
    setSelectedLoans((prevSelected) => {
      const isAlreadySelected = prevSelected.find((l) => l.id === loan.id);
      if (isAlreadySelected) {
        return prevSelected.filter((l) => l.id !== loan.id);
      } else {
        return [...prevSelected, loan];
      }
    });
  };

  const handleCompareLoans = () => {
    if (selectedLoans.length >= 2) {
      setShowComparison(true);
    }
  };

  const getCategoryDisplayName = () => {
    const category = loanCategories.find((cat) => cat.key === selectedCategory);
    return category ? category.name : "";
  };

  const resetToCategories = () => {
    setShowComparison(false);
    setShowLoanList(false);
    setSelectedLoans([]);
    setSelectedCategory("");
    setAvailableLoans([]);
  };

  const backToLoanSelection = () => {
    setShowComparison(false);
  };

  useEffect(() => {
  if (!selectedCategory) return;
  const fetchLoans = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BASE_URL
        }/banks/compare?loanType=${selectedCategory}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch loans");
      const data = await response.json();
      
      // reform
       const transformedLoans = Array.isArray(data) ? data.map((loan, index) => ({
        id: `${loan.bankName}-${index}`,
        name: loan.bankName,
        bankType: loan.bankType,
        principal: loan.minLoanAmount || 0,
        maxLoanAmount: loan.maxLoanAmount,
        interestRate: loan.interestRate,
        termYears: loan.maxTenure,
        creditScoreMin: loan.minCibilScore,
        approvalTime: "N/A", 
        minIncomeRequired: loan.minIncomeRequired,
      })) : [];

      setAvailableLoans(transformedLoans);
      
    } catch (error) {
      console.error("Error fetching loans:", error);
      setAvailableLoans([]);
    } finally {
      setLoading(false);
    }
  };
  fetchLoans();
}, [selectedCategory]);

  if (!showLoanList && !showComparison) {
    return (
      <CategorySelection
        categories={loanCategories}
        onCategorySelect={handleCategorySelect}
      />
    );
  }

  if (showLoanList && !showComparison) {
    return (
      <LoanSelection
        selectedCategory={selectedCategory}
        availableLoans={availableLoans}
        selectedLoans={selectedLoans}
        onLoanSelect={handleLoanSelection}
        onCompare={handleCompareLoans}
        onBack={resetToCategories}
        getCategoryDisplayName={getCategoryDisplayName}
        loading={loading}
      />
    );
  }

  if (showComparison) {
    return (
      <ComparisonTable
        selectedLoans={selectedLoans}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onBack={backToLoanSelection}
        getCategoryDisplayName={getCategoryDisplayName}
      />
    );
  }

  return null;
};

export default CompareLoans;
