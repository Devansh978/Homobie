import React, { useState } from "react";
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

import AllPropertiesData from "./AllPropertiesData";
import FeaturedPropertiesData from "./FeaturedPropertiesData";

const PropertyDetails = ({ property, files, onBack, id }) => {
  const [, setLocation] = useLocation();
  let propertyData = property;
  let propertyFiles = files;

  if (id) {
    const all = [...AllPropertiesData, ...FeaturedPropertiesData];
    const found = all.find(
      (item) => item.id === id || (item.property && item.property.id === id)
    );
    if (found) {
      propertyData = found.property;
      propertyFiles = found.files;
    }
  }

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState("overview");

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
  }${propertyData.location.city}, ${propertyData.location.state} ${
    propertyData.location.pincode
  }`;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };


  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "amenities", label: "Amenities" },
    { id: "location", label: "Location" },
    { id: "contact", label: "Contact" },
  ];

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

            {/* Thumbnail Gallery */}
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

          {/* Property Information */}
          <div className="space-y-8">
            {/* Basic Info */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <h1 className="text-4xl font-bold text-white mb-2">
                {propertyData.title}
              </h1>
              <div className="flex items-center gap-2 text-white/70 mb-6">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{locationString}</span>
              </div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-4xl font-bold text-white">
                    ₹{propertyData.actualPrice} Cr
                  </div>
                  {propertyData.discountPrice && propertyData.discountPrice > 0 && (
                    <div className="text-white/60">
                      <span className="line-through">
                        ₹
                        {(
                          propertyData.actualPrice + propertyData.discountPrice
                        ).toFixed(2)}{" "}
                        Cr
                      </span>
                      <span className="text-green-400 ml-2">
                        Save ₹{propertyData.discountPrice} Cr
                      </span>
                    </div>
                  )}
                  <div className="text-white/60 text-sm mt-1">
                    ₹
                    {(
                      (propertyData.actualPrice * 10000000) /
                      propertyData.areaSqft
                    ).toFixed(2)}{" "}
                    per sqft
                  </div>
                </div>
              </div>
              {/* Key Features */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  <Bed className="w-5 h-5 text-white/80" />
                  <div>
                    <div className="text-white font-medium">
                      {propertyData.bedrooms} BHK
                    </div>
                    <div className="text-white/60 text-sm">Bedrooms</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  <Bath className="w-5 h-5 text-white/80" />
                  <div>
                    <div className="text-white font-medium">
                      {propertyData.bathrooms}
                    </div>
                    <div className="text-white/60 text-sm">Bathrooms</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  <Square className="w-5 h-5 text-white/80" />
                  <div>
                    <div className="text-white font-medium">
                      {propertyData.areaSqft}
                    </div>
                    <div className="text-white/60 text-sm">Sq Ft</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  <Building className="w-5 h-5 text-white/80" />
                  <div>
                    <div className="text-white font-medium">
                      {propertyData.type}
                    </div>
                    <div className="text-white/60 text-sm">Property Type</div>
                  </div>
                </div>
              </div>
              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Sofa className="w-4 h-4 text-white/60" />
                  <span className="text-white/80 text-sm">
                    {propertyData.furnishing}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white/80 text-sm">
                    {propertyData.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
              <div className="flex border-b border-white/10">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex-1 py-4 px-6 text-sm font-medium transition-all duration-300 ${
                      selectedTab === tab.id
                        ? "text-white border-b-2 border-white bg-white/10"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {selectedTab === "overview" && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Property Overview
                    </h3>
                    <p className="text-white/80 leading-relaxed">
                      {propertyData.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div>
                        <h4 className="text-white font-medium mb-2">
                          Category
                        </h4>
                        <p className="text-white/70">{propertyData.category}</p>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-2">
                          Property ID
                        </h4>
                        <p className="text-white/70 text-sm font-mono">
                          {propertyData.ownerId.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTab === "amenities" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">
                        Amenities
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {propertyData.amenities?.map((amenity, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10"
                          >
                            <span className="text-white/80">{amenity}</span>
                          </div>
                        )) || (
                          <p className="text-white/60">No amenities listed</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">
                        Property Features
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {propertyData.propertyFeatures?.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10"
                          >
                            <span className="text-white/80">{feature}</span>
                          </div>
                        )) || (
                          <p className="text-white/60">No features listed</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {selectedTab === "location" && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Location Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-white/60 mt-1" />
                        <div>
                          <div className="text-white font-medium">Address</div>
                          <div className="text-white/70">
                            {propertyData.location.addressLine1}
                          </div>
                          {propertyData.location.addressLine2 && (
                            <div className="text-white/70">
                              {propertyData.location.addressLine2}
                            </div>
                          )}
                          <div className="text-white/70">
                            {propertyData.location.city}, {propertyData.location.state}{" "}
                            {propertyData.location.pincode}
                          </div>
                          <div className="text-white/70">
                            {propertyData.location.country}
                          </div>
                        </div>
                      </div>
                      {propertyData.location.landmark && (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                          </div>
                          <div>
                            <div className="text-white/70">
                              Landmark: {propertyData.location.landmark}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedTab === "contact" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Contact Information
                    </h3>
                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3 mb-4">
                        <User className="w-8 h-8 text-white/60" />
                        <div>
                          <div className="text-white font-medium">
                            Property Owner
                          </div>
                          <div className="text-white/60 text-sm">
                            ID: {propertyData.ownerId}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <button className="w-full bg-white/90 backdrop-blur-md text-black py-3 px-6 rounded-xl font-medium hover:bg-white transition-all duration-300 border border-white/20 hover:shadow-lg transform hover:scale-[1.02] flex items-center justify-center gap-2">
                          <Phone className="w-4 h-4" />
                          Call Now
                        </button>
                        <button className="w-full bg-white/10 backdrop-blur-md text-white py-3 px-6 rounded-xl font-medium hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 flex items-center justify-center gap-2">
                          <Mail className="w-4 h-4" />
                          Send Message
                        </button>
                        <button className="w-full bg-white/10 backdrop-blur-md text-white py-3 px-6 rounded-xl font-medium hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 flex items-center justify-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Schedule Visit
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
