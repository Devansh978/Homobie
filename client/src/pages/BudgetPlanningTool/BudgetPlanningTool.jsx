
import React, { useState, useEffect, useRef } from 'react';
import { Chart, PieController, ArcElement, Tooltip, Legend, BarController, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register Chart.js components
Chart.register(PieController, ArcElement, Tooltip, Legend, BarController, BarElement, CategoryScale, LinearScale);

const BudgetPlanner = () => {
  // State for budget data
  const [income, setIncome] = useState(5000);
  const [expenses, setExpenses] = useState([
    { id: 1, category: 'Housing', amount: 1500, max: 1500 },
    { id: 2, category: 'Transportation', amount: 400, max: 500 },
    { id: 3, category: 'Food', amount: 600, max: 600 },
    { id: 4, category: 'Utilities', amount: 300, max: 350 },
    { id: 5, category: 'Entertainment', amount: 200, max: 300 },
    { id: 6, category: 'Savings', amount: 1000, max: 1500 },
    { id: 7, category: 'Other', amount: 200, max: 250 },
  ]);
  const [timeframe, setTimeframe] = useState('monthly');
  const [activeChart, setActiveChart] = useState('pie');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const appRef = useRef(null);

  // Refs for charts
  const chartContainerRef = useRef(null);
  const chartInstance = useRef(null);

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = income - totalExpenses;
  const savings = expenses.find(e => e.category === 'Savings')?.amount || 0;

  // Check for mobile view and handle resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle fullscreen mode
  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (appRef.current.requestFullscreen) {
        appRef.current.requestFullscreen();
      } else if (appRef.current.webkitRequestFullscreen) {
        appRef.current.webkitRequestFullscreen();
      } else if (appRef.current.msRequestFullscreen) {
        appRef.current.msRequestFullscreen();
      }
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullScreen(false);
    }
  };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Initialize or update chart
  useEffect(() => {
    // Adjust chart legend position based on screen size
    const legendPosition = isMobile ? 'bottom' : 'right';

    // Destroy previous chart instance if exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartContainerRef.current.getContext('2d');

    if (activeChart === 'pie') {
      chartInstance.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: expenses.map(e => e.category),
          datasets: [{
            data: expenses.map(e => e.amount),
            backgroundColor: [
              '#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', 
              '#F59E0B', '#10B981', '#3B82F6', '#64748B'
            ],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: legendPosition,
              labels: {
                color: '#ffffff' // White text for legend
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const percentage = Math.round((context.raw / totalExpenses) * 100);
                  return `${context.label}: ₹${context.raw} (${percentage}%)`;
                }
              },
              titleColor: '#ffffff', // White text for tooltips
              bodyColor: '#ffffff'
            }
          }
        }
      });
    } else {
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: expenses.map(e => e.category),
          datasets: [
            {
              label: 'Spent',
              data: expenses.map(e => e.amount),
              backgroundColor: '#6366F1',
            },
            {
              label: 'Budgeted',
              data: expenses.map(e => e.max),
              backgroundColor: '#A5B4FC',
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: '#ffffff' // White text for y-axis
              },
              grid: {
                color: '#374151' // Dark gray grid lines
              }
            },
            x: {
              ticks: {
                color: '#ffffff' // White text for x-axis
              },
              grid: {
                color: '#374151' // Dark gray grid lines
              }
            }
          },
          plugins: {
            legend: {
              position: legendPosition,
              labels: {
                color: '#ffffff' // White text for legend
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.dataset.label}: ₹${context.raw}`;
                }
              },
              titleColor: '#ffffff', // White text for tooltips
              bodyColor: '#ffffff'
            }
          }
        }
      });
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [expenses, totalExpenses, isMobile, activeChart]);

  // Handle income change with proper clearing
  const handleIncomeChange = (value) => {
    if (value === '') {
      setIncome('');
    } else {
      setIncome(parseFloat(value) || 0);
    }
  };

  // Handle expense amount change with proper clearing
  const handleExpenseChange = (id, field, value) => {
    if (value === '') {
      setExpenses(expenses.map(expense => {
        if (expense.id === id) {
          return { ...expense, [field]: '' };
        }
        return expense;
      }));
    } else {
      const newValue = parseFloat(value) || 0;
      setExpenses(expenses.map(expense => {
        if (expense.id === id) {
          return { ...expense, [field]: newValue };
        }
        return expense;
      }));
    }
  };

  // Add new expense category
  const addNewCategory = () => {
    const newId = expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1;
    setExpenses([
      ...expenses,
      { id: newId, category: '', amount: '', max: '' }
    ]);
  };

  // Remove expense category
  const removeCategory = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  // Handle category name change
  const handleCategoryNameChange = (id, newName) => {
    setExpenses(expenses.map(expense => {
      if (expense.id === id) {
        return { ...expense, category: newName };
      }
      return expense;
    }));
  };

  // Mobile-friendly summary cards
  const SummaryCard = ({ title, value, isPositive = true }) => (
    <div className={`p-3 rounded-lg ${isPositive ? 'bg-green-900' : 'bg-red-900'} mb-2 border border-gray-700`}>
      <h3 className="text-xs sm:text-sm font-medium text-gray-200">{title}</h3>
      <p className={`text-lg sm:text-xl font-semibold ${isPositive ? 'text-green-300' : 'text-red-300'}`}>
        ₹{typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    </div>
  );

  return (
    <div 
      ref={appRef}
      className={`bg-black pt-20 ${isFullScreen ? 'fixed inset-0 overflow-auto' : 'min-h-screen'} py-2 px-2 sm:px-4 md:px-6`}
    >
      <div className={`max-w-6xl mx-auto ${isFullScreen ? 'p-4' : ''}`}>
        {/* Header with fullscreen toggle */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
            Budget Planning Tool
          </h1>
          <button
            onClick={toggleFullScreen}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full"
            aria-label={isFullScreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullScreen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 16h3v3a1 1 0 102 0v-3h3a1 1 0 100-2h-3v-3a1 1 0 10-2 0v3H5a1 1 0 100 2zm7-13H9V0a1 1 0 10-2 0v3H4a1 1 0 100 2h3v3a1 1 0 102 0V5h3a1 1 0 100-2z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile navigation menu */}
        {isMobile && (
          <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
            <button
              onClick={() => document.getElementById('income-section').scrollIntoView({ behavior: 'smooth' })}
              className="flex-shrink-0 px-3 py-1 bg-gray-800 text-white rounded-full text-sm border border-gray-600"
            >
              Income
            </button>
            <button
              onClick={() => document.getElementById('expenses-section').scrollIntoView({ behavior: 'smooth' })}
              className="flex-shrink-0 px-3 py-1 bg-gray-800 text-white rounded-full text-sm border border-gray-600"
            >
              Expenses
            </button>
            <button
              onClick={() => document.getElementById('charts-section').scrollIntoView({ behavior: 'smooth' })}
              className="flex-shrink-0 px-3 py-1 bg-gray-800 text-white rounded-full text-sm border border-gray-600"
            >
              Charts
            </button>
            <button
              onClick={() => document.getElementById('summary-section').scrollIntoView({ behavior: 'smooth' })}
              className="flex-shrink-0 px-3 py-1 bg-gray-800 text-white rounded-full text-sm border border-gray-600"
            >
              Summary
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Income and Summary Section */}
          <div id="income-section" className="lg:col-span-1 bg-gray-900 p-4 sm:p-6 rounded-lg shadow border border-gray-700">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Income & Summary</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-1">
                {timeframe === 'monthly' ? 'Monthly Income' : 'Quarterly Income'}
              </label>
              <div className="relative rounded-md shadow-sm">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-white">₹</span>
                <input
                  type="number"
                  className="block w-full pl-8 pr-12 py-2 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-gray-800 text-white placeholder-gray-400"
                  value={income}
                  onChange={(e) => handleIncomeChange(e.target.value)}
                  onFocus={(e) => e.target.select()}
                />
              </div>
            </div>

            <div className="flex space-x-2 sm:space-x-4 mb-4">
              <button
                onClick={() => setTimeframe('monthly')}
                className={`flex-1 py-2 px-2 sm:px-4 text-sm sm:text-base rounded-md ${
                  timeframe === 'monthly' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 border border-gray-600'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setTimeframe('quarterly')}
                className={`flex-1 py-2 px-2 sm:px-4 text-sm sm:text-base rounded-md ${
                  timeframe === 'quarterly' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 border border-gray-600'
                }`}
              >
                Quarterly
              </button>
            </div>

            {/* Mobile summary cards */}
            {isMobile && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                <SummaryCard title="Total Income" value={income} />
                <SummaryCard title="Total Expenses" value={totalExpenses} isPositive={totalExpenses <= income} />
                <SummaryCard title="Savings" value={savings} />
                <SummaryCard title="Remaining" value={remainingBudget} isPositive={remainingBudget >= 0} />
              </div>
            )}

            {/* Desktop summary */}
            {!isMobile && (
              <div className="space-y-3">
                <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <h3 className="text-sm font-medium text-white">Total Income</h3>
                  <p className="text-xl font-semibold text-white">₹{(typeof income === 'number' ? income : 0).toLocaleString()}</p>
                </div>

                <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <h3 className="text-sm font-medium text-white">Total Expenses</h3>
                  <p className="text-xl font-semibold text-white">₹{totalExpenses.toLocaleString()}</p>
                </div>

                <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <h3 className="text-sm font-medium text-white">Savings</h3>
                  <p className="text-xl font-semibold text-green-400">₹{savings.toLocaleString()}</p>
                </div>

                <div className={`p-3 rounded-lg border ${remainingBudget >= 0 ? 'bg-green-900 border-green-700' : 'bg-red-900 border-red-700'}`}>
                  <h3 className="text-sm font-medium text-white">Remaining Budget</h3>
                  <p className={`text-xl font-semibold ${remainingBudget >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    ₹{remainingBudget.toLocaleString()}
                  </p>
                  {remainingBudget < 0 && (
                    <p className="text-xs text-red-300 mt-1">Warning: You're overspending!</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Expenses and Charts Section */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Chart Selection and Display */}
            <div id="charts-section" className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow border border-gray-700">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-0">Spending Visualization</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveChart('pie')}
                    className={`py-1 px-2 sm:px-3 text-sm rounded-md ${
                      activeChart === 'pie' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 border border-gray-600'
                    }`}
                  >
                    Pie
                  </button>
                  <button
                    onClick={() => setActiveChart('bar')}
                    className={`py-1 px-2 sm:px-3 text-sm rounded-md ${
                      activeChart === 'bar' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 border border-gray-600'
                    }`}
                  >
                    Bar
                  </button>
                </div>
              </div>

              <div className="h-64 sm:h-80 bg-gray-800 rounded-lg p-2">
                <canvas ref={chartContainerRef}></canvas>
              </div>
            </div>

            {/* Expense Categories */}
            <div id="expenses-section" className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow border border-gray-700">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-0">Expense Categories</h2>
                <button
                  onClick={addNewCategory}
                  className="py-1 px-3 bg-indigo-600 text-white text-sm sm:text-base rounded-md hover:bg-indigo-700"
                >
                  Add Category
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Category</th>
                      <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Amount</th>
                      {!isMobile && (
                        <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Budget Max</th>
                      )}
                      <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                      <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-900 divide-y divide-gray-700">
                    {expenses.map((expense) => (
                      <tr key={expense.id} className={(expense.amount || 0) > (expense.max || 0) ? 'bg-red-900 bg-opacity-20' : ''}>
                        <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                          <input
                            type="text"
                            className="block w-full py-1 px-1 sm:px-2 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base bg-gray-800 text-white placeholder-gray-400"
                            value={expense.category}
                            onChange={(e) => handleCategoryNameChange(expense.id, e.target.value)}
                            placeholder="Category"
                          />
                        </td>
                        <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                          <div className="relative rounded-md shadow-sm">
                            <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-white text-sm">₹</span>
                            <input
                              type="number"
                              className="block w-full pl-6 pr-2 py-1 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base bg-gray-800 text-white placeholder-gray-400"
                              value={expense.amount}
                              onChange={(e) => handleExpenseChange(expense.id, 'amount', e.target.value)}
                              onFocus={(e) => e.target.select()}
                            />
                          </div>
                        </td>
                        {!isMobile && (
                          <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                            <div className="relative rounded-md shadow-sm">
                              <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-white text-sm">₹</span>
                              <input
                                type="number"
                                className="block w-full pl-6 pr-2 py-1 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base bg-gray-800 text-white placeholder-gray-400"
                                value={expense.max}
                                onChange={(e) => handleExpenseChange(expense.id, 'max', e.target.value)}
                                onFocus={(e) => e.target.select()}
                              />
                            </div>
                          </td>
                        )}
                        <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                          {(expense.amount || 0) > (expense.max || 0) ? (
                            <span className="px-1 py-0.5 text-xs font-semibold text-red-300 bg-red-900 rounded-full border border-red-700">Over</span>
                          ) : (
                            <span className="px-1 py-0.5 text-xs font-semibold text-green-300 bg-green-900 rounded-full border border-green-700">OK</span>
                          )}
                        </td>
                        <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                          <button
                            onClick={() => removeCategory(expense.id)}
                            className="text-red-400 hover:text-red-300 text-sm sm:text-base"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Table */}
            <div id="summary-section" className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow border border-gray-700">
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">{timeframe === 'monthly' ? 'Monthly' : 'Quarterly'} Summary</h2>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Category</th>
                      <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Amount</th>
                      {!isMobile && (
                        <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">% of Income</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-gray-900 divide-y divide-gray-700">
                    <tr>
                      <td className="px-2 sm:px-4 py-2 whitespace-nowrap font-medium text-white">Income</td>
                      <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-white">₹{(typeof income === 'number' ? income : 0).toLocaleString()}</td>
                      {!isMobile && (
                        <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-white">100%</td>
                      )}
                    </tr>
                    {expenses.map((expense) => (
                      <tr key={expense.id}>
                        <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-white">{expense.category || 'Unnamed'}</td>
                        <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-white">₹{(expense.amount || 0).toLocaleString()}</td>
                        {!isMobile && (
                          <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-white">{Math.round(((expense.amount || 0) / (typeof income === 'number' ? income : 1)) * 100)}%</td>
                        )}
                      </tr>
                    ))}
                    <tr className="bg-gray-800">
                      <td className="px-2 sm:px-4 py-2 whitespace-nowrap font-medium text-white">Total Expenses</td>
                      <td className="px-2 sm:px-4 py-2 whitespace-nowrap font-medium text-white">₹{totalExpenses.toLocaleString()}</td>
                      {!isMobile && (
                        <td className="px-2 sm:px-4 py-2 whitespace-nowrap font-medium text-white">{Math.round((totalExpenses / (typeof income === 'number' ? income : 1)) * 100)}%</td>
                      )}
                    </tr>
                    <tr className="bg-green-900 bg-opacity-20">
                      <td className="px-2 sm:px-4 py-2 whitespace-nowrap font-medium text-green-300">Remaining</td>
                      <td className="px-2 sm:px-4 py-2 whitespace-nowrap font-medium text-green-300">₹{remainingBudget.toLocaleString()}</td>
                      {!isMobile && (
                        <td className="px-2 sm:px-4 py-2 whitespace-nowrap font-medium text-green-300">{Math.round((remainingBudget / (typeof income === 'number' ? income : 1)) * 100)}%</td>
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanner;