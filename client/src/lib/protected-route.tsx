import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Redirect to="/auth" />;

  if (path.startsWith("/admin") && !["admin", "superadmin"].includes(user.role)) {
    return <Redirect to="/" />;
  }

  if (path.startsWith("/super-admin") && user.role !== "superadmin") {
    return <Redirect to="/" />;
  }

  return <Route path={path} component={Component} />;
}
