import React from 'react';
import CategoryCard from './CategoryCard';

const CategorySelection = ({ categories, onCategorySelect }) => {
  return (
    <div className="min-h-screen bg-black to-blue-900 text-white p-6">
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#4f46e5] mb-4">
            Smart Loan Comparison
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choose your loan category to see available options and compare them
          </p>
        </div>

        {/* Category Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {categories.map((category) => (
            <CategoryCard 
              key={category.key} 
              category={category} 
              onSelect={onCategorySelect}
            />
          ))}
        </div>

        {/* Features */}
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-600">
          <h2 className="text-3xl font-bold text-[#4f46e5] mb-6 text-center">Why you should Compare</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="font-semibold text-white mb-2 text-xl">Detailed Analysis</h3>
              <p className="text-gray-400 text-sm">Compare EMI, interest rates, processing fees, and total costs</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-white mb-2 text-xl">Real-time Comparison</h3>
              <p className="text-gray-400 text-sm">Get instant comparisons with up-to-date loan information</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-white mb-2 text-xl">Smart Recommendations</h3>
              <p className="text-gray-400 text-sm">Find the best loan option based on your requirements</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySelection;