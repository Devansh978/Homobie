import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Settings,
  Shield,
  ChevronDown,
  Users,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import "./header.css";

// --- Constants ---
const NAV_ITEMS = [
  {
    label: "Loans",
    subItems: [
      { label: "Home Loans", path: "/loan-application?type=home-loan" },
      { label: "LAP", path: "/loan-application?type=lap" },
      { label: "BT Top-Up", path: "/loan-application?type=bt-topup" },
    ],
  },
  {
    label: "Investment",
    subItems: [{ label: "SIP", path: "/sip" }],
  },
  {
    label: "Services",
    subItems: [{ label: "Consultation", path: "/consultation" }],
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
    label: "Properties",
    path: "/properties",
  },
];

const PARTNER_LOGIN_URL = "https://homobie-frontend-portal-bco8.vercel.app/";
const PARTNER_ROLES = ["Builder", "Broker", "User", "Telecaller"];

// --- Mobile Navigation ---
const MobileNav = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [_, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Navigation Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <Link href="/" className="text-xl font-bold text-primary">
                  <img 
                    src="/assets/wmremove-transformed - Edited.jpg" 
                    alt="Logo" 
                    className="h-8"
                  />
                </Link>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <nav className="flex flex-col p-4 space-y-2">
                  {NAV_ITEMS.map((item) => (
                    <div key={item.label} className="group">
                      {item.subItems ? (
                        <>
                          <button
                            onClick={() => setActiveSubmenu(activeSubmenu === item.label ? null : item.label)}
                            className="flex items-center justify-between w-full p-3 text-left rounded-lg hover:bg-gray-50"
                          >
                            <span className="font-medium">{item.label}</span>
                            <ChevronDown className={`w-5 h-5 transition-transform ${activeSubmenu === item.label ? "rotate-180" : ""}`} />
                          </button>
                          {activeSubmenu === item.label && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-4 space-y-2"
                            >
                              {item.subItems.map((subItem) => (
                                <button
                                  key={subItem.label}
                                  onClick={() => handleNavigate(subItem.path)}
                                  className="block w-full p-2 text-left rounded-lg hover:bg-gray-50"
                                >
                                  {subItem.label}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </>
                      ) : (
                        <button
                          onClick={() => handleNavigate(item.path!)}
                          className="block w-full p-3 text-left rounded-lg hover:bg-gray-50"
                        >
                          <span className="font-medium">{item.label}</span>
                        </button>
                      )}
                    </div>
                  ))}
                </nav>

                {/* Auth Section */}
                <div className="p-4 mt-auto border-t">
                  {user ? (
                    <div className="space-y-3">
                      <Link
                        href="/dashboard"
                        className="flex items-center p-3 rounded-lg hover:bg-gray-50"
                      >
                        <LayoutDashboard className="w-5 h-5 mr-3" />
                        <span>Dashboard</span>
                      </Link>
                      {user.role === "admin" || user.role === "superadmin" ? (
                        <Link
                          href="/admin"
                          className="flex items-center p-3 rounded-lg hover:bg-gray-50"
                        >
                          <Settings className="w-5 h-5 mr-3" />
                          <span>Admin Panel</span>
                        </Link>
                      ) : null}
                      <button
                        onClick={() => logoutMutation.mutate()}
                        disabled={logoutMutation.isPending}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50 text-red-600"
                      >
                        <LogOut className="w-5 h-5 mr-3" />
                        <span>{logoutMutation.isPending ? "Signing out..." : "Sign Out"}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link
                        href="/auth"
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center">
                          <User className="w-5 h-5 mr-3" />
                          <span>User Login</span>
                        </div>
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                      <div className="pl-8 space-y-2">
                        <p className="text-sm font-medium text-gray-500">Partner Login</p>
                        {PARTNER_ROLES.map((role) => (
                          <a
                            key={role}
                            href={PARTNER_LOGIN_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-2 rounded-lg hover:bg-gray-50"
                          >
                            {role}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Desktop Navigation Item ---
const NavItem = ({ item }: { item: typeof NAV_ITEMS[0] }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (item.path) {
    return (
      <Link
        href={item.path}
        className="px-4 py-2 text-sm font-medium transition-colors hover:text-primary"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
            isOpen ? "text-primary" : ""
          )}
        >
          {item.label}
          <ChevronDown
            className={cn(
              "ml-1 h-4 w-4 transition-transform",
              isOpen ? "rotate-180" : ""
            )}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-48 p-2 rounded-lg shadow-lg"
      >
        {item.subItems?.map((subItem) => (
          <DropdownMenuItem key={subItem.label} asChild>
            <Link
              href={subItem.path}
              className="w-full px-3 py-2 text-sm rounded-md hover:bg-gray-50"
            >
              {subItem.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// --- User Dropdown ---
const UserDropdown = ({
  user,
  onLogout,
  isLoggingOut,
}: {
  user: any;
  onLogout: () => void;
  isLoggingOut: boolean;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 hover:bg-gray-50"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
            <User className="w-4 h-4" />
          </div>
          <span className="hidden md:inline font-medium">
            {user.username || "Account"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-2 rounded-lg shadow-lg">
        <DropdownMenuItem asChild>
          <Link
            href="/dashboard"
            className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-gray-50"
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        {(user.role === "admin" || user.role === "superadmin") && (
          <DropdownMenuItem asChild>
            <Link
              href="/admin"
              className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-gray-50"
            >
              <Settings className="w-4 h-4 mr-2" />
              <span>Admin Panel</span>
            </Link>
          </DropdownMenuItem>
        )}
        {user.role === "superadmin" && (
          <DropdownMenuItem asChild>
            <Link
              href="/super-admin"
              className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-gray-50"
            >
              <Shield className="w-4 h-4 mr-2" />
              <span>Super Admin</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          disabled={isLoggingOut}
          className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-red-50 text-red-600"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// --- Main Header Component ---
export function Header() {
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b",
          scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-white/90",
          "border-gray-100"
        )}
      >
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="/assets/wmremove-transformed - Edited.jpg"
              alt="Logo"
              className="h-8"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {NAV_ITEMS.map((item) => (
              <NavItem key={item.label} item={item} />
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <UserDropdown
                user={user}
                onLogout={() => logoutMutation.mutate()}
                isLoggingOut={logoutMutation.isPending}
              />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="px-4 py-2 text-sm font-medium transition-colors bg-primary hover:bg-primary/90">
                    <span className="hidden md:inline">Login</span>
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 p-2 rounded-lg shadow-lg">
                  <DropdownMenuItem asChild>
                    <Link
                      href="/auth"
                      className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-gray-50"
                    >
                      <User className="w-4 h-4 mr-2" />
                      <span>User Login</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-gray-50">
                      <Users className="w-4 h-4 mr-2" />
                      <span>Partner Login</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-48 p-2 rounded-lg shadow-lg">
                      {PARTNER_ROLES.map((role) => (
                        <DropdownMenuItem key={role} asChild>
                          <a
                            href={PARTNER_LOGIN_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full px-3 py-2 text-sm rounded-md hover:bg-gray-50"
                          >
                            {role}
                          </a>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Spacer for header height */}
      <div className="h-16" />

      {/* Mobile Navigation */}
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}