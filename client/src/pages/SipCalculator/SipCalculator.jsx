import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Maximize, Minimize } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SipCalculator = () => {
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth < 768;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current
        ?.requestFullscreen?.()
        .then(() => setIsFullscreen(true))
        .catch((err) => console.error("Error entering fullscreen:", err));
    } else {
      document
        .exitFullscreen?.()
        .then(() => setIsFullscreen(false))
        .catch((err) => console.error("Error exiting fullscreen:", err));
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const [activeSection, setActiveSection] = useState("calculator");
  const [activeCalculator, setActiveCalculator] = useState("sip");

  // --- Staged State (Inputs read/write these immediately) ---
  const [sipAmountStaged, setSipAmountStaged] = useState(5000);
  const [sipRateStaged, setSipRateStaged] = useState(12);
  const [sipDurationStaged, setSipDurationStaged] = useState(5);

  const [loanAmountStaged, setLoanAmountStaged] = useState(500000);
  const [loanRateStaged, setLoanRateStaged] = useState(8.5);
  const [loanDurationStaged, setLoanDurationStaged] = useState(5);

  // --- Live State (Calculations use these, updated only on "Calculate") ---
  const [sipAmount, setSipAmountLive] = useState(5000);
  const [sipRate, setSipRateLive] = useState(12);
  const [sipDuration, setSipDurationLive] = useState(5);

  const [loanAmount, setLoanAmountLive] = useState(500000);
  const [loanRate, setLoanRateLive] = useState(8.5);
  const [loanDuration, setLoanDurationLive] = useState(5);

  const [sipResults, setSipResults] = useState([]);
  const [loanResults, setLoanResults] = useState([]);
  const [combinedChartData, setCombinedChartData] = useState(null);
  const [sipFutureValue, setSipFutureValue] = useState(0);
  const [loanEmi, setLoanEmi] = useState(0);
  const [totalLoanInterest, setTotalLoanInterest] = useState(0);

  // --- Calculation Functions using LIVE state parameters ---
  const calculateSip = (sipAmount, sipRate, sipDuration) => {
    const monthlyRate = sipRate / 12 / 100;
    const months = sipDuration * 12;
    const results = [];
    let futureValue = 0;

    for (let i = 1; i <= months; i++) {
      futureValue = (futureValue + sipAmount) * (1 + monthlyRate);

      if (i % 12 === 0 || i === months) {
        results.push({
          year: Math.ceil(i / 12),
          month: i,
          amount: futureValue,
          invested: sipAmount * i,
        });
      }
    }

    setSipResults(results);
    setSipFutureValue(futureValue);
  };

  const calculateLoan = (loanAmount, loanRate, loanDuration) => {
    const monthlyRate = loanRate / 12 / 100;
    const months = loanDuration * 12;

    let emi;

    if (loanRate === 0) {
      emi = loanAmount / months;
    } else {
      emi =
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
    }

    let balance = loanAmount;
    const results = [];
    let totalInterest = 0;

    for (let i = 1; i <= months; i++) {
      const interest = balance * monthlyRate;
      const principal = emi - interest;
      balance -= principal;
      totalInterest += interest;

      if (i % 12 === 0 || i === months) {
        results.push({
          month: i,
          emi,
          principal,
          interest,
          balance: balance > 0 ? balance : 0,
        });
      }
    }

    setLoanResults(results);
    setLoanEmi(emi);
    setTotalLoanInterest(totalInterest);
  };

  const createCombinedChart = (
    sipAmount,
    sipRate,
    sipDuration,
    loanAmount,
    loanRate,
    loanDuration
  ) => {
    //max for both
    const maxDuration = Math.max(sipDuration, loanDuration);
    const chartLabels = [];
    const sipInvestedData = [];
    const sipFutureValueData = [];
    const loanBalanceData = [];
    const loanInterestData = [];

    const sipMonthlyRate = sipRate / 12 / 100;
    const sipMonths = maxDuration * 12;
    let sipValue = 0;

    // Calculate Loan data
    const loanMonthlyRate = loanRate / 12 / 100;
    const loanMonths = maxDuration * 12;
    // Handle loanRate=0 case for emi calculation
    const emi =
      loanRate === 0
        ? loanAmount / loanMonths
        : (loanAmount *
            loanMonthlyRate *
            Math.pow(1 + loanMonthlyRate, loanMonths)) /
          (Math.pow(1 + loanMonthlyRate, loanMonths) - 1);
    let loanBalance = loanAmount;
    let totalLoanInterestPaid = 0;

    for (let year = 1; year <= maxDuration; year++) {
      const month = year * 12;

      chartLabels.push(isMobile ? `${year}Y` : `Year ${year}`);

      // Calculate SIP Value up to this year
      for (let i = (year - 1) * 12 + 1; i <= month; i++) {
        // Only invest if within the sip duration
        const contribution = i <= sipDuration * 12 ? sipAmount : 0;
        sipValue = (sipValue + contribution) * (1 + sipMonthlyRate);
      }

      sipInvestedData.push(sipAmount * Math.min(month, sipDuration * 12));
      sipFutureValueData.push(sipValue);

      // Calculate Loan Balance/Interest up to this year
      if (loanBalance > 0 && month <= loanMonths) {
        for (let i = (year - 1) * 12 + 1; i <= month; i++) {
          const interest = loanBalance * loanMonthlyRate;
          const principal = emi - interest;
          loanBalance -= principal;
          totalLoanInterestPaid += interest;
        }
        loanBalanceData.push(loanBalance > 0 ? loanBalance : 0);
        loanInterestData.push(totalLoanInterestPaid);
      } else if (month > loanMonths) {
        // After loan is paid off
        loanBalanceData.push(0);
        loanInterestData.push(totalLoanInterestPaid);
      } else {
        // Loan not paid off yet, but balance is 0 or less due to rounding/final payment logic
        loanBalanceData.push(0);
        loanInterestData.push(emi * loanMonths - loanAmount);
      }
    }

    setCombinedChartData({
      labels: chartLabels,
      datasets: [
        {
          label: "SIP Invested Amount",
          data: sipInvestedData,
          borderColor: "#4C51BF",
          backgroundColor: "rgba(76, 81, 191, 0.2)",
          borderWidth: 3,
          fill: true,
          tension: 0.3,
          yAxisID: "y",
          hidden: true,
        },
        {
          label: "SIP Future Value",
          data: sipFutureValueData,
          borderColor: "#38B2AC",
          backgroundColor: "rgba(56, 178, 172, 0.2)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          yAxisID: "y",
        },
        {
          label: "Loan Principal Balance",
          data: loanBalanceData,
          borderColor: "#C53030",
          backgroundColor: "rgba(197, 48, 48, 0.2)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          yAxisID: "y",
        },
        {
          label: "Total Interest Paid",
          data: loanInterestData,
          borderColor: "#DD6B20",
          backgroundColor: "rgba(221, 107, 32, 0.2)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          yAxisID: "y",
          hidden: true,
        },
      ],
    });
  };

  const onCalculate = () => {
    setSipAmountLive(sipAmountStaged);
    setSipRateLive(sipRateStaged);
    setSipDurationLive(sipDurationStaged);

    setLoanAmountLive(loanAmountStaged);
    setLoanRateLive(loanRateStaged);
    setLoanDurationLive(loanDurationStaged);

    calculateSip(sipAmountStaged, sipRateStaged, sipDurationStaged);
    calculateLoan(loanAmountStaged, loanRateStaged, loanDurationStaged);
    createCombinedChart(
      sipAmountStaged,
      sipRateStaged,
      sipDurationStaged,
      loanAmountStaged,
      loanRateStaged,
      loanDurationStaged
    );
  };
  useEffect(() => {
    calculateSip(sipAmountStaged, sipRateStaged, sipDurationStaged);
    calculateLoan(loanAmountStaged, loanRateStaged, loanDurationStaged);
    createCombinedChart(
      sipAmountStaged,
      sipRateStaged,
      sipDurationStaged,
      loanAmountStaged,
      loanRateStaged,
      loanDurationStaged
    );
  }, []); 

  useEffect(() => {
    onCalculate();
  }, []); 

  const InputField = ({
    label,
    value, // This is the STAGED value
    onStagedChange, // This is the STAGED setter (e.g., setSipAmountStaged)
    prefix,
    suffix,
    min,
    max,
    step,
  }) => {
    const [localValue, setLocalValue] = useState(value);

    // Sync local state when staged state (value) changes from outside (e.g., on initial load or "Calculate" button run)
    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    // Handle change for the number input field (only updates local state)
    const handleInputChange = (newValue) => {
      setLocalValue(newValue);
    };

    // This handles blur/slider changes to immediately update the staged state
    const handleStagedChange = (newValue) => {
      // Use onStagedChange immediately (no debounce)
      onStagedChange(newValue);
    };

    // Handle range slider change (updates local state AND staged state immediately)
    const handleRangeChange = (e) => {
      const val = Number(e.target.value);
      setLocalValue(val);
      handleStagedChange(val); // Slider updates staged state immediately (Requirement 4)
    };

    return (
      <div className="mb-6">
        <label className="block text-sm font-bold text-white mb-2">{label}</label>
        <div className="flex items-center bg-gray-800 rounded-lg border-2 border-gray-600 focus-within:border-white focus-within:ring-2 focus-within:ring-gray-600 transition-all duration-200">
          {prefix && <span className="ml-3 text-white font-bold">{prefix}</span>}
          <input
            type="number"
            value={localValue}
            onChange={(e) => handleInputChange(Number(e.target.value))}
            onBlur={(e) => handleStagedChange(Number(e.target.value))} // Text input blur updates staged state
            min={min}
            max={max}
            step={step}
            className="flex-1 py-3 px-3 bg-transparent outline-none font-bold text-white w-full"
          />
          {suffix && <span className="mr-3 text-white font-bold">{suffix}</span>}
        </div>
        <div className="mt-3">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={localValue}
            onChange={handleRangeChange} // Range slider updates staged state immediately
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          />
          <div className="flex justify-between text-xs font-medium text-gray-300 mt-1">
            <span>
              {min}
              {suffix}
            </span>
            <span>
              {max}
              {suffix}
            </span>
          </div>
        </div>
      </div>
    );
  };
  // --- END InputField Component ---

  // ... (SummaryCard, MainNav, CalculatorNav components are unchanged)
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: isMobile ? "bottom" : "top",
        labels: {
          color: "#ffffff",
          font: {
            size: isMobile ? 10 : 12,
            weight: "bold",
          },
          padding: isMobile ? 10 : 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(255,255,255,0.9)",
        titleColor: "#000000",
        bodyColor: "#000000",
        borderColor: "#ffffff",
        borderWidth: 1,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value = `₹${context.raw.toLocaleString("en-IN")}`;
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        beginAtZero: true,
        grid: {
          color: "rgba(255,255,255,0.1)",
        },
        ticks: {
          color: "#ffffff",
          font: {
            weight: "bold",
          },
          callback: (value) => `₹${value.toLocaleString("en-IN")}`,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#ffffff",
          font: {
            weight: "bold",
          },
        },
      },
    },
    elements: {
      point: {
        radius: isMobile ? 3 : 4,
        hoverRadius: isMobile ? 5 : 6,
      },
    },
  };

  const MainNav = () => (
    <nav className="flex overflow-x-auto py-2 mb-4 scrollbar-hide sticky top-0  z-10">
      <button
        onClick={() => setActiveSection("calculator")}
        className={`px-4 py-2 mx-1 rounded-full whitespace-nowrap font-medium text-sm sm:text-base ${
          activeSection === "calculator"
            ? "bg-white text-black shadow-md"
            : "bg-gray-800 text-white hover:bg-gray-700"
        }`}
      >
        Calculator
      </button>
      <button
        onClick={() => setActiveSection("sip-table")}
        className={`px-4 py-2 mx-1 rounded-full whitespace-nowrap font-medium text-sm sm:text-base ${
          activeSection === "sip-table"
            ? "bg-white text-black shadow-md"
            : "bg-gray-800 text-white hover:bg-gray-700"
        }`}
      >
        SIP Projection
      </button>
      <button
        onClick={() => setActiveSection("loan-table")}
        className={`px-4 py-2 mx-1 rounded-full whitespace-nowrap font-medium text-sm sm:text-base ${
          activeSection === "loan-table"
            ? "bg-white text-black shadow-md"
            : "bg-gray-800 text-white hover:bg-gray-700"
        }`}
      >
        Loan Amortization
      </button>
    </nav>
  );

  const CalculatorNav = () => (
    <div className="flex mb-4 rounded-lg overflow-hidden shadow-sm border border-gray-600">
      <button
        onClick={() => setActiveCalculator("sip")}
        className={`flex-1 py-3 font-bold text-sm sm:text-base transition-colors ${
          activeCalculator === "sip"
            ? "bg-white text-black"
            : "bg-gray-800 text-white hover:bg-gray-700"
        }`}
      >
        SIP Calculator
      </button>
      <button
        onClick={() => setActiveCalculator("loan")}
        className={`flex-1 py-3 font-bold text-sm sm:text-base transition-colors ${
          activeCalculator === "loan"
            ? "bg-white text-black"
            : "bg-gray-800 text-white hover:bg-gray-700"
        }`}
      >
        Loan Calculator
      </button>
    </div>
  );

  const SummaryCard = ({ title, value, variant = "primary" }) => {
    const cardStyles =
      variant === "secondary"
        ? "bg-gray-800 border-gray-600 text-gray-300"
        : "bg-gray-900 border-gray-500 text-white";

    return (
      <div className={`${cardStyles} p-4 rounded-lg border shadow-sm`}>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
        <p className="text-sm sm:text-xl font-extrabold mt-1">{value}</p>
      </div>
    );
  };

  const CalculatorView = () => (
    <div className=" p-4 rounded-lg shadow-lg border border-gray-800">
      {isMobile && <CalculatorNav />}

      <div className={isMobile ? "" : "flex gap-6"}>
        {/* SIP Calculator */}
        <div
          className={` rounded-lg w-full lg:w-1/2 ${
            !isMobile || activeCalculator === "sip" ? "block" : "hidden"
          }`}
        >
          <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center text-white">
            <span className="w-3 h-3 bg-white rounded-full mr-2"></span>
            SIP Calculator
          </h2>

          <div className={isMobile ? "" : "grid grid-cols-3 gap-4"}>
            <InputField
              label="Monthly Investment"
              value={sipAmountStaged}
              onStagedChange={setSipAmountStaged}
              prefix="₹"
              min={1000}
              max={100000}
              step={1000}
            />
            <InputField
              label="Expected Return"
              value={sipRateStaged}
              onStagedChange={setSipRateStaged}
              suffix="%"
              min={1}
              max={30}
              step={0.5}
            />
            <InputField
              label="Time Period"
              value={sipDurationStaged}
              onStagedChange={setSipDurationStaged}
              suffix="years"
              min={1}
              max={30}
              step={1}
            />
          </div>

          <div
            className={
              isMobile ? "grid grid-cols-2 gap-3 mt-4" : "flex gap-4 mt-6 justify-center"
            }
          >
            <SummaryCard
              title="Total Invested"
              value={`₹${(sipAmount * sipDuration * 12).toLocaleString(
                "en-IN",
                {
                  maximumFractionDigits: 0,
                }
              )}`}
            />

            <SummaryCard
              title="Est. Returns"
              // Use live state for calculation summary
              value={`₹${(
                sipFutureValue -
                sipAmount * sipDuration * 12
              ).toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}`}
              variant="secondary"
            />
            {!isMobile && (
              <SummaryCard
                title="Future Value"
                value={`₹${sipFutureValue.toLocaleString("en-IN", {
                  maximumFractionDigits: 0,
                })}`}
              />
            )}
          </div>
        </div>

        {/* Loan Calculator */}
        <div
          className={` rounded-lg w-full lg:w-1/2 ${
            isMobile
              ? activeCalculator === "loan"
                ? "block"
                : "hidden"
              : "block"
          }`}
        >
          <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center text-white">
            <span className="w-3 h-3 bg-white rounded-full mr-2"></span>
            Loan Calculator
          </h2>

          <div className={isMobile ? "" : "grid grid-cols-3 gap-4"}>
            <InputField
              label="Loan Amount"
              value={loanAmountStaged}
              onStagedChange={setLoanAmountStaged}
              prefix="₹"
              min={100000}
              max={10000000}
              step={10000}
            />
            <InputField
              label="Interest Rate"
              value={loanRateStaged}
              onStagedChange={setLoanRateStaged}
              suffix="%"
              min={5}
              max={20}
              step={0.1}
            />
            <InputField
              label="Loan Tenure"
              value={loanDurationStaged}
              onStagedChange={setLoanDurationStaged}
              suffix="years"
              min={1}
              max={30}
              step={1}
            />
          </div>

          {/* Calculate button for mobile/loan-only view */}
          {isMobile && activeCalculator === "loan" && (
            <div className="mt-6">
              <button
                onClick={onCalculate}
                className="bg-green-500 hover:bg-green-600 text-white font-extrabold py-3 px-6 rounded-lg transition duration-200 ease-in-out shadow-lg transform hover:scale-[1.02] active:scale-[0.98] mt-2 mb-4 w-full"
              >
                Calculate Results
              </button>
            </div>
          )}

          <div
            className={
              isMobile ? "grid grid-cols-2 gap-3 mt-4" : "flex gap-4 mt-6 justify-center"
            }
          >
            <SummaryCard
              title="Monthly EMI"
              value={`₹${loanEmi.toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}`}
            />
            <SummaryCard
              title="Total Interest"
              value={`₹${totalLoanInterest.toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}`}
              variant="secondary"
            />
            {!isMobile && (
              <SummaryCard
                title="Total Payment"
                value={`₹${(loanAmount + totalLoanInterest).toLocaleString(
                  "en-IN",
                  {
                    maximumFractionDigits: 0,
                  }
                )}`}
              />
            )}
          </div>
        </div>
      </div>

          <div className="mt-6">
            {/* Calculate Button (Requirement 5) */}
            <button
              onClick={onCalculate}
              className="bg-blue-500 hover:bg-green-600 text-white font-extrabold p-3 rounded-lg transition duration-200 ease-in-out shadow-lg transform hover:scale-[1.02] active:scale-[0.98] mt-2 mb-4 ml-[390px] w-[30%]"
            >
              Calculate Results
            </button>
          </div>
      {/* Combined Chart */}
      {combinedChartData && (
        <div className="mt-8">
          <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center text-white">
            <span className="w-3 h-3 bg-white rounded-full mr-2"></span>
            Financial Overview
          </h2>
          <div
            className="bg-gradient-to-br from-gray-900 to-black p-4 rounded-xl border border-white shadow-lg"
            style={{ height: isMobile ? "350px" : "450px" }}
          >
            <Line data={combinedChartData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );

  const TablesView = () => (
    <div className=" p-4 rounded-lg shadow-lg border border-gray-800 w-full overflow-hidden">
      {activeSection === "sip-table" && (
        <div className="w-full overflow-x-auto">
          <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center text-white">
            <span className="w-3 h-3 bg-white rounded-full mr-2"></span>
            SIP Projection
          </h2>
          <div className="min-w-full" style={{ minWidth: "600px" }}>
            <table className="w-full divide-y divide-gray-600">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    Invested
                  </th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    Returns
                  </th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    Total Value
                  </th>
                </tr>
              </thead>
              <tbody className=" divide-y divide-gray-700">
                {sipResults.map((result, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "" : "bg-gray-900"}
                  >
                    <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-white">
                      {result.year}
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-300">
                      ₹{(sipAmount * result.month).toLocaleString("en-IN")}
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-400">
                      ₹
                      {(
                        result.amount -
                        sipAmount * result.month
                      ).toLocaleString("en-IN")}
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-white">
                      ₹{result.amount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSection === "loan-table" && (
        <div className="w-full overflow-x-auto">
          <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center text-white">
            <span className="w-3 h-3 bg-white rounded-full mr-2"></span>
            Loan Amortization
          </h2>
          <div className="min-w-full" style={{ minWidth: "600px" }}>
            <table className="w-full divide-y divide-gray-600">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    Principal
                  </th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    Interest
                  </th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody className=" divide-y divide-gray-700">
                {loanResults.map((result, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "" : "bg-gray-900"}
                  >
                    <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-white">
                      {Math.ceil(result.month / 12)}
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-300">
                      ₹{result.principal.toLocaleString("en-IN")}
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-400">
                      ₹{result.interest.toLocaleString("en-IN")}
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-white">
                      ₹{result.balance.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={`min-h-screen pt-[100px] md:pt-[100px] sm:py-8 px-2 sm:px-4 bg-black${
        isFullscreen ? "fixed inset-0 z-50 overflow-auto" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto relative">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Financial Planning Calculator
          </h1>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-600"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize className="w-5 h-5 text-white" />
            ) : (
              <Maximize className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        <MainNav />

        <div className="w-full">
          {activeSection === "calculator" ? <CalculatorView /> : <TablesView />}
        </div>

        <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-400">
          <p className="font-medium">
            Note: Calculations are estimates only. Actual returns may vary.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SipCalculator;