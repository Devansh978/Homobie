import React, { useState } from "react";
import { CheckCircle, FileText, Calculator, Home, TrendingUp, Clock } from "lucide-react";

const CtaButton = ({ href = "/loan-application?type=home-loan", children, styles }) => {
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

const SectionIcon = ({ icon: Icon, className = "" }) => (
  <Icon className={`w-6 h-6 text-blue-400 ${className}`} />
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

const ChecklistItem = ({ children, highlight = false }) => (
  <li
    className={`flex items-start space-x-3 py-2 ${
      highlight ? "bg-green-900/40 px-4 rounded-lg" : ""
    }`}
  >
    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
    <span className="text-gray-300">{children}</span>
  </li>
);

const DocumentItem = ({ title, details }) => (
  <li className="flex items-start space-x-3 py-2">
    <FileText className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
    <div>
      <span className="font-semibold text-gray-100">{title}</span>
      <span className="text-gray-300">: {details}</span>
    </div>
  </li>
);

const Blog1 = ({ styles }) => (
  <div className="min-h-screen ">
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-6 leading-tight">
          How to Know If You're Eligible for a Home Loan – Fast & Easy Checklist
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto"></div>
      </div>

      {/* Introduction Section */}
      <section className="bg-gray-800 rounded-xl shadow-lg p-8 mb-10">
        <div className="flex items-center space-x-3 mb-6">
          <SectionIcon icon={TrendingUp} />
          <h2 className="text-2xl font-semibold text-gray-100">
            Your First Step Toward Homeownership
          </h2>
        </div>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-300 leading-relaxed mb-4">
            Buying a home is a major milestone, and securing a home loan is often the
            most practical way to achieve it. But before you start visiting properties
            or negotiating prices, it's essential to determine whether you're eligible
            for a home loan.
          </p>
          <p className="text-gray-300 leading-relaxed">
            In India's rapidly evolving housing market, banks and NBFCs offer a wide
            range of home financing solutions. Understanding your eligibility early
            ensures you apply to lenders that match your profile, maximizing your
            chances of approval.
          </p>
        </div>
      </section>

      {/* What is Home Loan Eligibility */}
      <section className="bg-gray-800 rounded-xl shadow-lg p-8 mb-10">
        <div className="flex items-center space-x-3 mb-6">
          <SectionIcon icon={FileText} />
          <h2 className="text-2xl font-semibold text-gray-100">
            What is Home Loan Eligibility?
          </h2>
        </div>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-300 leading-relaxed mb-4">
            Home loan eligibility is a lender's way of evaluating whether you qualify
            for a loan and how much you can borrow.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Lenders assess criteria like income, creditworthiness, and repayment
            ability. Your stability, age, and property location also influence
            decisions.
          </p>
        </div>
      </section>

      {/* Top Factors Section */}
      <section className="mb-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-100 mb-4">
            Top Factors That Determine Home Loan Eligibility
          </h2>
          <p className="text-gray-400">
            Understanding these key factors will help you prepare better
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <FactorCard
            icon={TrendingUp}
            title="Income and Employment Status"
            description="Stable income is key. Salaried individuals with continuity and self-employed with steady business income are preferred."
          />
          <FactorCard
            icon={Clock}
            title="Age of the Applicant"
            description="Ideal age: 21–60 (salaried), up to 65 (self-employed). Younger borrowers benefit from longer repayment tenures."
          />
          <FactorCard
            icon={CheckCircle}
            title="Credit Score and History"
            description="A CIBIL score of 750+ is essential. It reflects repayment behavior and financial discipline."
          />
          <FactorCard
            icon={FileText}
            title="Existing Financial Obligations"
            description="Your debt-to-income ratio (DTI) is monitored. Lower DTI = better repayment capacity."
          />
          <div className="md:col-span-2">
            <FactorCard
              icon={Home}
              title="Property Type and Location"
              description="Only legally clear, bank-approved properties qualify."
            />
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-800 rounded-xl shadow-lg p-8 mb-10 text-white">
        <div className="flex items-center space-x-3 mb-6">
          <Calculator className="w-6 h-6" />
          <h2 className="text-2xl font-semibold">
            Home Loan Eligibility Calculator: Know Before You Apply
          </h2>
        </div>
        <p className="leading-relaxed mb-4 text-blue-100">
          A calculator estimates how much loan you can qualify for based on income,
          EMIs, tenure, and rate. It's a smart way to pre-check eligibility.
        </p>
        <p className="leading-relaxed text-blue-100">
          Many banks provide these tools. Platforms like{" "}
          <strong className="text-white">Homobie</strong> combine eligibility checks,
          EMI planning, and loan assistance.
        </p>
      </section>

      {/* Checklist Section */}
      <section className="bg-gray-800 rounded-xl shadow-lg p-8 mb-10">
        <div className="flex items-center space-x-3 mb-6">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <h2 className="text-2xl font-semibold text-gray-100">
            Fast & Easy Home Loan Eligibility Checklist
          </h2>
        </div>
        <ul className="space-y-3">
          <ChecklistItem>Minimum monthly income of ₹25,000+</ChecklistItem>
          <ChecklistItem>Steady job or business for 2+ years</ChecklistItem>
          <ChecklistItem highlight>CIBIL score of 750+</ChecklistItem>
          <ChecklistItem>Debt-to-income ratio below 40%</ChecklistItem>
          <ChecklistItem>Age 21–60 (salaried), up to 65 (self-employed)</ChecklistItem>
          <ChecklistItem>Bank-approved, dispute-free property</ChecklistItem>
          <ChecklistItem>All key documents in place</ChecklistItem>
        </ul>
      </section>

      {/* Documents Section */}
      <section className="bg-gray-800 rounded-xl shadow-lg p-8 mb-10">
        <div className="flex items-center space-x-3 mb-6">
          <FileText className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-100">
            Common Documents Required
          </h2>
        </div>
        <ul className="space-y-3">
          <DocumentItem title="KYC Documents" details="Aadhaar, PAN, Passport, etc." />
          <DocumentItem title="Income Proof" details="Salary slips, ITRs, Form 16" />
          <DocumentItem title="Employment Proof" details="Offer letter, job certificate" />
          <DocumentItem title="Bank Statements" details="6–12 months" />
          <DocumentItem title="Property Papers" details="Sale deed, tax receipts" />
          <DocumentItem title="Existing Loan Info" details="EMI schedules, closure letters" />
        </ul>
      </section>

      {/* Conclusion Section */}
      <section className="bg-gray-800 rounded-xl shadow-lg p-8 mb-10">
        <div className="flex items-center space-x-3 mb-6">
          <Home className="w-6 h-6 text-green-500" />
          <h2 className="text-2xl font-semibold text-gray-100">
            Be Prepared and Get Closer to Your Dream Home
          </h2>
        </div>
        <p className="text-gray-300 leading-relaxed mb-4">
          Understanding eligibility is a powerful first step toward homeownership. Use
          tools like an <strong>EMI calculator</strong> and gather documents early.
        </p>
        <p className="text-gray-300 leading-relaxed">
          Platforms like <strong>Homobie</strong> simplify your loan journey with tools,
          guidance, and pre-approved networks.
        </p>
      </section>

      {/* Summary Checklist */}
      <section className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-8 mb-10 border border-gray-700">
        <h2 className="text-xl font-semibold mb-6 text-gray-100 flex items-center">
          <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
          Fast & Easy Home Loan Eligibility Checklist
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
              <strong className="text-green-400">Stable Income</strong>
              <p className="text-gray-300 text-sm mt-1">
                ₹25,000+ monthly; 2+ years stability
              </p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
              <strong className="text-green-400">Age Range</strong>
              <p className="text-gray-300 text-sm mt-1">21–60 (salaried), up to 65</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
              <strong className="text-green-400">Credit Score</strong>
              <p className="text-gray-300 text-sm mt-1">CIBIL 750+</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
              <strong className="text-green-400">Debt Ratio</strong>
              <p className="text-gray-300 text-sm mt-1">DTI &lt; 40%</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
              <strong className="text-green-400">Property</strong>
              <p className="text-gray-300 text-sm mt-1">
                Bank-approved, clear legal title
              </p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
              <strong className="text-green-400">Documents</strong>
              <div className="text-gray-300 text-sm mt-1 space-y-1">
                <div>• Aadhaar, PAN, Passport</div>
                <div>• Salary slips, ITR, Form 16</div>
                <div>• Job/Business proof</div>
                <div>• Bank Statements</div>
                <div>• Sale deed, tax receipts</div>
              </div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
              <strong className="text-green-400">Use Tools</strong>
              <p className="text-gray-300 text-sm mt-1">
                Check eligibility using calculators
              </p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
              <strong className="text-green-400">Pro Tip</strong>
              <p className="text-gray-300 text-sm mt-1">
                Use <strong>Homobie</strong> for expert help & pre-approval
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="text-center">
        <div className="bg-gray-800 rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-100 mb-4">
            Ready to Check Your Eligibility?
          </h3>
          <p className="text-gray-400 mb-6">
            Get instant pre-approval offers and expert guidance
          </p>
          <CtaButton styles={styles}>
            Check Now & Get Pre-Approved Offers
          </CtaButton>
        </div>
      </div>
    </div>
  </div>
);

export default Blog1;
