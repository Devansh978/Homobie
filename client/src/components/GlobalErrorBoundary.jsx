import React from "react";
import ErrorPage from "./ErrorPage";

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught by GlobalErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const error = this.state.error;

      if (error?.status) {
        return <ErrorPage error={error} />;
      }

      return <ErrorPage error={{ message: error?.message || "Something went wrong" }} />;
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
