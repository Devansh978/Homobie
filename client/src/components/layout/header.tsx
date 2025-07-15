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

import React, { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Settings,
  Shield,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = useMemo(
    () => [
      { label: "Home Loans", path: "/loan-application?type=home-loan" },
      { label: "LAP", path: "/loan-application?type=lap" },
      { label: "BT Top-Up", path: "/loan-application?type=bt-topup" },
      { label: "SIP", path: "/sip" },
      { label: "Consultation", path: "/consultation" },
      { label: "Our Teams", path: "/teams" },
      { label: "Blog", path: "/blog" },
    ],
    [],
  );

  const isActive = (path: string) => location === path;

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);
  const handleLogout = () => logoutMutation.mutate();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/30 shadow-sm border-b border-white/20">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <img
            src="/assets/wmremove-transformed - Edited.jpg"
            alt="Homobie Logo"
            className="h-8 rounded-full border border-white/20"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/fallback-logo.png";
            }}
          />
          <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600"></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              aria-current={isActive(link.path) ? "page" : undefined}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                isActive(link.path)
                  ? "bg-white/20 text-primary font-medium shadow-sm"
                  : "text-neutral-700 hover:bg-white/20 hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth/Actions Section */}
        <div className="flex items-center space-x-3">
          {user ? (
            <UserDropdown
              user={user}
              onLogout={handleLogout}
              isLoggingOut={logoutMutation.isPending}
            />
          ) : (
            <>
              <Link
                href="/auth"
                className="hidden md:block px-4 py-2 text-primary border border-primary/30 rounded-lg hover:bg-white/20 hover:border-primary/50 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/auth"
                className="px-4 py-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity shadow-md"
              >
                Apply Now
              </Link>
            </>
          )}

          <button
            className="md:hidden p-2 rounded-lg bg-white/20 text-neutral-700 hover:bg-white/30 transition-colors"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        links={navLinks}
        isActive={isActive}
        onClose={closeMobileMenu}
        isAuthenticated={!!user}
      />
    </header>
  );
}

// Extracted UserDropdown component with glassmorphism style
function UserDropdown({
  user,
  onLogout,
  isLoggingOut,
}: {
  user: any;
  onLogout: () => void;
  isLoggingOut: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20"
        >
          <User size={18} />
          <span className="hidden md:inline">{user.username}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 backdrop-blur-lg bg-white/30 border border-white/20 shadow-lg"
      >
        <DropdownMenuItem
          asChild
          className="hover:bg-white/20 focus:bg-white/20"
        >
          <Link
            href="/dashboard"
            className="flex w-full cursor-pointer items-center"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>

        {(user.role === "admin" || user.role === "superadmin") && (
          <DropdownMenuItem
            asChild
            className="hover:bg-white/20 focus:bg-white/20"
          >
            <Link
              href="/admin"
              className="flex w-full cursor-pointer items-center"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Admin Panel</span>
            </Link>
          </DropdownMenuItem>
        )}

        {user.role === "superadmin" && (
          <DropdownMenuItem
            asChild
            className="hover:bg-white/20 focus:bg-white/20"
          >
            <Link
              href="/super-admin"
              className="flex w-full cursor-pointer items-center"
            >
              <Shield className="mr-2 h-4 w-4" />
              <span>Super Admin</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator className="bg-white/20" />

        <DropdownMenuItem
          onClick={onLogout}
          disabled={isLoggingOut}
          className="hover:bg-white/20 focus:bg-white/20"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Extracted MobileMenu component with glassmorphism
function MobileMenu({
  isOpen,
  links,
  isActive,
  onClose,
  isAuthenticated,
}: {
  isOpen: boolean;
  links: Array<{ label: string; path: string }>;
  isActive: (path: string) => boolean;
  onClose: () => void;
  isAuthenticated: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden backdrop-blur-lg bg-white/30 border-t border-white/20 animate-in fade-in">
      <div className="container mx-auto px-4 py-3 space-y-2">
        {links.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            className={`block px-3 py-2 rounded-lg transition-colors ${
              isActive(link.path)
                ? "bg-white/20 text-primary font-medium"
                : "text-neutral-700 hover:bg-white/20"
            }`}
            onClick={onClose}
            aria-current={isActive(link.path) ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}

        {!isAuthenticated && (
          <Link
            href="/auth"
            className="block px-3 py-2 rounded-lg text-neutral-700 hover:bg-white/20 font-medium"
            onClick={onClose}
          >
            Log In
          </Link>
        )}
      </div>
    </div>
  );
}
