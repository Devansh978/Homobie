import { Switch, Route } from "wouter";
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
import { ProtectedRoute } from "./lib/protected-route";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import BlogPage from "@/pages/blog-page";
import OurTeamPage from "@/pages/ourteam-page";
// import Calculator from '@/components/ui/calculator';
import { Calculator } from "lucide-react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/loan-application"/>
        <LoanApplicationPage />
        {/* <Route path="/tools/emi-calculator" component={Calculator} />
      </Calculator> */}
      <Route path="/consultation">
        <ConsultationPage />
      </Route>
      <Route path="/sip">
        <SipPage />
      </Route>
      <Route path="/blog">
        <BlogPage />
      </Route>
      <Route path="/ourteam">
        <OurTeamPage />
      </Route>
      
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
            <main className="flex-grow">
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
