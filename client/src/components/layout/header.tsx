import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/use-auth"; 

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

const basePartnerUrl = "https://homobie-partner-portal.vercel.app";
const partnerRoles = ["Builder", "Broker", "User", "Telecaller"];

const getPartnerLoginUrl = (role = null) => {
  try {
    const userRole = role || localStorage.getItem('userRole') || localStorage.getItem('role') || localStorage.getItem('user_role');
    
    if (!userRole) {
      return `${basePartnerUrl}/user`;
    }
    
    const normalizedRole = userRole.toLowerCase();
    
    switch (normalizedRole) {
      case 'builder':
        return `${basePartnerUrl}/builder`;
      case 'user':
        return `${basePartnerUrl}/user`;
      case 'broker':
      case 'telecaller':
      default:
        return `${basePartnerUrl}/builder`;
    }
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return `${basePartnerUrl}/user`;
  }
};

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
  const { logoutMutation, user, isLoading } = useAuth(); // Get user from auth context
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [loginToggle, setLoginToggle] = useState("user");
  const dropdownTimeoutRef = useRef(null);
  const loginTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

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

  const handleLogout = () => {
    setLoginDropdownOpen(false);
    logoutMutation.mutate(); 
  };

  const handleDropdownHover = (index) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(index);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300);
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
    }, 300);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handlePartnerLogin = (role) => {
    const dynamicUrl = getPartnerLoginUrl(role);
    window.open(dynamicUrl, '_blank', 'noopener,noreferrer');
  };

  const handleUserLogin = () => {
    window.location.href = "/auth";
  };

  // Show loading state if auth is still loading
  if (isLoading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-8xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <a href="/" className="flex items-center">
                <img
                  src="/assets/homobie-logo.png"
                  alt="Homobie Logo"
                  className="h-12 w-auto object-contain"
                />
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <div className="animate-pulse bg-white/20 rounded-lg w-20 h-10"></div>
              <div className="animate-pulse bg-white/20 rounded-lg w-20 h-10"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 font-bold
          ${scrolled
            ? "bg-black/60 backdrop-blur-xl border-b border-white/10 shadow-lg"
            : "bg-black/40 backdrop-blur-xl border-b border-white/5"
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

            {/* Desktop Auth Section */}
            <div className="hidden lg:flex items-center space-x-2">
              {user ? (
                <div className="relative">
                  <button
                    className="flex items-center px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl transition-all duration-300 border border-white/20 text-[16px]"
                    onMouseEnter={handleLoginDropdownEnter}
                    onMouseLeave={handleLoginDropdownLeave}
                  >
                    <User className="h-4 w-4 mr-2" />
                    <span className="font-medium">{user.fullName}</span>
                    <ChevronDown
                      className={`ml-2 h-4 w-4 transition-transform duration-300 ${
                        loginDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* User Dropdown */}
                  <div
                    className={`absolute right-0 top-full mt-2 w-48 bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl transition-all duration-300 ${
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
                      <button 
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                        className="w-full text-left px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200 flex items-center disabled:opacity-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        {logoutMutation.isPending ? "Logging out..." : "Logout"}
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

                    {/* Login Dropdown */}
                    <div
                      className={`absolute right-0 top-full mt-2 w-64 bg-black backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl transition-all duration-300 ${
                        loginDropdownOpen
                          ? "opacity-100 pointer-events-auto"
                          : "opacity-0 pointer-events-none"
                      }`}
                      onMouseEnter={handleLoginDropdownEnter}
                      onMouseLeave={handleLoginDropdownLeave}
                    >
                      <div className="p-4">
                        {/* Toggle Switch */}
                        <div className="flex items-center justify-center mb-4">
                          <div className="relative bg-white/10 rounded-full p-1 flex">
                            <button
                              onClick={() => setLoginToggle("user")}
                              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                                loginToggle === "user"
                                  ? "bg-[#292579] text-white shadow-lg"
                                  : "text-white/70 hover:text-white"
                              }`}
                            >
                              User
                            </button>
                            <button
                              onClick={() => setLoginToggle("partner")}
                              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                                loginToggle === "partner"
                                  ? "bg-[#292579] text-white shadow-lg"
                                  : "text-white/70 hover:text-white"
                              }`}
                            >
                              Partner
                            </button>
                          </div>
                        </div>

                        {/* Login Options */}
                        {loginToggle === "user" ? (
                          <button
                            onClick={handleUserLogin}
                            className="w-full px-4 py-3 text-white/90 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200 font-medium text-center"
                          >
                            User Login
                          </button>
                        ) : (
                          <div className="space-y-2">
                            <div className="text-white/70 text-sm font-medium mb-2 text-center">
                              Partner Login
                            </div>
                            {partnerRoles.map((role, index) => (
                              <button
                                key={index}
                                onClick={() => handlePartnerLogin(role)}
                                className="block w-full text-left px-4 py-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
                              >
                                {role}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <a
                    href="/auth"
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

          {/* Desktop Dropdown Content */}
          <div
            className={`transition-all duration-500 overflow-hidden ${
              activeDropdown !== null ? "h-[70%] opacity-100" : "h-0 opacity-0"
            }`}
            onMouseEnter={handleDropdownContentEnter}
            onMouseLeave={handleDropdownLeave}
          >
            <div className="py-8 px-8">
              <div className="flex items-start justify-start gap-16">
                {activeDropdown !== null &&
                  navData[activeDropdown]?.children && (
                    <>
                      <div className="w-1/4">
                        <h3 className="text-white font-semibold text-2xl border-b border-white/20 pb-4">
                          {navData[activeDropdown].label}
                        </h3>
                      </div>
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

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 backdrop-blur-sm"
          onClick={closeMobileMenu}
        />

        <div
          className={`absolute right-0 top-0 h-full w-full max-w-sm backdrop-blur-2xl border-l border-white/20 shadow-2xl transition-all duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
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
                      {user.fullName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {user.fullName}
                      </div>
                      <div className="text-white/70 text-[14px]">{user.role || 'User'}</div>
                    </div>
                  </div>
                  
                  {/* Mobile Logout Button */}
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                    disabled={logoutMutation.isPending}
                    className="flex w-full px-4 py-3 text-center text-red-400 bg-white/5 hover:bg-red-500/20 rounded-lg transition-all duration-300 items-center justify-center disabled:opacity-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {logoutMutation.isPending ? "Logging out..." : "Logout"}
                  </button>
                </div>
              ) : (
                <>
                  {/* Mobile Toggle */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative bg-white/10 rounded-full p-1 flex">
                      <button
                        onClick={() => setLoginToggle("user")}
                        className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                          loginToggle === "user"
                            ? "bg-[#292579] text-white shadow-lg"
                            : "text-white/70 hover:text-white"
                        }`}
                      >
                        User
                      </button>
                      <button
                        onClick={() => setLoginToggle("partner")}
                        className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                          loginToggle === "partner"
                            ? "bg-[#292579] text-white shadow-lg"
                            : "text-white/70 hover:text-white"
                        }`}
                      >
                        Partner
                      </button>
                    </div>
                  </div>

                  {/* Mobile Login Options */}
                  {loginToggle === "user" ? (
                    <button
                      onClick={() => {
                        handleUserLogin();
                        closeMobileMenu();
                      }}
                      className="block w-full px-4 py-3 text-center text-white bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 backdrop-blur-sm"
                    >
                      User Login 
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-white/70 text-sm font-medium px-2 mb-2">
                        Partner Login
                      </div>
                      {partnerRoles.map((role, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            handlePartnerLogin(role);
                            closeMobileMenu();
                          }}
                          className="block w-full px-4 py-2 text-center text-white/80 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300 text-sm"
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  )}

                  <a
                    href="/auth"
                    onClick={closeMobileMenu}
                    className="block w-full px-4 py-3 text-center text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all duration-300 mt-4"
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
