import React, { useState } from "react";
import {
  FileText,
  User,
  Home,
  ClipboardCheck,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

const CtaButton = ({ href = "/loan-application?type=home-loan", children }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <a
      href={href}
      className={`
        inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 
        bg-gradient-to-r from-blue-600 to-blue-700 
        text-white font-semibold rounded-lg shadow-lg 
        transform transition-all duration-300
        hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-105
        focus:outline-none focus:ring-4 focus:ring-blue-500
        text-sm sm:text-base
      `}
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
  <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
    <div className="flex items-start gap-3 sm:gap-4">
      <div className="bg-gray-700 p-2 sm:p-3 rounded-lg">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-100 mb-1 sm:mb-2">
          {title}
        </h3>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  </div>
);

const Blog8 = () => (
  <div className="min-h-screen text-gray-100">
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
          What Documents Are Essential for Home Loan Approval?
        </h1>
        <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto"></div>
      </div>

      {/* Intro */}
      <section className="bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8 sm:mb-10">
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          To get a home loan approved in India—whether a <strong>home loan</strong>, 
          <strong> mortgage loan</strong>, or <strong>loan against property</strong>—you need essential documents: KYC, income proof, employment proof, property papers, bank statements, photographs, and signed application form. Platforms like <strong>Homobie</strong> help you prepare and organize them for smooth approval.
        </p>
      </section>

      {/* Document Sections as Cards */}
      <section className="mb-8 sm:mb-10 grid gap-4 sm:gap-6 md:grid-cols-2">
        <SectionCard
          icon={User}
          title="1. KYC & Identity Documents"
          description="PAN, Aadhaar, Voter ID, Passport, utility bills, birth certificate, photos, signature verification."
        />
        <SectionCard
          icon={FileText}
          title="2. Income & Employment Proof"
          description="Salaried: salary slips, Form 16, IT returns, 6-month bank statement, employment letter. Self-employed: IT returns, balance sheet, licenses, 6-month bank statements."
        />
        <SectionCard
          icon={Home}
          title="3. Property & Contribution Documents"
          description="Sale agreement, title deeds, no encumbrance certificate, building approvals, payment receipts, proof of contribution."
        />
        <SectionCard
          icon={ClipboardCheck}
          title="4. Banking & Loan History"
          description="6 months' bank statements, ongoing loans, foreclosure letters, cheque for processing fees."
        />
        <SectionCard
          icon={CheckCircle}
          title="5. Additional (Optional) Documents"
          description="Marriage certificate, power of attorney, NRI documents, guarantor forms."
        />
        <SectionCard
          icon={TrendingUp}
          title="6. Tips to Avoid Rejection"
          description="Use checklist, label scans, submit updated records, double-check consistency, respond to queries promptly."
        />
        <SectionCard
          icon={FileText}
          title="7. How Homobie Makes This Easy"
          description="Creates checklist, organizes uploads, tracks missing items, provides EMI calculator & smart recommendations, connects to lenders."
        />
      </section>

      {/* CTA */}
      <section className="rounded-xl shadow-lg p-6 sm:p-8 text-center">
        <CtaButton>
          Get matched. Get organized. Get home—faster. With Homobie.
        </CtaButton>
      </section>
    </div>
  </div>
);

export default Blog8;
