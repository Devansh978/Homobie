import React from "react";
import {
  X,
  Building2,
  DollarSign,
  TrendingUp,
  Calendar,
  Users,
  Briefcase,
  CreditCard,
  User,
  Clock,
  Percent,
} from "lucide-react";

const ViewDetails = ({ bank, onClose }) => {
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

  const detailSections = [
    {
      title: "Loan Information",
      icon: Briefcase,
      items: [
        {
          label: "Loan Type",
          value: formatLoanType(bank.loanType),
          icon: Briefcase,
        },
        {
          label: "Min Amount",
          value: formatCurrency(bank.minLoanAmount),
          icon: DollarSign,
        },
        {
          label: "Max Amount",
          value: formatCurrency(bank.maxLoanAmount),
          icon: DollarSign,
        },
      ],
    },
    {
      title: "Interest Rates",
      icon: Percent,
      items: [
        {
          label: "Rate Type",
          value: bank.interestRateType || "N/A",
          icon: TrendingUp,
        },
        {
          label: "Min Rate",
          value: bank.minInterestRate ? `${bank.minInterestRate}%` : "N/A",
          icon: TrendingUp,
        },
        {
          label: "Max Rate",
          value: bank.maxInterestRate ? `${bank.maxInterestRate}%` : "N/A",
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
          value: bank.maxTenure ? `${bank.maxTenure} months` : "N/A",
          icon: Clock,
        },
        {
          label: "Min Income",
          value: formatCurrency(bank.minIncomeRequired),
          icon: DollarSign,
        },
        {
          label: "Min CIBIL Score",
          value: bank.minCibilScore || "N/A",
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
          value: bank.minAge ? `${bank.minAge} years` : "N/A",
          icon: User,
        },
        {
          label: "Max Age",
          value: bank.maxAge ? `${bank.maxAge} years` : "N/A",
          icon: User,
        },
        {
          label: "Min Turnover",
          value: formatCurrency(bank.minTurnover),
          icon: DollarSign,
        },
        {
          label: "Employment Types",
          value: formatEmploymentTypes(bank.employmentTypesAllowed),
          icon: Users,
        },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/20 backdrop-blur-md border-b border-white/20 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Building2 className="text-white" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {bank.bankName}
                </h2>
                <p className="text-gray-300 mt-1">
                  {bank.bankType} Bank • {formatLoanType(bank.loanType)}
                </p>
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
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 pb-36 max-h-[calc(90vh-120px)]">
       
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
                    {bank.minInterestRate ? `${bank.minInterestRate}%` : "N/A"}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">Starting Rate</p>
                </div>
                <div className="text-center p-4 bg-black/20 rounded-lg">
                  <DollarSign
                    className="mx-auto text-blue-400 mb-2"
                    size={28}
                  />
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(bank.maxLoanAmount)}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">Max Loan</p>
                </div>
                <div className="text-center p-4 bg-black/20 rounded-lg">
                  <Calendar
                    className="mx-auto text-purple-400 mb-2"
                    size={28}
                  />
                  <p className="text-2xl font-bold text-white">
                    {bank.maxTenure ? `${bank.maxTenure}m` : "N/A"}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">Max Tenure</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/20 backdrop-blur-md border-t border-white/20 p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;
