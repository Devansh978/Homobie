import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Square,
  Car,
  Wifi,
  Shield,
  Zap,
  TreePine,
  Dumbbell,
  Camera,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  Home,
  Building,
  Sofa,
  User,
} from "lucide-react";

const PropertyDetails = ({ id, onBack }) => {
  const [, setLocation] = useLocation();
  
  const [propertyData, setPropertyData] = useState(null);
  const [propertyFiles, setPropertyFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState("overview");

  // Fetch property details from backend
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    fetch(`/api/properties/${id}`) // Change this to your backend endpoint
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch property details");
        return res.json();
      })
      .then((data) => {
        setPropertyData(data.property || data); // adjust depending on API structure
        setPropertyFiles(data.files || []);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load property details.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Navigation for images
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyFiles.length);
  };
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + propertyFiles.length) % propertyFiles.length);
  };

  // Tabs
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "amenities", label: "Amenities" },
    { id: "location", label: "Location" },
    { id: "contact", label: "Contact" },
  ];

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-lg">Loading property details...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  // No property found
  if (!propertyData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Home className="w-16 h-16 mx-auto mb-4 text-white/60" />
          <p className="text-xl">Property not found</p>
        </div>
      </div>
    );
  }

  const images = propertyFiles || [];
  const locationString = `${propertyData.location.addressLine1}, ${
    propertyData.location.addressLine2 ? propertyData.location.addressLine2 + ", " : ""
  }${propertyData.location.city}, ${propertyData.location.state} ${propertyData.location.pincode}`;

  return (
    <div className="bottom-20 min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-white/2 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/1 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Header */}
      <div className="relative border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-end gap-3">
            <button className="bg-white/10 backdrop-blur-md hover:bg-white/20 p-3 rounded-xl text-white transition-all duration-300 border border-white/10 hover:border-white/30 transform hover:scale-110">
              <Heart className="w-5 h-5" />
            </button>
            <button className="bg-white/10 backdrop-blur-md hover:bg-white/20 p-3 rounded-xl text-white transition-all duration-300 border border-white/10 hover:border-white/30 transform hover:scale-110">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="relative bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10">
              <div className="relative h-96 overflow-hidden">
                {images.length > 0 ? (
                  <img
                    src={images[currentImageIndex]}
                    alt={`${propertyData.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/10 flex items-center justify-center">
                    <Camera className="w-16 h-16 text-white/40" />
                  </div>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-md hover:bg-black/70 p-2 rounded-full text-white transition-all duration-300 border border-white/20"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-md hover:bg-black/70 p-2 rounded-full text-white transition-all duration-300 border border-white/20"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm border border-white/20">
                  {currentImageIndex + 1} / {images.length || 1}
                </div>

                <div className="absolute bottom-4 right-4">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md border ${
                      propertyData.constructionStatus === "Ready to Move"
                        ? "bg-green-500/80 text-white border-green-400/30"
                        : "bg-yellow-500/80 text-black border-yellow-400/30"
                    }`}
                  >
                    {propertyData.constructionStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      currentImageIndex === index
                        ? "border-white/60 scale-105"
                        : "border-white/20 hover:border-white/40"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Property Info */}
          {/* ... keep all your info & tabs code as is, replacing `propertyData` and `propertyFiles` usage */}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
