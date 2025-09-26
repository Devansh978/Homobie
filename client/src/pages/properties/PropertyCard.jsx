import React from "react";
import {
  Heart,
  Share2,
  Camera,
  MapPin,
  User,
} from "lucide-react";

const PropertyCard = ({ property, files, ownerName, isSlider }) => {
  const locationString = property.location 
    ? `${property.location.addressLine1 || ''}, ${property.location.city || ''}, ${property.location.state || ''}`.replace(/^,\s*|,\s*$/g, '')
    : "Location not available";
    
  const imageSrc = files && files.length > 0 ? files[0] : "/placeholder.jpg";

  // Helper function to format construction status
  const formatConstructionStatus = (status) => {
    if (!status) return "Status Unknown";
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Helper function to format property status
  const formatPropertyStatus = (status) => {
    if (!status) return "Status Unknown";
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Helper function to get status color classes
  const getStatusClasses = (status) => {
    if (!status) return "bg-gray-500/80 text-white border-gray-400/30";
    
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes("ready") || lowerStatus.includes("available")) {
      return "bg-green-500/80 text-white border-green-400/30";
    } else if (lowerStatus.includes("construction") || lowerStatus.includes("pending")) {
      return "bg-yellow-500/80 text-black border-yellow-400/30";
    } else if (lowerStatus.includes("sold") || lowerStatus.includes("occupied")) {
      return "bg-red-500/80 text-white border-red-400/30";
    }
    return "bg-blue-500/80 text-white border-blue-400/30";
  };

  return (
    <div className={`${isSlider ? "min-w-[330px]" : ""} bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-500 hover:shadow-2xl hover:shadow-white/5 group transform hover:scale-[1.02] hover:-translate-y-1`}>
      {/* Image Section */}
      <div className="relative h-48 flex items-center justify-center overflow-hidden rounded-t-2xl">
        <img
          src={imageSrc}
          alt={property.title || "Property"}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Photo Count Badge */}
        <div className="absolute top-3 right-3 bg-transparent/50 backdrop-blur-md text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 border border-white/10">
          <Camera className="w-3 h-3" />
          {files?.length || 0}
        </div>

        {/* Construction Status Badge */}
        {property.constructionStatus && (
          <div className="absolute bottom-3 left-3">
            <span className={`px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md border ${getStatusClasses(property.constructionStatus)}`}>
              {formatConstructionStatus(property.constructionStatus)}
            </span>
          </div>
        )}

        {/* Property Status Badge */}
        {property.propertyStatus && (
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-md border ${getStatusClasses(property.propertyStatus)}`}>
              {formatPropertyStatus(property.propertyStatus)}
            </span>
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="p-5">
        {/* Title and Location */}
        <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
          {property.title || "Property Title"}
        </h3>
        
        <div className="flex items-center gap-1.5 text-white/60 mb-3">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm line-clamp-1">{locationString}</span>
        </div>

        {/* Owner Info */}
        {ownerName && (
          <div className="flex items-center gap-1.5 text-white/50 mb-4">
            <User className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-xs">Owner: {ownerName}</span>
          </div>
        )}



        {/* Property Type */}
        {property.type && (
          <div className="mb-4">
            <span className="px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300 border border-blue-400/30">
              {property.type}
            </span>
          </div>
        )}
        
       {/* Price Section */}
<div className="flex items-center justify-between mb-4">
  <div className="text-white">
    {/* Show discounted price first (if exists), otherwise actual */}
    <span className="text-2xl font-bold">
      ₹{property.discountPrice 
        ? parseFloat(property.discountPrice).toFixed(2) 
        : parseFloat(property.actualPrice || 0).toFixed(2)}
    </span>

    {/* Show actual price struck-through if it's higher than discount */}
    {property.actualPrice && property.discountPrice && 
     parseFloat(property.discountPrice) < parseFloat(property.actualPrice) && (
      <div className="flex flex-col">
        <span className="text-white/40 text-sm line-through">
          ₹{parseFloat(property.actualPrice).toFixed(2)}
        </span>
        <span className="text-green-400 text-xs">
          Save ₹{(parseFloat(property.actualPrice) - parseFloat(property.discountPrice)).toFixed(2)} 
        </span>
      </div>
    )}

    {/* Price per sqft / contact info */}
    {(property.actualPrice || property.discountPrice) && (
      <p className="text-white/60 text-xs mt-1">
        Contact for area details
      </p>
    )}
  </div>
</div>


        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button className="flex-1 bg-white/90 backdrop-blur-md text-black py-2.5 px-4 rounded-xl font-medium hover:bg-white transition-all duration-300 border border-white/20 hover:shadow-lg transform hover:scale-[1.02] mr-3">
            View Details
          </button>
          
          <div className="flex gap-2">
            <button className="text-white/60 hover:text-red-400 p-2 transition-all duration-300 hover:bg-white/10 rounded-lg backdrop-blur-sm">
              <Heart className="w-4 h-4" />
            </button>
            <button className="text-white/60 hover:text-white p-2 transition-all duration-300 hover:bg-white/10 rounded-lg backdrop-blur-sm">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;