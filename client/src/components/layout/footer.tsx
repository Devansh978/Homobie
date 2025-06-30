import React from "react";
import { Link } from "wouter";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Facebook, 
  Twitter, 
  Instagram, 
  ArrowRight
} from "lucide-react";
import { companyInfo } from "@/lib/company-info";
import homobieLogo from "/assets/homobie-logo.png";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-neutral-800 text-neutral-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <img src={homobieLogo} alt="Homobie Logo" className="h-10" />
              <span className="font-bold text-2xl text-white">{}</span>
            </div>
            <p className="text-neutral-400 mb-6">
              Providing innovative financial solutions to help you achieve your dreams.
            </p>
            <div className="flex space-x-4">
              <a href={companyInfo.social.facebook} className="text-neutral-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href={companyInfo.social.twitter} className="text-neutral-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href={companyInfo.social.instagram} className="text-neutral-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-neutral-400 hover:text-white transition-colors flex items-center">
                  <ArrowRight size={16} className="mr-2" />
                  Home
                </Link>
              </li>
              <li>
                <Link href="/loan-application?type=home-loan" className="text-neutral-400 hover:text-white transition-colors flex items-center">
                  <ArrowRight size={16} className="mr-2" />
                  Home Loans
                </Link>
              </li>
              <li>
                <Link href="/sip" className="text-neutral-400 hover:text-white transition-colors flex items-center">
                  <ArrowRight size={16} className="mr-2" />
                  SIP Investments
                </Link>
              </li>
              <li>
                <Link href="/consultation" className="text-neutral-400 hover:text-white transition-colors flex items-center">
                  <ArrowRight size={16} className="mr-2" />
                  Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Business Hours</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Clock size={18} className="mr-3 mt-1 text-primary" />
                <div>
                  <p className="font-medium">Monday - Saturday</p>
                  <p className="text-neutral-400">{companyInfo.businessHours.monday}</p>
                </div>
              </li>
              <li className="flex items-start">
                <Clock size={18} className="mr-3 mt-1 text-primary" />
                <div>
                  <p className="font-medium">Sunday</p>
                  <p className="text-neutral-400">{companyInfo.businessHours.sunday}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Phone size={18} className="mr-3 mt-1 text-primary" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-neutral-400">{companyInfo.contact.phones[0]}</p>
                  <p className="text-neutral-400">{companyInfo.contact.phones[1]}</p>
                </div>
              </li>
              <li className="flex items-start">
                <Mail size={18} className="mr-3 mt-1 text-primary" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-neutral-400">{companyInfo.contact.email}</p>
                </div>
              </li>
              <li className="flex items-start">
                <MapPin size={18} className="mr-3 mt-1 text-primary" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-neutral-400">{companyInfo.contact.address}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-neutral-700 py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {currentYear} {companyInfo.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}