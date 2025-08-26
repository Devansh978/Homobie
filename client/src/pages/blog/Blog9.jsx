import React, { useState } from "react";

const CtaButton = ({ href = "#", children, styles }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <a
      href={href}
      style={{
        ...styles.ctaButton,
        ...(isHovered ? styles.ctaButtonHover : null),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="inline-block text-center"
    >
      {children}
    </a>
  );
};

const Blog9 = ({ styles }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">
        Which Home Loan Type Should You Choose? A Simple Guide for Indian Buyers
      </h1>
      <div className="mb-8">
        <p className="leading-relaxed">
          If you’re planning to buy, build, expand, renovate, or refinance a
          home in India, different loan types are designed for each purpose.
          From a standard home purchase loan to loan against property or NRI
          loans—understanding each option helps you pick the right one. Use
          tools like an <strong>EMI calculator online</strong> or explore a{" "}
          <strong>SIP investment plan</strong> strategy if considering top-up or
          refinancing. <strong>Homobie</strong> helps match your profile to the
          best-fit loan effortlessly.
        </p>
      </div>

      {/* Sections */}
      {[
        {
          title: "1. Home Purchase Loan",
          text: "The most common type of home loan—it lets you borrow money to buy a new or resale home, or even an under-construction property. Lenders typically fund up to 75-90% of the property value. Many lenders offer options for both fixed- and floating-rate interest. Ideal for first-time buyers and salaried professionals.",
        },
        {
          title: "2. Home Construction Loan",
          text: "Own land and want to build your home? A construction loan disburses funds in stages based on building progress. Can also cover plot purchase (if bought within the past year) plus construction costs.",
        },
        {
          title: "3. Home Improvement / Renovation Loan",
          text: "Used for repainting, repairs, upgrades, or interior renovations. Comes with faster approvals and smaller ticket sizes—helpful for homeowners improving existing property.",
        },
        {
          title: "4. Home Extension Loan",
          text: "For expanding an existing home—adding rooms or floors. Often chosen by growing families. Easy approval for salaried or retired borrowers.",
        },
        {
          title: "5. Plot or Land Purchase Loan",
          text: "Helps buy residential land. Borrowers can later use another loan to build. Lenders usually fund 70-85% of plot value. Ideal for investors or future builders.",
        },
        {
          title: "6. Composite Loan (Plot + Construction)",
          text: "Combines plot purchase and construction cost in one loan. Useful when you plan to build immediately. Offers merged repayment schedules.",
        },
        {
          title: "7. Balance Transfer Loan",
          text: "Already repaying a home loan? A balance transfer lets you switch to a lender offering lower interest. Can reduce EMI or tenure—but watch out for processing fees. Use an EMI calculator online to check savings.",
        },
        {
          title: "8. Top-up Loan on Existing Home Loan",
          text: "Need more funds beyond your current loan? A top-up lets you borrow extra without a new application. Suitable for renovation, education, or emergencies.",
        },
        {
          title: "9. Loan Against Property (LAP)",
          text: "A secured loan where you pledge property as collateral. Offers higher amounts at competitive loan against property interest rates. Useful for business capital, debt consolidation, or personal needs.",
        },
        {
          title: "10. NRI Home Loans",
          text: "Tailored for NRIs buying property in India. Includes special documentation and income verification. Offered by most top lenders with compliance focus.",
        },
      ].map((section, i) => (
        <div key={i} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
          <p className="leading-relaxed">{section.text}</p>
        </div>
      ))}

      {/* How to Choose */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          How to Choose the Right Loan Type
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Define your purpose</strong>: Purchase, build, extend,
            renovate, refinance?
          </li>
          <li>
            <strong>Salaried vs Self-employed</strong>: Different eligibility
            and documentation. Check eligibility free at{" "}
            <strong>Homobie</strong>.
          </li>
          <li>
            <strong>Loan size and tenure</strong>: Plot and construction loans
            may require staged disbursement; LAP funds larger amounts.
          </li>
          <li>
            <strong>Interest structure</strong>: Fixed vs floating. Public banks
            usually offer lower floaters; HFCs offer flexible terms.
          </li>
          <li>
            <strong>Financial planning tools</strong>: Use an{" "}
            <strong>EMI calculator online</strong> to compare repayments.
            Consider a <strong>SIP investment plan</strong> to reinvest savings.
          </li>
        </ul>
      </div>

      {/* Why Homobie */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          Why Homobie Helps You Choose Smarter
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            Analyzes your profile and goals to recommend the right{" "}
            <strong>home loan</strong> or <strong>mortgage loan</strong>.
          </li>
          <li>
            Shows refinancing and <strong>balance transfer</strong> options to
            lower EMIs.
          </li>
          <li>
            Compares <strong>loan against property interest rates</strong> for
            large funding needs.
          </li>
          <li>
            Includes an intuitive <strong>EMI calculator online</strong> for
            instant repayment views.
          </li>
          <li>
            Supports smart planning with a <strong>SIP investment plan</strong>.
          </li>
          <li>
            Reduces paperwork with digital onboarding and document checklists.
          </li>
        </ul>
      </div>

      {/* Conclusion */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Conclusion</h2>
        <p className="leading-relaxed mb-2">
          India offers many home loan types—purchase, construction, renovation,
          extension, top-up, or LAP. Choosing depends on your goals, employment,
          and financial plan.
        </p>
        <p className="leading-relaxed">
          <strong>Homobie</strong> simplifies the decision with profiling,
          tools, and lender matching—so you borrow smarter and faster.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center mt-10">
        <CtaButton styles={styles} href="loan-application?type=home-loan">
          Take control of your borrowing with clarity. Match smarter and borrow
          better with Homobie.
        </CtaButton>
      </div>
    </div>
  );
};

export default Blog9;
