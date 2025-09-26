import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Filter, X, ChevronDown } from "lucide-react";

const PropertyFilters = ({
  filters,
  onFilterChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  // Property types based on your API
  const propertyTypes = [
    "RESIDENTIAL",
    "COMMERCIAL", 
    "INDUSTRIAL",
    "PLOT",
    "VILLA",
    "APARTMENT"
  ];

  const constructionStatuses = [
    "UNDER_CONSTRUCTION",
    "READY_TO_MOVE",
    "NEW_LAUNCH",
    "OFF_PLAN"
  ];

  const propertyStatuses = [
    "AVAILABLE",
    "SOLD",
    "RENTED", 
    "BOOKED"
  ];

  const furnishingTypes = [
    "UNFURNISHED",
    "SEMI_FURNISHED",
    "FULLY_FURNISHED"
  ];

  // Function to update dropdown position
  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        top: rect.bottom + 8,
        left: Math.max(8, rect.left), // Ensure it doesn't go off-screen
        width: Math.max(320, rect.width)
      });
    }
  };

  // Update dropdown position when button moves or on scroll
  useEffect(() => {
    if (isOpen) {
      updatePosition();
      const handleScroll = () => updatePosition();
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleScroll);
      
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleScroll);
      };
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        const dropdown = document.getElementById('property-filters-dropdown');
        if (!dropdown || !dropdown.contains(event.target)) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Handle filter change
  const handleFilterChange = (name, value) => {
    onFilterChange(name, value);
  };

  // Clear all filters
  const clearAll = () => {
    const clearedFilters = {
      bedrooms: "",
      type: "",
      minPrice: "",
      maxPrice: "",
      pincode: "",
      location: "",
      city: "",
      state: "",
      furnishing: "",
      category: "",
      constructionStatus: "",
      propertyStatus: ""
    };
    
    // Call onFilterChange for each filter to clear them
    Object.entries(clearedFilters).forEach(([key, value]) => {
      onFilterChange(key, value);
    });
  };

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(
    value => value !== "" && value !== null && value !== undefined
  ).length;

  // Format display text for select options
  const formatOptionText = (text) => {
    return text.replace(/_/g, ' ')
              .toLowerCase()
              .replace(/\b\w/g, l => l.toUpperCase());
  };

  const dropdownContent = (
    <div
      id="property-filters-dropdown"
      className="bg-black backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden"
      style={{
        position: 'fixed',
        top: buttonPosition.top,
        left: buttonPosition.left,
        width: buttonPosition.width,
        maxWidth: '420px',
        maxHeight: '80vh',
        zIndex: 999999,
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-700/50 bg-gray-800/50">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-400" />
          Property Filters
        </h3>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700/50 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="p-6 space-y-6 max-h-96 overflow-y-auto custom-scrollbar">
        {/* Property Type & Bedrooms Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Property Type</label>
            <div className="relative">
              <select
                value={filters.type || ""}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="w-full bg-gray-800/50 text-white border border-gray-600/50 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="" className="bg-gray-800">All Types</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type} className="bg-gray-800">
                    {formatOptionText(type)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Bedrooms</label>
            <div className="relative">
              <select
                value={filters.bedrooms || ""}
                onChange={(e) => handleFilterChange("bedrooms", e.target.value)}
                className="w-full bg-gray-800/50 text-white border border-gray-600/50 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="" className="bg-gray-800">Any</option>
                <option value="1" className="bg-gray-800">1 BHK</option>
                <option value="2" className="bg-gray-800">2 BHK</option>
                <option value="3" className="bg-gray-800">3 BHK</option>
                <option value="4" className="bg-gray-800">4+ BHK</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Price Range (₹)</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                value={filters.minPrice || ""}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                className="w-full bg-gray-800/50 text-white border border-gray-600/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Min price"
                min="0"
                step="100000"
              />
            </div>
            <div>
              <input
                type="number"
                value={filters.maxPrice || ""}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                className="w-full bg-gray-800/50 text-white border border-gray-600/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Max price"
                min="0"
                step="100000"
              />
            </div>
          </div>
        </div>

        {/* Location Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
            <input
              type="text"
              value={filters.city || ""}
              onChange={(e) => handleFilterChange("city", e.target.value)}
              className="w-full bg-gray-800/50 text-white border border-gray-600/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter city name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
              <input
                type="text"
                value={filters.location || ""}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="w-full bg-gray-800/50 text-white border border-gray-600/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Area/Locality"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Pincode</label>
              <input
                type="text"
                value={filters.pincode || ""}
                onChange={(e) => handleFilterChange("pincode", e.target.value)}
                className="w-full bg-gray-800/50 text-white border border-gray-600/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Pincode"
                pattern="[0-9]{6}"
                maxLength="6"
              />
            </div>
          </div>
        </div>

        {/* Status & Furnishing Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Construction Status</label>
            <div className="relative">
              <select
                value={filters.constructionStatus || ""}
                onChange={(e) => handleFilterChange("constructionStatus", e.target.value)}
                className="w-full bg-gray-800/50 text-white border border-gray-600/50 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="" className="bg-gray-800">All Statuses</option>
                {constructionStatuses.map(status => (
                  <option key={status} value={status} className="bg-gray-800">
                    {formatOptionText(status)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Furnishing</label>
            <div className="relative">
              <select
                value={filters.furnishing || ""}
                onChange={(e) => handleFilterChange("furnishing", e.target.value)}
                className="w-full bg-gray-800/50 text-white border border-gray-600/50 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="" className="bg-gray-800">Any</option>
                {furnishingTypes.map(type => (
                  <option key={type} value={type} className="bg-gray-800">
                    {formatOptionText(type)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Availability */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Availability</label>
          <div className="relative">
            <select
              value={filters.propertyStatus || ""}
              onChange={(e) => handleFilterChange("propertyStatus", e.target.value)}
              className="w-full bg-gray-800/50 text-white border border-gray-600/50 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="" className="bg-gray-800">All Availabilities</option>
              {propertyStatuses.map(status => (
                <option key={status} value={status} className="bg-gray-800">
                  {formatOptionText(status)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex gap-3 p-6 border-t border-gray-700/50 bg-gray-800/30">
        <button
          type="button"
          onClick={clearAll}
          className="flex-1 bg-gray-700/50 text-gray-300 border border-gray-600/50 rounded-xl px-4 py-3 hover:bg-gray-600/50 hover:text-white transition-all duration-200 flex items-center justify-center gap-2 font-medium"
        >
          <X className="w-4 h-4" />
          Clear All
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="flex-1 bg-green-500 text-white rounded-xl px-4 py-3 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg"
        >
          Apply Filters
        </button>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(75, 85, 99, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
        }
      `}</style>
    </div>
  );

  return (
    <div className="relative">
      {/* Filter Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3 hover:border-white/30 hover:bg-white/10 transition-all duration-300 relative text-white"
      >
        <Filter className="w-4 h-4" />
        Filters
        {activeFilterCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1 shadow-lg">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Portal-rendered Dropdown */}
      {isOpen && createPortal(dropdownContent, document.body)}
    </div>
  );
};

export default PropertyFilters;