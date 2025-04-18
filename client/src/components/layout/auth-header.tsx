import { Header } from "./header";
import { AuthProvider } from "@/hooks/use-auth";

export function AuthHeader() {
  return (
    <AuthProvider>
      <Header />
    </AuthProvider>
  );
}