import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Fullscreen, FullscreenExit } from 'react-bootstrap-icons';

// Register ChartJS components
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

const FinanceCalculator = () => {
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // Track window size changes
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.()
        .then(() => setIsFullscreen(true))
        .catch(err => console.error('Error entering fullscreen:', err));
    } else {
      document.exitFullscreen?.()
        .then(() => setIsFullscreen(false))
        .catch(err => console.error('Error exiting fullscreen:', err));
    }
  };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Navigation state
  const [activeSection, setActiveSection] = useState<'calculator' | 'sip-table' | 'loan-table'>('calculator');
  const [activeCalculator, setActiveCalculator] = useState<'sip' | 'loan'>('sip');

  // SIP Calculator State
  const [sipAmount, setSipAmount] = useState(5000);
  const [sipRate, setSipRate] = useState(12);
  const [sipDuration, setSipDuration] = useState(5);

  // Loan Calculator State
  const [loanAmount, setLoanAmount] = useState(500000);
  const [loanRate, setLoanRate] = useState(8.5);
  const [loanDuration, setLoanDuration] = useState(5);

  // Results
  const [sipResults, setSipResults] = useState([]);
  const [loanResults, setLoanResults] = useState([]);
  const [sipChartData, setSipChartData] = useState(null);
  const [loanChartData, setLoanChartData] = useState(null);
  const [sipFutureValue, setSipFutureValue] = useState(0);
  const [loanEmi, setLoanEmi] = useState(0);
  const [totalLoanInterest, setTotalLoanInterest] = useState(0);

  // Calculate results
  useEffect(() => {
    calculateSip();
    calculateLoan();
  }, [sipAmount, sipRate, sipDuration, loanAmount, loanRate, loanDuration]);

  const calculateSip = () => {
    const monthlyRate = sipRate / 12 / 100;
    const months = sipDuration * 12;
    const results = [];
    let futureValue = 0;
    const chartLabels = [];
    const chartData = [];
    const investedData = [];

    for (let i = 1; i <= months; i++) {
      futureValue = (futureValue + sipAmount) * (1 + monthlyRate);

      if (i % 12 === 0 || i === months) {
        results.push({
          year: Math.ceil(i / 12),
          month: i,
          amount: futureValue,
          invested: sipAmount * i
        });
      }

      if (i % (isMobile ? 12 : 6) === 0 || i === 1 || i === months) {
        chartLabels.push(isMobile ? `${Math.ceil(i/12)}Y` : `Year ${Math.ceil(i/12)}`);
        chartData.push(futureValue);
        investedData.push(sipAmount * i);
      }
    }

    setSipResults(results);
    setSipFutureValue(futureValue);

    setSipChartData({
      labels: chartLabels,
      datasets: [
        {
          label: 'Invested Amount',
          data: investedData,
          borderColor: '#4C51BF',
          backgroundColor: 'rgba(76, 81, 191, 0.2)',
          borderWidth: 3,
          fill: true,
          tension: 0.3
        },
        {
          label: 'Future Value',
          data: chartData,
          borderColor: '#38B2AC',
          backgroundColor: 'rgba(56, 178, 172, 0.2)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }
      ]
    });
  };

  const calculateLoan = () => {
    const monthlyRate = loanRate / 12 / 100;
    const months = loanDuration * 12;
    const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                (Math.pow(1 + monthlyRate, months) - 1);

    let balance = loanAmount;
    const results = [];
    const chartLabels = [];
    const balanceData = [];
    const interestData = [];

    for (let i = 1; i <= months; i++) {
      const interest = balance * monthlyRate;
      const principal = emi - interest;
      balance -= principal;

      if (i % 12 === 0 || i === months) {
        results.push({
          month: i,
          emi,
          principal,
          interest,
          balance: balance > 0 ? balance : 0
        });
      }

      if (i % (isMobile ? 12 : 6) === 0 || i === 1 || i === months) {
        chartLabels.push(isMobile ? `${Math.ceil(i/12)}Y` : `Year ${Math.ceil(i/12)}`);
        balanceData.push(balance > 0 ? balance : 0);
        interestData.push(interest);
      }
    }

    setLoanResults(results);
    setLoanEmi(emi);
    setTotalLoanInterest(emi * months - loanAmount);

    setLoanChartData({
      labels: chartLabels,
      datasets: [
        {
          label: 'Principal Balance',
          data: balanceData,
          borderColor: '#C53030',
          backgroundColor: 'rgba(197, 48, 48, 0.2)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        },
        {
          label: 'Interest Paid',
          data: interestData,
          borderColor: '#DD6B20',
          backgroundColor: 'rgba(221, 107, 32, 0.2)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }
      ]
    });
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: isMobile ? 'bottom' : 'top',
        labels: {
          font: {
            size: isMobile ? 12 : 14,
            weight: 'bold'
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 12
        },
        callbacks: {
          label: (context) => `₹${context.raw.toLocaleString('en-IN')}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.05)'
        },
        ticks: {
          font: {
            weight: 'bold'
          },
          callback: (value) => `₹${value.toLocaleString('en-IN')}`
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            weight: 'bold'
          }
        }
      }
    },
    elements: {
      point: {
        radius: isMobile ? 3 : 4,
        hoverRadius: isMobile ? 5 : 6
      }
    }
  };

  const MainNav = () => (
    <nav className="flex overflow-x-auto py-2 mb-4 scrollbar-hide sticky top-0 bg-gray-50 z-10">
      <button
        onClick={() => setActiveSection('calculator')}
        className={`px-4 py-2 mx-1 rounded-full whitespace-nowrap font-medium text-sm sm:text-base ${
          activeSection === 'calculator' 
            ? 'bg-indigo-700 text-white shadow-md' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        Calculator
      </button>
      <button
        onClick={() => setActiveSection('sip-table')}
        className={`px-4 py-2 mx-1 rounded-full whitespace-nowrap font-medium text-sm sm:text-base ${
          activeSection === 'sip-table' 
            ? 'bg-indigo-700 text-white shadow-md' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        SIP Projection
      </button>
      <button
        onClick={() => setActiveSection('loan-table')}
        className={`px-4 py-2 mx-1 rounded-full whitespace-nowrap font-medium text-sm sm:text-base ${
          activeSection === 'loan-table' 
            ? 'bg-indigo-700 text-white shadow-md' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        Loan Amortization
      </button>
    </nav>
  );

  const CalculatorNav = () => (
    <div className="flex mb-4 rounded-lg overflow-hidden shadow-sm">
      <button
        onClick={() => setActiveCalculator('sip')}
        className={`flex-1 py-3 font-bold text-sm sm:text-base transition-colors ${
          activeCalculator === 'sip'
            ? 'bg-indigo-700 text-white' 
            : 'bg-gray-100 text-indigo-800 hover:bg-gray-200 hover:text-indigo-900'
        }`}
      >
        SIP Calculator
      </button>
      <button
        onClick={() => setActiveCalculator('loan')}
        className={`flex-1 py-3 font-bold text-sm sm:text-base transition-colors ${
          activeCalculator === 'loan'
            ? 'bg-red-700 text-white'
            : 'bg-gray-100 text-red-800 hover:bg-gray-200 hover:text-red-900'
        }`}
      >
        Loan Calculator
      </button>
    </div>
  );

  const InputField = ({ label, value, onChange, prefix, suffix, min, max, step }) => (
    <div className="mb-6">
      <label className="block text-sm font-bold text-gray-800 mb-2">{label}</label>
      <div className="flex items-center bg-white rounded-lg border-2 border-indigo-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 transition-all duration-200">
        {prefix && (
          <span className="ml-3 text-indigo-700 font-bold">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="flex-1 py-3 px-3 bg-transparent outline-none font-bold text-gray-800 w-full"
        />
        {suffix && (
          <span className="mr-3 text-indigo-700 font-bold">
            {suffix}
          </span>
        )}
      </div>
      <div className="mt-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600"
        />
        <div className="flex justify-between text-xs font-medium text-indigo-800 mt-1">
          <span>{min}{suffix}</span>
          <span>{max}{suffix}</span>
        </div>
      </div>
    </div>
  );

  const SummaryCard = ({ title, value, color }) => {
    const colorMap = {
      indigo: {
        bg: 'bg-indigo-100',
        border: 'border-indigo-300',
        text: 'text-indigo-800'
      },
      red: {
        bg: 'bg-red-100',
        border: 'border-red-300',
        text: 'text-red-800'
      },
      teal: {
        bg: 'bg-teal-100',
        border: 'border-teal-300',
        text: 'text-teal-800'
      }
    };

    return (
      <div className={`${colorMap[color].bg} p-4 rounded-lg border ${colorMap[color].border} shadow-sm`}>
        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">{title}</h3>
        <p className={`text-sm sm:text-xl font-extrabold ${colorMap[color].text} mt-1`}>{value}</p>
      </div>
    );
  };

  const CalculatorView = () => (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      {isMobile && <CalculatorNav />}

      <div className={isMobile ? '' : 'flex gap-6'}>
        {/* SIP Calculator */}
        <div className={`bg-white rounded-lg ${!isMobile || activeCalculator === 'sip' ? 'block' : 'hidden'}`}>
          <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center text-indigo-800">
            <span className="w-3 h-3 bg-indigo-700 rounded-full mr-2"></span>
            SIP Calculator
          </h2>

          <div className={isMobile ? '' : 'grid grid-cols-3 gap-4'}>
            <InputField
              label="Monthly Investment"
              value={sipAmount}
              onChange={setSipAmount}
              prefix="₹"
              min={1000}
              max={100000}
              step={1000}
            />
            <InputField
              label="Expected Return"
              value={sipRate}
              onChange={setSipRate}
              suffix="%"
              min={1}
              max={30}
              step={0.5}
            />
            <InputField
              label="Time Period"
              value={sipDuration}
              onChange={setSipDuration}
              suffix="years"
              min={1}
              max={30}
              step={1}
            />
          </div>

          {sipChartData && (
            <div className="mt-6 bg-gray-50 p-3 rounded-lg" style={{ height: isMobile ? '280px' : '350px' }}>
              <Line data={sipChartData} options={chartOptions} />
            </div>
          )}

          <div className={isMobile ? 'grid grid-cols-2 gap-3 mt-4' : 'flex gap-4 mt-6'}>
            <SummaryCard 
              title="Total Invested" 
              value={`₹${(sipAmount * sipDuration * 12).toLocaleString('en-IN')}`} 
              color="indigo" 
            />
            <SummaryCard 
              title="Est. Returns" 
              value={`₹${(sipFutureValue - sipAmount * sipDuration * 12).toLocaleString('en-IN')}`} 
              color="teal" 
            />
            {!isMobile && (
              <SummaryCard 
                title="Future Value" 
                value={`₹${sipFutureValue.toLocaleString('en-IN')}`} 
                color="indigo" 
              />
            )}
          </div>
        </div>

        {/* Loan Calculator */}
        <div className={`bg-white rounded-lg mt-6 ${isMobile ? (activeCalculator === 'loan' ? 'block' : 'hidden') : 'block'}`}>
          <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center text-red-800">
            <span className="w-3 h-3 bg-red-700 rounded-full mr-2"></span>
            Loan Calculator
          </h2>

          <div className={isMobile ? '' : 'grid grid-cols-3 gap-4'}>
            <InputField
              label="Loan Amount"
              value={loanAmount}
              onChange={setLoanAmount}
              prefix="₹"
              min={100000}
              max={10000000}
              step={10000}
            />
            <InputField
              label="Interest Rate"
              value={loanRate}
              onChange={setLoanRate}
              suffix="%"
              min={5}
              max={20}
              step={0.1}
            />
            <InputField
              label="Loan Tenure"
              value={loanDuration}
              onChange={setLoanDuration}
              suffix="years"
              min={1}
              max={30}
              step={1}
            />
          </div>

          {loanChartData && (
            <div className="mt-6 bg-gray-50 p-3 rounded-lg" style={{ height: isMobile ? '280px' : '350px' }}>
              <Line data={loanChartData} options={chartOptions} />
            </div>
          )}

          <div className={isMobile ? 'grid grid-cols-2 gap-3 mt-4' : 'flex gap-4 mt-6'}>
            <SummaryCard 
              title="Monthly EMI" 
              value={`₹${loanEmi.toLocaleString('en-IN')}`} 
              color="red" 
            />
            <SummaryCard 
              title="Total Interest" 
              value={`₹${totalLoanInterest.toLocaleString('en-IN')}`} 
              color="red" 
            />
            {!isMobile && (
              <SummaryCard 
                title="Total Payment" 
                value={`₹${(loanAmount + totalLoanInterest).toLocaleString('en-IN')}`} 
                color="red" 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const TablesView = () => (
    <div className="bg-white p-4 rounded-lg shadow-lg w-full overflow-hidden">
      {activeSection === 'sip-table' && (
        <div className="w-full overflow-x-auto">
          <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center text-indigo-800">
            <span className="w-3 h-3 bg-indigo-700 rounded-full mr-2"></span>
            SIP Projection
          </h2>
          <div className="min-w-full" style={{ minWidth: '600px' }}>
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-bold text-indigo-800 uppercase tracking-wider">Year</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-bold text-indigo-800 uppercase tracking-wider">Invested</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-bold text-indigo-800 uppercase tracking-wider">Returns</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-bold text-indigo-800 uppercase tracking-wider">Total Value</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sipResults.map((result, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-indigo-50'}>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{result.year}</td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-indigo-700">
                      ₹{(sipAmount * result.month).toLocaleString('en-IN')}
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-teal-600">
                      ₹{(result.amount - sipAmount * result.month).toLocaleString('en-IN')}
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-indigo-700">
                      ₹{result.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSection === 'loan-table' && (
        <div className="w-full overflow-x-auto">
          <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center text-red-800">
            <span className="w-3 h-3 bg-red-700 rounded-full mr-2"></span>
            Loan Amortization
          </h2>
          <div className="min-w-full" style={{ minWidth: '600px' }}>
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-red-50">
                <tr>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-bold text-red-800 uppercase tracking-wider">Year</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-bold text-red-800 uppercase tracking-wider">Principal</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-bold text-red-800 uppercase tracking-wider">Interest</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-bold text-red-800 uppercase tracking-wider">Balance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loanResults.map((result, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-red-50'}>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                      {Math.ceil(result.month / 12)}
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-red-700">
                      ₹{result.principal.toLocaleString('en-IN')}
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-orange-600">
                      ₹{result.interest.toLocaleString('en-IN')}
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-red-700">
                      ₹{result.balance.toLocaleString('en-IN')}
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
      className={`min-h-screen bg-gray-50 py-4 sm:py-8 px-2 sm:px-4 ${isFullscreen ? 'fixed inset-0 z-50 overflow-auto' : ''}`}
    >
      <div className="max-w-6xl mx-auto relative">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Financial Planning Calculator
          </h1>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <FullscreenExit className="w-5 h-5" />
            ) : (
              <Fullscreen className="w-5 h-5" />
            )}
          </button>
        </div>

        <MainNav />

        <div className="w-full">
          {activeSection === 'calculator' ? <CalculatorView /> : <TablesView />}
        </div>

        <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-600">
          <p className="font-medium">Note: Calculations are estimates only. Actual returns may vary.</p>
        </div>
      </div>
    </div>
  );
};

export default FinanceCalculator;