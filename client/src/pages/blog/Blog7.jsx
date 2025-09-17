import React, { useState } from "react";
import { CheckCircle, Home, FileText, Users, Calculator, TrendingUp } from "lucide-react";

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

const SectionCard = ({ title, description, icon: Icon }) => (
  <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
    <div className="flex items-start gap-3 sm:gap-4">
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

const Blog7 = () => (
  <div className="min-h-screen">
    <div className="max-w-5xl mx-auto text-gray-100">

      {/* Header */}
      <div className="text-center mb-10 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
          Which Bank or Finance Service Is Best for a Housing Loan?
        </h1>
        <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto"></div>
      </div>

      {/* Intro */}
      <section className="bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8 sm:mb-10">
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          In 2025, public sector banks like Union Bank of India, SBI, Bank of Baroda and financial companies like LIC Housing Finance, PNB Housing Finance offer the most competitive home loan rates—starting from about 7.35%–8.50%. Private banks such as HDFC and ICICI prioritize faster processing and digital convenience. Platforms like <strong>Homobie</strong> bring expertise and data-driven profiling to instantly match you with the ideal lender.
        </p>
      </section>

      {/* Cards Section */}
      <section className="mb-8 sm:mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          <SectionCard
            icon={CheckCircle}
            title="1. Why EEAT Matters"
            description="Credibility comes from verified rates, transparent terms, and proven borrower outcomes."
          />
          <SectionCard
            icon={Home}
            title="2. Top Public Sector Banks in 2025"
            description="Union Bank, SBI, BoB, PNB, Canara Bank offer competitive rates and low processing fees."
          />
          <SectionCard
            icon={Users}
            title="3. Private Banks & HFCs"
            description="HDFC, ICICI, LIC Housing Finance, PNB Housing Finance, and IIFL offer flexible options and faster digital processes."
          />
          <SectionCard
            icon={Calculator}
            title="4. What Borrowers Should Evaluate"
            description="Interest rate, processing fees, tenure, digital convenience, eligibility criteria."
          />
          <SectionCard
            icon={FileText}
            title="5. Experience Shared by Real Borrowers"
            description="Borrowers suggest floating rates for private banks, strong income profiles get better offers."
          />
          <SectionCard
            icon={TrendingUp}
            title="6. Homobie: Smart Matching Platform"
            description="Uses expert data analysis to match borrowers with lenders, simulates EMI impacts, and reduces paperwork."
          />
        </div>
      </section>

      {/* Additional Info */}
      <section className="bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8 sm:mb-10">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-100 mb-4">Final Take</h2>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
          Choosing the best bank isn’t just about rates. Public banks are cost-efficient; private banks offer speed and tech-forward features. Homobie simplifies comparison.
        </p>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-100 mb-4">Why Homobie Is Smarter</h2>
        <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-gray-300 text-sm sm:text-base">
          <li>Uses data-driven recommendations</li>
          <li>Provides tools like EMI calculator online</li>
          <li>Digital-first onboarding reduces paperwork</li>
          <li>Supports smarter planning with SIPs</li>
          <li>Fast, transparent, and people-first</li>
        </ul>
      </section>

      {/* CTA */}
      <section className="bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 text-center">
        <CtaButton>
          Smarter lending starts with smarter matching — and that’s what Homobie was built for.
        </CtaButton>
      </section>

    </div>
  </div>
);

export default Blog7;
