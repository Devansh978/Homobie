import React, { useState } from 'react';

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

const Blog6 = ({ styles }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-white">
      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">
        Home Loan Insurance: Essential for New Buyers in 2025
      </h1>
      <p className="mb-6 leading-relaxed">
        Home loan insurance—or home loan protection plan—is a decreasing-cover
        policy that pays off your outstanding loan in case of death, disability,
        or job loss. Though not mandatory, it offers peace of mind, safeguarding
        families and preserving credit history. Premiums may be added to EMIs
        and qualify for tax deductions under Section 80C. In 2025, with RBI
        encouraging borrower protection, new buyers should strongly consider it.
        Platforms like <strong>Homobie</strong> help you evaluate insurance
        options, metrics like loan against property interest rates, and use EMI
        calculators intelligently—ensuring you make informed choices.
      </p>

      {/* Sections */}
      <h2 className="text-2xl font-semibold mt-8 mb-3">1. What Is Home Loan Insurance?</h2>
      <p className="mb-6 leading-relaxed">
        Also known as a home loan protection plan, this policy covers your
        outstanding home loan if you die, are permanently disabled, or lose your
        job unexpectedly. It typically matches your loan tenure and reduces in
        coverage as you repay EMIs—so your family isn’t left carrying the burden
        of a large unpaid loan balance.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">2. Why It Matters for New Buyers</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li><strong>Debt protection for family:</strong> It clears the loan directly with the bank—no risk of foreclosure or asset loss.</li>
        <li><strong>Preserves credit score:</strong> Timely payment of the outstanding debt safeguards future borrowing power.</li>
        <li><strong>Low-cost peace of mind:</strong> Premiums are often flexible—lump sum or added to EMIs.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3">3. Key Features & Benefits</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Decreasing cover that aligns with your loan balance.</li>
        <li>Optional add-ons like critical illness, disability, and EMI coverage for job loss.</li>
        <li>Flexible premium modes—pay annually or with EMIs.</li>
        <li>Single policy can cover co-borrowers.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3">4. RBI & Lender Guidance</h2>
      <p className="mb-6 leading-relaxed">
        While RBI and IRDAI don’t mandate this insurance, financial institutions
        often include it with your home loan offer—advising it to reduce risk
        and protect the borrower and lender alike.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">5. Cost & Tax Benefits</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Premiums typically range from 0.3% to 0.5% of the loan amount per year.</li>
        <li>Premiums paid separately may be eligible for deduction under Section 80C.</li>
        <li>Compared to term insurance, home loan protection plans are easier to access and directly tied to your loan.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3">6. Choosing the Right Plan</h2>
      <ol className="list-decimal pl-6 space-y-2 mb-6">
        <li>Compare premium rates, riders, and claim settlement ratios.</li>
        <li>Choose the premium mode that best fits your budget.</li>
        <li>Ensure the policy tenure matches the loan tenure.</li>
        <li>Select riders if your income or job stability is uncertain.</li>
      </ol>
      <p className="mb-6 leading-relaxed">
        Platforms like <strong>Homobie</strong> enable easy comparisons, help
        calculate EMI impacts, and highlight relevant tax advantages—making
        decisions faster and better informed.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">7. Alternatives & When to Skip It</h2>
      <p>Consider alternatives like term insurance if:</p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>You already have a solid life insurance policy.</li>
        <li>Premiums for home loan insurance are unusually high.</li>
        <li>You want broader life coverage beyond the loan amount.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3">8. Real-World Scenario</h2>
      <p className="mb-6 leading-relaxed">
        For a ₹50 lakh home loan at 7% over 20 years, a home loan protection
        policy might cost around ₹20,000 annually. That’s less than ₹2,000 per
        month for full family protection and financial peace of mind.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">9. How Homobie Makes It Simple</h2>
      <p>With <strong>Homobie</strong>, new buyers get one streamlined experience. You can:</p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Compare top home loan insurance policies alongside lenders.</li>
        <li>Use an <strong>EMI calculator online</strong> to evaluate premium impact.</li>
        <li>Access insights on <strong>loan against property interest rates</strong>, terms, and protection add-ons.</li>
      </ul>
      <p className="mb-6 leading-relaxed">
        Homobie ensures you borrow smarter, plan better, and protect your
        future—all in one platform.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">10. Final Take</h2>
      <p className="mb-4 leading-relaxed">
        Home loan insurance may not be mandatory—but in 2025, it’s quickly
        becoming essential. It’s a smart way to protect your investment and give
        your loved ones financial security.
      </p>
      <p className="text-center">
      <CtaButton styles={styles} href="loan-application?type=home-loan">
        Thinking ahead? Let Homobie help you match with the right home loan—and
        the protection that fits your future.
      </CtaButton>
    </p>
    </div>
  );
};

export default Blog6;
