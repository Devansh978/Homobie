import React from "react";
import CategoryCard from "./CategoryCard";

const CategorySelection = ({ categories, onCategorySelect }) => {
  return (
    <div className="min-h-screen bg-black text-white p-6 relative overflow-hidden">
   
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/2 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto pt-20 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Smart Loan Comparison
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Choose your loan category to see available options and compare them
            </p>
          
        </div>

        <div className="flex justify-center mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <CategoryCard
                key={category.key}
                category={category}
                onSelect={onCategorySelect}
              />
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-6 text-center drop-shadow-lg">
            Why you should Compare
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
              <h3 className="font-semibold text-white mb-2 text-xl drop-shadow-md">
                Detailed Analysis
              </h3>
              <p className="text-white/60 text-sm">
                Compare EMI, interest rates, and total costs
              </p>
            </div>
            <div className="text-center backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
              <h3 className="font-semibold text-white mb-2 text-xl drop-shadow-md">
                Real-time Comparison
              </h3>
              <p className="text-white/60 text-sm">
                Get instant comparisons with up-to-date loan information
              </p>
            </div>
            <div className="text-center backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
              <h3 className="font-semibold text-white mb-2 text-xl drop-shadow-md">
                Smart Recommendations
              </h3>
              <p className="text-white/60 text-sm">
                Find the best loan option based on your requirements
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySelection;