// src/lib/auth.ts
import { apiRequest } from "./queryClient";

export interface AuthUser {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  company?: string;
  role: UserRole;
  isVerified?: boolean;
  createdAt?: string;
  userId: string;
}

export type UserRole =
  | "super_admin"
  | "admin"
  | "ca"
  | "builder"
  | "broker"
  | "user"
  | "telecaller";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  role: UserRole;
  company: string;
}

export interface AuthResponse {
  email: string;
  role: string; // backend sends string
  token: string;
  refreshToken: string;
  message?: string;
  firstName: string;
  lastName: string;
  userId: string;
  propertyId?: string; 
  timeSlotId?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export class AuthService {
  private token: string | null = null;
  private refreshToken: string | null = null;
  private user: AuthUser | null = null;
  private readonly baseUrl =
    "http://homobie.ap-south-1.elasticbeanstalk.com";
  private tokenRefreshPromise: Promise<void> | null = null;
  private propertyId: string | null = null;
  private userId: string | null = null;
  private timeSlotId: string | null = null;
  constructor() {
    this.loadFromStorage();
    this.setupTokenRefresh();
  }

  // === Storage Management ===
  private loadFromStorage() {
    if (typeof window === "undefined") return;

    this.token = localStorage.getItem("auth_token");
    this.refreshToken = localStorage.getItem("auth_refresh_token");
    this.propertyId = localStorage.getItem('${propertyId}');
    this.userId = localStorage.getItem("userId");
    this.ownerId = localStorage.getItem("ownerId");
    this.timeSlotId = localStorage.getItem("timeSlotId");

    const userJson = localStorage.getItem("auth_user");
    try {
      this.user = userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error("Could not parse auth_user from localStorage, resetting.");
      this.user = null;
      localStorage.removeItem("auth_user");
    }
  }

  // Save auth data to storage
  private saveToStorage(token: string, refreshToken: string, user: AuthUser , propertyId?: string, timeSlotId?: string) {
    this.token = token;
    this.refreshToken = refreshToken;
    this.user = user;
    this.propertyId = '${propertyId}';
    this.userId = user.userId;
    this.timeSlotId =timeSlotId;

    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_refresh_token", refreshToken);
      localStorage.setItem("auth_user", JSON.stringify(user));
      localStorage.setItem('${propertyId}', JSON.stringify('${propertyId}'));
      localStorage.setItem("userId", user.userId);
      localStorage.setItem("timeSlotId", timeSlotId || "");
    }
  }

