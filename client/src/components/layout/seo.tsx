import React from "react";
import { Helmet } from "react-helmet";

const SEO = ({
  title = "HomoBie - Your Trusted Financial Partner for Home Loans & LAP",
  description = "Apply for Home Loans, Loan Against Property (LAP), and Balance Transfers with ease on HomoBie. Get expert consultation and low-interest offers.",
  url = "https://www.homobie.com",
  image = "https://www.homobie.com/assets/homobie-logo.png",
}) => (
  <Helmet>
    {/* Primary Meta Tags */}
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={url} />
    <meta name="robots" content="index, follow" />
    <meta name="author" content="HomoBie Team" />
    <meta name="keywords" content="Home Loan, Loan Against Property, LAP, Balance Transfer, Homobie, Low EMI Loan, Online Loan Application" />

    {/* Open Graph / Facebook */}
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={url} />
    <meta property="og:image" content={image} />

    {/* Twitter Card */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
  </Helmet>
);

export default SEO;

