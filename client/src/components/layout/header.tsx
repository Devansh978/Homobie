// import React, { useState } from "react";
// import { Link, useLocation } from "wouter";
// import { useAuth } from "@/hooks/use-auth";
// import { Button } from "@/components/ui/button";
// import {
//   Menu,
//   X,
//   User,
//   LogOut,
//   LayoutDashboard,
//   Settings,
//   Clock,
//   Phone,
//   Mail,
//   MapPin,
//   Shield
// } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { companyInfo } from "@/lib/company-info";
// import homobieLogo from "/public/assets/wmremove-transformed - Edited.jpg";

// export function Header() {
//   const [location] = useLocation();
//   const { user, logoutMutation } = useAuth();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const toggleMobileMenu = () => {
//     setMobileMenuOpen(!mobileMenuOpen);
//   };

//   const handleLogout = () => {
//     logoutMutation.mutate();
//   };

//   const isActive = (path: string) => {
//     return location === path;
//   };

//   const navLinks = [
//     { label: "Home Loans", path: "/loan-application?type=home-loan" },
//     { label: "LAP", path: "/loan-application?type=lap" },
//     { label: "BT Top-Up", path: "/loan-application?type=bt-topup" },
//     { label: "SIP", path: "/sip" },
//     { label: "Consultation", path: "/consultation" },
//   ];

//   return (
//     <header className="bg-white shadow-sm sticky top-0 z-50">
//       <div className="container mx-auto px-4 py-3 flex justify-between items-center">
//         <Link href="/" className="flex items-center space-x-2">
//           <img src={homobieLogo} alt="Homobie Logo" className=" h-8" />
//           <span className="font-bold text-xl text-primary">{}</span>
//         </Link>

//         <nav className="hidden md:flex space-x-8">
//           {navLinks.map((link) => (
//             <Link key={link.path} href={link.path}
//               className={`${
//                 isActive(link.path)
//                   ? "text-primary font-medium"
//                   : "text-neutral-600 hover:text-primary"
//               } transition-colors`}
//             >
//               {link.label}
//             </Link>
//           ))}
//         </nav>

//         <div className="flex items-center space-x-4">
//           {user ? (
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" className="flex items-center space-x-2">
//                   <User size={18} />
//                   <span className="hidden md:inline">{user.username}</span>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-56">
//                 <DropdownMenuItem asChild>
//                   <Link href="/dashboard" className="flex w-full cursor-pointer items-center">
//                     <LayoutDashboard className="mr-2 h-4 w-4" />
//                     <span>Dashboard</span>
//                   </Link>
//                 </DropdownMenuItem>

//                 {(user.role === "admin" || user.role === "superadmin") && (
//                   <DropdownMenuItem asChild>
//                     <Link href="/admin" className="flex w-full cursor-pointer items-center">
//                       <Settings className="mr-2 h-4 w-4" />
//                       <span>Admin Panel</span>
//                     </Link>
//                   </DropdownMenuItem>
//                 )}

//                 {user.role === "superadmin" && (
//                   <DropdownMenuItem asChild>
//                     <Link href="/super-admin" className="flex w-full cursor-pointer items-center">
//                       <Shield className="mr-2 h-4 w-4" />
//                       <span>Super Admin</span>
//                     </Link>
//                   </DropdownMenuItem>
//                 )}

//                 <DropdownMenuSeparator />

