import React, { useState } from "react";
import { Link } from "wouter";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  ArrowRight,
  Calculator,
  Coins,
  PieChart,
  CalendarDays,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { companyInfo } from "@/lib/company-info";
import homobieLogo from "/assets/homobie-logo.png";
import SipCalculator from "../../pages/SipCalculator/SipCalculator";
import EmiCalculator from "../../pages/EmiCalculator/EmiCalculator";
import BudgetPlanningTool from "../../pages/BudgetPlanningTool/BudgetPlanningTool";


const toolItems = [
  {
    name: "EMI Calculator",
    icon: Calculator,
    path: "/tools/emi-calculator",
    ariaLabel: "Open EMI Calculator",
    component: <EmiCalculator />,
    isModal: false,
  },
  {
    name: "SIP & Loan Calculator",
    icon: Coins,
    path: "/tools/sip-loan-calculator",
    component: <SipCalculator />,
      isModal: false,
  },
  {
    name: "Budget Planning Tool",
    icon: PieChart,
    path: "/tools/budget-planner",
    component: <BudgetPlanningTool />,
      isModal: false,
  },
  {
    name: "Retirement Planner",
    icon: CalendarDays,
    path: "/tools/retirement-planner",
    ariaLabel: "Navigate to Retirement Planner tool",
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [activeTool, setActiveTool] = useState(null);

  const handleToolClick = (tool) => {
    if (tool.isModal) {
      setActiveTool(tool);
    }
  };

  const closeModal = () => {
    setActiveTool(null);
  };

  return (
    <footer className="bg-neutral-800 text-neutral-300 relative">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <img
                src={homobieLogo}
                alt="Homobie Logo"
                className="h-10 w-auto"
                width={40}
                height={40}
              />
              <span className="sr-only">Homobie</span>
            </div>
            <p className="text-neutral-400">
              Providing innovative financial solutions to help you achieve your
              dreams.
            </p>
            <div className="flex space-x-4">
              {[
                {
                  icon: Facebook,
                  url: companyInfo.social.facebook,
                  label: "Facebook",
                },
                {
                  icon: Twitter,
                  url: companyInfo.social.twitter,
                  label: "Twitter",
                },
                {
                  icon: Instagram,
                  url: companyInfo.social.instagram,
                  label: "Instagram",
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  className="text-neutral-400 hover:text-white transition-colors duration-200"
                  aria-label={`Visit our ${social.label}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                {
                  name: "Home Loans",
                  path: "/loan-application?type=home-loan",
                },
                {
                  name: "Loan Against Property",
                  path: "/loan-application?type=lap",
                },
                {
                  name: "Balance Transfer",
                  path: "/loan-application?type=bt-topup",
                },
                { name: "SIP Investments", path: "/sip" },
                { name: "Consultation", path: "/consultation" },
                { name: "Blog", path: "/blog" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-neutral-400 hover:text-white transition-colors duration-200 flex items-center group"
                    aria-label={`Navigate to ${link.name}`}
                  >
                    <ArrowRight
                      size={16}
                      className="mr-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools & Resources */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">
              Tools & Resources
            </h3>
            <ul className="space-y-3">
              {toolItems.map((item) => (
                <motion.li
                  key={item.name}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.isModal ? (
                      <button
                        onClick={() => handleToolClick(item)}
                        className="text-neutral-400 hover:text-white transition-colors flex items-center w-full text-left"
                        aria-label={item.ariaLabel}
                      >
                        <item.icon
                          size={18}
                          className="mr-3 text-primary flex-shrink-0"
                        />
                        <span>{item.name}</span>
                      </button>
                    ) : (
                      <Link
                        href={item.path}
                        className="text-neutral-400 hover:text-white transition-colors flex items-center"
                        aria-label={item.ariaLabel}
                      >
                        <item.icon
                          size={18}
                          className="mr-3 text-primary flex-shrink-0"
                        />
                        <span>{item.name}</span>
                      </Link>
                    )}
                  </motion.div>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">
              Business Hours
            </h3>
            <ul className="space-y-4">
              {[
                {
                  label: "Monday - Saturday",
                  time: companyInfo.businessHours.monday,
                },
                {
                  label: "Sunday",
                  time: companyInfo.businessHours.sunday,
                },
              ].map((item) => (
                <li key={item.label} className="flex items-start">
                  <Clock
                    size={18}
                    className="mr-3 mt-1 text-primary flex-shrink-0"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-neutral-400">{item.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Phone
                  size={18}
                  className="mr-3 mt-1 text-primary flex-shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-medium">Phone</p>
                  {companyInfo.contact.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\s+/g, "")}`}
                      className="block text-neutral-400 hover:text-white transition-colors duration-200"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </li>
              <li className="flex items-start">
                <Mail
                  size={18}
                  className="mr-3 mt-1 text-primary flex-shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-medium">Email</p>
                  <a
                    href={`mailto:${companyInfo.contact.email}`}
                    className="block text-neutral-400 hover:text-white transition-colors duration-200"
                  >
                    {companyInfo.contact.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <MapPin
                  size={18}
                  className="mr-3 mt-1 text-primary flex-shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-neutral-400">
                    {companyInfo.contact.address}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Calculator Modal */}
      {activeTool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {activeTool.name}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 p-1"
                aria-label="Close calculator"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-2">
              {activeTool.component}
            </div>
          </motion.div>
        </div>
      )}

      {/* Copyright */}
      <div className="border-t border-neutral-700 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-neutral-400">
            &copy; {currentYear} {companyInfo.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}