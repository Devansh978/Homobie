import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Chrome } from "lucide-react";
import { authService } from "../lib/auth";

const OAuth = () => {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      console.error("OAuth error:", error);
      toast.error("Google login failed. Please try again.");
      return;
    }

    if (authCode) {
      handleOAuthCallback(authCode);
    }
  }, []);

 const handleOAuthCallback = async (code) => {
  try {
    const response = await fetch( `${import.meta.env.VITE_BASE_URL}/auth/oauth/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: code,
        source: 'WEB'
      }),
    });

    if (response.ok) {
      const data = await response.json();
      
      if (data.user && data.tokens) {
        authService.setAuthData(data.user, data.tokens);
        toast.success("Login successful!");
        
        window.history.replaceState({}, document.title, "/");

        // --- Role-based redirect ---
        const role = data.user.role;
        if (role && role !== "USER") {
          window.location.href =
            "https://homobie-partner-portal.vercel.app/builder";
        } else {
          window.location.href =
            "https://homobie-partner-portal.vercel.app";
        }
      } else {
        throw new Error('Invalid response format from server');
      }
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Authentication failed');
    }
  } catch (error) {
    console.error("OAuth callback error:", error);
    toast.error(error.message || "Authentication failed. Please try again.");
    
    window.history.replaceState({}, document.title, "/login");
  }
};


  const handleGoogleLogin = () => {
    try {
      // Redirect to your backend OAuth2 endpoint
      window.location.href =  `${import.meta.env.VITE_BASE_URL}/oauth2/authorization/google`;
    } catch (error) {
      console.error("OAuth redirect failed:", error);
      toast.error("Failed to initiate Google login. Please try again.");
    }
  };

  return (
    <div className="w-full">
  <button
    onClick={handleGoogleLogin}
    className="w-full flex items-center justify-center gap-3 px-4 py-3 
               border border-gray-300 rounded-lg bg-white 
               text-gray-700 font-medium 
               hover:bg-gray-50 hover:shadow-sm 
               transition-all duration-200"
  >
    {/* Google Icon */}
    <svg className="w-5 h-5" viewBox="0 0 533.5 544.3">
      <path
        fill="#4285F4"
        d="M533.5 278.4c0-18.5-1.5-37.1-4.9-55h-254v104h145c-6.1 
           33.5-25.1 61.9-53.6 80.9v67h86.6c50.7-46.7 
           80.9-115.7 80.9-196.9z"
      />
      <path
        fill="#34A853"
        d="M274.6 544.3c72.5 0 133.5-23.9 
           178.1-64.7l-86.6-67c-24.1 16.3-55 25.9-91.5 
           25.9-70.1 0-129.5-47.3-150.7-110.6h-89.7v69.7c44.8 
           88.1 136.1 146.7 240.4 146.7z"
      />
      <path
        fill="#FBBC05"
        d="M123.9 328c-10.7-31.5-10.7-65.6 
           0-97.1v-69.7h-89.7c-37.6 74.5-37.6 
           162.3 0 236.8l89.7-69.7z"
      />
      <path
        fill="#EA4335"
        d="M274.6 109c39.6 0 75.4 13.6 
           103.6 40.3l77.3-77.3C408.1 24.2 
           347.1 0 274.6 0 170.3 0 79 58.6 
           34.2 146.7l89.7 69.7C145.1 
           156.3 204.5 109 274.6 109z"
      />
    </svg>

    <span>Continue with Google</span>
  </button>
</div>

  );
};

export default OAuth;
