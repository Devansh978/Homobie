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
import  {Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import BlogPage from "@/pages/blog-page";
import AboutPage from "@/pages/about-page";
import OurTeamPage from "@/pages/ourteam-page";
import PropertyDetails from "@/pages/properties/PropertyDetails";
import Properties from "@/pages/properties/Properties";
import SipCalculator from "@/pages/SipCalculator/SipCalculator";
import EmiCalculator from "@/pages/EmiCalculator/EmiCalculator";
import BudgetPlanningTool from "@/pages/BudgetPlanningTool/BudgetPlanningTool";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
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
 <Route path="/tools/sip-loan-calculator" component={SipCalculator} />
      <Route path="/tools/emi-calculator" component={EmiCalculator} />
      <Route path="/tools/budget-planner" component={BudgetPlanningTool} />
      
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
            <main>
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
