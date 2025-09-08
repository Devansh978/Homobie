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

const Blog4 = ({ styles }) => (
  <div className="max-w-4xl mx-auto px-6 py-12 text-white">
    <h1 className="text-4xl font-bold mb-8 leading-tight">
      Home Loan Takeover Explained: RBI Guidelines Every Borrower Should Know
    </h1>
    <div className="w-24 h-1 mb-5 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto"></div>

    <p className="mb-6 leading-relaxed">
      The Reserve Bank of India (RBI) allows borrowers to transfer their home
      loans to another lender—commonly known as a{" "}
      <strong className="font-semibold">home loan takeover</strong> or{" "}
      <strong className="font-semibold">balance transfer</strong>—to take
      advantage of lower interest rates or better repayment terms. RBI rules
      mandate zero foreclosure charges on floating-rate loans, caps on
      prepayment fees for fixed loans, clear loan-to-value (LTV) ratios, and
      prompt documentation release. With platforms like{" "}
      <strong className="font-semibold">Homobie</strong>, the takeover process
      becomes smarter, faster, and less stressful.
    </p>

    <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
    <p className="mb-4 leading-relaxed">
      Buying a home is one of life’s biggest investments. But what happens
      when your current home loan starts to feel like a financial burden
      instead of a smart decision? That’s where{" "}
      <strong className="font-semibold">home loan takeovers</strong>, also
      known as <strong className="font-semibold">balance transfers</strong>,
      come into play.
    </p>
    <p className="mb-6 leading-relaxed">
      To protect borrowers and promote financial transparency, the{" "}
      <strong className="font-semibold">RBI (Reserve Bank of India)</strong>{" "}
      has laid down specific guidelines for such takeovers. These rules
      empower homeowners to switch lenders efficiently—without penalty in many
      cases—and reduce their EMIs or interest outgo.
    </p>

    <h2 className="text-2xl font-semibold mb-4">
      What Is a Home Loan Takeover?
    </h2>
    <p className="mb-4 leading-relaxed">
      A home loan takeover is the process of shifting your existing home loan
      from one bank or lender to another. It’s often used to take advantage of
      better <strong className="font-semibold">loan against property interest rates</strong>, reduce
      your monthly <strong className="font-semibold">EMIs</strong>, or restructure repayment terms.
    </p>
    <p className="mb-6 leading-relaxed">
      It's not to be confused with foreclosure (paying off a loan early) or
      top-ups (borrowing extra against your current loan). A balance transfer
      allows for a smarter shift—especially when planned with tools like an{" "}
      <strong className="font-semibold">EMI calculator online</strong> or a{" "}
      <strong className="font-semibold">SIP calculator</strong>.
    </p>

    <h2 className="text-2xl font-semibold mb-4">
      RBI Guidelines Governing Home Loan Takeovers
    </h2>

    <div className="bg-gray-800 p-4 rounded mb-6">
      <h3 className="text-xl font-semibold mb-2">
        No Foreclosure Charges on Floating-Rate Loans
      </h3>
      <p className="leading-relaxed">
        According to RBI directives, lenders cannot charge foreclosure or
        prepayment fees on <strong className="font-semibold">floating-rate home loans</strong>.
        This allows borrowers to switch or repay early without being penalized.
      </p>
    </div>

    <div className="bg-gray-800 p-4 rounded mb-6">
      <h3 className="text-xl font-semibold mb-2">
        Fixed-Rate Loans: Prepayment Charges Apply
      </h3>
      <p className="leading-relaxed">
        For <strong className="font-semibold">fixed-rate loans</strong>, RBI
        allows lenders to charge prepayment penalties—usually around 1–3% of the
        outstanding loan amount. It’s essential to check this cost before
        switching.
      </p>
    </div>

    <div className="bg-gray-800 p-4 rounded mb-6">
      <h3 className="text-xl font-semibold mb-2">Loan-to-Value (LTV) Ratio Limits</h3>
      <ul className="list-disc list-inside">
        <li>Up to 90% LTV for loans below ₹30 lakh</li>
        <li>80% LTV for loans between ₹30–₹75 lakh</li>
        <li>75% LTV for loans above ₹75 lakh</li>
      </ul>
    </div>

    <div className="bg-gray-800 p-4 rounded mb-6">
      <h3 className="text-xl font-semibold mb-2">Documentation Requirements</h3>
      <p className="leading-relaxed">
        You'll need to submit ID proof, property papers, income documents, and
        prior loan statements. RBI mandates that existing lenders release
        necessary documents within 30 days for smooth takeovers.
      </p>
    </div>

    <div className="bg-gray-800 p-4 rounded mb-6">
      <h3 className="text-xl font-semibold mb-2">
        Eligibility Criteria: Loan Age & Profile
      </h3>
      <p className="leading-relaxed">
        Most lenders require a minimum of 12 months of repayment history, a
        decent credit score, and stable income. Platforms like{" "}
        <strong className="font-semibold">Homobie</strong> pre-verify eligibility
        instantly—so you know exactly where you stand.
      </p>
    </div>

    <div className="text-center mt-8">
      <CtaButton styles={styles} href="/loan-application?type=home-loan">
        Check your eligibility instantly with Homobie
      </CtaButton>
    </div>
  </div>
);

export default Blog4;
