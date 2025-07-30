
import React, { useState } from 'react';

// --- STYLES (CSS-in-JS) ---
// All CSS is converted into a JavaScript object for use within the component.
const styles = {
  body: {
    backgroundColor: '#121212',
    color: '#e0e0e0',
    fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    lineHeight: 1.7,
    margin: 0,
    padding: 0,
  },
  mainContainer: {
    maxWidth: '900px',
    margin: '40px auto',
    padding: '20px',
  },
  blogPost: {
    backgroundColor: '#1e1e1e',
    border: '1px solid #333',
    borderRadius: '10px',
    padding: '25px 40px',
    marginBottom: '50px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  },
  h1: {
    color: '#ffffff',
    fontSize: '2.2em',
    textAlign: 'center',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '2px solid #FF7F50',
  },
  h2: {
    color: '#ffffff',
    fontSize: '1.8em',
    borderBottom: '1px solid #444',
    paddingBottom: '10px',
    marginTop: '30px',
    marginBottom: '20px',
  },
  strong: {
    color: '#FF7F50',
    fontWeight: 600,
  },
  a: {
    color: '#FF7F50',
    textDecoration: 'none',
  },
  ctaButton: {
    display: 'inline-block',
    backgroundColor: '#FF7F50',
    color: '#121212',
    padding: '12px 25px',
    borderRadius: '50px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: '20px',
    border: 'none',
    cursor: 'pointer',
    transition: 'transform 0.2s ease-in-out, filter 0.2s',
  },
  ctaButtonHover: {
    transform: 'translateY(-2px)',
    filter: 'brightness(1.1)',
  },
  tldrSection: {
    backgroundColor: '#252525',
    border: '1px solid #444',
    padding: '20px',
    borderRadius: '8px',
    marginTop: '30px',
  },
  tldrHeader: {
      borderBottom: 'none',
      marginTop: 0,
  }
};

// --- HELPER COMPONENT for Hover Effect ---
const CtaButton = ({ href, children }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <a 
            href={href} 
            style={{ ...styles.ctaButton, ...(isHovered ? styles.ctaButtonHover : null) }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
        </a>
    );
};


// --- BLOG CONTENT COMPONENTS ---

const Blog1 = () => (
  <>
    <h1 style={styles.h1}>How to Know If You’re Eligible for a Home Loan</h1>
    <h2 style={styles.h2}>Introduction: Your First Step</h2>
    <p>Buying a home is a major milestone. Before you start visiting properties, it's essential to determine whether you're eligible for a home loan to save time and avoid rejections.</p>
    <div style={styles.tldrSection}>
      <h2 style={{...styles.h2, ...styles.tldrHeader}}>Eligibility Checklist</h2>
      <ul>
        <li><strong style={styles.strong}>Stable Income:</strong> ₹25,000+ monthly income.</li>
        <li><strong style={styles.strong}>Credit Score:</strong> CIBIL score of 750 or higher is ideal.</li>
        <li><strong style={styles.strong}>Debt Ratio:</strong> Your Debt-to-Income (DTI) ratio should be below 40%.</li>
      </ul>
    </div>
    <p style={{ textAlign: 'center', marginTop: '30px' }}>
      <CtaButton href="loan-application?type=home-loan">Check Eligibility Now &raquo;</CtaButton>
    </p>
  </>
);

const Blog2 = () => (
    <>
      <h1 style={styles.h1}>Unlocking the Value of Your Property: A Guide to Loan Against Property</h1>
      <h2 style={styles.h2}>Introduction: Your Property as a Financial Tool</h2>
      <p>A <strong style={styles.strong}>Loan Against Property (LAP)</strong> allows you to leverage your property's value for various needs, like business expansion or consolidating debt, at lower interest rates than personal loans.</p>
      <h2 style={styles.h2}>Key Features</h2>
      <ul>
        <li><strong style={styles.strong}>Higher Loan Amount:</strong> Get access to significant funds based on your property's value.</li>
        <li><strong style={styles.strong}>Lower Interest Rates:</strong> Since it's secured, rates are lower.</li>
        <li><strong style={styles.strong}>Longer Repayment Tenure:</strong> Enjoy flexible tenures up to 20 years.</li>
      </ul>
      <p style={{ textAlign: 'center', marginTop: '30px' }}>
        <CtaButton href="loan-application?type=lap">Calculate Your LAP Eligibility &raquo;</CtaButton>
      </p>
    </>
  );

const Blog3 = () => (
  <>
    <h1 style={styles.h1}>Is Your Home Loan EMI Too High? The Guide to Balance Transfer</h1>
    <h2 style={styles.h2}>Introduction: Don't Settle</h2>
    <p>If interest rates have dropped since you took your loan, a <strong style={styles.strong}>Home Loan Balance Transfer</strong> can help you switch to a new lender with a lower rate, saving you a significant amount of money.</p>
    <h2 style={styles.h2}>When to Consider a Transfer?</h2>
    <ul>
      <li><strong style={styles.strong}>Lower Rate:</strong> If another lender offers a rate at least 0.50% lower.</li>
      <li><strong style={styles.strong}>Early Stage of Loan:</strong> Most beneficial in the initial years.</li>
      <li><strong style={styles.strong}>Improved Credit:</strong> You may qualify for better rates now.</li>
    </ul>
    <p style={{ textAlign: 'center', marginTop: '30px' }}>
      <CtaButton href="loan-application?type=bt-topup">Find Best Balance Transfer Offers &raquo;</CtaButton>
    </p>
  </>
);

const Blog4 = () => (
  <>
    <h1 style={styles.h1}>Investing in Real Estate vs. SIP: Which Path is Right for You?</h1>
    <h2 style={styles.h2}>Introduction: The Investment Dilemma</h2>
    <p>Choosing between the tangible ownership of <strong style={styles.strong}>Real Estate</strong> and the market-linked growth of <strong style={styles.strong}>SIPs</strong> depends on your goals, risk appetite, and financial situation.</p>
    <h2 style={styles.h2}>Quick Comparison</h2>
    <ul>
      <li><strong style={styles.strong}>Ticket Size:</strong> Real Estate (High) vs. SIP (Low)</li>
      <li><strong style={styles.strong}>Liquidity:</strong> Real Estate (Low) vs. SIP (High)</li>
      <li><strong style={styles.strong}>Risk:</strong> Real Estate (Moderate) vs. SIP (High)</li>
    </ul>
    <p style={{ textAlign: 'center', marginTop: '30px' }}>
      <CtaButton href="sip">Use Our Investment Calculators &raquo;</CtaButton>
    </p>
  </>
);

const Blog5 = () => (
  <>
    <h1 style={styles.h1}>Prepay Your Home Loan or Invest in SIP? A Dilemma Solved</h1>
    <h2 style={styles.h2}>Introduction: A Common Crossroads</h2>
    <p>With surplus cash, should you <strong style={styles.strong}>prepay your home loan</strong> to become debt-free, or <strong style={styles.strong}>invest in a SIP</strong> to build wealth? The answer lies in a simple comparison.</p>
    <div style={styles.tldrSection}>
        <h2 style={{...styles.h2, ...styles.tldrHeader}}>The Golden Rule ⚖️</h2>
        <p>If the expected return from your investment is higher than your home loan's interest rate, investing makes more financial sense.</p>
        <p style={{ textAlign: 'center', fontSize: '1.2em' }}>
            If <strong style={styles.strong}>R<sub>SIP</sub> &gt; R<sub>Loan</sub></strong>, investing is potentially better.
        </p>
    </div>
    <p style={{ textAlign: 'center', marginTop: '30px' }}>
      <CtaButton href="sip">Make a Smart Decision &raquo;</CtaButton>
    </p>
  </>
);

// --- MAIN APP COMPONENT ---

const blogData = [
  { id: 1, component: <Blog1 /> },
  { id: 2, component: <Blog2 /> },
  { id: 3, component: <Blog3 /> },
  { id: 4, component: <Blog4 /> },
  { id: 5, component: <Blog5 /> },
];

function App() {
  // Applying body styles directly requires targeting the document body.
  // This effect hook runs once when the component mounts.
  React.useEffect(() => {
    Object.assign(document.body.style, styles.body);
  }, []);

  return (
    <div style={styles.mainContainer}>
      {blogData.map(post => (
        <div key={post.id} style={styles.blogPost}>
          {post.component}
        </div>
      ))}
    </div>
  );
}

export default App;
