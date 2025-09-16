import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import {
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Add type definitions if not already present
type SelectUser = {
  id: string;
  email: string;
  fullName: string;
  role?: string;
  // Add other user properties as needed
};

type InsertUser = {
  username: string;
  password: string;
  email: string;
  fullName: string;
  // Add other required registration fields
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
  const [user, setUser] = useState<SelectUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (err) {
        console.error('Error loading user from localStorage:', err);
        setError(new Error('Failed to load user data'));
        // Clear corrupted data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      // Update this URL to match your actual login endpoint
      const response = await fetch('https://api.homobie.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Login failed');
      }

      return await response.json();
    },
    onSuccess: (data) => {
      // Assuming your API returns { user: {...}, token: "..." }
      const { user: userData, token } = data;
      
      // Store in localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userId', userData.id);
      
      // Update state
      setUser(userData);
      setError(null);
      
      queryClient.setQueryData(["/auth/user"], userData);
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.fullName}!`,
      });
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
      // Update this URL to match your actual register endpoint
      const response = await fetch('https://api.homobie.com/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Registration failed');
      }

      return await response.json();
    },
    onSuccess: (data) => {
      // Assuming your API returns { user: {...}, token: "..." }
      const { user: userData, token } = data;
      
      // Store in localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userId', userData.id);
      
      // Update state
      setUser(userData);
      setError(null);
      
      queryClient.setQueryData(["/auth/user"], userData);
      toast({
        title: "Registration successful",
        description: `Welcome to Homobie, ${userData.fullName}!`,
      });
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
      const token = localStorage.getItem('auth_token');
      
      // Call logout endpoint if you have one
      if (token) {
        try {
          await fetch('https://api.homobie.com/auth/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (err) {
          console.warn('Logout API call failed:', err);
          // Continue with local logout even if API call fails
        }
      }
    },
    onSuccess: () => {
      // Clear localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      
      // Update state
      setUser(null);
      setError(null);
      
      queryClient.setQueryData(["/auth/user"], null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    },
    onError: (error: Error) => {
      // Even if logout API fails, clear local data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      setUser(null);
      
      toast({
        title: "Logout completed",
        description: "You have been logged out locally.",
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