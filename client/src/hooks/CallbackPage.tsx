import React, { useEffect, useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { authService } from "../lib/auth";
import { useLocation } from "wouter";

const CallbackPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing"
  );
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    console.log("CallbackPage useEffect triggered");

    const processCallback = async () => {
      try {
        const currentUrl = window.location.href;
        const urlParams = new URLSearchParams(window.location.search);

        console.log("=== OAUTH CALLBACK DEBUG ===");
        console.log("Full URL:", currentUrl);
        console.log("Search params:", window.location.search);
        console.log("All URL params:", Object.fromEntries(urlParams.entries()));

        const allParams = Object.fromEntries(urlParams.entries());

        setDebugInfo({
          fullUrl: currentUrl,
          searchString: window.location.search,
          allParams: allParams,
          timestamp: new Date().toISOString(),
        });

        // Direct token approach
        const token = urlParams.get("token");
        const refreshToken = urlParams.get("refreshToken");
        const userId = urlParams.get("userId");
        const firstName = urlParams.get("firstName");
        const lastName = urlParams.get("lastName");
        const role = urlParams.get("role");

        // OAuth code approach
        const authCode = urlParams.get("code");
        const error = urlParams.get("error");

        console.log("Direct token params:", {
          token: !!token,
          refreshToken: !!refreshToken,
          userId,
        });
        console.log("OAuth code params:", { code: !!authCode, error });

        if (error) {
          console.error("OAuth error parameter:", error);
          toast.error(`Authentication error: ${error}`);
          setStatus("error");
          return;
        }

        // --- Direct Token Flow ---
        if (token && refreshToken && userId) {
          console.log("Using direct token approach");

          const user = {
            userId: userId,
            firstName: firstName || "",
            lastName: lastName || "",
            role: role?.toLowerCase() || "user",
            email: "", // Optional: extract from token if needed
          };

          const tokens = {
            token: token,
            refreshToken: refreshToken,
          };

          console.log("Setting auth data:", { user, tokens });
          authService.setAuthData(user, tokens);

          toast.success("Login successful!");
          setStatus("success");

          setTimeout(() => {
            window.history.replaceState({}, document.title, "/");

            if (role && role !== "USER") {
              window.location.href =
                "https://homobie-partner-portal.vercel.app/builder";
            } else {
              window.location.href =
                "https://homobie-partner-portal.vercel.app/user";
            }
          }, 2000);
          return;
        }

        // --- OAuth Code Flow ---
        if (authCode) {
          console.log("Using OAuth code approach");

          const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/auth/oauth/callback`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                code: authCode,
                source: "WEB",
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            console.log("Backend response:", data);

            if (data.user && data.tokens) {
              authService.setAuthData(data.user, {
                token: data.tokens.token,
                refreshToken: data.tokens.refreshToken,
              });

              toast.success("Login successful!");
              setStatus("success");

              setTimeout(() => {
                window.history.replaceState({}, document.title, "/");

                if (role && role !== "USER") {
                  window.location.href =
                    "https://homobie-partner-portal.vercel.app/builder";
                } else {
                  window.location.href =
                    "https://homobie-partner-portal.vercel.app/user";
                }
              }, 2000);
              return;
            }
          }

          console.error(
            "Backend response failed:",
            response.status,
            response.statusText
          );
          throw new Error("Backend authentication failed");
        }

        // No valid auth data
        console.error("No valid authentication data found");
        toast.error("No authentication data received");
        setStatus("error");
      } catch (error: any) {
        console.error("OAuth processing error:", error);
        toast.error(`Authentication failed: ${error?.message || error}`);
        setStatus("error");
      }
    };

    const timer = setTimeout(processCallback, 100);
    return () => clearTimeout(timer);
  }, [setLocation]);

  // Auto-redirect on error after showing debug info
  useEffect(() => {
    if (status === "error") {
      const timer = setTimeout(() => {
        setLocation("/auth");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [status, setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-gray-200 text-center">
          {status === "processing" && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Processing Login
              </h2>
              <p className="text-gray-600">
                Please wait while we complete your authentication...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Login Successful!
              </h2>
              <p className="text-gray-600 mb-4">
                Welcome! You will be redirected shortly.
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full animate-pulse"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Authentication Failed
              </h2>
              <p className="text-gray-600 mb-4">
                There was an error processing your login. Check the console and
                debug info below.
              </p>

              {debugInfo && (
                <div className="mt-6 text-left">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Debug Information:
                  </h3>
                  <div className="bg-gray-100 rounded p-3 text-xs overflow-auto max-h-60">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(debugInfo, null, 2)}
                    </pre>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Check browser console for more details
                  </p>
                </div>
              )}

              <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                <div
                  className="bg-red-500 h-2 rounded-full animate-pulse"
                  style={{ width: "100%" }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Redirecting to login in 10 seconds...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallbackPage;