  private clearStorage() {
    this.token = null;
    this.refreshToken = null;
    this.user = null;

    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_refresh_token");
      localStorage.removeItem("auth_user");
      localStorage.removeItem("propertyId");
      localStorage.removeItem("userId");
      localStorage.removeItem("timeSlotId");
    }
  }

  // Clear token method for external use
  clearToken() {
    this.clearStorage();
  }

  // Setup automatic token refresh
  private setupTokenRefresh() {
    if (typeof window !== "undefined" && this.token && this.refreshToken) {
      const jwt = this.parseJwt(this.token);
      if (jwt && jwt.exp) {
        const expiresIn = (jwt.exp * 1000) - Date.now() - 60000;
        if (expiresIn > 0) {
          setTimeout(() => this.refreshAuthToken(), expiresIn);
        }
      }
    }
  }

  // Parse JWT token
  private parseJwt(token: string) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  // Register new user
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiRequest(
      "POST",
      `${this.baseUrl}/register`,
      data
    );
    const jsonResponse: AuthResponse = await response.json();

    if (!this.isValidAuthResponse(jsonResponse)) {
      throw new Error("Invalid response from server");
    }

    const user: AuthUser = {
      email: jsonResponse.email,
      firstName: jsonResponse.firstName,
      lastName: jsonResponse.lastName,
      role: jsonResponse.role.toLowerCase() as UserRole,
      userId: jsonResponse.userId,
    };

    this.saveToStorage(
      jsonResponse.token,
      jsonResponse.refreshToken || "",
      user
    );
    this.setupTokenRefresh();

    return jsonResponse;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiRequest(
      "POST",
      `${this.baseUrl}/auth/login`,
      credentials
    );
    const jsonResponse: AuthResponse = await response.json();

    if (!this.isValidAuthResponse(jsonResponse)) {
      throw new Error("Invalid credentials");
    }

    const user: AuthUser = {
      email: jsonResponse.email,
      firstName: jsonResponse.firstName,
      lastName: jsonResponse.lastName,
      role: jsonResponse.role.toLowerCase() as UserRole,
      userId: jsonResponse.userId,
    };

    this.saveToStorage(
      jsonResponse.token,
      jsonResponse.refreshToken,
      user
    );
    this.setupTokenRefresh();

    return jsonResponse;
  }

  async logout(): Promise<void> {
    try {
      if (this.token) {
        await fetch(`${this.baseUrl}/auth/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${this.token}` },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.clearStorage();
    }
  }

  public async refreshAuthToken(): Promise<void> {
    if (!this.refreshToken || this.tokenRefreshPromise) return;

    this.tokenRefreshPromise = (async () => {
      try {
        const response = await fetch(`${this.baseUrl}/auth/refresh`, {
          method: "POST",
          headers: { Authorization: `Bearer ${this.refreshToken}` },
        });

        if (!response.ok) throw new Error("Token refresh failed");

        const jsonResponse: AuthResponse = await response.json();

        const user: AuthUser = {
          email: jsonResponse.email,
          firstName: jsonResponse.firstName,
          lastName: jsonResponse.lastName,
          role: jsonResponse.role.toLowerCase() as UserRole,
          userId: jsonResponse.userId,
        };

        if (this.isValidAuthResponse(jsonResponse)) {
          this.saveToStorage(
            jsonResponse.token,
            jsonResponse.refreshToken || this.refreshToken || "",
            user
          );
          this.setupTokenRefresh();
        }
      } catch (error) {
        this.clearStorage();
        console.error("Token refresh failed:", error);
      } finally {
        this.tokenRefreshPromise = null;
      }
    })();

    await this.tokenRefreshPromise;
  }

  private setupTokenRefresh() {
    if (typeof window === "undefined" || !this.token || !this.refreshToken)
      return;

    const jwt = this.parseJwt(this.token);
    if (jwt && jwt.exp) {
      const expiresIn = jwt.exp * 1000 - Date.now() - 60000;
      if (expiresIn > 0) {
        setTimeout(() => this.refreshAuthToken(), expiresIn);
      }
    }
  }

  private parseJwt(token: string) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  }

  private isValidAuthResponse(response: any): response is AuthResponse {
    return (
      response &&
      typeof response.token === "string" &&
      response.token.length > 0 &&
      typeof response.refreshToken === "string" &&
      response.refreshToken.length > 0 &&
      typeof response.email === "string" &&
      typeof response.role === "string" &&
      typeof response.firstName === "string" &&
      typeof response.lastName === "string"
    );
  }

  // === Getters ===
  public getToken(): string | null {
    return this.token;
  }

  public getUser(): AuthUser | null {
    return this.user;
  }
  public getPropertyId(): string | null {
    return this.propertyId;
  }
  public getTimeSlotId(): string | null {
    return this.timeSlotId;
  }
  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  public hasRole(roles: UserRole[]): boolean {
    return this.user ? roles.includes(this.user.role) : false;
  }
}

export const authService = new AuthService();

// === Authenticated fetch helper ===
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = authService.getToken();

  const headers = new Headers(options.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  headers.set("Content-Type", "application/json");

  try {
    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      if (authService.getToken() && authService.getUser()) {
        await authService.refreshAuthToken();
        const newToken = authService.getToken();
        if (newToken) {
          headers.set("Authorization", `Bearer ${newToken}`);
          return fetch(url, { ...options, headers });
        }
      }
      await authService.logout();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Session expired. Please login again.");
    }

    return response;
  } catch (error) {
    if (error instanceof Error && error.message.includes("Session expired")) {
      throw error;
    }
    throw new Error("Network request failed");
  }
}
