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

const Blog5 = ({ styles }) => (
  <>
    <h1 className="text-3xl font-bold mb-4">
      How Does Taking Out a Home Loan Affect Your Income Tax?
    </h1>
    <p className="mb-4">
      A home loan offers significant <strong>income tax benefits</strong> in
      India. You can claim deductions on the principal under{" "}
      <strong>Section 80C</strong> (up to ₹1.5 L), interest under{" "}
      <strong>Section 24(b)</strong> (up to ₹2 L on self-occupied properties),
      and extra deductions under <strong>Section 80EE</strong> and{" "}
      <strong>80EEA</strong> for first-time or affordable housing loans. Joint
      loans boost savings further. Homobie’s tools like the{" "}
      <strong>EMI calculator online</strong> & intelligent loan matches help
      you maximize these deductions stress-free.
    </p>

    <h2 className="text-2xl font-semibold mb-2">
      1. Principal Repayment (Section 80C)
    </h2>
    <p className="mb-4">
      Under Section 80C, you can claim deductions for the amount you repay
      toward the <strong>principal</strong> of your loan and related charges
      like stamp duty and registration — up to ₹1.5 lakh annually.
    </p>
    <p className="mb-4">
      For example, if you're repaying ₹1 lakh principal in a financial year,
      you can reduce your taxable income by that amount—making it a powerful
      tool for tax planning.
    </p>

    <h2 className="text-2xl font-semibold mb-2">
      2. Interest Payment (Section 24(b))
    </h2>
    <p className="mb-4">
      Interest on home loan EMIs can be deducted under Section 24(b). The
      limit is ₹2 lakh for self-occupied homes, or unlimited for let-out
      properties, subject to caps on loss set-offs.
    </p>
    <p className="mb-4">
      If you build or purchase an under-construction property, the
      pre-construction interest is divided equally across five years
      post-possession.
    </p>
    <p className="mb-4">
      <strong>Example:</strong> A ₹50 lakh loan at 8% interest over 20 years
      could yield ₹2 lakh deduction annually—saving ~₹60k in taxes if you're
      in the 30% slab.
    </p>

    <h2 className="text-2xl font-semibold mb-2">
      3. Additional Deductions: Section 80EE & 80EEA
    </h2>
    <p className="mb-4">
      <strong>Section 80EE:</strong> Offers up to ₹50,000 extra interest
      deduction for first-time buyers with loan ≤ ₹35 L and property ≤ ₹50 L.
    </p>
    <p className="mb-4">
      <strong>Section 80EEA:</strong> For affordable housing loans sanctioned
      between April 2019–March 2022, allows extra ₹1.5 L interest deduction
      (property stamp value ≤ ₹45 L).
    </p>
    <p className="mb-4">
      These sit on top of Sections 80C and 24(b), giving first-time homebuyers
      tax savings up to ₹3 L+ annually.
    </p>

    <h2 className="text-2xl font-semibold mb-2">
      4. Joint Home Loan Benefits
    </h2>
    <p>
      When two (or more) co-borrowers, who also co-own the property, take a
      joint loan, each can individually claim:
    </p>
    <ul className="list-disc list-inside mb-4">
      <li>₹1.5 L deduction under 80C (principal)</li>
      <li>₹2 L interest under 24(b)</li>
      <li>Extra under 80EE/80EEA if eligible</li>
    </ul>
    <p className="mb-4">This effectively doubles your tax benefit.</p>

    <h2 className="text-2xl font-semibold mb-2">5. Old vs New Tax Regime</h2>
    <p className="mb-4">
      The <strong>old regime</strong> allows full deductions under Sections
      80C, 24(b), 80EE, 80EEA. The <strong>new regime</strong>, though
      offering lower tax rates, often eliminates these deductions—especially
      for owner-occupied homes.
    </p>
    <p className="mb-4">
      Weigh the benefits of tax savings against slab rates. If your total
      deductions (incl. home loan) are high, the old regime may still offer
      better savings.
    </p>

    <h2 className="text-2xl font-semibold mb-2">
      6. Strategic Tips to Maximize Tax Benefits
    </h2>
    <ul className="list-disc list-inside mb-4">
      <li>Claim principal and interest deductions diligently each year.</li>
      <li>Use Sections 80EE/80EEA if you're a first-time buyer.</li>
      <li>Opt for joint loans to multiply benefits.</li>
      <li>
        Lodge pre-construction interest claims over five years after moving
        in.
      </li>
      <li>Maintain documentation per updated ITR guidelines.</li>
      <li>
        Before opting for the new tax regime, run numbers on tax paid vs
        savings.
      </li>
    </ul>

    <h2 className="text-2xl font-semibold mb-2">
      7. Homobie Makes Tax-Smart Borrowing Easier
    </h2>
    <p className="mb-4">
      Navigating tax deductions while managing your home loan can get
      confusing. That’s where <strong>Homobie</strong> simplifies the journey.
      With intuitive tools like the <strong>EMI calculator online</strong> and
      smart loan profiling, Homobie matches you to loans that optimize both
      financial and tax benefits.
    </p>
    <p className="mb-4">
      Want to reduce your{" "}
      <strong>loan against property interest rates</strong> or evaluate a
      refinance? Homobie seamlessly integrates repayment and tax impact,
      making it easy to compare scenarios—all without overwhelming paperwork.
    </p>

    <h2 className="text-2xl font-semibold mb-2">
      8. When Prepayment May Be Smarter
    </h2>
    <p className="mb-4">
      Under the new tax regime—where many deductions are lost—prepaying a
      portion of the loan can significantly reduce interest outgo and shorten
      tenure. Recent RBI advice—citing prepayment strategies as a way to
      counter lost deductions—is worth considering.
    </p>

    <h2 className="text-2xl font-semibold mb-2">Conclusion</h2>
    <p className="mb-4">
      A home loan isn’t just a financing tool—it’s also a smart tax planning
      lever. From Sections 80C and 24(b) to bonus deductions under 80EE/80EEA,
      loans offer layered benefits—especially in joint-home setups.
    </p>
    <p className="mb-6">
      But with changing regimes and complex rules, it's easy to miscalculate.
      Platforms like <strong>Homobie</strong> make it simpler—helping you pick
      the right loan, optimize EMIs, and maximize tax deductions—all in one
      place.
    </p>

    <p className="text-center">
      <CtaButton styles={styles} href="loan-application?type=home-loan">
        Ready to borrow smarter and save more? Start here with Homobie’s tools
        and guidance &raquo;
      </CtaButton>
    </p>
  </>
);
export default Blog5;