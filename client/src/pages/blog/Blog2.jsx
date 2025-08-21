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

const Blog2 = ({ styles }) => (
  <div className="max-w-4xl mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold italic mb-6">
      What is the Best CIBIL Score for a Loan Approval? A Complete Guide for 2025
    </h1>

    <h2 className="text-2xl font-semibold mb-3">Quick Summary</h2>
    <ul className="list-disc list-inside mb-6 space-y-2">
      <li>
        Ideal CIBIL score: <strong className="italic">750+</strong> for home loan approval
      </li>
      <li>Minimum acceptable: <strong className="italic">700</strong>; Below 650 may limit options</li>
      <li>Score affects: Interest rates, loan amount, approval speed</li>
      <li>
        <strong className="italic">Homobie</strong>: Smart loan matchmaker that helps with low/high score navigation
      </li>
      <li>✔ Check your score for free and take steps to improve if needed</li>
    </ul>

    <h2 className="text-2xl font-semibold mb-3">
      Introduction: Why CIBIL Score Matters More Than Ever
    </h2>
    <p className="mb-6">
      In 2025, lenders rely heavily on your CIBIL score to approve loans quickly and digitally. A strong score not
      only boosts your eligibility but also helps you negotiate better interest rates. Whether you're applying for{" "}
      <strong className="italic">home loans</strong>, <strong className="italic">mortgage loans</strong>, or{" "}
      <strong className="italic">loan against property</strong>, your credit profile plays a critical role. With
      platforms like <strong className="italic">Homobie</strong>, you can now check your eligibility instantly based
      on your credit score.
    </p>

    <h2 className="text-2xl font-semibold mb-3">What is a CIBIL Score?</h2>
    <p className="mb-6">
      A CIBIL score is a 3-digit number (ranging from 300 to 900) that reflects your creditworthiness based on past
      credit behavior. It’s calculated by TransUnion CIBIL and widely used by Indian banks and NBFCs for evaluating
      loan applications for <strong className="italic">home loans</strong>,{" "}
      <strong className="italic">loan against property</strong>, and more.
    </p>

    <h2 className="text-2xl font-semibold mb-3">Why CIBIL Score is Crucial for Loan Approval</h2>
    <ul className="list-disc list-inside mb-6 space-y-2">
      <li>
        <strong className="italic">Eligibility Filter:</strong> Lenders set minimum score cutoffs to reduce risk.
      </li>
      <li>
        <strong className="italic">Better Offers:</strong> Higher scores attract lower interest rates and higher loan
        amounts.
      </li>
      <li>
        <strong className="italic">Digital Processing:</strong> Platforms like{" "}
        <strong className="italic">Homobie</strong> match you with pre-approved offers based on your score instantly.
      </li>
    </ul>

    <h2 className="text-2xl font-semibold mb-3">Ideal CIBIL Score for Different Loans</h2>
    <ul className="list-disc list-inside mb-6 space-y-2">
      <li>
        <strong className="italic">Home Loans:</strong> 750 and above is ideal
      </li>
      <li>
        <strong className="italic">Loan Against Property Loan:</strong> 750+ preferred for best terms
      </li>
      <li>
        <strong className="italic">Balance Transfer:</strong> 720+ recommended for seamless switching
      </li>
    </ul>

    <h2 className="text-2xl font-semibold mb-3">Factors Affecting Your CIBIL Score</h2>
    <ul className="list-disc list-inside mb-6 space-y-2">
      <li>
        <strong className="italic">Repayment History:</strong> Missed EMIs lower your score significantly
      </li>
      <li>
        <strong className="italic">Credit Utilization:</strong> High usage (&gt;30%) of your credit limit reduces your
        score
      </li>
      <li>
        <strong className="italic">Credit Mix:</strong> Balanced mix of secured and unsecured loans boosts score
      </li>
      <li>
        <strong className="italic">Hard Inquiries:</strong> Too many loan applications in a short span harm your score
      </li>
    </ul>

    <h2 className="text-2xl font-semibold mb-3">How to Check Your CIBIL Score for Free</h2>
    <p className="mb-6">
      Use RBI-mandated portals or trusted fintech platforms to check your score once a year for free.{" "}
      <strong className="italic">Homobie</strong> integrates score checks with its loan match system to give you
      accurate insights in seconds.
    </p>

    <h2 className="text-2xl font-semibold mb-3">How Lenders Read Your Score</h2>
    <ul className="list-disc list-inside mb-6 space-y-2">
      <li>
        <strong className="italic">750–900:</strong> Excellent – quick approvals, low interest rates
      </li>
      <li>
        <strong className="italic">700–749:</strong> Good – possible approval with slight rate variation
      </li>
      <li>
        <strong className="italic">650–699:</strong> Average – may need guarantor or higher interest rate
      </li>
      <li>
        <strong className="italic">Below 650:</strong> Poor – high rejection probability, limited options
      </li>
    </ul>

    <h2 className="text-2xl font-semibold mb-3">What to Do If Your Score is Low</h2>
    <ul className="list-disc list-inside mb-6 space-y-2">
      <li>Pay off outstanding dues</li>
      <li>
        Limit new credit card usage or opt for <strong className="italic">balance transfer credit card</strong> offers
      </li>
      <li>Don’t apply for multiple loans at once</li>
      <li>
        Use <strong className="italic">Homobie’s credit guidance tools</strong> to improve eligibility
      </li>
    </ul>

    <h2 className="text-2xl font-semibold mb-3">Benefits of a High CIBIL Score</h2>
    <ul className="list-disc list-inside mb-6 space-y-2">
      <li>Faster approvals with minimal documentation</li>
      <li>
        Negotiable interest rates and better{" "}
        <strong className="italic">loan against property interest rates</strong>
      </li>
      <li>Higher loan amounts and flexible tenure</li>
      <li>
        Access to exclusive digital offers via <strong className="italic">Homobie</strong>
      </li>
    </ul>

    <h2 className="text-2xl font-semibold mb-3">Myths About CIBIL Score</h2>
    <ul className="list-disc list-inside mb-6 space-y-2">
      <li>
        Checking your own score lowers it – <strong className="italic">False</strong>
      </li>
      <li>
        Paying minimum dues is enough – <strong className="italic">False</strong>
      </li>
      <li>
        Closing old credit cards improves score – <strong className="italic">False</strong>
      </li>
    </ul>

    <h2 className="text-2xl font-semibold mb-3">
      <strong className="italic">Homobie</strong> Helps You Navigate Credit Scores
    </h2>
    <p className="mb-6">
      <strong className="italic">Homobie</strong> helps match your CIBIL score with suitable lenders based on your
      credit profile and loan requirements. Whether your score is 550 or 800+,{" "}
      <strong className="italic">Homobie</strong> recommends the right banks and NBFCs for{" "}
      <strong className="italic">home loans</strong>, <strong className="italic">loan against property</strong>,{" "}
      <strong className="italic">balance transfer</strong> offers, and more—saving time and rejection.
    </p>

    <h2 className="text-2xl font-semibold mb-3">Conclusion: Know Your Score, Know Your Power</h2>
    <p className="mb-4">
      Maintaining a CIBIL score of <strong className="italic">750+</strong> is your best bet for fast, smooth loan
      approval. But even if your score is less than perfect, you still have options. Platforms like{" "}
      <strong className="italic">Homobie</strong> are built to help you improve, match, and secure your ideal loan
      with full transparency. Use their <strong className="italic">EMI calculator online</strong> to plan your next
      move confidently.
    </p>
    <div className="text-center mt-8">
      <CtaButton styles={styles} href="#">
        Check your score. Match with lenders. Move into your dream home.
      </CtaButton>
    </div>
  </div>
);

export default Blog2;