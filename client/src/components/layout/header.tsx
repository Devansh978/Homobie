import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Menu, X, User, LogOut } from "lucide-react";

// --- Data definitions ---
const navData = [

  {
    label: "Loans",
    children: [
      { label: "Home Loans", path: "/loan-application?type=home-loan" },
      { label: "LAP", path: "/loan-application?type=lap" },
      { label: "BT Top-Up", path: "/loan-application?type=bt-topup" },
    ],
  },
  {
    label: "Investment",
    children: [{ label: "SIP", path: "/sip" }],
  },
  {
    label: "Services",
    children: [{ label: "Consultation", path: "/consultation" }],
  },
  {
    label: "About",
    path: "/about",
  },
  {
    label: "Blog",
    path: "/blog",
  },
  {
    label: "Explore Properties",
    path: "/properties",
  },
  {
    label: "Financial Tools",
    children: [
      { label: "EMI Calculator", path: "/tools/emi-calculator" },
      { label: "SIP & Loan Calculator", path: "/tools/sip-loan-calculator" },
      { label: "Budget Planning Tool", path: "/tools/budget-planner" },
    ],
  },
];

const partnerLoginUrl = "https://homobie-frontend-portal-bco8-devansh978s-projects.vercel.app";
const partnerRoles = ["Builder", "Broker", "User", "Telecaller"];

// Glassmorphism DesktopNavDropdown component
const DesktopNavDropdown = ({ item, isActive, onHover, onLeave }) => {
  const hasChildren = item.children && item.children.length > 0;

  const handleMouseEnter = () => {
    onHover();
  };

  if (!hasChildren) {
    return (
      <li className="relative">
        <a
          href={item.path || "/"}
          className="flex items-center px-2 py-2 text-white/90 hover:text-white transition-all duration-300 font-medium text-[16px] tracking-wide hover:bg-white/10 rounded-lg backdrop-blur-sm"
        >
          {item.label}
        </a>
      </li>
    );
  }

  return (
    <li className="relative" onMouseEnter={handleMouseEnter}>
      <button className="flex items-center px-2 py-2 text-white/90 hover:text-white transition-all duration-300 font-medium text-[16px] tracking-wide hover:bg-white/10 rounded-lg backdrop-blur-sm">
        {item.label}
        <ChevronDown
          className={`ml-1 h-3 w-3 transition-transform duration-300 ${
            isActive ? "rotate-180" : ""
          }`}
        />
      </button>
    </li>
  );
};

