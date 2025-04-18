import React from "react";
import { Link } from "wouter";
import { Shield, MapPin, Phone, Mail } from "lucide-react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-1 mb-4">
              <Shield className="h-8 w-8 text-white" />
              <span className="font-bold text-xl">FinSecure</span>
            </div>
            <p className="text-neutral-400 mb-4">
              Your trusted partner for all financial needs. We help you secure
              your future with the right financial products.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-white hover:text-[#FFB800] transition-colors"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="text-white hover:text-[#FFB800] transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="text-white hover:text-[#FFB800] transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="#"
                className="text-white hover:text-[#FFB800] transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/loan-application?type=home-loan" className="text-neutral-400 hover:text-white transition-colors">
                  Home Loans
                </Link>
              </li>
              <li>
                <Link href="/loan-application?type=lap" className="text-neutral-400 hover:text-white transition-colors">
                  Loan Against Property
                </Link>
              </li>
              <li>
                <Link href="/loan-application?type=bt-topup" className="text-neutral-400 hover:text-white transition-colors">
                  Balance Transfer
                </Link>
              </li>
              <li>
                <Link href="/sip" className="text-neutral-400 hover:text-white transition-colors">
                  SIP Investments
                </Link>
              </li>
              <li>
                <Link href="/consultation" className="text-neutral-400 hover:text-white transition-colors">
                  Free Consultation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#calculator"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  EMI Calculator
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Eligibility Calculator
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Blog & Articles
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Customer Support
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mt-1 mr-3 text-[#FFB800]" />
                <span className="text-neutral-400">
                  123 Financial Street, Mumbai, Maharashtra 400001
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 text-[#FFB800]" />
                <span className="text-neutral-400">+91 9876543210</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 text-[#FFB800]" />
                <span className="text-neutral-400">support@finsecure.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-500">
          <p>
            © {new Date().getFullYear()} FinSecure. All rights reserved. |{" "}
            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>{" "}
            |{" "}
            <a href="#" className="hover:text-white">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
