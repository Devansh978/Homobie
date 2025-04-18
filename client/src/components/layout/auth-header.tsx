import { Header } from "./header";
import { AuthProvider } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

// A simple header for when auth fails
function SimpleHeader() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-1">
          <Shield className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl text-primary">FinSecure</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link href="/auth" className="hidden md:block px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
            Log In
          </Link>
          <Link href="/auth" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export function AuthHeader() {
  try {
    return (
      <AuthProvider>
        <Header />
      </AuthProvider>
    );
  } catch (error) {
    console.error("Error in AuthHeader:", error);
    return <SimpleHeader />;
  }
}