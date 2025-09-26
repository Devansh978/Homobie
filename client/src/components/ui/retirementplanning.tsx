// cspell:ignore chartjs
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
  ChartOptions,
  ChartData,
} from "chart.js";

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

// Fullscreen icons as SVG components
const FullscreenIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
  </svg>
);

const FullscreenExitIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
  </svg>
);

interface Projection {
  age: number;
  contribution: number;
  interest: number;
  total: number;
}

const RetirementPlanner = () => {
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth < 768;

  // Input states
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState(100000);
  const [monthlyContribution, setMonthlyContribution] = useState(2000);
  const [annualReturn, setAnnualReturn] = useState(7);
  const [desiredCorpus, setDesiredCorpus] = useState(2000000);
  const [activeTab, setActiveTab] = useState("calculator");

  // Track window size changes
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fullscreen toggle
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

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Results
  const [projections, setProjections] = useState<Projection[]>([]);
  const [chartData, setChartData] = useState<ChartData<"line"> | null>(null);
  const [goalMet, setGoalMet] = useState(false);
  const [shortfall, setShortfall] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Calculate projections
  useEffect(() => {
    calculateProjections();
  }, [
    currentAge,
    retirementAge,
    currentSavings,
    monthlyContribution,
    annualReturn,
    desiredCorpus,
  ]);

  const calculateProjections = () => {
    const years = retirementAge - currentAge;
    const monthlyRate = annualReturn / 12 / 100;
    const months = years * 12;

    let totalSavings = currentSavings;
    const results = [];
    const labels = [];
    const savingsData = [];

    for (let year = 0; year <= years; year++) {
      const age = currentAge + year;
      let yearlyContribution = 0;
      let yearlyInterest = 0;

      // Calculate monthly for more accuracy
      for (let month = 1; month <= 12; month++) {
        if (year === 0 && month === 1) continue;

        const interest = totalSavings * monthlyRate;
        yearlyInterest += interest;
        totalSavings += interest + monthlyContribution;
        yearlyContribution += monthlyContribution;
      }

      results.push({
        age,
        contribution: yearlyContribution,
        interest: yearlyInterest,
        total: totalSavings,
      });

      labels.push(age);
      savingsData.push(totalSavings);
    }

    setProjections(results);

    // Check if goal is met
    const met = totalSavings >= desiredCorpus;
    setGoalMet(met);
    setShortfall(met ? 0 : desiredCorpus - totalSavings);

    // Generate suggestions if goal not met
    if (!met) {
      const newSuggestions = [];

      // Calculate required monthly contribution
      const requiredMonthly = calculateRequiredMonthly();
      if (requiredMonthly > monthlyContribution) {
        newSuggestions.push(
          `Increase monthly contribution to ₹${requiredMonthly.toLocaleString(
            "en-IN",
            { maximumFractionDigits: 0 }
          )}`
        );
      }

      // Calculate required retirement age
      const requiredAge = calculateRequiredAge();
      if (requiredAge > retirementAge) {
        newSuggestions.push(`Delay retirement to age ${requiredAge}`);
      }

      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }

    // Prepare chart data
    setChartData({
      labels,
      datasets: [
        {
          label: "Total Savings",
          data: savingsData,
          borderColor: "#ffffff",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.3,
        },
        {
          label: "Desired Corpus",
          data: Array(labels.length).fill(desiredCorpus),
          borderColor: "#888888",
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
        },
      ],
    });
  };

  const calculateRequiredMonthly = () => {
    const years = retirementAge - currentAge;
    const months = years * 12;
    const monthlyRate = annualReturn / 12 / 100;

    const requiredMonthly =
      (desiredCorpus - currentSavings * Math.pow(1 + monthlyRate, months)) /
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

    return Math.max(0, requiredMonthly);
  };

  const calculateRequiredAge = () => {
    let age = retirementAge;
    let total = currentSavings;
    const monthlyRate = annualReturn / 12 / 100;

    while (total < desiredCorpus && age < 100) {
      age++;
      const months = 12;
      for (let m = 0; m < months; m++) {
        total = total * (1 + monthlyRate) + monthlyContribution;
      }
    }

    return age;
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: isMobile ? "bottom" : "top",
        labels: {
          font: {
            size: isMobile ? 12 : 14,
            weight: "bold",
          },
          padding: 20,
          color: "#ffffff",
        },
      },
      tooltip: {
        backgroundColor: "rgba(255,255,255,0.9)",
        titleColor: "#000000",
        bodyColor: "#000000",
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += `₹${context.parsed.y.toLocaleString("en-IN")}`;
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
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
  };

  const InputField = ({
    label,
    value,
    onChange,
    prefix,
    suffix,
    min,
    max,
    step,
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    prefix?: string;
    suffix?: string;
    min?: number;
    max?: number;
    step?: number;
  }) => {
    const id = `input-${label.replace(/\s+/g, "-").toLowerCase()}`;
    return (
      <div className="mb-4">
        <label
          htmlFor={id}
          className="block text-sm font-bold text-white mb-1"
        >
          {label}
        </label>
        <div className="flex items-center bg-gray-800 rounded-lg border-2 border-gray-600 focus-within:border-white focus-within:ring-2 focus-within:ring-white/20">
          {prefix && (
            <span className="ml-3 text-white font-bold">{prefix}</span>
          )}
          <input
            id={id}
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            min={min}
            max={max}
            step={step}
            className="flex-1 py-2 px-3 bg-transparent outline-none font-bold text-white placeholder-gray-400"
          />
          {suffix && (
            <span className="mr-3 text-white font-bold">{suffix}</span>
          )}
        </div>
      </div>
    );
  };

  const NavigationTabs = () => (
    <nav className="flex overflow-x-auto py-2 mb-4 scrollbar-hide sticky top-0 bg-black z-10">
      <button
        onClick={() => setActiveTab("calculator")}
        className={`px-4 py-2 mx-1 rounded-full whitespace-nowrap font-medium text-sm sm:text-base ${
          activeTab === "calculator"
            ? "bg-white text-black shadow-md"
            : "bg-gray-800 text-white hover:bg-gray-700"
        }`}
      >
        Calculator
      </button>
      <button
        onClick={() => setActiveTab("projections")}
        className={`px-4 py-2 mx-1 rounded-full whitespace-nowrap font-medium text-sm sm:text-base ${
          activeTab === "projections"
            ? "bg-white text-black shadow-md"
            : "bg-gray-800 text-white hover:bg-gray-700"
        }`}
      >
        Projections
      </button>
      <button
        onClick={() => setActiveTab("table")}
        className={`px-4 py-2 mx-1 rounded-full whitespace-nowrap font-medium text-sm sm:text-base ${
          activeTab === "table"
            ? "bg-white text-black shadow-md"
            : "bg-gray-800 text-white hover:bg-gray-700"
        }`}
      >
        Yearly Details
      </button>
    </nav>
  );

  return (
    <div
      ref={containerRef}
      className={`min-h-screen bg-black pt-20 md:pt-20 sm:py-20 px-2 sm:px-4 ${
        isFullscreen ? "fixed inset-0 z-50 overflow-auto" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto relative">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Retirement Planner
          </h1>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors text-white"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </button>
        </div>

        <NavigationTabs />

        {activeTab === "calculator" && (
          <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-md mb-6 border border-gray-700">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Your Retirement Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputField
                label="Current Age"
                value={currentAge}
                onChange={setCurrentAge}
                min={18}
                max={100}
                step={1}
              />
              <InputField
                label="Retirement Age"
                value={retirementAge}
                onChange={setRetirementAge}
                min={currentAge + 1}
                max={100}
                step={1}
              />
              <InputField
                label="Current Savings"
                value={currentSavings}
                onChange={setCurrentSavings}
                prefix="₹"
                min={0}
                step={1000}
              />
              <InputField
                label="Monthly Contribution"
                value={monthlyContribution}
                onChange={setMonthlyContribution}
                prefix="₹"
                min={0}
                step={500}
              />
              <InputField
                label="Expected Annual Return"
                value={annualReturn}
                onChange={setAnnualReturn}
                suffix="%"
                min={0}
                max={20}
                step={0.1}
              />
              <InputField
                label="Desired Corpus"
                value={desiredCorpus}
                onChange={setDesiredCorpus}
                prefix="₹"
                min={0}
                step={100000}
              />
            </div>
          </div>
        )}

        {activeTab === "projections" && (
          <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-md mb-6 border border-gray-700">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Savings Projection
            </h2>
            <div className="h-80">
              {chartData && <Line data={chartData} options={chartOptions} />}
            </div>
          </div>
        )}

        {activeTab === "table" && (
          <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-md mb-6 overflow-x-auto border border-gray-700">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Yearly Projections
            </h2>
            <div className="min-w-full" style={{ minWidth: "600px" }}>
              <table className="w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                      Age
                    </th>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                      Contribution
                    </th>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                      Interest
                    </th>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                      Total Savings
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-700">
                  {projections.map((projection, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm sm:text-base font-medium text-white">
                        {projection.age}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm sm:text-base text-gray-300">
                        ₹{projection.contribution.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm sm:text-base text-gray-400">
                        ₹{projection.interest.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm sm:text-base font-bold text-white">
                        ₹{projection.total.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div
          className={`p-4 sm:p-6 rounded-lg shadow-md border-2 ${
            goalMet
              ? "bg-gray-900 border-white"
              : "bg-gray-800 border-gray-600"
          }`}
        >
          <h2 className="text-xl font-bold mb-4">
            {goalMet ? (
              <span className="text-white">
                🎉 Your Retirement Goal is Achievable!
              </span>
            ) : (
              <span className="text-white">
                ⚠️ Your Retirement Goal Needs Adjustment
              </span>
            )}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-medium text-gray-300">
                Projected Corpus at Retirement:
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-white">
                ₹
                {projections[projections.length - 1]?.total?.toLocaleString(
                  "en-IN"
                ) || 0}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-300">
                Desired Corpus:
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-white">
                ₹{desiredCorpus.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {!goalMet && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-300">Shortfall:</p>
              <p className="text-xl font-bold text-white">
                ₹{shortfall.toLocaleString("en-IN")}
              </p>
            </div>
          )}

          {suggestions.length > 0 && (
            <div>
              <p className="text-sm font-bold text-white mb-2">
                Suggestions to Meet Your Goal:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm font-medium text-gray-300">
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RetirementPlanner;