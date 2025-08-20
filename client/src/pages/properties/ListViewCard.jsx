import React from "react";
import {
  Heart,
  Share2,
  Camera,
  MapPin,
} from "lucide-react";

const ListViewCard = ({ property, files, ownerName }) => {
  const locationString = property.location 
    ? `${property.location.addressLine1 || ''}, ${property.location.city || ''}, ${property.location.state || ''}`.replace(/^,\s*|,\s*$/g, '')
    : "Location not available";
    
  const imageSrc = files && files.length > 0 ? files[0] : "/placeholder.jpg";
 
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-500 p-5 mb-4 group">
      <div className="flex gap-5">
        {/* Image */}
        <div className="relative rounded-xl">
          <div className="relative w-40 h-28 rounded-xl flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
            <img
              src={imageSrc}
              alt={property.title || "Property"}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
          <div className="absolute top-2 left-2 bg-black/30 backdrop-blur-md text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 border border-white/10">
            <Camera className="w-2.5 h-2.5" />
            {files?.length || 0}
          </div>
        </div>
 
        {/* Details */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-white font-bold text-lg mb-1">
                {property.title || "Property Title"}
              </h3>
              <div className="flex items-center gap-1.5 text-white/60 text-sm">
                <MapPin className="w-3.5 h-3.5" />
                <span>{locationString}</span>
              </div>
              {ownerName && (
                <div className="text-white/50 text-xs mt-1">
                  By: {ownerName}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-white text-xl font-bold">
                ₹{property.actualPrice || property.price || 0} Cr
              </div>
              {property.discountPrice && property.discountPrice !== property.actualPrice && (
                <div className="text-white/40 text-sm line-through">
                  ₹{parseFloat(property.discountPrice).toFixed(2)} Cr
                </div>
              )}
              <div className="text-white/60 text-sm">
                Contact for area details
              </div>
            </div>
          </div>
 
          {/* Features */}
          <div className="flex items-center gap-6 text-white/60 text-sm mb-4">
            {property.bedrooms && (
              <div className="flex items-center gap-1.5">
                <Bed className="w-4 h-4" />
                <span>{property.bedrooms} BHK</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1.5">
                <Bath className="w-4 h-4" />
                <span>{property.bathrooms} Bath</span>
              </div>
            )}
            {property.areaSqft && (
              <div className="flex items-center gap-1.5">
                <Square className="w-4 h-4" />
                <span>{property.areaSqft} sqft</span>
              </div>
            )}
            {property.type && (
              <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300 border border-blue-400/30">
                {property.type}
              </span>
            )}
            {property.constructionStatus && (
              <span
                className={`px-3 py-1 rounded-full text-xs backdrop-blur-md border ${
                  property.constructionStatus === "Ready to Move"
                    ? "bg-green-500/80 text-white border-green-400/30"
                    : property.constructionStatus === "Under Construction"
                    ? "bg-yellow-500/80 text-black border-yellow-400/30"
                    : "bg-gray-500/80 text-white border-gray-400/30"
                }`}
              >
                {property.constructionStatus}
              </span>
            )}
          </div>

          {/* Property Status */}
          {property.propertyStatus && (
            <div className="mb-4">
              <span className={`px-3 py-1 rounded-full text-xs backdrop-blur-md border ${
                property.propertyStatus === "Available"
                  ? "bg-green-500/20 text-green-300 border-green-400/30"
                  : property.propertyStatus === "Sold"
                  ? "bg-red-500/20 text-red-300 border-red-400/30"
                  : "bg-orange-500/20 text-orange-300 border-orange-400/30"
              }`}>
                {property.propertyStatus}
              </span>
            </div>
          )}
 
          {/* Actions */}
          <div className="flex justify-between items-center">
            <button className="bg-white/90 backdrop-blur-md text-black py-2 px-4 rounded-xl font-medium hover:bg-white transition-all duration-300 border border-white/20">
              View More
            </button>
            <div className="flex gap-2">
              <button className="text-white/60 hover:text-white p-2 transition-all duration-300 hover:bg-white/10 rounded-lg backdrop-blur-sm">
                <Heart className="w-4 h-4" />
              </button>
              <button className="text-white/60 hover:text-white p-2 transition-all duration-300 hover:bg-white/10 rounded-lg backdrop-blur-sm">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListViewCard;