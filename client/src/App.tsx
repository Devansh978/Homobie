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
import LoanApplicationPage from "@/pages/loan-application-page";
import ConsultationPage from "@/pages/consultation-page";
import SipPage from "@/pages/sip-page";
import { ProtectedRoute } from "./lib/protected-route";
import { ThemeProvider } from "next-themes";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/loan-application" component={LoanApplicationPage} />
      <ProtectedRoute path="/consultation" component={ConsultationPage} />
      <ProtectedRoute path="/sip" component={SipPage} />
      <ProtectedRoute path="/admin" component={AdminPage} />
      <ProtectedRoute path="/super-admin" component={SuperAdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
