import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Filter, X } from "lucide-react";

const PropertyFilters = ({
  filters,
  setFilters
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
        left: rect.left,
        width: rect.width
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
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Clear all filters
  const clearAll = () => {
    setFilters({
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
    });
  };

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(
    value => value !== "" && value !== null && value !== undefined
  ).length;

  const dropdownContent = (
    <div
      id="property-filters-dropdown"
      className="bg-transparent/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 space-y-3"
      style={{
        position: 'fixed',
        top: buttonPosition.top,
        left: buttonPosition.left,
        width: buttonPosition.width,
        minWidth: '300px',
        maxWidth: '400px',
        zIndex: 999999,
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium text-white">Filters</h3>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-white/60 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-sm text-white/70 mb-1">Property Type</label>
        <select
          value={filters.type}
          onChange={(e) => handleFilterChange("type", e.target.value)}
          className="bg-transparent text-white border border-white/10 rounded-xl px-3 py-2 w-full"
        >
          <option value="">All Types</option>
          {propertyTypes.map(type => (
            <option key={type} value={type}>
              {type.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Construction Status */}
      <div>
        <label className="block text-sm text-white/70 mb-1">Construction Status</label>
        <select
          value={filters.constructionStatus}
          onChange={(e) => handleFilterChange("constructionStatus", e.target.value)}
          className="bg-transparent text-white border border-white/10 rounded-xl px-3 py-2 w-full"
        >
          <option value="">All Statuses</option>
          {constructionStatuses.map(status => (
            <option key={status} value={status}>
              {status.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Property Status */}
      <div>
        <label className="block text-sm text-white/70 mb-1">Availability</label>
        <select
          value={filters.propertyStatus}
          onChange={(e) => handleFilterChange("propertyStatus", e.target.value)}
          className="bg-transparent text-white border border-white/10 rounded-xl px-3 py-2 w-full"
        >
          <option value="">All Availabilities</option>
          {propertyStatuses.map(status => (
            <option key={status} value={status}>
              {status.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="block text-sm text-white/70 mb-1">Bedrooms</label>
        <select
          value={filters.bedrooms}
          onChange={(e) => handleFilterChange("bedrooms", e.target.value)}
          className="bg-transparent text-white border border-white/10 rounded-xl px-3 py-2 w-full"
        >
          <option value="">Any</option>
          <option value="1">1 BHK</option>
          <option value="2">2 BHK</option>
          <option value="3">3 BHK</option>
          <option value="4">4+ BHK</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-white/70 mb-1">Min Price (Cr)</label>
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            className="bg-transparent text-white border border-white/10 rounded-xl px-3 py-2 w-full"
            min="0"
            step="0.01"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-sm text-white/70 mb-1">Max Price (Cr)</label>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            className="bg-transparent text-white border border-white/10 rounded-xl px-3 py-2 w-full"
            min="0"
            step="0.01"
            placeholder="Any"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm text-white/70 mb-1">Location</label>
        <input
          type="text"
          value={filters.location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
          className="bg-transparent text-white border border-white/10 rounded-xl px-3 py-2 w-full"
          placeholder="Area or Locality"
        />
      </div>

      {/* City */}
      <div>
        <label className="block text-sm text-white/70 mb-1">City</label>
        <input
          type="text"
          value={filters.city}
          onChange={(e) => handleFilterChange("city", e.target.value)}
          className="bg-transparent text-white border border-white/10 rounded-xl px-3 py-2 w-full"
          placeholder="City"
        />
      </div>

      {/* Pincode */}
      <div>
        <label className="block text-sm text-white/70 mb-1">Pincode</label>
        <input
          type="text"
          value={filters.pincode}
          onChange={(e) => handleFilterChange("pincode", e.target.value)}
          className="bg-transparent text-white border border-white/10 rounded-xl px-3 py-2 w-full"
          placeholder="Pincode"
        />
      </div>

      {/* Furnishing */}
      <div>
        <label className="block text-sm text-white/70 mb-1">Furnishing</label>
        <select
          value={filters.furnishing}
          onChange={(e) => handleFilterChange("furnishing", e.target.value)}
          className="bg-transparent text-white border border-white/10 rounded-xl px-3 py-2 w-full"
        >
          <option value="">Any</option>
          {furnishingTypes.map(type => (
            <option key={type} value={type}>
              {type.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={clearAll}
          className="flex-1 bg-white/10 text-white border border-white/20 rounded-xl px-3 py-2 hover:bg-white/20 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          Clear All
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="flex-1 bg-white/90 text-black rounded-xl px-3 py-2 hover:bg-white transition-all duration-200"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {/* Filter Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3 hover:border-white/30 hover:bg-white/10 transition-all duration-300 relative"
      >
        <Filter className="w-4 h-4" />
        Filters
        {activeFilterCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
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