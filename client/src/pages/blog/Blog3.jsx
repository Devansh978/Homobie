import React, { useState } from "react";
import { TrendingUp } from "lucide-react";

const CtaButton = ({ href = "#", children }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <a
      href={href}
      className={`
        inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700
        text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300
        hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-105
        focus:outline-none focus:ring-4 focus:ring-blue-300
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <TrendingUp className={`ml-2 w-5 h-5 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`} />
    </a>
  );
};

const Blog3 = () => (
  <div className="min-h-screen text-gray-200">
    <div className="max-w-4xl mx-auto px-6 py-12">
      
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          Prepay Your Home Loan or Invest in SIP? A Dilemma Solved
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto"></div>
      </div>

      {/* Introduction */}
      <section className="bg-gray-800 rounded-xl shadow-lg p-8 mb-10">
        <h2 className="text-2xl font-semibold text-white mb-4">Introduction: A Common Crossroads</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          With surplus cash, should you{" "}
          <strong className="text-red-500 font-semibold">prepay your home loan</strong> or{" "}
          <strong className="text-green-500 font-semibold">invest in SIP</strong>? This is a common dilemma many face, especially
          in a dynamic market where loan rates and investment returns fluctuate.
        </p>
      </section>

      {/* Basics */}
      <section className="bg-gray-800 rounded-xl shadow-lg p-8 mb-10">
        <h2 className="text-2xl font-semibold text-white mb-4">Understanding the Basics</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          Prepaying your <strong className="text-red-500 font-semibold">home loan</strong> reduces interest burden and tenure, while investing in{" "}
          <strong className="text-green-500 font-semibold">SIP</strong> allows compounding growth, if returns exceed your loan rate.
        </p>
      </section>

      {/* Key Factors */}
      <section className="bg-gray-800 rounded-xl shadow-lg p-8 mb-10">
        <h2 className="text-2xl font-semibold text-white mb-4">Key Factors to Consider</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>Loan interest rate vs. expected SIP returns – Compare both to make a sound decision.</li>
          <li>Financial security – Prepaying reduces debt risk, SIP provides growth potential.</li>
          <li>Tax benefits – Consider deductions under <strong className="text-purple-500 font-semibold">Section 24</strong> and <strong className="text-purple-500 font-semibold">Section 80C</strong>.</li>
        </ul>
      </section>

      {/* Verdict */}
      <section className="bg-gray-800 rounded-xl shadow-lg p-8 mb-10">
        <h2 className="text-2xl font-semibold text-white mb-4">The Verdict</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          If loan interest exceeds average <strong className="text-green-500 font-semibold">SIP returns</strong> (post-tax), prepaying might be wiser. Otherwise, SIP may yield better long-term growth.
        </p>
        <blockquote className="border-l-4 border-yellow-500 pl-4 italic text-gray-100 mb-4">
          “A balanced approach — partially prepaying your home loan while investing in SIP — can give the best of both worlds.”
        </blockquote>
        <p className="text-gray-300 font-medium">Assess your risk tolerance, financial goals, and market conditions before deciding.</p>
      </section>

      {/* CTA */}
      <div className="text-center mt-8">
        <CtaButton href="/loan-application?type=home-loan">
          Assess your goals and make the right move with Homobie
        </CtaButton>
      </div>
    </div>
  </div>
);

export default Blog3;