//                 <DropdownMenuItem onClick={handleLogout} disabled={logoutMutation.isPending}>
//                   <LogOut className="mr-2 h-4 w-4" />
//                   <span>{logoutMutation.isPending ? "Logging out..." : "Logout"}</span>
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           ) : (
//             <>
//               <Link href="/auth" className="hidden md:block px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
//                 Log In
//               </Link>
//               <Link href="/auth" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
//                 Apply Now
//               </Link>
//             </>
//           )}

//           <button
//             className="md:hidden text-neutral-600"
//             onClick={toggleMobileMenu}
//             aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
//           >
//             {mobileMenuOpen ? <X className="text-xl" /> : <Menu className="text-xl" />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile menu */}
//       {mobileMenuOpen && (
//         <div className="md:hidden bg-white border-t">
//           <div className="container mx-auto px-4 py-2 space-y-2">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.path}
//                 href={link.path}
//                 className={`block py-2 ${
//                   isActive(link.path)
//                     ? "text-primary font-medium"
//                     : "text-neutral-600 hover:text-primary"
//                 }`}
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 {link.label}
//               </Link>
//             ))}

//             {!user && (
//               <Link
//                 href="/auth"
//                 className="block py-2 text-neutral-600 hover:text-primary font-medium"
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 Log In
//               </Link>
//             )}
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth"; // Assuming you have this hook
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Settings,
  Shield,
  Search,
  Globe,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Make sure this CSS file exists and has the correct content
import "./header.css";

// --- Your navigation data  ---
const navData = [
  {
    label: "Apply for Loan",
    children: [
      { label: "Home Loans", path: "/loan-application?type=home-loan" },
      { label: "Loan Against Property", path: "/loan-application?type=lap" },
      { label: "Balance Transfer", path: "/loan-application?type=bt-topup" },
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
    label: "About Us",
    children: [
      // { label: "Our Teams", path: "/ourteam" },
      { label: "Blog", path: "/blog" },
    ],
  },
];

// --- Reusable Animation Variants ---
const flyoutVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

const mobileNavVariants = {
  hidden: { x: "-100%" },
  visible: { x: "0%", transition: { duration: 0.3, ease: "easeInOut" } },
  exit: { x: "-100%", transition: { duration: 0.25, ease: "easeInOut" } },
};

// --- Desktop Navigation Item Component (FIXED) ---
const DesktopNavItem = ({ item }: { item: any }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [location] = useLocation();
  const isActive = (path: string) => path && location === path;
  const hasChildren = item.children && item.children.length > 0;

  return (
    <li
      className="h-full flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-full flex items-center">
        <span className="flex h-full items-center px-4 text-white font-medium border-b-2 border-transparent hover:border-white transition-colors duration-300 cursor-default">
          {item.label}
        </span>
        <AnimatePresence>
          {hasChildren && isHovered && (
            <motion.div
              variants={flyoutVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute top-full left-0 z-50 min-w-[250px] origin-top rounded-lg bg-white p-2 text-nexi-blackgray shadow-lg"
            >
              <ul className="space-y-1">
                {item.children.map((child: any) => (
                  <li key={child.label}>
                    <Link
                      href={child.path}
                      onClick={() => setIsHovered(false)}
                      className={`block w-full p-3 text-sm font-medium rounded-md ${
                        isActive(child.path)
                          ? "text-nexi-blue bg-nexi-pagebg"
                          : "text-nexi-darkgray hover:bg-nexi-pagebg hover:text-nexi-blue"
                      }`}
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </li>
  );
};

// --- Mobile Navigation Component (IMPROVED) ---
const MobileNav = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
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
  const handleNavigate = (path: string) => {
    if (path) navigate(path);
    onClose();
  };

  const currentLevel = menuStack[menuStack.length - 1];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" aria-modal="true">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            variants={mobileNavVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute left-0 top-0 h-full w-full max-w-md bg-white text-nexi-blackgray shadow-xl flex flex-col"
          >
            <div className="flex h-header items-center justify-between border-b px-4">
              {menuStack.length > 1 ? (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 p-2 -ml-2 text-lg font-semibold text-nexi-darkblue"
                >
                  <ChevronLeft size={24} />
                  <span>{menuStack[menuStack.length - 2].label}</span>
                </button>
              ) : (
                <Link
                  href="/"
                  onClick={onClose}
                  className="flex items-center gap-3"
                >
                  <img
                    src="/assets/wmremove-transformed - Edited.jpg"
                    alt="Logo"
                    className="h-8 rounded-full"
                  />
                  <span className="font-bold text-xl text-nexi-darkblue">
                    
                  </span>
                </Link>
              )}
              <button onClick={onClose} className="p-2 text-nexi-darkgray">
                <X size={28} />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto p-4">
              <h2 className="px-3 pb-4 text-2xl font-bold text-nexi-darkblue">
                {currentLevel.label}
              </h2>
              <ul className="space-y-2">
                {currentLevel.items.map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() =>
                        item.children
                          ? handleForward(item.children, item.label)
                          : handleNavigate((item as any).path || '/')
                      }
                      className="w-full flex justify-between items-center text-left p-4 text-lg text-nexi-darkgray rounded-lg hover:bg-nexi-pagebg"
                    >
                      <span>{item.label}</span>
                      {item.children && <ChevronRight size={20} />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t p-4">
              {user ? (
                <UserDropdown
                  user={user}
                  onLogout={() => logoutMutation.mutate()}
                  isLoggingOut={logoutMutation.isPending}
                  isMobile={true}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/auth"
                    className="flex-1 text-center px-4 py-3 font-semibold text-nexi-blue border border-nexi-blue/30 rounded-full hover:bg-nexi-pagebg"
                    onClick={onClose}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/auth"
                    className="flex-1 text-center px-4 py-3 font-semibold bg-nexi-blue text-white rounded-full hover:bg-nexi-darkblue"
                    onClick={onClose}
                  >
                    Apply Now
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Main Header Component ---
export function Header() {
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [location] = useLocation();
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    scrolled || mobileMenuOpen
      ? "bg-nexi-blue/80 backdrop-blur-lg shadow-lg"
      : "bg-transparent"
  }`;

  return (
    <>
      <header className={headerClasses}>
        <div className="container mx-auto flex h-header items-center justify-between px-4">
          <Link href="/" className="flex flex-shrink-0 items-center space-x-3">
            <img
              src="/assets/wmremove-transformed - Edited.jpg"
              alt="Homobie Logo"
              className="h-8 rounded-full"
            />
            <span className="font-bold text-xl text-white"></span>
          </Link>

          <nav className="hidden lg:flex h-full">
            <ul className="flex h-full items-center">
              {navData.map((item) => (
                <DesktopNavItem key={item.label} item={item} />
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-6 text-white">
            <div className="hidden lg:flex items-center gap-6">
              {user ? (
                <UserDropdown
                  user={user}
                  onLogout={() => logoutMutation.mutate()}
                  isLoggingOut={logoutMutation.isPending}
                />
              ) : (
                <Button
                  asChild
                  className="bg-transparent border border-white hover:bg-white/10 rounded-full"
                >
                  <Link href="/auth">Log In</Link>
                </Button>
              )}
            </div>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-white lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </header>
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}

// --- User Dropdown Component (FIXED) ---
function UserDropdown({ user, onLogout, isLoggingOut, isMobile = false }: { user: any; onLogout: () => void; isLoggingOut: boolean; isMobile?: boolean }) {
  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <p className="font-bold text-lg text-nexi-darkblue">
            {user.username || "User"}
          </p>
        </div>
        <Button
          onClick={onLogout}
          disabled={isLoggingOut}
          className="w-full bg-nexi-blue hover:bg-nexi-darkblue rounded-full py-3 text-base"
        >
          <LogOut className="mr-2 h-5 w-5" />
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="p-0 text-white hover:bg-transparent hover:text-white focus-visible:ring-0"
        >
          <User className="mr-2 h-5 w-5" />
          <span className="font-medium">{user.username || "Account"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 mt-2 bg-white text-nexi-darkgray"
      >
        <DropdownMenuItem asChild>
          <Link
            href="/dashboard"
            className="flex w-full cursor-pointer items-center p-2 rounded-md hover:bg-nexi-pagebg"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>

        {(user.role === "admin" || user.role === "superadmin") && (
          <DropdownMenuItem asChild>
            <Link
              href="/admin"
              className="flex w-full cursor-pointer items-center p-2 rounded-md hover:bg-nexi-pagebg"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Admin Panel</span>
            </Link>
          </DropdownMenuItem>
        )}

        {user.role === "superadmin" && (
          <DropdownMenuItem asChild>
            <Link
              href="/super-admin"
              className="flex w-full cursor-pointer items-center p-2 rounded-md hover:bg-nexi-pagebg"
            >
              <Shield className="mr-2 h-4 w-4" />
              <span>Super Admin</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          disabled={isLoggingOut}
          className="p-2 rounded-md hover:bg-nexi-pagebg focus:bg-red-50 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
