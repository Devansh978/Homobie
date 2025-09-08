import React, { useState } from "react";
import { Home, Hammer, Edit, Layers, FileText, Users, CheckCircle, TrendingUp, DollarSign, Globe } from "lucide-react";


const CtaButton = ({ href = "#", children }) => {
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
      <TrendingUp className={`ml-2 w-5 h-5 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`} />
    </a>
  );
};

const SectionCard = ({ title, description, icon: Icon }) => (
  <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 mb-6">
    <div className="flex items-start gap-4">
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

const Blog9 = () => {
  const sections = [
    { title: "1. Home Purchase Loan", icon: Home, text: "Borrow money to buy new/resale property; fixed/floating rates; 75-90% funding." },
    { title: "2. Home Construction Loan", icon: Hammer, text: "Build on own land; disbursed in stages; covers plot + construction." },
    { title: "3. Home Improvement / Renovation Loan", icon: Edit, text: "For repairs, upgrades, interiors; faster approval; small ticket size." },
    { title: "4. Home Extension Loan", icon: Layers, text: "Add rooms/floors; suitable for growing families; easy approval." },
    { title: "5. Plot or Land Purchase Loan", icon: FileText, text: "Buy residential land; 70-85% funding; good for future construction." },
    { title: "6. Composite Loan (Plot + Construction)", icon: Layers, text: "Merge plot + construction; single repayment schedule." },
    { title: "7. Balance Transfer Loan", icon: DollarSign, text: "Switch to lower interest lender; reduce EMI/tenure; check fees." },
    { title: "8. Top-up Loan on Existing Home Loan", icon: DollarSign, text: "Extra funds on current loan; ideal for renovation, education, emergencies." },
    { title: "9. Loan Against Property (LAP)", icon: Home, text: "Secured by property; higher amounts; good for business or debt consolidation." },
    { title: "10. NRI Home Loans", icon: Globe, text: "For NRIs buying in India; special documentation; top lenders offer compliance." },
  ];

  return (
    <div className="min-h-screen  text-gray-100 px-6 py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Which Home Loan Type Should You Choose? A Simple Guide for Indian Buyers</h1>
      <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto mb-5"></div>
      <p className="leading-relaxed mb-10 text-gray-300 text-center">
        Understand your options—home purchase, construction, renovation, top-up, LAP, or NRI loans. Tools like <strong>EMI calculator online</strong> or a <strong>SIP investment plan</strong> strategy help you plan. <strong>Homobie</strong> matches your profile to the best-fit loan.
      </p>

      {sections.map((s, i) => (
        <SectionCard key={i} title={s.title} description={s.text} icon={s.icon} />
      ))}

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">How to Choose the Right Loan Type</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li><strong>Define your purpose:</strong> Purchase, build, extend, renovate, refinance?</li>
          <li><strong>Salaried vs Self-employed:</strong> Check eligibility free at <strong>Homobie</strong>.</li>
          <li><strong>Loan size & tenure:</strong> Plot/construction loans may have staged disbursement; LAP funds larger amounts.</li>
          <li><strong>Interest structure:</strong> Fixed vs floating; public banks lower floaters, HFCs flexible terms.</li>
          <li><strong>Financial planning tools:</strong> Use <strong>EMI calculator online</strong> and <strong>SIP investment plan</strong> for smart planning.</li>
        </ul>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Why Homobie Helps You Choose Smarter</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>Analyzes your profile to recommend the right <strong>home loan</strong> or <strong>mortgage loan</strong>.</li>
          <li>Shows refinancing & <strong>balance transfer</strong> options to reduce EMI.</li>
          <li>Compares <strong>loan against property interest rates</strong>.</li>
          <li>Provides instant <strong>EMI calculator online</strong> results.</li>
          <li>Supports planning with <strong>SIP investment plan</strong>.</li>
          <li>Reduces paperwork with digital onboarding & checklists.</li>
        </ul>
      </div>

      <div className="text-center">
        <CtaButton href="loan-application?type=home-loan">
          Match smarter and borrow better with Homobie.
        </CtaButton>
      </div>
    </div>
  );
};

export default Blog9;
