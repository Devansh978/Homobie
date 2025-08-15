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

const Blog1 = ({ styles }) => (
  <div className="max-w-4xl mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-6">
      How to Know If You’re Eligible for a Home Loan – Fast & Easy Checklist
    </h1>

    <h2 className="text-2xl font-semibold mt-6 mb-4">
      Introduction: Your First Step Toward Homeownership
    </h2>
    <p className="mb-4">
      Buying a home is a major milestone, and securing a home loan is often the
      most practical way to achieve it. But before you start visiting properties
      or negotiating prices, it's essential to determine whether you're eligible
      for a home loan. Knowing this upfront can save you time, avoid unnecessary
      rejections, and help you make confident financial decisions.
    </p>
    <p className="mb-4">
      In India’s rapidly evolving housing market, banks and NBFCs offer a wide
      range of home financing solutions. Understanding your home loan eligibility
      early ensures you apply to lenders that match your profile, maximizing your
      chances of approval with better terms.
    </p>

    <h2 className="text-2xl font-semibold mt-6 mb-4">What is Home Loan Eligibility?</h2>
    <p className="mb-4">
      Home loan eligibility is a lender’s way of evaluating whether you qualify
      for a loan and how much you can borrow. Lenders assess several criteria,
      such as your income, employment status, creditworthiness, and repayment
      ability.
    </p>
    <p className="mb-4">
      Each financial institution has its own lending criteria, but the core
      principle remains the same: determining if you can responsibly repay the
      loan over the chosen tenure. Factors such as your financial stability, age,
      and property location also influence this decision.
    </p>

    <h2 className="text-2xl font-semibold mt-6 mb-4">Top Factors That Determine Home Loan Eligibility</h2>

    <h3 className="text-xl font-semibold mt-4 mb-2">Income and Employment Status</h3>
    <p className="mb-4">
      Stable income is key. Salaried individuals with at least two years of job
      continuity and self-employed professionals with steady business income are
      preferred. Your income directly affects the loan amount you're eligible for.
    </p>

    <h3 className="text-xl font-semibold mt-4 mb-2">Age of the Applicant</h3>
    <p className="mb-4">
      Ideal age is between 21 and 60 for salaried applicants (up to 65 for
      self-employed). Younger borrowers benefit from longer repayment tenures,
      reducing monthly EMIs.
    </p>

    <h3 className="text-xl font-semibold mt-4 mb-2">Credit Score and History</h3>
    <p className="mb-4">
      A good CIBIL score—typically 750 or higher—is essential. It reflects your
      repayment behavior and financial discipline. Poor credit history can reduce
      eligibility or lead to higher interest rates.
    </p>

    <h3 className="text-xl font-semibold mt-4 mb-2">Existing Financial Obligations</h3>
    <p className="mb-4">
      Your debt-to-income ratio (DTI) is closely monitored. Lower DTI indicates
      better repayment capacity. If you're repaying other loans, it may limit
      your home loan amount.
    </p>

    <h3 className="text-xl font-semibold mt-4 mb-2">Property Type and Location</h3>
    <p className="mb-4">
      Lenders only finance properties with clear legal titles and in approved
      areas. Unregulated or under-dispute locations may result in application
      rejection.
    </p>

    <h2 className="text-2xl font-semibold mt-6 mb-4">Home Loan Eligibility Calculator: Know Before You Apply</h2>
    <p className="mb-4">
      A home loan eligibility calculator is a fast, online tool that estimates
      how much loan you can qualify for based on key inputs—monthly income,
      existing EMIs, loan tenure, and interest rate. It’s a smart way to
      pre-check your eligibility from the comfort of your home.
    </p>
    <p className="mb-4">
      Many Indian banks and digital platforms provide these tools, often paired
      with an <strong>EMI calculator</strong> to give a complete view of monthly
      payments. Platforms like <strong>Homobie</strong> go a step further by
      combining eligibility checks, EMI planning, and expert loan assistance—all
      in one place.
    </p>

    <h2 className="text-2xl font-semibold mt-6 mb-4">Fast & Easy Home Loan Eligibility Checklist</h2>
    <ul className="list-disc pl-6 mb-6 space-y-2">
      <li>Minimum monthly income of ₹25,000 or more (varies by city and lender)</li>
      <li>Steady job or business income for 2+ years</li>
      <li>CIBIL score of 750 or above</li>
      <li>Debt-to-income ratio below 40%</li>
      <li>Age between 21–60 (salaried) or up to 65 (self-employed)</li>
      <li>Property approved by the bank and free from legal disputes</li>
      <li>All key documents in place (see below)</li>
    </ul>

    <h2 className="text-2xl font-semibold mt-6 mb-4">Common Documents Required for Home Loan Approval</h2>
    <ul className="list-disc pl-6 mb-6 space-y-2">
      <li><strong>KYC Documents</strong>: Aadhaar, PAN card, passport, voter ID, or driving license</li>
      <li><strong>Income Proof</strong>: Salary slips (last 3 months), Form 16, IT returns (2–3 years)</li>
      <li><strong>Employment Proof</strong>: Offer letter, job certificate, or business registration</li>
      <li><strong>Bank Statements</strong>: Last 6 months for salaried; 12 months for self-employed</li>
      <li><strong>Property Papers</strong>: Sale agreement, title deed, approved plan, tax receipts</li>
      <li><strong>Existing Loan Info</strong>: EMI schedules and closure letters if any</li>
    </ul>

    <h2 className="text-2xl font-semibold mt-6 mb-4">Conclusion: Be Prepared and Get Closer to Your Dream Home</h2>
    <p className="mb-4">
      Understanding and improving your home loan eligibility is a powerful first
      step toward homeownership. By evaluating the right criteria, using tools
      like the <strong>EMI calculator</strong>, and gathering your <strong>home
      loan documents</strong> early, you’ll streamline the approval process.
    </p>
    <p className="mb-4">
      Whether you’re a first-time buyer or looking to upgrade, platforms like
      <strong>Homobie</strong> simplify the loan journey by providing tools,
      expert guidance, and access to pre-approved lender networks—all tailored
      to your profile.
    </p>

    <section className="p-4 rounded-lg mt-8">
      <h2 className="text-xl font-semibold mb-4">
        TL;DR – Fast & Easy Home Loan Eligibility Checklist
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>Stable Income</strong>: ₹25,000+ monthly income; 2+ years job/business stability
        </li>
        <li>
          <strong>Age Range</strong>: 21–60 years (salaried), up to 65 (self-employed)
        </li>
        <li>
          <strong>Credit Score</strong>: CIBIL score of 750 or higher is ideal
        </li>
        <li>
          <strong>Debt Ratio</strong>: Debt-to-income (DTI) ratio should be below 40%
        </li>
        <li>
          <strong>Property</strong>: Legally clear and approved property in bank-approved area
        </li>
        <li>
          <strong>Documents</strong>:
          <ul className="list-disc pl-6">
            <li>KYC: Aadhaar, PAN, Passport, etc.</li>
            <li>Income: Salary slips, ITR, Form 16</li>
            <li>Job/Business Proof: Offer letter or registration</li>
            <li>Bank Statements: 6–12 months</li>
            <li>Property Papers: Sale deed, tax receipts</li>
          </ul>
        </li>
        <li>
          <strong>Use Tools</strong>: Check eligibility using a <em>Home Loan Eligibility Calculator</em>
        </li>
        <li>
          <strong>Pro Tip</strong>: Use platforms like <strong>Homobie</strong> to get expert help & instant pre-approval offers
        </li>
      </ul>
    </section>
    <div className="text-center mt-8">
      <CtaButton styles={styles} href="#">
        Check Now & Get Pre-Approved Offers »
      </CtaButton>
    </div>
  </div>
);

export default Blog1;