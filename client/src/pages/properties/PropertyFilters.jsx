import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Filter } from "lucide-react";

const PropertyFilters = ({
  bedroomFilter,
  setBedroomFilter,
  typeFilter,
  setTypeFilter,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  pincode,
  setPincode,
  location,
  setLocation,
  city,
  setCity,
  stateValue,
  setStateValue,
  furnishing,
  setFurnishing,
  category,
  setCategory,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  // Function to update dropdown position
  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        top: rect.bottom + 8, // 8px gap below button
        left: rect.left,
      });
    }
  };

  // Update dropdown position when button moves or on scroll
  useEffect(() => {
    if (isOpen) {
      updatePosition();
      
      // Add scroll listener to update position
      const handleScroll = () => updatePosition();
      window.addEventListener('scroll', handleScroll, true); // true for capture phase
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
        // Check if click is on the dropdown itself
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

  // Clear all filters handler
  const clearAll = () => {
    setBedroomFilter("");
    setTypeFilter("");
    setMinPrice("");
    setMaxPrice("");
    setPincode("");
    setLocation("");
    setCity("");
    setStateValue("");
    setFurnishing("");
    setCategory("");
  };

  const dropdownContent = (
    <div
      id="property-filters-dropdown"
      className="bg-black/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-80 space-y-3"
      style={{
        position: 'fixed',
        top: buttonPosition.top,
        left: buttonPosition.left,
        zIndex: 999999,
      }}
    >
      {/* Bedrooms */}
      <select
        value={bedroomFilter}
        onChange={(e) => setBedroomFilter(e.target.value)}
        className="bg-black text-white border border-white/10 rounded-xl px-3 py-2 w-full"
      >
        <option value="">Bedrooms</option>
        <option value="1">1 BHK</option>
        <option value="2">2 BHK</option>
        <option value="3">3 BHK</option>
        <option value="4">4 BHK</option>
      </select>

      {/* Type */}
      <select
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
        className="bg-black text-white border border-white/10 rounded-xl px-3 py-2 w-full"
      >
        <option value="">Type</option>
        <option value="Flat">Flat</option>
        <option value="Villa">Villa</option>
        <option value="Apartment">Apartment</option>
      </select>

      {/* Price Range */}
      <input
        type="number"
        placeholder="Min Price (Cr)"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        className="bg-black text-white border border-white/10 rounded-xl px-3 py-2 w-full"
        min="0"
      />
      <input
        type="number"
        placeholder="Max Price (Cr)"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        className="bg-black text-white border border-white/10 rounded-xl px-3 py-2 w-full"
        min="0"
      />

      {/* Location Fields */}
      <input
        type="text"
        placeholder="Pincode"
        value={pincode}
        onChange={(e) => setPincode(e.target.value)}
        className="bg-black text-white border border-white/10 rounded-xl px-3 py-2 w-full"
      />
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="bg-black text-white border border-white/10 rounded-xl px-3 py-2 w-full"
      />
      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="bg-black text-white border border-white/10 rounded-xl px-3 py-2 w-full"
      />
      <input
        type="text"
        placeholder="State"
        value={stateValue}
        onChange={(e) => setStateValue(e.target.value)}
        className="bg-black text-white border border-white/10 rounded-xl px-3 py-2 w-full"
      />

      {/* Furnishing */}
      <select
        value={furnishing}
        onChange={(e) => setFurnishing(e.target.value)}
        className="bg-black text-white border border-white/10 rounded-xl px-3 py-2 w-full"
      >
        <option value="">Furnishing</option>
        <option value="Unfurnished">Unfurnished</option>
        <option value="Semi Furnished">Semi Furnished</option>
        <option value="Fully Furnished">Fully Furnished</option>
      </select>

      {/* Category */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="bg-black text-white border border-white/10 rounded-xl px-3 py-2 w-full"
      >
        <option value="">Category</option>
        <option value="Residential">Residential</option>
        <option value="Commercial">Commercial</option>
        <option value="Industrial">Industrial</option>
      </select>

      {/* Clear All */}
      <button
        type="button"
        onClick={clearAll}
        className="w-full mt-2 bg-white/10 text-white border border-white/20 rounded-xl px-3 py-2 hover:bg-white/20 transition-all duration-200"
      >
        Clear All
      </button>
    </div>
  );

  return (
    <div className="relative">
      {/* Filter Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3 hover:border-white/30 hover:bg-white/10 transition-all duration-300"
      >
        <Filter className="w-4 h-4" />
        Filters
      </button>

      {/* Portal-rendered Dropdown */}
      {isOpen && createPortal(dropdownContent, document.body)}
    </div>
  );
};

export default PropertyFilters;