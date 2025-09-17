import React, { useState } from "react";
import { CheckCircle, TrendingUp, Calculator, Home, FileText } from "lucide-react";

const CtaButton = ({ href = "/loan-application?type=home-loan", children }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <a
      href={href}
      className="
        inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 
        bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold 
        rounded-lg shadow-lg transform transition-all duration-300
        hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-105
        focus:outline-none focus:ring-4 focus:ring-blue-500
        text-sm sm:text-base
      "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <TrendingUp
        className={`ml-2 w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${
          isHovered ? "translate-x-1" : ""
        }`}
      />
    </a>
  );
};

const FactorCard = ({ title, description, icon: Icon }) => (
  <div className="rounded-lg shadow-md p-5 sm:p-6 border border-gray-700 bg-gray-800 hover:shadow-lg transition-shadow duration-300">
    <div className="flex items-start space-x-4">
      <div className="bg-gray-700 p-2 sm:p-3 rounded-lg shrink-0">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-100 mb-2">{title}</h3>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

const Blog6 = () => (
  <div className="min-h-screen">
    <div className="max-w-5xl mx-auto text-gray-100">

      {/* Header */}
      <div className="text-center mb-10 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
          Home Loan Insurance: Essential for New Buyers in 2025
        </h1>
        <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto"></div>
      </div>

      {/* Introduction */}
      <section className="bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8 sm:mb-10">
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          Home loan insurance—or home loan protection plan—is a decreasing-cover policy that pays off your outstanding loan in case of death, disability, or job loss. Though not mandatory, it offers peace of mind, safeguarding families and preserving credit history. Premiums may be added to EMIs and qualify for tax deductions under Section 80C. In 2025, with RBI encouraging borrower protection, new buyers should strongly consider it. Platforms like <strong>Homobie</strong> help you evaluate insurance options, metrics like loan against property interest rates, and use EMI calculators intelligently—ensuring you make informed choices.
        </p>
      </section>

      {/* Key Sections as FactorCards */}
      <section className="mb-8 sm:mb-10">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-3 sm:mb-4">
            Key Insights for Home Loan Insurance
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">Understand why it matters and how to choose wisely</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          <FactorCard
            icon={FileText}
            title="1. What Is Home Loan Insurance?"
            description="A policy that covers your outstanding home loan in case of death, disability, or job loss, typically reducing coverage as you repay EMIs."
          />
          <FactorCard
            icon={CheckCircle}
            title="2. Why It Matters for New Buyers"
            description="Protects your family, preserves credit score, and provides low-cost peace of mind through premiums."
          />
          <FactorCard
            icon={Calculator}
            title="3. Key Features & Benefits"
            description="Decreasing cover, optional add-ons, flexible premiums, and coverage for co-borrowers."
          />
          <FactorCard
            icon={Home}
            title="4. Cost & Tax Benefits"
            description="Premiums ~0.3%-0.5% of loan annually; may be eligible under Section 80C; simpler than term insurance."
          />
          <FactorCard
            icon={TrendingUp}
            title="5. Choosing the Right Plan"
            description="Compare rates, riders, policy tenure, and premium modes to match your budget and loan tenure."
          />
        </div>
      </section>

      {/* Additional Tips */}
      <section className="bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8 sm:mb-10">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-100 mb-4">Alternatives & When to Skip It</h2>
        <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-gray-300 text-sm sm:text-base">
          <li>You already have a solid life insurance policy.</li>
          <li>Premiums for home loan insurance are unusually high.</li>
          <li>You want broader life coverage beyond the loan amount.</li>
        </ul>
      </section>

      {/* Real-World Scenario */}
      <section className="bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8 sm:mb-10">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-100 mb-4">Real-World Scenario</h2>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          For a ₹50 lakh home loan at 7% over 20 years, a home loan protection policy might cost around ₹20,000 annually. That’s less than ₹2,000 per month for full family protection and financial peace of mind.
        </p>
      </section>

      {/* Homobie Section */}
      <section className="bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8 sm:mb-10">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-100 mb-4">How Homobie Makes It Simple</h2>
        <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-gray-300 text-sm sm:text-base">
          <li>Compare top home loan insurance policies alongside lenders.</li>
          <li>Use an <strong>EMI calculator online</strong> to evaluate premium impact.</li>
          <li>Access insights on <strong>loan against property interest rates</strong>, terms, and protection add-ons.</li>
        </ul>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed mt-4">
          Homobie ensures you borrow smarter, plan better, and protect your future—all in one platform.
        </p>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Final Take</h2>
        <p className="text-gray-300 text-sm sm:text-base mb-6">
          Home loan insurance may not be mandatory—but in 2025, it’s quickly becoming essential. Protect your investment and provide financial security for your loved ones.
        </p>
        <CtaButton>
          Thinking ahead? Let Homobie help you match with the right home loan—and the protection that fits your future.
        </CtaButton>
      </section>

    </div>
  </div>
);

export default Blog6;
