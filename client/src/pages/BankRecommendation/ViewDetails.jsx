import React, { useState, useEffect } from "react";
import {
  X,
  Building2,
  IndianRupee,
  TrendingUp,
  Calendar,
  Users,
  Briefcase,
  CreditCard,
  User,
  Clock,
  Percent,
  ChevronDown,
} from "lucide-react";

const ViewDetails = ({ bank, onClose }) => {
  const [selectedLoanType, setSelectedLoanType] = useState("");
  const [availableLoanTypes, setAvailableLoanTypes] = useState([]);
  const [bankDetails, setBankDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingLoanTypes, setLoadingLoanTypes] = useState(false);

  useEffect(() => {
    if (bank?.bankId) {
      fetchAvailableLoanTypes();
    }
  }, [bank?.bankId]);
  useEffect(() => {
  if (selectedLoanType && bank?.bankId) {
    fetchBankDetails();
  }
}, [selectedLoanType, bank?.bankId]);

  const fetchAvailableLoanTypes = async () => {
    setLoadingLoanTypes(true);
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/banks/loan-types/${bank.bankId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setAvailableLoanTypes(data);
    } catch (error) {
      console.error("Error fetching loan types:", error);
      alert("Failed to fetch available loan types. Please try again.");
    } finally {
      setLoadingLoanTypes(false);
    }
  };

  const fetchBankDetails = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/banks/policy?bankId=${bank.bankId}&loanType=${selectedLoanType}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    setBankDetails(data);
  } catch (error) {
    console.error("Error fetching bank details:", error);
    alert("Failed to fetch bank details. Please try again.");
  } finally {
    setLoading(false);
  }
};

  if (!bank) return null;

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatEmploymentTypes = (types) => {
    if (!types || types.length === 0) return "N/A";
    return types
      .map((type) =>
        type
          .toLowerCase()
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      )
      .join(", ");
  };

  const formatLoanType = (type) => {
    if (!type) return "N/A";
    return type
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

const displayBank = bankDetails 
  ? { ...bankDetails, loanType: selectedLoanType }
  : bank;

  const detailSections = [
    {
      title: "Loan Information",
      icon: Briefcase,
      items: [
        {
          label: "Loan Type",
          value: formatLoanType(displayBank.loanType),
          icon: Briefcase,
        },
        {
          label: "Min Amount",
          value: formatCurrency(displayBank.minLoanAmount),
          icon: IndianRupee,
        },
        {
          label: "Max Amount",
          value: formatCurrency(displayBank.maxLoanAmount),
          icon: IndianRupee,
        },
      ],
    },
    {
      title: "Interest Rates",
      icon: Percent,
      items: [
        {
          label: "Rate Type",
          value: displayBank.interestRateType || "N/A",
          icon: TrendingUp,
        },
        {
          label: "Min Rate",
          value: displayBank.minInterestRate
            ? `${displayBank.minInterestRate}%`
            : "N/A",
          icon: TrendingUp,
        },
        {
          label: "Max Rate",
          value: displayBank.maxInterestRate
            ? `${displayBank.maxInterestRate}%`
            : "N/A",
          icon: TrendingUp,
        },
      ],
    },
    {
      title: "Tenure & Requirements",
      icon: Calendar,
      items: [
        {
          label: "Max Tenure",
          value: displayBank.maxTenure
            ? `${displayBank.maxTenure} months`
            : "N/A",
          icon: Clock,
        },
        {
          label: "Min Income",
          value: formatCurrency(displayBank.minIncomeRequired),
          icon: IndianRupee,
        },
        {
          label: "Min CIBIL Score",
          value: displayBank.minCibilScore || "N/A",
          icon: CreditCard,
        },
      ],
    },
    {
      title: "Eligibility Criteria",
      icon: Users,
      items: [
        {
          label: "Min Age",
          value: displayBank.minAge ? `${displayBank.minAge} years` : "N/A",
          icon: User,
        },
        {
          label: "Max Age",
          value: displayBank.maxAge ? `${displayBank.maxAge} years` : "N/A",
          icon: User,
        },
        {
          label: "Min Turnover",
          value: formatCurrency(displayBank.minTurnover),
          icon: IndianRupee,
        },
        {
          label: "Employment Types",
          value: formatEmploymentTypes(displayBank.employmentTypesAllowed),
          icon: Users,
        },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#292727] backdrop-blur-md border-b border-white/20 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Building2 className="text-white" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {bank.bankName}
                </h2>
                <p className="text-gray-300 mt-1">{bank.bankType} Bank</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition"
              aria-label="Close"
            >
              <X className="text-white" size={24} />
            </button>
          </div>

          {/* Dropdown */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Loan Type
            </label>
            {loadingLoanTypes ? (
              <div className="flex items-center gap-2 px-4 py-3 border border-white/20 rounded-lg bg-black/30">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span className="text-gray-300 text-sm">Loading loan types...</span>
              </div>
            ) : (
              <div className="relative">
                <select
                  value={selectedLoanType}
                  onChange={(e) => setSelectedLoanType(e.target.value)}
                  className="w-full px-4 py-3 border border-white/20 rounded-lg bg-black/30 text-white backdrop-blur-sm focus:ring-2 focus:ring-white focus:border-transparent transition hover:backdrop-brightness-125 appearance-none cursor-pointer"
                  disabled={availableLoanTypes.length === 0}
                >
                  <option value="" className="bg-black/40 text-white">
                    {availableLoanTypes.length === 0 
                      ? "No loan types available" 
                      : "Select a loan type"}
                  </option>
                  {availableLoanTypes.map((type) => (
                    <option
                      key={type}
                      value={type}
                      className="bg-black/40 text-white"
                    >
                      {formatLoanType(type)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white pointer-events-none"
                  size={20}
                />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 pb-36 max-h-[calc(90vh-200px)]">
          {!selectedLoanType ? (
            <div className="text-center py-12">
              <p className="text-gray-300">
                Please select a loan type to view details
              </p>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="mt-4 text-gray-300">Loading details...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {detailSections.map((section, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <section.icon className="text-white" size={24} />
                    <h3 className="text-lg font-semibold text-white">
                      {section.title}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="flex items-start gap-3 p-4 bg-black/20 rounded-lg"
                      >
                        <item.icon
                          className="text-gray-300 mt-1 flex-shrink-0"
                          size={20}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-400">{item.label}</p>
                          <p className="text-base font-medium text-white mt-1 break-words">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Key Highlights */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Key Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-black/20 rounded-lg">
                    <TrendingUp
                      className="mx-auto text-green-400 mb-2"
                      size={28}
                    />
                    <p className="text-2xl font-bold text-white">
                      {displayBank.minInterestRate
                        ? `${displayBank.minInterestRate}%`
                        : "N/A"}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">Starting Rate</p>
                  </div>
                  <div className="text-center p-4 bg-black/20 rounded-lg">
                    <IndianRupee
                      className="mx-auto text-blue-400 mb-2"
                      size={28}
                    />
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(displayBank.maxLoanAmount)}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">Max Loan</p>
                  </div>
                  <div className="text-center p-4 bg-black/20 rounded-lg">
                    <Calendar
                      className="mx-auto text-purple-400 mb-2"
                      size={28}
                    />
                    <p className="text-2xl font-bold text-white">
                      {displayBank.maxTenure
                        ? `${displayBank.maxTenure}m`
                        : "N/A"}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">Max Tenure</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-center">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-[#292727] text-white rounded-lg hover:bg-white/20 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;