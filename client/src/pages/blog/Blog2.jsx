import React, { useState } from "react";
import { TrendingUp } from "lucide-react";

const CtaButton = ({ href = "#", children }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <a
      href={href}
      className={`
        inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4
        bg-gradient-to-r from-blue-600 to-blue-700
        text-sm sm:text-base md:text-lg text-white font-semibold rounded-lg 
        shadow-lg transform transition-all duration-300
        hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-105
        focus:outline-none focus:ring-4 focus:ring-blue-300
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

const Blog2 = () => (
  <div className="min-h-screen text-gray-200">
    <div className="max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10 md:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-snug md:leading-tight">
          What is the Best CIBIL Score for a Loan Approval? A Complete Guide for 2025
        </h1>
        <div className="w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto"></div>
      </div>

      {/* Section Component */}
      {[
        {
          title: "Quick Summary",
          content: (
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Ideal CIBIL score: <strong className="italic text-white">750+</strong> for home loan approval</li>
              <li>Minimum acceptable: <strong className="italic text-white">700</strong>; Below 650 may limit options</li>
              <li>Score affects: Interest rates, loan amount, approval speed</li>
              <li><strong className="italic text-white">Homobie</strong>: Smart loan matchmaker that helps with low/high score navigation</li>
              <li>✔ Check your score for free and take steps to improve if needed</li>
            </ul>
          ),
        },
        {
          title: "Introduction: Why CIBIL Score Matters More Than Ever",
          content: (
            <p className="text-gray-300 leading-relaxed">
              In 2025, lenders rely heavily on your CIBIL score to approve loans quickly and digitally. A strong score not
              only boosts your eligibility but also helps you negotiate better interest rates. Whether you're applying for{" "}
              <strong className="italic text-white">home loans</strong>, <strong className="italic text-white">mortgage loans</strong>, or{" "}
              <strong className="italic text-white">loan against property</strong>, your credit profile plays a critical role.
              With platforms like <strong className="italic text-white">Homobie</strong>, you can now check your eligibility instantly based
              on your credit score.
            </p>
          ),
        },
        {
          title: "What is a CIBIL Score?",
          content: (
            <p className="text-gray-300 leading-relaxed">
              A CIBIL score is a 3-digit number (ranging from 300 to 900) that reflects your creditworthiness based on past
              credit behavior. It’s calculated by TransUnion CIBIL and widely used by Indian banks and NBFCs for evaluating
              loan applications for <strong className="italic text-white">home loans</strong>,{" "}
              <strong className="italic text-white">loan against property</strong>, and more.
            </p>
          ),
        },
        {
          title: "Why CIBIL Score is Crucial for Loan Approval",
          content: (
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li><strong className="italic text-white">Eligibility Filter:</strong> Lenders set minimum score cutoffs to reduce risk.</li>
              <li><strong className="italic text-white">Better Offers:</strong> Higher scores attract lower interest rates and higher loan amounts.</li>
              <li><strong className="italic text-white">Digital Processing:</strong> Platforms like <strong className="italic text-white">Homobie</strong> match you with pre-approved offers based on your score instantly.</li>
            </ul>
          ),
        },
        {
          title: "Ideal CIBIL Score for Different Loans",
          content: (
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li><strong className="italic text-white">Home Loans:</strong> 750 and above is ideal</li>
              <li><strong className="italic text-white">Loan Against Property Loan:</strong> 750+ preferred for best terms</li>
              <li><strong className="italic text-white">Balance Transfer:</strong> 720+ recommended for seamless switching</li>
            </ul>
          ),
        },
        {
          title: "Factors Affecting Your CIBIL Score",
          content: (
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li><strong className="italic text-white">Repayment History:</strong> Missed EMIs lower your score significantly</li>
              <li><strong className="italic text-white">Credit Utilization:</strong> High usage (&gt;30%) of your credit limit reduces your score</li>
              <li><strong className="italic text-white">Credit Mix:</strong> Balanced mix of secured and unsecured loans boosts score</li>
              <li><strong className="italic text-white">Hard Inquiries:</strong> Too many loan applications in a short span harm your score</li>
            </ul>
          ),
        },
        {
          title: "How to Check Your CIBIL Score for Free",
          content: (
            <p className="text-gray-300 leading-relaxed">
              Use RBI-mandated portals or trusted fintech platforms to check your score once a year for free.{" "}
              <strong className="italic text-white">Homobie</strong> integrates score checks with its loan match system to give you
              accurate insights in seconds.
            </p>
          ),
        },
      ].map((section, idx) => (
        <section key={idx} className="bg-gray-800 rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-6 sm:mb-8 md:mb-10">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4 text-white">
            {section.title}
          </h2>
          {section.content}
        </section>
      ))}

      {/* CTA Section */}
      <div className="text-center mt-6 md:mt-8">
        <div className="bg-gray-800 rounded-xl shadow-lg p-5 sm:p-6 md:p-8 inline-block">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">
            Ready to Apply for Your Home Loan?
          </h3>
          <p className="text-gray-300 mb-4 sm:mb-5 md:mb-6">
            Get pre-approval offers and expert guidance instantly
          </p>
          <CtaButton href="/loan-application?type=home-loan">
            Check Your Eligibility & Apply Now
          </CtaButton>
        </div>
      </div>

    </div>
  </div>
);

export default Blog2;
