import React, { useState } from 'react';
import CategorySelection from './CategorySelection';
import LoanSelection from './LoanSelection';
import ComparisonTable from './ComparisonTable';
import { loanDatabase, loanCategories } from './loanData';

const CompareLoans = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showComparison, setShowComparison] = useState(false);
  const [showLoanList, setShowLoanList] = useState(false);
  const [selectedLoans, setSelectedLoans] = useState([]);
  const [sortBy, setSortBy] = useState('emi');

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowLoanList(true);
    setSelectedLoans([]);
    setShowComparison(false);
  };

  const handleLoanSelection = (loan) => {
    setSelectedLoans(prevSelected => {
      const isAlreadySelected = prevSelected.find(l => l.id === loan.id);
      if (isAlreadySelected) {
        return prevSelected.filter(l => l.id !== loan.id);
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

  const getCurrentLoans = () => {
    return loanDatabase[selectedCategory] || [];
  };

  const getCategoryDisplayName = () => {
    const category = loanCategories.find(cat => cat.key === selectedCategory);
    return category ? category.name : '';
  };

  const resetToCategories = () => {
    setShowComparison(false);
    setShowLoanList(false);
    setSelectedLoans([]);
    setSelectedCategory('');
  };

  const backToLoanSelection = () => {
    setShowComparison(false);
  };

  // Home screen - Category selection
  if (!showLoanList && !showComparison) {
    return (
      <CategorySelection 
        categories={loanCategories} 
        onCategorySelect={handleCategorySelect}
      />
    );
  }

  // Loan list screen - Individual loan selection
  if (showLoanList && !showComparison) {
    const availableLoans = getCurrentLoans();

    return (
      <LoanSelection
        selectedCategory={selectedCategory}
        availableLoans={availableLoans}
        selectedLoans={selectedLoans}
        onLoanSelect={handleLoanSelection}
        onCompare={handleCompareLoans}
        onBack={resetToCategories}
        getCategoryDisplayName={getCategoryDisplayName}
      />
    );
  }

  // Comparison screen
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
};

export default CompareLoans;