// Mobile Nav Item Component
const MobileNavItem = ({ item, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const handleItemClick = () => {
    if (!hasChildren && onClose) {
      onClose();
    }
  };

  if (!hasChildren) {
    return (
      <a
        href={item.path || "/"}
        onClick={handleItemClick}
        className="block px-4 py-3 text-white hover:text-blue-300 hover:bg-white/10 rounded-lg transition-all duration-300 font-medium"
      >
        {item.label}
      </a>
    );
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-white hover:text-blue-300 hover:bg-white/10 rounded-lg transition-all duration-300 font-medium"
      >
        {item.label}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="ml-4 mt-2 space-y-2">
          {item.children.map((child, index) => (
            <a
              key={index}
              href={child.path}
              onClick={handleItemClick}
              className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
              target={child.external ? "_blank" : undefined}
              rel={child.external ? "noopener noreferrer" : undefined}
            >
              {child.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Navigation Component
export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef(null);
  const loginTimeoutRef = useRef(null);

  // Mock auth state - replace with your actual auth hook
  const user = null;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleDropdownHover = (index) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(index);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300); // 300ms delay
  };

  const handleDropdownContentEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
  };

  const handleLoginDropdownEnter = () => {
    if (loginTimeoutRef.current) {
      clearTimeout(loginTimeoutRef.current);
    }
    setLoginDropdownOpen(true);
  };

  const handleLoginDropdownLeave = () => {
    loginTimeoutRef.current = setTimeout(() => {
      setLoginDropdownOpen(false);
    }, 300); // 300ms delay
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 font-bold${
          scrolled
            ? "bg-slate-900/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl"
            : "bg-slate-900/50 backdrop-blur-xl"
        } ${activeDropdown !== null ? "pb-6" : ""}`}
      >
        <div className="max-w-8xl mx-auto px-2 sm:px-4 lg:px-6 relative">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/" className="flex items-center">
                <img
                  src="/assets/homobie-logo.png"
                  alt="Homobie Logo"
                  className="h-12 w-auto object-contain"
                />
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:block font-bold">
              <ul
                className="flex items-center space-x-4 relative"
                onMouseLeave={handleDropdownLeave}
              >
                {navData.map((item, index) => (
                  <DesktopNavDropdown
                    key={index}
                    item={item}
                    isActive={activeDropdown === index}
                    onHover={() => handleDropdownHover(index)}
                    onLeave={handleDropdownLeave}
                  />
                ))}
              </ul>
            </div>

            {/* Desktop User Menu / Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-2">
              {user ? (
                <div className="relative">
                  <button
                    className="flex items-center px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl transition-all duration-300 border border-white/20 text-[16px]"
                    onMouseEnter={handleLoginDropdownEnter}
                    onMouseLeave={handleLoginDropdownLeave}
                  >
                    <User className="h-4 w-4 mr-2" />
                    <span className="font-medium">{user.name}</span>
                    <ChevronDown
                      className={`ml-2 h-4 w-4 transition-transform duration-300 ${
                        loginDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* User Dropdown */}
                  <div
                    className={`absolute right-0 top-full mt-2 w-48 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl transition-all duration-300 ${
                      loginDropdownOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                    }`}
                    onMouseEnter={handleLoginDropdownEnter}
                    onMouseLeave={handleLoginDropdownLeave}
                  >
                    <div className="p-2">
                      <a
                        href="/profile"
                        className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
                      >
                        Profile
                      </a>
                      <a
                        href="/settings"
                        className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
                      >
                        Settings
                      </a>
                      <button className="w-full text-left px-4 py-3 text-white/90 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200 flex items-center">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  {/* Login Dropdown */}
                  <div className="relative">
                    <button
                      className="flex items-center px-3 py-2 text-white/90 hover:text-white font-medium transition-all duration-300 hover:bg-white/10 rounded-lg backdrop-blur-sm text-[16px]"
                      onMouseEnter={handleLoginDropdownEnter}
                      onMouseLeave={handleLoginDropdownLeave}
                    >
                      Login
                      <ChevronDown
                        className={`ml-1 h-3 w-3 transition-transform duration-300 ${
                          loginDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Login Options Dropdown */}
                    <div
                      className={`absolute right-0 top-full mt-2 w-56 bg-black backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl transition-all duration-300 ${
                        loginDropdownOpen
                          ? "opacity-100 pointer-events-auto"
                          : "opacity-0 pointer-events-none"
                      }`}
                      onMouseEnter={handleLoginDropdownEnter}
                      onMouseLeave={handleLoginDropdownLeave}
                    >
                      <div className="p-2">
                        {/* User Login */}
                        <a
                          href="/auth"
                          className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200 font-medium"
                        >
                          User Login
                        </a>

                        {/* Divider */}
                        <div className="border-t border-white/20 my-2"></div>

                        {/* Partner Login Header */}
                        <div className="px-4 py-2 text-white/70 text-[16px] font-medium">
                          Partner Login
                        </div>

                        {/* Partner Login Options */}
                        {partnerRoles.map((role, index) => (
                          <a
                            key={index}
                            href={partnerLoginUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200 ml-2"
                          >
                            {role}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  <a
                    href="/register"
                    className="px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/20 text-[16px]"
                  >
                    Sign Up
                  </a>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Dropdown Container - Expands the nav height */}
          {/* Dropdown */}
          <div
            className={`transition-all duration-500 overflow-hidden ${
              activeDropdown !== null ? "h-screen opacity-100" : "h-0 opacity-0"
            }`}
            onMouseEnter={handleDropdownContentEnter}
            onMouseLeave={handleDropdownLeave}
          >
            <div className="py-8 px-8">
              <div className="flex items-start justify-start gap-16">
                {activeDropdown !== null &&
                  navData[activeDropdown]?.children && (
                    <>
                      {/* Left Heading */}
                      <div className="w-1/4">
                        <h3 className="text-white font-semibold text-2xl border-b border-white/20 pb-4">
                          {navData[activeDropdown].label}
                        </h3>
                      </div>

                      {/* Right Options */}
                      <div className="flex-1 grid grid-row-2 md:grid-row-3 lg:grid-row-4 gap-6">
                        {navData[activeDropdown].children.map(
                          (child, index) => (
                            <a
                              key={index}
                              href={child.path}
                              className="block text-white/80 hover:text-white transition-all duration-200 font-medium py-1"
                            >
                              {child.label}
                            </a>
                          )
                        )}
                      </div>
                    </>
                  )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Glass Drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 backdrop-blur-sm"
          onClick={closeMobileMenu}
        />

        {/* Glass Drawer */}
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-sm backdrop-blur-2xl border-l border-white/20 shadow-2xl transition-all duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <img
                src="/assets/wmremove-transformed - Edited.jpg"
                alt="Homobie Logo"
                className="h-8 w-auto object-contain"
              />
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile Nav Items */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-2">
                {navData.map((item, index) => (
                  <MobileNavItem
                    key={index}
                    item={item}
                    onClose={closeMobileMenu}
                  />
                ))}
              </div>
            </div>

            {/* Mobile Auth Section */}
            <div className="border-t border-white/20 p-6">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      {`${user.firstName[0]}${user.lastName[0]}`}
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-white/70 text-[16px]">{user.role}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <a
                      href="/dashboard"
                      onClick={closeMobileMenu}
                      className="block w-full px-4 py-3 text-center text-white bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300"
                    >
                      Dashboard
                    </a>
                    {user.role === "admin" && (
                      <a
                        href="/admin"
                        onClick={closeMobileMenu}
                        className="block w-full px-4 py-3 text-center text-white bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300"
                      >
                        Admin Dashboard
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <a
                    href="/auth"
                    onClick={closeMobileMenu}
                    className="block w-full px-4 py-3 text-center text-white bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 backdrop-blur-sm"
                  >
                    User Login
                  </a>

                  <div className="space-y-2 mt-2">
                    <div className="text-white/70 text-[16px] font-medium px-2">
                      Partner Login
                    </div>
                    {partnerRoles.map((role, index) => (
                      <a
                        key={index}
                        href={partnerLoginUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={closeMobileMenu}
                        className="block w-full px-4 py-2 text-center text-white/80 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300 text-[16px]"
                      >
                        {role}
                      </a>
                    ))}
                  </div>

                  <a
                    href="/register"
                    onClick={closeMobileMenu}
                    className="block w-full px-4 py-3 text-center text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all duration-300"
                  >
                    Sign Up
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
