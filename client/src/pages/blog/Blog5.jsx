import React, { useState } from "react";
import { CheckCircle, TrendingUp, Calculator, Home, FileText } from "lucide-react";

const CtaButton = ({ href = "/loan-application?type=home-loan", children }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <a
      href={href}
      className={`
        inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 
        text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300
        hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-105
        focus:outline-none focus:ring-4 focus:ring-blue-500
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <TrendingUp
        className={`ml-2 w-5 h-5 transition-transform duration-300 ${
          isHovered ? "translate-x-1" : ""
        }`}
      />
    </a>
  );
};

const SectionIcon = ({ icon: Icon }) => (
  <Icon className="w-6 h-6 text-blue-400" />
);

const FactorCard = ({ title, description, icon: Icon }) => (
  <div className="rounded-lg shadow-md p-6 border border-gray-700 bg-gray-800 hover:shadow-lg transition-shadow duration-300">
    <div className="flex items-start space-x-4">
      <div className="bg-gray-700 p-3 rounded-lg">
        <Icon className="w-6 h-6 text-blue-400" />
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-gray-100 mb-2">{title}</h3>
        <p className="text-gray-300 leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

const Blog5 = () => (
  <div className="min-h-screen">
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-100">

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          How Does Taking Out a Home Loan Affect Your Income Tax?
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto"></div>
      </div>

      {/* Introduction Section */}
      <section className="bg-gray-800 rounded-xl shadow-lg p-8 mb-10">
        <p className="text-gray-300 leading-relaxed mb-4">
          A home loan offers significant <strong>income tax benefits</strong> in India. You can claim deductions on the principal under <strong>Section 80C</strong> (up to ₹1.5 L), interest under <strong>Section 24(b)</strong> (up to ₹2 L on self-occupied properties), and extra deductions under <strong>Section 80EE</strong> and <strong>80EEA</strong> for first-time or affordable housing loans. Joint loans boost savings further. Homobie’s tools like the <strong>EMI calculator online</strong> & intelligent loan matches help you maximize these deductions stress-free.
        </p>
      </section>

      {/* Factors Section */}
      <section className="mb-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-100 mb-4">
            Key Tax Benefits of a Home Loan
          </h2>
          <p className="text-gray-400">Understand how each component can save you money</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <FactorCard
            icon={FileText}
            title="1. Principal Repayment (Section 80C)"
            description="Claim deductions for the amount repaid toward the principal of your loan, including stamp duty and registration, up to ₹1.5 lakh annually."
          />
          <FactorCard
            icon={Calculator}
            title="2. Interest Payment (Section 24(b))"
            description="Deduct interest on home loan EMIs. Limit is ₹2 lakh for self-occupied homes, unlimited for let-out properties subject to loss set-off rules."
          />
          <FactorCard
            icon={TrendingUp}
            title="3. Additional Deductions: Section 80EE & 80EEA"
            description="Extra deductions for first-time or affordable housing loans, up to ₹1.5 L. Combine with 80C and 24(b) for maximum savings."
          />
          <FactorCard
            icon={Home}
            title="4. Joint Home Loan Benefits"
            description="Joint loans allow each co-borrower to claim deductions separately, multiplying your tax savings potential."
          />
        </div>
      </section>

      {/* Strategic Tips Section */}
      <section className="bg-gray-800 rounded-xl shadow-lg p-8 mb-10">
        <div className="flex items-center space-x-3 mb-6">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <h2 className="text-2xl font-semibold text-gray-100">
            Strategic Tips to Maximize Tax Benefits
          </h2>
        </div>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>Claim principal and interest deductions diligently each year.</li>
          <li>Use Sections 80EE/80EEA if you're a first-time buyer.</li>
          <li>Opt for joint loans to multiply benefits.</li>
          <li>Lodge pre-construction interest claims over five years post-possession.</li>
          <li>Maintain documentation per updated ITR guidelines.</li>
          <li>Run numbers on tax paid vs savings before choosing new regime.</li>
        </ul>
      </section>

      {/* Conclusion & CTA */}
      <section className="bg-gray-800 rounded-xl shadow-lg p-8 mb-10 text-center">
        <h2 className="text-2xl font-bold mb-4">A Smarter Way to Borrow</h2>
        <p className="text-gray-300 mb-6">
          Homobie simplifies tax-smart borrowing with intuitive tools like the <strong>EMI calculator online</strong> and smart loan profiling.
        </p>
        <CtaButton>
          Ready to borrow smarter and save more? Start here with Homobie’s tools &raquo;
        </CtaButton>
      </section>
    </div>
  </div>
);

export default Blog5;
