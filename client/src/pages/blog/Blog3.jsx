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
    >
      {children}
    </a>
  );
};

const Blog3 = ({ styles }) => (
  <div className="max-w-4xl mx-auto px-6 py-12 text-white">
    <h1 className="text-4xl font-bold text-[#fff] mb-8 leading-tight">
      Prepay Your Home Loan or Invest in SIP? A Dilemma Solved
    </h1>

    <h2 className="text-2xl font-semibold text-[#fff] mb-4">
      Introduction: A Common Crossroads
    </h2>
    <p className="mb-6 leading-relaxed text-white">
      With surplus cash, should you{" "}
      <strong className="text-[#e74c3c] font-semibold">
        prepay your home loan
      </strong>{" "}
      or{" "}
      <strong className="text-[#27ae60] font-semibold">
        invest in SIP
      </strong>
      ? This is a question that many financially-conscious individuals face,
      especially in a time when loan interest rates and market returns are
      dynamic.
    </p>

    <h2 className="text-2xl font-semibold text-[#fff] mb-4">
      Understanding the Basics
    </h2>
    <p className="mb-6 leading-relaxed text-white">
      Prepaying your{" "}
      <strong className="text-[#e74c3c] font-semibold">home loan</strong>{" "}
      reduces your interest burden and shortens the loan tenure. On the other
      hand, investing in{" "}
      <strong className="text-[#27ae60] font-semibold">SIP</strong> allows
      your money to grow through the power of compounding, provided the
      investment return is higher than your loan interest rate.
    </p>

    <h2 className="text-2xl font-semibold text-[#fff] mb-4">
      Key Factors to Consider
    </h2>
    <ul className="list-disc list-inside space-y-2 mb-6 text-white">
      <li>
        Loan interest rate vs. expected SIP returns – Compare both to make a
        sound decision.
      </li>
      <li>
        Financial security – Prepaying reduces debt risk, while SIP provides
        growth potential.
      </li>
      <li>
        Tax benefits – Consider the deductions you receive under{" "}
        <strong className="text-[#8e44ad] font-semibold">Section 24</strong>{" "}
        and{" "}
        <strong className="text-[#8e44ad] font-semibold">
          Section 80C
        </strong>
        .
      </li>
    </ul>

    <h2 className="text-2xl font-semibold text-[#fff] mb-4">
      The Verdict
    </h2>
    <p className="mb-6 leading-relaxed text-white">
      If your loan interest rate is higher than the average{" "}
      <strong className="text-[#27ae60] font-semibold">
        SIP returns
      </strong>{" "}
      (post-tax), prepaying your home loan might be the wiser choice.
      Otherwise, investing in SIP could yield better long-term results.
    </p>

    <blockquote className="border-l-4 border-[#f39c12] pl-4 italic text-[#fff] mb-8">
      “A balanced approach — partially prepaying your home loan and
      simultaneously investing in SIP — can give you the best of both worlds.”
    </blockquote>

    <p className="text-white font-medium">
      Make sure to assess your risk tolerance, financial goals, and current
      market conditions before making the decision.
    </p>
    <div className="text-center mt-8">
      <CtaButton styles={styles} href="#">
        Assess your goals and make the right move with Homobie
      </CtaButton>
    </div>
  </div>
);

export default Blog3;