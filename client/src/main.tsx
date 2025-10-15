import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import GlobalErrorBoundary from "./components/GlobalErrorBoundary"; 
import { setupFetchInterceptor } from "./setupFetchInterceptor"; 

setupFetchInterceptor();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </GlobalErrorBoundary>
  </React.StrictMode>
);
