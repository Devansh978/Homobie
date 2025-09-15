import React, { useState, useEffect } from "react";
import { Star, Send, Edit3, MessageSquare, User, Settings, Copy, Check } from "lucide-react";

const FeedbackForm = ({
  mode = "create",
  existingFeedback = null,
  feedbacks = [],   
  onSuccess = () => {},
  onCancel = () => {},
}) => {
  const [formData, setFormData] = useState({
    rating: 0,
    serviceType: "",
    userId: "",
    comments: "",
    feedbackId: "",
  });

  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newFeedbackId, setNewFeedbackId] = useState(null);
  const [copied, setCopied] = useState(false);

  const serviceTypes = ["Consultation", "Loan"];
  const API_BASE_URL = "https://api.homobie.com";

  // Load user data for create mode
  useEffect(() => {
    if (mode === "create") {
      try {
        const storedUser = localStorage.getItem("auth_user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser?.userId) {
            setFormData((prev) => ({
              ...prev,
              userId: parsedUser.userId,
            }));
          }
        }
      } catch (err) {
        console.error("Error parsing auth_user from localStorage", err);
      }
    }
  }, [mode]);

  useEffect(() => {
    if (mode === "update" && formData.feedbackId && feedbacks?.length > 0) {
      if (error) setError("");
      
      const found = feedbacks.find(
        (f) =>
          f.feedbackId === formData.feedbackId || 
          f.id === formData.feedbackId ||
          String(f.feedbackId) === formData.feedbackId ||
          String(f.id) === formData.feedbackId
      );

      if (found) {
        setFormData((prev) => ({
          ...prev,
          rating: found.rating || 0,
          serviceType: found.serviceType || "",
          userId: found.userId || "",
          comments: found.comments || "",
        }));
        setSuccess("Feedback found! You can now edit the details.");
      } else if (formData.feedbackId.length > 0) {
        setError("Feedback ID not found. Please check and try again.");
        setFormData((prev) => ({
          ...prev,
          rating: 0,
          serviceType: "",
          userId: "",
          comments: "",
        }));
      }
    }
  }, [mode, formData.feedbackId, feedbacks, error]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.rating || formData.rating < 1) {
      setError("Please provide a rating");
      return false;
    }
    if (mode === "create" && !formData.serviceType.trim()) {
      setError("Please select a service type");
      return false;
    }
    if (mode === "create" && !formData.userId.trim()) {
      setError("User ID is required");
      return false;
    }
    if (!formData.comments.trim()) {
      setError("Please provide your comments");
      return false;
    }
    if (mode === "update" && !formData.feedbackId) {
      setError("Feedback ID is required for update");
      return false;
    }
    return true;
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const submitFeedback = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");
    setNewFeedbackId(null);

    try {
      const endpoint = mode === "create"
        ? `${API_BASE_URL}/feedback/save`
        : `${API_BASE_URL}/feedback/update`;

      const payload = mode === "create"
        ? {
            rating: formData.rating,
            serviceType: formData.serviceType,
            userId: formData.userId,
            comments: formData.comments,
          }
        : {
            feedbackId: formData.feedbackId,
            rating: formData.rating,
            comments: formData.comments,
          };

      const token = localStorage.getItem("auth_token");
      const response = await fetch(endpoint, {
        method: mode === "create" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const rawText = await response.clone().text();
      let result;
      
      try {
        result = JSON.parse(rawText);
      } catch (jsonErr) {
        result = { message: rawText };
      }

      if (!response.ok) {
        throw new Error(result.message || `Failed to ${mode} feedback`);
      }

      if (mode === "create") {
        let feedbackId = null;
        
        if (Array.isArray(result) && result.length > 0) {
          feedbackId = result[0].feedbackId || result[0].id;
        } else if (result.feedbackId || result.id) {
          feedbackId = result.feedbackId || result.id;
        } else if (result.data && (result.data.feedbackId || result.data.id)) {
          feedbackId = result.data.feedbackId || result.data.id;
        }

        if (feedbackId) {
          setNewFeedbackId(feedbackId);
        }
      }

      setSuccess(`Feedback ${mode === "create" ? "submitted" : "updated"} successfully!`);

      if (mode === "create") {
        setFormData({
          rating: 0,
          serviceType: "",
          userId: formData.userId,
          comments: "",
          feedbackId: "",
        });
        setHoveredRating(0);
      }

      onSuccess(result);
    } catch (err) {
      setError(err.message || `Failed to ${mode} feedback`);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-8 h-8 cursor-pointer transition-colors ${
            star <= (hoveredRating || formData.rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-600 hover:text-yellow-300"
          }`}
          onClick={() => handleInputChange("rating", star)}
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(0)}
        />
      ))}
      <span className="ml-3 text-gray-300 text-sm">
        {formData.rating > 0 && `${formData.rating}/5`}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen  p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-t-xl p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            {mode === "create" ? (
              <MessageSquare className="w-6 h-6 text-blue-400" />
            ) : (
              <Edit3 className="w-6 h-6 text-green-400" />
            )}
            <h2 className="text-2xl font-bold text-white">
              {mode === "create" ? "Submit Feedback" : "Update Feedback"}
            </h2>
          </div>
          <p className="text-gray-400 mt-2">
            {mode === "create"
              ? "We value your opinion! Please share your experience with us."
              : "Make changes to your existing feedback."}
          </p>
        </div>

        {/* Form */}
        <div className="bg-gray-800 rounded-b-xl p-6">
          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Rating *
            </label>
            {renderStars()}
          </div>

          {mode === "create" && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                <Settings className="w-4 h-4 inline mr-2" />
                Service Type *
              </label>
              <select
                value={formData.serviceType}
                onChange={(e) => handleInputChange("serviceType", e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a service type</option>
                {serviceTypes.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* User ID - Create Mode Only */}
          {mode === "create" && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                <User className="w-4 h-4 inline mr-2" />
                Logged in as:
              </label>
              <div className="w-full px-4 py-3 bg-gray-600 border border-gray-600 rounded-lg text-gray-300 flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{formData.userId || "Not logged in"}</span>
                {!formData.userId && (
                  <span className="text-red-400 text-sm ml-2">
                    (Please log in to continue)
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Feedback ID - Update Mode Only */}
          {mode === "update" && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Enter Feedback ID *
              </label>
              <input
                type="text"
                value={formData.feedbackId}
                onChange={(e) => handleInputChange("feedbackId", e.target.value)}
                placeholder="Enter your Feedback ID"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Comments */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Comments *
            </label>
            <textarea
              value={formData.comments}
              onChange={(e) => handleInputChange("comments", e.target.value)}
              placeholder="Share your detailed feedback here..."
              rows={5}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {formData.comments.length}/1000
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
              {error}
            </div>
          )}

          {/* Success Message with Feedback ID */}
          {success && (
            <div className="mb-4 p-4 bg-green-900/50 border border-green-700 rounded-lg text-green-300">
              <div className="font-medium">{success}</div>
              {newFeedbackId && (
                <div className="mt-3 p-3 bg-green-800/30 border border-green-600/30 rounded-lg">
                  <div className="text-sm font-medium mb-2">
                    Your Feedback ID (save this to edit later):
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-green-300 font-mono text-lg">
                      {newFeedbackId}
                    </code>
                    <button
                      onClick={() => copyToClipboard(String(newFeedbackId))}
                      className="p-2 text-green-300 hover:text-green-200 hover:bg-green-800/20 rounded transition-colors"
                      title="Copy Feedback ID"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="text-xs text-green-400 mt-1">
                    {copied ? "Copied to clipboard!" : "Click the copy button to save this ID"}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={submitFeedback}
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                mode === "create"
                  ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                  : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
              } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              {loading
                ? `${mode === "create" ? "Submitting" : "Updating"}...`
                : `${mode === "create" ? "Submit" : "Update"} Feedback`}
            </button>

            {mode === "update" && (
              <button
                onClick={onCancel}
                disabled={loading}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;