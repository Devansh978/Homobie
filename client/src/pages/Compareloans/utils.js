export const calculateEMI = (principal, annualRate, years) => {
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = years * 12;
  if (monthlyRate === 0) return principal / totalMonths;
  
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
              (Math.pow(1 + monthlyRate, totalMonths) - 1);
  return emi;
};

export const calculateTotalInterest = (principal, emi, years) => {
  return (emi * years * 12) - principal;
};

export const calculateProcessingFee = (principal, feePercent) => {
  return 0;
};

export const calculateTotalCost = (principal, totalInterest, processingFee) => {
  return principal + totalInterest + processingFee;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};