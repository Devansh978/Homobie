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
const Blog8 = ({ styles }) => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        What Documents Are Essential for Home Loan Approval?
      </h1>
      <p className="mt-2">
        To get a home loan approved in India—whether a <strong>home loan</strong>, 
        <strong> mortgage loan</strong>, or <strong>loan against property</strong>—you need a set of 
        essential documents: KYC, income proof, employment proof, property papers, bank statements, 
        photographs, and a signed application form. Missing any of these can cause delays. 
        Digital platforms like <strong>Homobie</strong> help you prepare, organize, and submit the right 
        paperwork from the start, making approval smoother and faster.
      </p>

      <h2 className="text-2xl font-semibold mt-6">1. KYC & Identity Documents</h2>
      <ul className="list-disc ml-6 mt-2">
        <li>PAN Card or Form 60</li>
        <li>Aadhaar Card, Voter ID, Driving Licence, or Passport</li>
        <li>Utility bills for address proof</li>
        <li>Birth certificate or other date of birth proof</li>
        <li>Passport-size photographs and signature verification</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6">2. Income & Employment Proof</h2>
      <h3 className="text-xl font-semibold mt-4">Salaried Applicants</h3>
      <ul className="list-disc ml-6 mt-2">
        <li>Last 3 months’ salary slips</li>
        <li>Form 16 and IT returns</li>
        <li>6-month bank statement</li>
        <li>Employment letter or contract</li>
      </ul>
      <h3 className="text-xl font-semibold mt-4">Self-Employed / Business Owners</h3>
      <ul className="list-disc ml-6 mt-2">
        <li>IT returns (2–3 years)</li>
        <li>Balance sheet & profit/loss statements</li>
        <li>Professional/firm licenses</li>
        <li>6-month business bank statements</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6">3. Property & Contribution Documents</h2>
      <ul className="list-disc ml-6 mt-2">
        <li>Sale Agreement or Allotment Letter</li>
        <li>Title Deeds and Chain of Agreements</li>
        <li>No Encumbrance Certificate</li>
        <li>Building plan approvals</li>
        <li>Payment receipts</li>
        <li>Proof of your own financial contribution</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6">4. Banking & Loan History</h2>
      <ul className="list-disc ml-6 mt-2">
        <li>6 months' bank statements</li>
        <li>Ongoing loan statements</li>
        <li>Foreclosure letters (for balance transfer cases)</li>
        <li>Cheque for processing fees</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6">5. Additional (Optional) Documents</h2>
      <ul className="list-disc ml-6 mt-2">
        <li>Marriage certificate or divorce decree</li>
        <li>Power of Attorney (for NRI/joint loans)</li>
        <li>NRI documents—passport, visa, overseas income proof</li>
        <li>Guarantor forms (if applicable)</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6">6. Tips to Avoid Rejection</h2>
      <ul className="list-disc ml-6 mt-2">
        <li>Use a document checklist</li>
        <li>Label scanned files clearly</li>
        <li>Submit updated records</li>
        <li>Double-check name, date, and signature consistency</li>
        <li>Respond to queries quickly</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6">7. How Homobie Makes This Easy</h2>
      <p className="mt-2">
        Getting a loan shouldn't feel like a second job. Homobie simplifies the process:
      </p>
      <ul className="list-disc ml-6 mt-2">
        <li>Creates a personalized document checklist</li>
        <li>Securely uploads and organizes your files</li>
        <li>Tracks what’s missing and flags mismatches</li>
        <li>Uses <strong>EMI calculator online</strong> and smart recommendations to prepare for your loan confidently</li>
        <li>Connects you to lenders with the best <strong>loan against property interest rates</strong> or <strong>balance transfer</strong> options</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6">Conclusion</h2>
      <p className="mt-2">
        Home loan approval isn’t hard—but it does require preparation. From your ID to your income to 
        your property proofs, every document plays a role. Submitting incomplete or inconsistent records 
        is the number one reason for delays and rejections.
      </p>
      <p className="mt-2">
        That’s why smart borrowers use platforms like <strong>Homobie</strong>. It’s built to simplify 
        home loans—matching you with lenders, organizing your paperwork, and showing the clearest path 
        from application to approval.
      </p>
      <p className="text-center">
      <CtaButton styles={styles} href="loan-application?type=home-loan">
        Get matched. Get organized. Get home—faster. With Homobie.
      </CtaButton>
    </p>
    </div>
  )
}

export default Blog8
