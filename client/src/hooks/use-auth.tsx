import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

type SelectUser = {
  id: string;
  email: string;
  fullName: string;
  role?: string;
};

type InsertUser = {
  username: string;
  password: string;
  email: string;
  fullName: string;
};

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<SelectUser, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<SelectUser, Error, InsertUser>;
};

type LoginData = Pick<InsertUser, "username" | "password">;

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<SelectUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load user from localStorage
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const token = localStorage.getItem("auth_token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (err) {
        console.error("Error loading user from localStorage:", err);
        setError(new Error("Failed to load user data"));
        // Clear corrupted data
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Login failed");
      }

      return await response.json();
    },
    onSuccess: (data) => {
      const { user: userData, token } = data;

      localStorage.setItem("auth_token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userId", userData.id);

      setUser(userData);
      setError(null);

      queryClient.setQueryData(["/auth/user"], userData);

      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.fullName}!`,
      });

      // --- Role-based redirect ---
      if (userData.role && userData.role !== "USER") {
        window.location.href =
          "https://homobie-partner-portal.vercel.app/builder";
      } else {
        window.location.href = "https://homobie-partner-portal.vercel.app/user";
      }
    },

    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: InsertUser) => {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Registration failed");
      }

      return await response.json();
    },
    onSuccess: (data) => {
      const { user: userData, token } = data;

      localStorage.setItem("auth_token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userId", userData.id);

      setUser(userData);
      setError(null);

      queryClient.setQueryData(["/auth/user"], userData);

      toast({
        title: "Registration successful",
        description: `Welcome to Homobie, ${userData.fullName}!`,
      });

      // --- Role-based redirect ---
      if (userData.role && userData.role !== "USER") {
        window.location.href =
          "https://homobie-partner-portal.vercel.app/builder";
      } else {
        window.location.href = "https://homobie-partner-portal.vercel.app/user";
      }
    },

    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      setUser(null);

      return true;
    },
    onSuccess: () => {
      queryClient.setQueryData(["/auth/user"], null);

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });

      setTimeout(() => setLocation("/auth"), 100);
    },
    onError: () => {
      toast({
        title: "Logout failed",
        description: "Something went wrong while logging out.",
      });
    },
  });
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
