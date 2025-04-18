import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import { AuthProvider } from "@/hooks/use-auth";

// A wrapper component for all routes
export function RouteComponent({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  return (
    <Route path={path}>
      <Component />
    </Route>
  );
}

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  try {
    const { user, isLoading } = useAuth();

    if (isLoading) {
      return (
        <Route path={path}>
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </Route>
      );
    }

    if (!user) {
      return (
        <Route path={path}>
          <Redirect to="/auth" />
        </Route>
      );
    }

    // Check if the user is trying to access admin pages
    if (path.includes("admin") && user.role !== "admin" && user.role !== "superadmin") {
      return (
        <Route path={path}>
          <Redirect to="/dashboard" />
        </Route>
      );
    }

    // Check if the user is trying to access super admin pages
    if (path.includes("super-admin") && user.role !== "superadmin") {
      return (
        <Route path={path}>
          <Redirect to="/dashboard" />
        </Route>
      );
    }

    return <Route path={path} component={Component} />;
  } catch (error) {
    console.error("Error in ProtectedRoute:", error);
    // Fallback to redirect to auth page in case of context error
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }
}
