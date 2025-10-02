import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Upload,
  ChevronDown,
  X,
  Building2,
  TrendingUp,
  Calendar,
  DollarSign,
} from "lucide-react";
import ViewDetails from "./ViewDetails";

const BankRecommendation = () => {
  const [filters, setFilters] = useState({
    bankType: "",
    loanType: "",
    minLoanAmount: "",
    maxLoanAmount: "",
    interestRateType: "",
    minInterestRate: "",
    maxInterestRate: "",
    maxTenure: "",
    minIncomeRequired: "",
    minCibilScore: "",
    minAge: "",
    maxAge: "",
    minTurnover: "",
    employmentType: [],
  });

  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    sortBy: "bankName",
    sortDirection: "ASC",
  });

  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
   const [selectedBank, setSelectedBank] = useState(null);

  const bankTypes = ["PUBLIC", "PRIVATE", "NBFC"];
  const loanTypes = [
    "HOME_LOAN",
    "LOAN_AGAINST_PROPERTY",
    "BALANCE_TRANSFER_TOP_UP",
    "PLOT_LOAN",
    "CONSTRUCTION_LOAN",
  ];
  const interestRateTypes = ["REDUCING", "FLOATING"];

  const employmentTypes = ["SALARIED", "SELF_EMPLOYED"];

  const fieldInstructions = {
  bank_name: "Bank Name is required. Please add a 'bank_name' column in your file.",
  bank_type: "Bank Type is required. Use 'PRIVATE', 'PUBLIC', or 'NBFC'.",
  loan_type: "Loan Type is required. Add a 'loan_type' column (e.g., HOME_LOAN).",
  min_loan_amount: "Minimum loan amount is required.",
  max_loan_amount: "Maximum loan amount is required.",
  interest_rate_type: "Interest Rate Type is required. Use 'REDUCING' or 'FLOATING'.",
  min_interest_rate: "Minimum interest rate is required.",
  max_interest_rate: "Maximum interest rate is required.",
  max_tenure: "Maximum tenure (in months) is required.",
  min_income_required: "Minimum income required is missing.",
  min_cibil_score: "Minimum CIBIL score is missing.",
  min_age: "Minimum age is missing.",
  max_age: "Maximum age is missing.",
  min_turnover: "Minimum turnover is required for businesses.",
  employment_types_allowed: "Employment Type is required. Include at least one type (SALARIED, SELF_EMPLOYED, PROFESSIONAL).",
};


  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEmploymentTypeToggle = (type) => {
    setFilters((prev) => ({
      ...prev,
      employmentType: prev.employmentType.includes(type)
        ? prev.employmentType.filter((t) => t !== type)
        : [...prev.employmentType, type],
    }));
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const requestBody = {
        bankType: filters.bankType || null,
        loanType: filters.loanType || null,
        minLoanAmount: filters.minLoanAmount
          ? parseFloat(filters.minLoanAmount)
          : null,
        maxLoanAmount: filters.maxLoanAmount
          ? parseFloat(filters.maxLoanAmount)
          : null,
        interestRateType: filters.interestRateType || null,
        minInterestRate: filters.minInterestRate
          ? parseFloat(filters.minInterestRate)
          : null,
        maxInterestRate: filters.maxInterestRate
          ? parseFloat(filters.maxInterestRate)
          : null,
        maxTenure: filters.maxTenure ? parseInt(filters.maxTenure) : null,
        minIncomeRequired: filters.minIncomeRequired
          ? parseFloat(filters.minIncomeRequired)
          : null,
        minCibilScore: filters.minCibilScore
          ? parseInt(filters.minCibilScore)
          : null,
        minAge: filters.minAge ? parseInt(filters.minAge) : null,
        maxAge: filters.maxAge ? parseInt(filters.maxAge) : null,
        minTurnover: filters.minTurnover
          ? parseFloat(filters.minTurnover)
          : null,
        employmentType:
          filters.employmentType && filters.employmentType.length > 0
            ? filters.employmentType
            : null,
        page: pagination.page,
        size: pagination.size,
        sortBy: pagination.sortBy,
        sortDirection: pagination.sortDirection,
      };

      Object.keys(requestBody).forEach(
        (key) =>
          (requestBody[key] === null || requestBody[key] === "") &&
          delete requestBody[key]
      );

      const token = localStorage.getItem("auth_token");

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/banks/search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      setBanks(data);
    } catch (error) {
      console.error("Error fetching banks:", error);
      alert("Failed to fetch banks. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

 const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setUploadFile(file);
  setLoading(true);

  const formData = new FormData();
  formData.append("file", file);

  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/banks/upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      let message = "File upload failed.";
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.message) {
          const missingFieldMatch = errorJson.message.match(
            /Missing required field: (\w+)/
          );
          if (missingFieldMatch) {
            const field = missingFieldMatch[1];
            message =
              fieldInstructions[field] || `Please check the field: ${field}`;
          } else {
            message = errorJson.message;
          }
        }
      } catch {
        message = errorText;
      }

      alert(message);
      return;
    }

    const result = await response.text(); 
    alert(`File uploaded successfully! ${result}`);

    // refres
    handleSearch();
  } catch (error) {
    console.error("Error uploading file:", error);
    alert("An unexpected error occurred while uploading the file.");
  } finally {
    setLoading(false);
  }
};


  const clearFilters = () => {
    setFilters({
      bankType: "",
      loanType: "",
      minLoanAmount: "",
      maxLoanAmount: "",
      interestRateType: "",
      minInterestRate: "",
      maxInterestRate: "",
      maxTenure: "",
      minIncomeRequired: "",
      minCibilScore: "",
      minAge: "",
      maxAge: "",
      minTurnover: "",
      employmentType: [],
    });
  };

  useEffect(() => {
    handleSearch();
  }, [pagination]);

  return (
    <div className="pt-20 min-h-screen bg-black p-6 text-white">
      <div className="mt-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg p-6 mb-6 transition hover:shadow-2xl hover:backdrop-brightness-125">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Bank Recommendation
              </h1>
              <p className="text-gray-300 mt-1">Find the best loan offers</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 hover:text-gray-900 transition">
                  <Upload size={20} />
                  <span>Upload Excel</span>
                </div>
              </label>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 hover:text-gray-900 transition"
              >
                <Filter size={20} />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { icon: Building2, value: banks.length, label: "Banks Found" },
              { icon: TrendingUp, value: "8.5%", label: "Best Rate" },
              { icon: Calendar, value: "30Y", label: "Max Tenure" },
              { icon: DollarSign, value: "₹1Cr", label: "Max Amount" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-lg transition hover:shadow-lg hover:backdrop-brightness-125"
              >
                <stat.icon className="text-white mb-2" size={24} />
                <div className="text-2xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter */}
        {showFilters && (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg p-4 sm:p-6 mb-6 transition hover:shadow-2xl hover:backdrop-brightness-125">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
              <h2 className="text-lg sm:text-xl font-semibold text-white">
                Search Filters
              </h2>
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-red-500 hover:text-red-400"
              >
                <X size={16} />
                Clear All
              </button>
            </div>

            {/* form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Bank Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Bank Type
                </label>
                <select
                  value={filters.bankType}
                  onChange={(e) =>
                    handleFilterChange("bankType", e.target.value)
                  }
                  className="w-full px-3 sm:px-4 py-2 border border-white/20 rounded-lg bg-black/30 text-white backdrop-blur-sm focus:ring-2 focus:ring-white focus:border-transparent transition hover:backdrop-brightness-125 appearance-none text-sm sm:text-base"
                >
                  <option value="" className="bg-black/30 text-white">
                    All Types
                  </option>
                  {bankTypes.map((type) => (
                    <option
                      key={type}
                      value={type}
                      className="bg-black/40 text-white"
                    >
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Loan Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Loan Type
                </label>
                <select
                  value={filters.loanType}
                  onChange={(e) =>
                    handleFilterChange("loanType", e.target.value)
                  }
                  className="w-full px-3 sm:px-4 py-2 border border-white/20 rounded-lg bg-black/30 text-white backdrop-blur-sm focus:ring-2 focus:ring-white focus:border-transparent transition hover:backdrop-brightness-125 appearance-none text-sm sm:text-base"
                >
                  <option value="">All Loans</option>
                  {loanTypes.map((type) => (
                    <option
                      key={type}
                      value={type}
                      className="bg-black/40 text-white"
                    >
                      {type
                        .toLowerCase()
                        .split("_")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Interest Rate Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Interest Rate Type
                </label>
                <select
                  value={filters.interestRateType}
                  onChange={(e) =>
                    handleFilterChange("interestRateType", e.target.value)
                  }
                  className="w-full px-3 sm:px-4 py-2 border border-white/20 rounded-lg bg-black/30 text-white backdrop-blur-sm focus:ring-2 focus:ring-white focus:border-transparent transition hover:backdrop-brightness-125 appearance-none text-sm sm:text-base"
                >
                  <option value="">All Types</option>
                  {interestRateTypes.map((type) => (
                    <option
                      key={type}
                      value={type}
                      className="bg-black/40 text-white"
                    >
                      {type.charAt(0) + type.slice(1).toLowerCase()}{" "}
                  
                    </option>
                  ))}
                </select>
              </div>

              {/*unputs */}
              {[
                {
                  label: "Min Loan Amount (₹)",
                  key: "minLoanAmount",
                  placeholder: "e.g., 100000",
                },
                {
                  label: "Max Loan Amount (₹)",
                  key: "maxLoanAmount",
                  placeholder: "e.g., 5000000",
                },
                {
                  label: "Min Interest Rate (%)",
                  key: "minInterestRate",
                  placeholder: "e.g., 8.0",
                },
                {
                  label: "Max Interest Rate (%)",
                  key: "maxInterestRate",
                  placeholder: "e.g., 12.0",
                },
                {
                  label: "Max Tenure (months)",
                  key: "maxTenure",
                  placeholder: "e.g., 240",
                },
                {
                  label: "Min Income Required (₹)",
                  key: "minIncomeRequired",
                  placeholder: "e.g., 50000",
                },
                {
                  label: "Min CIBIL Score",
                  key: "minCibilScore",
                  placeholder: "e.g., 700",
                },
                { label: "Min Age", key: "minAge", placeholder: "e.g., 21" },
                { label: "Max Age", key: "maxAge", placeholder: "e.g., 65" },
                {
                  label: "Min Turnover (₹)",
                  key: "minTurnover",
                  placeholder: "e.g., 1000000",
                },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                    {field.label}
                  </label>
                  <input
                    type={
                      field.key.includes("InterestRate") ? "number" : "text"
                    }
                    step={
                      field.key.includes("InterestRate") ? "0.1" : undefined
                    }
                    value={filters[field.key]}
                    onChange={(e) =>
                      handleFilterChange(field.key, e.target.value)
                    }
                    placeholder={field.placeholder}
                    className="w-full px-3 sm:px-4 py-2 border border-white/20 rounded-lg bg-white/10 text-white backdrop-blur-sm focus:ring-2 focus:ring-white focus:border-transparent transition hover:backdrop-brightness-125 text-sm sm:text-base"
                  />
                </div>
              ))}

              {/* Employment Type */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Employment Type
                </label>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {employmentTypes.map((type) => (
                    <option
                      key={type}
                      onClick={() => handleEmploymentTypeToggle(type)}
                      className={`px-3 sm:px-4 py-2 rounded-lg border-2 text-sm sm:text-base transition ${
                        filters.employmentType.includes(type)
                          ? "bg-white text-gray-900 border-white"
                          : "bg-white/10 text-white border-white/20 hover:border-white hover:backdrop-brightness-125"
                      }`}
                    >
                      {type
                        .toLowerCase()
                        .split("_")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </option>
                  ))}
                </div>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-6">
              <button
                onClick={handleSearch}
                className="flex-1 bg-white/20 backdrop-blur-sm text-white py-3 rounded-lg hover:bg-white/30 hover:text-gray-900 transition font-medium text-sm sm:text-base"
              >
                Search Banks
              </button>
            </div>
          </div>
        )}

        {/* Result */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg p-6 transition hover:shadow-2xl hover:backdrop-brightness-125">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl font-semibold text-white">
              Recommended Banks ({banks.length})
            </h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2 ">
                <label className="text-sm text-gray-300">Sort by:</label>
                <select
                  value={pagination.sortBy}
                  onChange={(e) =>
                    setPagination((prev) => ({
                      ...prev,
                      sortBy: e.target.value,
                    }))
                  }
                  className="px-3 py-1 border border-white/20 rounded-lg text-sm bg-white/10 text-white backdrop-blur-sm transition hover:backdrop-brightness-125"
                >
                  <option value="bankName" className="bg-white/10 text-white">
                    Bank Name
                  </option>
                  <option value="bankType" className="bg-white/10 text-white">
                    Bank Type
                  </option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={pagination.sortDirection}
                  onChange={(e) =>
                    setPagination((prev) => ({
                      ...prev,
                      sortDirection: e.target.value,
                    }))
                  }
                  className="px-3 py-1 border border-white/20 rounded-lg text-sm bg-white/10 text-white backdrop-blur-sm transition hover:backdrop-brightness-125"
                >
                  <option value="ASC" className="bg-white/10 text-white">
                    Ascending
                  </option>
                  <option value="DESC" className="bg-white/10 text-white">
                    Descending
                  </option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="mt-4 text-gray-300">Loading banks...</p>
            </div>
          ) : banks.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="mx-auto text-gray-500 mb-4" size={48} />
              <p className="text-gray-300">
                No banks found matching your criteria
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {banks.map((bank) => (
                <div
                  key={bank.bankId}
                  className="border border-white/20 rounded-lg p-6 hover:shadow-lg hover:backdrop-brightness-125 transition"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center transition hover:backdrop-brightness-125">
                        <Building2 className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {bank.bankName}
                        </h3>
                        <p className="text-sm text-gray-300">
                          {bank.bankType} Bank
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedBank(bank)}
                      className="px-6 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 hover:text-gray-900 transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {banks.length > 0 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 pt-6 border-t border-white/20 gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-300">Show:</label>
                <select
                  value={pagination.size}
                  onChange={(e) =>
                    setPagination((prev) => ({
                      ...prev,
                      size: Number(e.target.value),
                      page: 0,
                    }))
                  }
                  className="px-3 py-1 border border-white/20 rounded-lg text-sm bg-white/10 text-white backdrop-blur-sm transition hover:backdrop-brightness-125"
                >
                  <option value={5} className="bg-white/10 text-white">
                    5
                  </option>
                  <option value={10} className="bg-white/10 text-white">
                    10
                  </option>
                  <option value={20} className="bg-white/10 text-white">
                    20
                  </option>
                  <option value={50} className="bg-white/10 text-white">
                    50
                  </option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: Math.max(0, prev.page - 1),
                    }))
                  }
                  disabled={pagination.page === 0}
                  className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white transition hover:backdrop-brightness-125"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
                  className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10 text-white transition hover:backdrop-brightness-125"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
 {selectedBank && (
        <ViewDetails 
          bank={selectedBank} 
          onClose={() => setSelectedBank(null)} 
        />
      )}
    </div>
  );
};

export default BankRecommendation;
