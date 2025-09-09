import React, { useState } from 'react';

const CtaButton = ({ href = "#", children, styles }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <a
      href={href}
      className={`inline-block px-6 py-3 rounded-lg font-semibold text-white transition-transform transform ${
        isHovered ? "bg-blue-500 scale-105" : "bg-blue-600"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={styles?.ctaButton}
    >
      {children}
    </a>
  );
};

const Blog10 = ({ styles }) => {
  return (
   <div className="min-h-screen  text-gray-100 px-6 py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        How to Pay Off Your Home Loan in 10 Years: Smart Strategies for Indian Borrowers
      </h1>
      <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto mb-5"></div>

      <p className="text-lg leading-relaxed mb-8">
        Want to finish your home loan in just 10 years? Combine a shorter or adjustable tenure,
        regular prepayments, EMI increases, and SIP investment plans. <strong className="text-blue-400">Homobie</strong> offers tools like the{" "}
        <strong className="text-blue-400">EMI calculator online</strong> and tailored{" "}
        <strong className="text-blue-400">SIP reinvestment plans for home loans and loan against property</strong> to help you plan and repay faster with less stress.
      </p>

      {/* Sections */}
      {[
        {
          title: "1. Opt for the Right Tenure Early",
          text: "If you start with a 10-year tenure or shorter, your total interest drops dramatically. For example, a ₹50 lakh loan at 9% over 20 years may cost ₹58 lakh in interest—but if you choose a 10-year term, it falls to ~₹26 lakh. Higher EMI, yes—but massive long-term savings."
        },
        {
          title: "2. Make Regular Prepayments, Especially Early",
          text: "Since most EMI interest is front-loaded, making timely prepayments—like one extra EMI per year—can drastically cut down both principal and loan tenure. Even moderate windfalls redirected into prepayment early on result in huge interest savings. Aim for at least one prepayment each year."
        },
        {
          title: "3. Increase Your EMI Over Time",
          text: "As your income rises, increasing EMI by 5–10% annually accelerates debt repayment. This can reduce a 20-year loan to under 10 years and cut nearly 45% off interest. Consistency is key."
        },
        {
          title: "4. Use Bonuses or Windfalls Wisely",
          text: "Instead of spending bonuses or tax refunds, channel them into lump-sum prepayments. A ₹2 lakh windfall early in the tenure can shave off up to three years."
        },
        {
          title: "5. Try Biweekly or Extra EMIs",
          text: "Paying EMIs every two weeks instead of monthly results in roughly 13 EMIs per year. This small shift can trim years off your loan, with no extra stress."
        },
        {
          title: "6. Refinance When Rates Drop via Balance Transfer",
          text: "Keep an eye on RBI’s rate decisions. Even a 0.5% drop in rates can yield big savings. Use an <strong className='text-blue-400'>EMI calculator online</strong> to compare lender offers."
        },
        {
          title: "7. Use an SIP Investment Plan to Fuel Prepayments",
          text: <>Invest ~10% of your EMI monthly in a mutual fund SIP. After 3–5 years, redeem it for a lump-sum prepayment—reducing tenure and interest. <strong className="text-blue-400">Homobie</strong> offers <a href="/sip" className="text-blue-500 underline">SIP reinvestment plans</a> aligned with EMI timelines.</>
        },
        {
          title: "8. Combine SIP Strategy with Loan Prepayments",
          text: "A hybrid approach—small prepayments plus SIP—can cut years off while building wealth. Many Indians recover their total loan interest via SIP returns alone."
        },
        {
          title: "9. Maintain Discipline & Avoid EMI Misses",
          text: "Missing EMIs hurts your credit score and adds penalties. Use auto-debits, keep a buffer, and review your plan annually."
        },
        {
          title: "10. Choose Daily Reducing Balance Loans",
          text: "Daily reducing balance loans save more interest than monthly reducing. Always check your lender’s amortization method."
        },
        {
          title: "11. Review and Adjust the Plan Annually",
          text: "Life changes—bonuses, promotions, rate cuts. Review yearly and adjust SIP, EMIs, or prepayments."
        }
      ].map((section, idx) => (
        <div key={idx} className="mb-6">
          <h2 className="text-2xl font-semibold mb-2 text-blue-400">{section.title}</h2>
          <p className="leading-relaxed text-gray-200">{section.text}</p>
        </div>
      ))}

      <h2 className="text-2xl font-semibold mt-6 mb-2 text-blue-400">Real User Insight from Reddit</h2>
      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-300 mb-6">
        “Invest ₹1.5 lakh in a diversified aggressive fund while paying loan simultaneously…and finish the loan early.” — Reddit user
      </blockquote>

      <h2 className="text-2xl font-semibold mt-6 mb-2 text-blue-400">How Homobie Supports Your 10-Year Repayment Plan</h2>
      <ul className="list-disc pl-6 mb-6 text-gray-200 space-y-2">
        <li><strong className="text-blue-400">EMI calculator online</strong> to project scenarios like tenure cuts, prepayments, balance transfers, and EMI hikes.</li>
        <li>Guides on investment vs prepayment decisions using SIP analysis.</li>
        <li>Personalized SIP reinvestment plans aligned with debt reduction goals.</li>
        <li>Realtime alerts for rate drops to refinance faster.</li>
      </ul>

      <p className="text-gray-200 mb-6">
        With Homobie, repayment becomes smarter, visual, and stress-free—while keeping ownership and clarity intact.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2 text-blue-400">Conclusion</h2>
      <p className="text-gray-200 mb-4">
        Clearing your home loan in 10 years is possible with deliberate planning: right tenure, smart prepayments, EMI hikes, SIPs, and discipline. The mix reduces interest and builds wealth.
      </p>
      <p className="text-gray-200 mb-6">
        <strong className="text-blue-400">Homobie</strong> helps you execute—matching you to the right loan, simulating plans, and guiding SIP reinvestments.
      </p>

      <div className="text-center mb-8">
        <strong className="text-lg text-white">Start your journey to debt freedom with clarity, tools, and a plan—with Homobie.</strong>
      </div>

      <div className="text-center">
        <CtaButton styles={styles} href="loan-application?type=home-loan">
          Match smarter and borrow better with Homobie.
        </CtaButton>
      </div>
    </div>
  );
};

export default Blog10;
