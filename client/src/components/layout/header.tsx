import React, { useState, useEffect, useRef } from "react";
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
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Users,
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
import "./header.css";

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
];

const partnerLoginUrl = "https://homobie-frontend-portal-bco8.vercel.app/"; // Base URL is here
const partnerRoles = ["Builder", "Broker", "User", "Telecaller"];

// MODIFICATION START: All roles now point to the same URL.
const partnerRolesMenu = {
  label: "Partner Login",
  children: partnerRoles.map((role) => ({
    label: role,
    path: partnerLoginUrl, // Always use the base URL
    external: true,
  })),
};
// MODIFICATION END

// --- Animation variants ---
const mobileNavVariants = {
  hidden: { x: "-100%" },
  visible: { x: "0%", transition: { duration: 0.3, ease: "easeInOut" } },
  exit: { x: "-100%", transition: { duration: 0.25, ease: "easeInOut" } },
};

// Simplified DesktopNavDropdown component
const DesktopNavDropdown = ({ item }: { item: any }) => {
  const hasChildren = item.children && item.children.length > 0;

  if (!hasChildren) {
    return (
      <li className="base-header__nav-item">
        <Link href={item.path || "/"} className="base-header__nav-button">
          {item.label}
        </Link>
      </li>
    );
  }

  return (
    <li className="base-header__nav-item">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="base-header__nav-button flex items-center">
            <span>{item.label}</span>
            <ChevronDown
              size={16}
              className="ml-1 transition-transform duration-200 group-data-[state=open]:rotate-180"
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="user-dropdown glasmorphism"
        >
          {item.children.map((child: any) => (
            <DropdownMenuItem key={child.label} asChild>
              <Link href={child.path} className="user-dropdown__link">
                {child.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
};

// MobileNav component
const MobileNav = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [menuStack, setMenuStack] = useState([
    { items: navData, label: "Menu" },
  ]);
  const [_, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();

  useEffect(() => {
    if (isOpen) setMenuStack([{ items: navData, label: "Menu" }]);
  }, [isOpen]);

  const handleForward = (children: any, label: string) =>
    setMenuStack((prev) => [...prev, { items: children, label }]);
  const handleBack = () => setMenuStack((prev) => prev.slice(0, -1));

  const handleNavigate = (path: string, external: boolean = false) => {
    if (external) {
      window.open(path, "_blank", "noopener,noreferrer");
    } else if (path) {
      navigate(path);
    }
    onClose();
  };

  const currentLevel = menuStack[menuStack.length - 1];
  const previousLevelLabel =
    menuStack.length > 1 ? menuStack[menuStack.length - 2].label : "";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden" aria-modal="true">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            variants={mobileNavVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mobile-nav glasmorphism"
          >
            <div className="mobile-nav__header">
              {menuStack.length > 1 ? (
                <button onClick={handleBack} className="mobile-nav__back-btn">
                  <ChevronLeft size={22} />
                  <span>{previousLevelLabel}</span>
                </button>
              ) : (
                <Link href="/" onClick={onClose} className="mobile-nav__logo">
                  <img
                    src="/assets/wmremove-transformed - Edited.jpg"
                    alt="Logo"
                    className="mobile-nav__logo-img"
                  />
                </Link>
              )}
              <button
                onClick={onClose}
                title="Close menu"
                className="mobile-nav__close-btn"
              >
                <X size={24} />
              </button>
            </div>
            <div className="mobile-nav__content">
              <h2 className="mobile-nav__title">{currentLevel.label}</h2>
              <ul className="mobile-nav__items">
                {currentLevel.items.map((item: any) => (
                  <li key={item.label}>
                    <button
                      onClick={() =>
                        item.children
                          ? handleForward(item.children, item.label)
                          : handleNavigate(item.path, item.external)
                      }
                      className="mobile-nav__item-btn"
                    >
                      <span>{item.label}</span>
                      {item.children && <ChevronRight size={20} />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mobile-nav__footer">
              {user ? (
                <UserDropdown
                  user={user}
                  onLogout={() => logoutMutation.mutate()}
                  isLoggingOut={logoutMutation.isPending}
                  isMobile={true}
                />
              ) : (
                <div className="w-full space-y-3">
                  <button
                    onClick={() => handleNavigate("/auth")}
                    className="mobile-nav_auth-btn mobile-nav_auth-btn--secondary w-full"
                  >
                    <User className="mr-2 h-4 w-4" /> User Login
                  </button>
                  <button
                    onClick={() =>
                      handleForward(
                        partnerRolesMenu.children,
                        partnerRolesMenu.label
                      )
                    }
                    className="mobile-nav_auth-btn mobile-nav_auth-btn--primary w-full justify-between"
                  >
                    <span>
                      <Users className="mr-2 h-4 w-4 inline-block" /> Partner
                      Login
                    </span>
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Main Header Component
export function Header() {
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [location] = useLocation();
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <header
        className={`base-header ${scrolled ? "glasmorphism" : "transparent"}`}
      >
        <div className="base-header__container">
          <Link href="/" title="Go to Homepage" className="base-header__logo">
            <img src="/assets/wmremove-transformed - Edited.jpg" alt="Logo" />
          </Link>
          <nav className="base-header__nav">
            <ul className="base-header__nav-items">
              {navData.map((item) => (
                <DesktopNavDropdown key={item.label} item={item} />
              ))}
            </ul>
          </nav>
          <div className="base-header__tools">
            <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <UserDropdown
                  user={user}
                  onLogout={() => logoutMutation.mutate()}
                  isLoggingOut={logoutMutation.isPending}
                />
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="base-header_auth-btn base-header_auth-btn--primary">
                      Login <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="user-dropdown glasmorphism"
                  >
                    <DropdownMenuItem asChild>
                      <Link href="/auth" className="user-dropdown__link">
                        <User className="mr-2 h-4 w-4" />
                        <span>User Login</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/20" />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="user-dropdown__link">
                        <Users className="mr-2 h-4 w-4" />
                        <span>Partner Login</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="user-dropdown glasmorphism">
                        {/* MODIFICATION START: All roles now point to the same URL. */}
                        {partnerRoles.map((role) => (
                          <DropdownMenuItem key={role} asChild>
                            <a
                              href={partnerLoginUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="user-dropdown__link"
                            >
                              {role}
                            </a>
                          </DropdownMenuItem>
                        ))}
                        {/* MODIFICATION END */}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <button
              className="base-header__menu-btn"
              title="Open menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </header>
      <div style={{ height: "var(--header-height)" }} />
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}

// UserDropdown component
function UserDropdown({
  user,
  onLogout,
  isLoggingOut,
  isMobile = false,
}: {
  user: any;
  onLogout: () => void;
  isLoggingOut: boolean;
  isMobile?: boolean;
}) {
  if (isMobile) {
    return (
      <div className="w-full">
        <p className="text-center text-lg font-semibold mb-4">
          {user.username || "User Account"}
        </p>
        <Button
          onClick={onLogout}
          disabled={isLoggingOut}
          className="w-full mobile-nav__auth-btn--primary"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </Button>
      </div>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="base-header__user-btn">
          <User className="mr-2 h-5 w-5" />
          <span className="font-medium">{user.username || "Account"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="user-dropdown glasmorphism">
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="user-dropdown__link">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        {(user.role === "admin" || user.role === "superadmin") && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="user-dropdown__link">
              <Settings className="mr-2 h-4 w-4" />
              <span>Admin Panel</span>
            </Link>
          </DropdownMenuItem>
        )}
        {user.role === "superadmin" && (
          <DropdownMenuItem asChild>
            <Link href="/super-admin" className="user-dropdown__link">
              <Shield className="mr-2 h-4 w-4" />
              <span>Super Admin</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator className="bg-white/20" />
        <DropdownMenuItem
          onClick={onLogout}
          disabled={isLoggingOut}
          className="user-dropdown_link user-dropdown_link--logout"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
