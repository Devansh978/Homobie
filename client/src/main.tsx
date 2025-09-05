import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);





// import React from "react";
// import ReactDOM from "react-dom/client";
// import { GoogleOAuthProvider } from "@react-oauth/google";
// import App from "./App";
// import "./index.css";
// import { QueryClientProvider } from "@tanstack/react-query";
// import { queryClient } from "./lib/queryClient";

// const GOOGLE_CLIENT_ID = "618311165892-bv210vqoe1u8bmpl6657ef72ri64nj9l.apps.googleusercontent.com";

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
//       <QueryClientProvider client={queryClient}>
//         <App />
//       </QueryClientProvider>
//     </GoogleOAuthProvider>
//   </React.StrictMode>
// );
