import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  User,
  Loader2,
  AlertCircle,
  Plus,
  Edit3,
} from "lucide-react";
import FeedbackForm from "./FeedbackForm";

const Feedback = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formMode, setFormMode] = useState("create");
  const [showForm, setShowForm] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState(null);

  const handleCreateNew = () => {
    setFormMode("create");
    setEditingFeedback(null);
    setShowForm(true);
  };

  const handleEdit = (feedback) => {
    setFormMode("update");
    setEditingFeedback(feedback);
    setShowForm(true);
  };

  const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const getUserName = () => {
  try {
    const authUser = localStorage.getItem("auth_user");
    if (authUser) {
      const userData = JSON.parse(authUser);
      const firstName = capitalize(userData.firstName || "");
      const lastName = capitalize(userData.lastName || "");

      if (firstName && lastName) {
        return `${firstName} ${lastName}`;
      } else if (firstName) {
        return firstName;
      }

      const email = userData?.email;
      if (email) {
        return email.split("@")[0];
      }
    }

    return "Anonymous User";
  } catch (error) {
    console.error("Error parsing auth_user from localStorage:", error);
    return "Anonymous User";
  }
};


  const fetchFeedbacks = async () => {
    setLoading(true);
    setError(null);

    try {
      const BASE_URL = "http://homobie.ap-south-1.elasticbeanstalk.com";
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("auth_token");

      if (!userId) {
        throw new Error("User ID not found. Please log in.");
      }

      if (!token) {
        throw new Error("Token not found. Please log in.");
      }

      const API_ENDPOINT = `${BASE_URL}/feedback/getAllUserFeedbacks?userId=${encodeURIComponent(userId)}`;

      const response = await fetch(API_ENDPOINT, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      const feedbacksData = Array.isArray(data) ? data : data.feedbacks || data.data || [];

      if (!Array.isArray(feedbacksData)) {
        throw new Error("Invalid response format. Expected an array of feedbacks.");
      }

      // Get the user's name from localStorage
      const userName = getUserName();

      // Filter & sort feedbacks, and add the user's name to each feedback
      const filteredFeedbacks = feedbacksData
        .filter(
          (feedback) =>
            feedback &&
            typeof feedback.rating === "number" &&
            feedback.rating >= 4 &&
            feedback.comments
        )
        .map(feedback => ({
          ...feedback,
          name: userName // Add the user's name from localStorage
        }))
        .sort((a, b) =>
          b.rating !== a.rating
            ? b.rating - a.rating
            : (b.id || 0) - (a.id || 0)
        )
        .slice(0, 6);

      setFeedbacks(filteredFeedbacks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const nextSlide = () => {
    if (isAnimating || feedbacks.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % feedbacks.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating || feedbacks.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + feedbacks.length) % feedbacks.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Auto-play carousel
  useEffect(() => {
    if (feedbacks.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % feedbacks.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [feedbacks.length]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-400"
        } transition-colors duration-300`}
      />
    ));
  };

  // Show feedback form
  if (showForm) {
    return (
      <FeedbackForm
        mode={formMode}
        feedbacks={feedbacks}
        existingFeedback={editingFeedback}
        onSuccess={() => {
          setShowForm(false);
          fetchFeedbacks();
        }}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">Loading Feedbacks...</h2>
          <p className="text-blue-200 opacity-80">Fetching the latest Reviews from our database</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">Something went wrong</h2>
          <p className="text-red-200 opacity-80 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={fetchFeedbacks}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300 flex items-center gap-2"
            >
              <Loader2 className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={handleCreateNew}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-300 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Feedback
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No feedbacks state
  if (feedbacks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <User className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">No High-Rating Feedbacks Yet</h2>
          <p className="text-blue-200 opacity-80 mb-6">
            No feedbacks with 4+ stars found. Create your first feedback to get started!
          </p>
          <button
            onClick={handleCreateNew}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300 flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Add Your First Feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Action Buttons */}
      <div className="relative top-10 right-2 z-50 flex gap-6">
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg backdrop-blur-md border border-blue-500/30"
        >
          <Plus className="w-4 h-4" />
          Add Feedback
        </button>
        {feedbacks.length > 0 && (
          <button
            onClick={() => handleEdit(feedbacks[currentIndex])}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            Edit Feedback
          </button>
        )}
      </div>

      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 relative z-10">
            <h2 className="text-6xl font-bold text-white mb-6 tracking-tight">
              Success Stories That Matter
            </h2>
            <p className="text-blue-200 text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
              Discover how we've helped thousands achieve their financial dreams
              with personalized loan solutions and expert consultancy
            </p>
          </div>

          {/* Carousel */}
          <div className="relative">
            {/* Card */}
            <div className="backdrop-blur-xl border border-white/20 rounded-3xl p-12 min-h-[400px] flex flex-col justify-center w-full bg-white/5 shadow-[0_10px_50px_-15px_rgba(0,0,0,0.6)]">
              {/* Navigation */}
              <button
                onClick={prevSlide}
                disabled={isAnimating}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 backdrop-blur-md border border-white/30 rounded-full p-3 transition-all duration-300 hover:scale-110 hover:border-blue-400/50 group z-10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-6 h-6 text-white group-hover:text-blue-300" />
              </button>

              <button
                onClick={nextSlide}
                disabled={isAnimating}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 backdrop-blur-md border border-white/30 rounded-full p-3 transition-all duration-300 hover:scale-110 hover:border-blue-400/50 group z-10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-6 h-6 text-white group-hover:text-blue-300" />
              </button>

              {/* Content */}
              <div className="text-center space-y-8">
                {/* Name & Icon */}
                <div className="flex items-center justify-center gap-3">
                  <div className="p-2 rounded-full backdrop-blur-md border border-white/30">
                    <User className="w-6 h-6 text-blue-300" />
                  </div>
                  <h3
                    key={`name-${currentIndex}`}
                    className={`text-3xl font-semibold text-white transition-all duration-500 ${
                      isAnimating
                        ? "opacity-0 transform translate-y-4"
                        : "opacity-100 transform translate-y-0"
                    }`}
                  >
                    {feedbacks[currentIndex]?.name}
                  </h3>
                </div>

                {/* Stars */}
                <div className="flex justify-center gap-2">
                  {renderStars(feedbacks[currentIndex]?.rating || 0)}
                </div>

                {/* Comments */}
                <div className="relative overflow-hidden">
                  <p
                    key={currentIndex}
                    className={`text-xl leading-relaxed text-white/90 max-w-3xl mx-auto transition-all duration-500 ${
                      isAnimating
                        ? "opacity-0 transform translate-y-4"
                        : "opacity-100 transform translate-y-0"
                    }`}
                  >
                    "{feedbacks[currentIndex]?.comments}"
                  </p>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6 w-full bg-white/20 rounded-full h-1 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300"
                style={{
                  width: `${
                    feedbacks.length > 0
                      ? ((currentIndex + 1) / feedbacks.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={fetchFeedbacks}
                disabled={loading}
                className="px-4 py-2 text-sm text-blue-300 hover:text-white border border-blue-300/30 hover:border-blue-300/60 rounded-full transition-all duration-300 backdrop-blur-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Refreshing..." : "Refresh Testimonials"}
              </button>

              <div className="text-sm text-white/60">
                {currentIndex + 1} of {feedbacks.length} testimonials
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;