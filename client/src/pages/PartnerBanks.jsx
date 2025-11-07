import React from "react";
import { motion } from "framer-motion";

const partnerBanks = [
  {
    name: "HDFC Bank",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/HDFC_Bank_Logo.svg/2560px-HDFC_Bank_Logo.svg.png",
  },
  {
    name: "ICICI Bank",
    logoUrl:
      "https://www.icicibank.com/content/dam/icicibank-revamp/images/icici-logo/icici-header-logo.png",
  },
  {
    name: "State Bank of India",
    logoUrl: "https://sbi.bank.in/o/SBI-Theme/images/custom/logo.png",
  },
  {
    name: "Axis Bank",
    logoUrl: "https://www.axisbank.com/assets/images/logo-white.png",
  },
  {
    name: "Kotak Mahindra Bank",
    logoUrl:
      "https://www.kotak811.com/open-zero-balance-savings-account/images/logo-new.svg",
  },
  {
    name: "Bajaj Finserv",
    logoUrl:
      "https://cms-assets.bajajfinserv.in/is/image/bajajfinance/bajaj-logo-sep-15?scl=1&fmt=png-alpha",
  },
  {
    name: "IDFC First Bank",
    logoUrl:
      "https://www.idfcfirstbank.com/content/dam/idfcfirstbank/images/n1/IDFC-logo-website.svg",
  },
  {
    name: "Yes Bank",
    logoUrl:
      "https://th.bing.com/th/id/OIP.GycGFfInHPtQYR6dV5s86AHaDn?w=349&h=171&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
  },
  {
    name: "Bank of Baroda",
    logoUrl:
      "https://bankofbaroda.bank.in/-/media/project/bob/countrywebsites/india/icons/bob-logo.svg",
  },
  {
    name: "Punjab National Bank",
    logoUrl: "https://www.pnbindia.in/images/logo.png",
  },
  {
    name: "IndusInd Bank",
    logoUrl:
      "https://www.indusind.bank.in/content/dam/homepage_webp_img/indusind-bank1.webp",
  },
  {
    name: "Federal Bank",
    logoUrl:
      "https://www.federalbank.co.in/o/federal-bank-theme/images/logo.png",
  },
];

const partnerNBFCs = [
  {
    name: "L&T Finance",
    logoUrl: "https://www.ltfinance.com/assets/images/lt-logo.png",
  },
  {
    name: "Tata Capital",
    logoUrl:
      "https://retailonline.tatacapital.com/assets/images/TataCapitalLogo.svg",
  },
  {
    name: "Aditya Birla Capital",
    logoUrl: "https://careers.adityabirla.com/assets/images/logo/logo.png",
  },
  {
    name: "Muthoot Finance",
    logoUrl:
      "https://cdn.muthootfinance.com/sites/default/files/files/logo_0.webp",
  },
  {
    name: "Shriram Finance",
    logoUrl: "https://cdn.shriramfinance.in/sfl-fe/assets/images/sfl-logo.webp",
  },
  {
    name: "Cholamandalam",
    logoUrl: "https://files.cholamandalam.com/assets/images/chola_logo.svg",
  },
  {
    name: "Mahindra Finance",
    logoUrl:
      "https://www.mahindrafinance.com/wp-content/uploads/2023/05/mahindra-finance-logo.png",
  },
  {
    name: "Bajaj Finance",
    logoUrl:
      "https://www.bajajgroup.company/wp-content/uploads/2024/05/Bajajlogo3.jpg",
  },
  {
    name: "HDB Financial Services",
    logoUrl: "https://www.hdbfs.com/sites/default/files/images/logo_2021.svg",
  },
  {
    name: "ICICI Home Finance",
    logoUrl:
      "https://campaigns.icicibank.com/hl/homeLoan/nca/dist/img/icici_logo.webp",
  },
  {
    name: "PNB Housing Finance",
    logoUrl:
      "https://www.pnbhousing.com/documents/d/guest/logo-header?download=true",
  },
  {
    name: "LIC Housing Finance",
    logoUrl: "https://www.lichousing.com/images/lic-hfl-logo.svg",
  },
  {
    name: "DHFL",
    logoUrl: "https://www.dhfl.com/images/logo.png",
  },
  {
    name: "Capri Global",
    logoUrl: "https://www.capriloans.in/Assets/capri_logo.svg",
  },
];

export const PartnerBanks = () => {
  return (
    <section className="py-16 px-4 overflow-hidden relative">
      {/* Subtle gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.03] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold mb-4 text-white"
        >
          Our Partner Banks & NBFCs
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-lg text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          We've joined hands with India's top financial institutions to bring
          you unmatched trust, flexibility, and convenience.
        </motion.p>

        {/* Partner Banks Section */}
        <div className="mb-16">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-2xl font-semibold mb-8 text-blue-300 tracking-wide"
          >
            Partner Banks
          </motion.h3>

          <div className="relative overflow-hidden py-4">
            <motion.div
              className="flex space-x-8"
              animate={{ x: [0, -1030] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 38,
                  ease: "linear",
                },
              }}
            >
              {[...partnerBanks, ...partnerBanks].map((bank, index) => (
                <motion.div
                  key={`${bank.name}-${index}`}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.05,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.1 }}
                  className="flex-shrink-0 w-40 h-20 flex items-center justify-center p-4 bg-white/[0.04] rounded-2xl backdrop-blur-md border border-white/10 hover:border-white/30 transition-all duration-500 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                >
                  <img
                    src={bank.logoUrl}
                    alt={bank.name}
                    className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Partner NBFCs Section */}
        <div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-2xl font-semibold mb-8 text-purple-300 tracking-wide"
          >
            Partner NBFCs
          </motion.h3>

          <div className="relative overflow-hidden py-4">
            <motion.div
              className="flex space-x-8"
              animate={{ x: [-1030, 0] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 38,
                  ease: "linear",
                },
              }}
            >
              {[...partnerNBFCs, ...partnerNBFCs].map((nbfc, index) => (
                <motion.div
                  key={`${nbfc.name}-${index}`}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.05,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.1 }}
                  className="flex-shrink-0 w-40 h-20 flex items-center justify-center p-4 bg-white/[0.04] rounded-2xl backdrop-blur-md border border-white/10 hover:border-white/30 transition-all duration-500 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                >
                  <img
                    src={nbfc.logoUrl}
                    alt={nbfc.name}
                    className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerBanks;
