import React from 'react';

export const Industries = () => {
  const partnerNBFCs = [
    { name: "L&T Finance", logoUrl: "https://www.ltfinance.com/assets/images/lt-logo.png" },
    { name: "Tata Capital", logoUrl: "https://retailonline.tatacapital.com/assets/images/TataCapitalLogo.svg" },
    { name: "Aditya Birla Capital", logoUrl: "https://careers.adityabirla.com/assets/images/logo/logo.png" },
    { name: "Muthoot Finance", logoUrl: "https://cdn.muthootfinance.com/sites/default/files/files/logo_0.webp" },
    { name: "Shriram Finance", logoUrl: "https://cdn.shriramfinance.in/sfl-fe/assets/images/sfl-logo.webp" },
    { name: "Cholamandalam", logoUrl: "https://files.cholamandalam.com/assets/images/chola_logo.svg" },
    { name: "Mahindra Finance", logoUrl: "https://www.mahindrafinance.com/wp-content/uploads/2023/05/mahindra-finance-logo.png" },
    { name: "Bajaj Finance", logoUrl: "https://www.bajajgroup.company/wp-content/uploads/2024/05/Bajajlogo3.jpg" },
    { name: "HDB Financial Services", logoUrl: "https://www.hdbfs.com/sites/default/files/images/logo_2021.svg" },
    { name: "ICICI Home Finance", logoUrl: "https://campaigns.icicibank.com/hl/homeLoan/nca/dist/img/icici_logo.webp" },
    { name: "PNB Housing Finance", logoUrl: "https://www.pnbhousing.com/documents/d/guest/logo-header?download=true" },
    { name: "LIC Housing Finance", logoUrl: "https://www.lichousing.com/images/lic-hfl-logo.svg" },
    { name: "DHFL", logoUrl: "https://www.dhfl.com/images/logo.png" },
    { name: "Capri Global", logoUrl: "https://www.capriloans.in/Assets/capri_logo.svg" },
  ];

  const featuredPartners = [
    {
      logo: partnerNBFCs[0].logoUrl,
      role: "KA Abir, North Zonal Head, L&T Housing",
      description:
        "Homobie has been a reliable distribution partner - transparent, prompt, and professional. Their tech-first approach ensures smoother file submissions and faster decision-making, which is great for both lenders and customers.",
    },
    {
      logo: partnerNBFCs[1].logoUrl,
      role: "Siddharth Srivastava, North Zonal Head, Tata Housing",
      description:
        "Homobie understands the nuances of housing finance like few others. Their team ensures quality applications and well-informed customers, which makes our underwriting smoother and faster.",
    },
    {
      logo: partnerNBFCs[3].logoUrl,
      role: "Regional Partnership Team, Home Loan Specialists",
      description:
        "India's leading home finance solutions with digital-first approach. Enjoy hassle-free loan processing and personalized customer service.",
    },
  ];

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-gray-300">Strong </span>
            <span className="text-orange-500 italic">partnerships</span>
            <span className="text-gray-300"> with industry leaders</span>
          </h1>
        </div>

        {/* Partner Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mx-auto max-w-6xl">
          {featuredPartners.map((partner, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-transparent mx-2"
            >
              {/* Description */}
              <div className="mb-6 min-h-[120px] px-2">
                <p className="text-gray-400 text-center text-sm md:text-base leading-relaxed">
                  {partner.description}
                </p>
              </div>

              {/* Divider */}
              <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-blue-800 mx-auto mb-6"></div>

              {/* Logo */}
              <div className="rounded-lg mt-4 mb-4 h-24 w-40 flex items-start justify-center shadow-md hover:shadow-lg transition">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-12 max-w-[150px] object-contain"
                />
              </div>

              {/* Role */}
              <div className="text-center md:-mt-6">
                <p className="text-gray-300 text-xs md:text-sm font-medium px-2">
                  {partner.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Industries;
