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
      const response = await fetch('https://homobiebackend-railway-production.up.railway.app/auth/oauth/callback', {
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
          setLocation('/');
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
      window.location.href = 'https://homobiebackend-railway-production.up.railway.app/oauth2/authorization/google';
    } catch (error) {
      console.error("OAuth redirect failed:", error);
      toast.error("Failed to initiate Google login. Please try again.");
    }
  };

  return (
    <div className="w-full space-y-4">
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg transition-colors"
      >
        <Chrome className="w-5 h-5" />
        Continue with Google
      </button>
    </div>
  );
};

export default OAuth;


// import React from "react";
// import { GoogleLogin } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";
// import { useLocation } from "wouter";

// const OAuth = () => {
//   const [, setLocation] = useLocation(); 

//   return (
//     <div className="h-10 flex items-center justify-center p-4">
//       <div className="w-full max-w-md space-y-4">
//         <GoogleLogin
//           onSuccess={(credentialResponse) => {
//             const token = credentialResponse.credential;
//             const user = jwtDecode(token); 
//             console.log("Google User:", user);
            
//             localStorage.setItem('user', JSON.stringify(user));
            
//             setLocation('/'); 
//           }}
//           onError={() => {
//             console.log("Google Login Failed");
//           }}
//           useOneTap
//         />
//       </div>
//     </div>
//   );
// };

// export default OAuth;