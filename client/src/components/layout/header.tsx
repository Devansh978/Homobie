import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Menu, 
  X, 
  User,
  LogOut,
  LayoutDashboard, 
  Settings
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isActive = (path: string) => {
    return location === path;
  };

  const navLinks = [
    { label: "Home Loans", path: "/loan-application?type=home-loan" },
    { label: "LAP", path: "/loan-application?type=lap" },
    { label: "BT Top-Up", path: "/loan-application?type=bt-topup" },
    { label: "SIP", path: "/sip" },
    { label: "Consultation", path: "/consultation" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-1">
          <Shield className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl text-primary">FinSecure</span>
        </Link>

        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path}
              className={`${
                isActive(link.path)
                  ? "text-primary font-medium"
                  : "text-neutral-600 hover:text-primary"
              } transition-colors`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2">
                  <User size={18} />
                  <span className="hidden md:inline">{user.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex w-full cursor-pointer items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                
                {(user.role === "admin" || user.role === "superadmin") && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex w-full cursor-pointer items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Admin Panel</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                
                {user.role === "superadmin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/super-admin" className="flex w-full cursor-pointer items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Super Admin</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={handleLogout} disabled={logoutMutation.isPending}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{logoutMutation.isPending ? "Logging out..." : "Logout"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/auth" className="hidden md:block px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
                Log In
              </Link>
              <Link href="/auth" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                Get Started
              </Link>
            </>
          )}
          
          <button
            className="md:hidden text-neutral-600"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="text-xl" /> : <Menu className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-2 space-y-2">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                className={`block py-2 ${
                  isActive(link.path)
                    ? "text-primary font-medium"
                    : "text-neutral-600 hover:text-primary"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {!user && (
              <Link 
                href="/auth"
                className="block py-2 text-neutral-600 hover:text-primary font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
