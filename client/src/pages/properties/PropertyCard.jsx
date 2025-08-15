import React from "react";
import {
  Heart,
  Share2,
  Camera,
  MapPin,
  Bed,
  Bath,
  Square,
} from "lucide-react";
const PropertyCard = ({ property, files, isSlider = false }) => {
  const imageSrc = files && files.length > 0 ? files[0] : "/placeholder.jpg";
  const locationString = `${property.location.addressLine1}, ${property.location.city}`;

  return (
    <div
      className={`${
        isSlider ? "min-w-[330px]" : ""
      } bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-500 hover:shadow-2xl hover:shadow-white/5 group transform hover:scale-[1.02] hover:-translate-y-1`}
    >
      <div className="relative overflow-hidden">
        <div className="relative h-48 flex items-center justify-center overflow-hidden rounded-t-2xl">
          <img
            src={imageSrc}
            alt={property.title}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        <div className="absolute top-3 left-3 bg-black/30 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 border border-white/10">
          <Camera className="w-3.5 h-3.5" />
          {files?.length || 0}
        </div>
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-black/30 backdrop-blur-md hover:bg-white/20 p-2.5 rounded-full text-white transition-all duration-300 border border-white/10 hover:border-white/30 transform hover:scale-110">
            <Heart className="w-4 h-4" />
          </button>
          <button className="bg-black/30 backdrop-blur-md hover:bg-white/20 p-2.5 rounded-full text-white transition-all duration-300 border border-white/10 hover:border-white/30 transform hover:scale-110">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md border ${
              property.constructionStatus === "Ready to Move"
                ? "bg-green-500/80 text-white border-green-400/30"
                : "bg-yellow-500/80 text-black border-yellow-400/30"
            }`}
          >
            {property.constructionStatus}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-white font-bold text-lg mb-2 group-hover:text-white transition-colors">
          {property.title}
        </h3>
        <div className="flex items-center gap-1.5 text-white/60 mb-4 group-hover:text-white/80 transition-colors">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{locationString}</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="text-white">
            <span className="text-2xl font-bold">₹{property.actualPrice} Cr</span>
            {property.areaSqft && (
              <p className="text-white/60 text-sm mt-1">
                ₹ {(property.actualPrice * 10000000 / property.areaSqft).toFixed(2)} per sqft
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 mb-5 text-white/60 text-sm">
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4" />
            <span>{property.bedrooms} BHK</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4" />
            <span>{property.bathrooms} Bath</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Square className="w-4 h-4" />
            <span>{property.areaSqft} sqft</span>
          </div>
        </div>
        <button className="flex-1 bg-white/90 backdrop-blur-md text-black py-2.5 px-4 rounded-xl font-medium hover:bg-white transition-all duration-300 border border-white/20 hover:shadow-lg transform hover:scale-[1.02]">
          View Details
        </button>
      </div>
    </div>
  );
};
export default PropertyCard;