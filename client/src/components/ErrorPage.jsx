import React from "react";

const ErrorPage = ({ error }) => {
  let title = "Something Went Wrong";
  let message = "An unexpected error occurred. Please try again later.";
  let detail = "";
  let icon = "⚠️";

  switch (error?.status) {
    case 400:
      title = "Bad Request";
      message = error?.title || "Invalid request.";
      detail = error?.detail || "";
      icon = "❗";
      break;
    case 401:
      title = "Unauthorized Access";
      message = error?.message || "You need to log in to access this page.";
      icon = "🔒";
      break;
    case 403:
      title = "Access Denied";
      message = error?.message || "You're not authorized to access this page.";
      icon = "🚫";
      break;
    case 404:
      title = "Resource Not Found";
      message = error?.message || "The requested resource could not be found.";
      icon = "🔍";
      break;
    case 500:
      title = "Internal Server Error";
      message = error?.message || "Our servers are currently experiencing issues.";
      icon = "💥";
      break;
    default:
      if (error?.message) message = error.message;
      if (error?.detail) detail = error.detail;
      icon = "⚠️";
      break;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#0f0f0f] text-gray-100 px-6">
      <div className="text-center max-w-xl animate-fadeIn">
  
        <div className="text-6xl mb-4">{icon}</div>

        <h1 className="text-5xl font-extrabold mb-4 text-red-500">{title}</h1>

        <p className="text-lg text-gray-300 mb-4">{message}</p>

        {detail && <p className="text-gray-400 mb-6">{detail}</p>}

        <div className="flex gap-4 justify-center mt-6">
          <button
            onClick={() => window.history.back()}
            className="px-5 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-200"
          >
            Go Back
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
