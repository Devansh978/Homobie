import React from "react";
import { Switch, Route } from "wouter";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import AdminPage from "@/pages/admin-page";
import SuperAdminPage from "@/pages/super-admin-page";
import AuditLogsPage from "@/pages/audit-logs-page";
import LoanApplicationPage from "@/pages/loan-application-page";
import ConsultationPage from "@/pages/consultation-page";
import SipPage from "@/pages/sip-page";
import BlogPage from "@/pages/blog-page";
import AboutPage from "@/pages/about-page";
import OurTeamPage from "@/pages/ourteam-page";
import CompleteProfile from "@/pages/CompleteProfile";
import Properties from "@/pages/properties/Properties";
import PropertyDetails from "@/pages/properties/PropertyDetails";
import  CallbackPage   from "@/hooks/CallbackPage";
import { ProtectedRoute } from "./lib/protected-route";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
     <Route path="/complete-profile">
  {() => {
    console.log("Complete profile route matched!");
    const search = window.location.search;
    const searchParams = new URLSearchParams(search);
    const email = searchParams.get('email') || '';
    const firstName = searchParams.get('firstName') || '';
    console.log("Email:", email, "FirstName:", firstName);
    return <CompleteProfile email={email} firstName={firstName} />;
  }}
</Route>
      <Route path="/loan-application" component={LoanApplicationPage} />
      <Route path="/loan-application?type=home-loan" component={LoanApplicationPage} />
      <Route path="/loan-application?type=lap" component={LoanApplicationPage} />
      <Route path="/loan-application?type=bt-topup" component={LoanApplicationPage} />
      <Route path="/consultation" component={ConsultationPage} />
      <Route path="/sip" component={SipPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/ourteam" component={OurTeamPage} />
      <Route path="/properties" component={Properties} />
      <Route path="/properties/:id">
        {params => <PropertyDetails id={params.id} />}
      </Route>
      <Route path="/auth/callback" component={CallbackPage} />

      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/admin" component={AdminPage} />
      <ProtectedRoute path="/super-admin" component={SuperAdminPage} />
      <ProtectedRoute path="/audit-logs" component={AuditLogsPage} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="">
              <Router />
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
