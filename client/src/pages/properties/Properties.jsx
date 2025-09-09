import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "wouter";
import {
  Grid,
  List,
  Search,
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react";
import PropertyCard from "./PropertyCard";
import ListViewCard from "./ListViewCard";
import PropertyFilters from "./PropertyFilters";
import FormProperties from "./FormProperties";

const baseUrl = "http://homobie.ap-south-1.elasticbeanstalk.com";

// Helper function to convert byte array to image URL
// Updated helper functions for better image handling
const convertByteArrayToImageUrl = (byteArray) => {
  if (!byteArray || byteArray.length === 0) {
    console.warn("Empty or null byte array provided");
    return "/placeholder.jpg";
  }
  
  try {
    // Handle different input formats
    let uint8Array;
    
    if (byteArray instanceof Uint8Array) {
      uint8Array = byteArray;
    } else if (Array.isArray(byteArray)) {
      uint8Array = new Uint8Array(byteArray);
    } else if (typeof byteArray === 'string') {
      // Handle base64 strings
      try {
        const base64Data = byteArray.includes(',') ? byteArray.split(',')[1] : byteArray;
        const binaryString = atob(base64Data);
        uint8Array = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          uint8Array[i] = binaryString.charCodeAt(i);
        }
      } catch (e) {
        console.error("Failed to decode base64 string:", e);
        return "/placeholder.jpg";
      }
    } else {
      console.error("Unsupported byte array format:", typeof byteArray);
      return "/placeholder.jpg";
    }

    // Create blob with proper MIME type detection
    let mimeType = 'image/jpeg'; // default
    
    // Simple MIME type detection based on file signature
    if (uint8Array.length > 4) {
      const signature = Array.from(uint8Array.slice(0, 4)).map(b => b.toString(16).padStart(2, '0')).join('');
      if (signature.startsWith('8950')) mimeType = 'image/png';
      else if (signature.startsWith('4749')) mimeType = 'image/gif';
      else if (signature.startsWith('ffd8')) mimeType = 'image/jpeg';
      else if (signature.startsWith('5249')) mimeType = 'image/webp';
    }
    
    const blob = new Blob([uint8Array], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    return url;
  } catch (error) {
    console.error("Error converting byte array to image:", error);
    return "/placeholder.jpg";
  }
};

// Helper function to convert multiple byte arrays to image URLs
const convertImagesToUrls = (images) => {
  if (!images || !Array.isArray(images)) {
    console.warn("Invalid images array provided");
    return [];
  }
  
  return images.map((byteArray, index) => {
    const url = convertByteArrayToImageUrl(byteArray);
    console.log(`Converted image ${index}:`, url);
    return url;
  }).filter(url => url !== "/placeholder.jpg"); // Remove failed conversions
};

const savePropertyToList = (newProperty) => {
  const existingProperties = JSON.parse(localStorage.getItem('userProperties') || '[]');
  const updatedProperties = [...existingProperties, newProperty];
  localStorage.setItem('userProperties', JSON.stringify(updatedProperties));
  localStorage.setItem('currentPropertyId', newProperty.propertyId);
  localStorage.setItem('currentProperty', JSON.stringify(newProperty));
};

const handleAddProperty = async (propertyData) => {
  const response = await addProperty(propertyData);
  if(response && response.propertyId) {
    savePropertyToList(response);
  }
};

// Auth helper functions
const getAuthTokens = () => {
  const authUser = localStorage.getItem("auth_user");
  return {
    token: localStorage.getItem("auth_token"),
    userId: localStorage.getItem("userId"),
    refreshToken: localStorage.getItem("auth_refresh_token"),
    userData: authUser ? JSON.parse(authUser) : null
  };
};

const clearAuthTokens = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_refresh_token");
  localStorage.removeItem("auth_user");
  localStorage.removeItem("userId");
};

const api = axios.create({
  baseURL: baseUrl,
  timeout: 1000000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - only add token if it exists
api.interceptors.request.use(
  (config) => {
    const { token } = getAuthTokens();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - only handle token refresh if user is authenticated
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Only handle token refresh if user was previously authenticated
    const { token, refreshToken } = getAuthTokens();
    if (error.response?.status === 401 && !originalRequest._retry && token) {
      originalRequest._retry = true;
      
      try {
        if (refreshToken) {
          const response = await axios.post(`${baseUrl}/auth/refresh`, {
            refresh_token: refreshToken
          });
          
          localStorage.setItem("auth_token", response.data.access_token);
          localStorage.setItem("auth_refresh_token", response.data.refresh_token);
          
          originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
      }
      
      clearAuthTokens();
      window.location.href = "/auth";
    }
    
    return Promise.reject(error);
  }
);

const Properties = () => {
  const [currentView, setCurrentView] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    minPrice: "",
    maxPrice: "",
    pincode: "",
    location: "",
    city: "",
    state: "",
    furnishing: "",
    category: ""
  });
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [isSliding, setIsSliding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(false); // Set to false since we don't need auth check
  const [error, setError] = useState(null);
  const [showAuthRedirect, setShowAuthRedirect] = useState(false);
  const scrollContainerRef = useRef(null);

  const cardWidth = 374;

  const checkAuth = (showError = true) => {
    const { token, userId, userData } = getAuthTokens();
    
    if (!token) {
      if (showError) setShowAuthRedirect(true);
      return false;
    }
    
    if (!userId || !userData?.userId) {
      if (showError) setShowAuthRedirect(true);
      return false;
    }
    
    return true;
  };

  const fetchIndividualProperty = async (propertyId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`${baseUrl}/properties/getIndividualProperty?propertyId=${propertyId}`);
      console.log("Individual Property Response:", response.data);
      
      if (response.data) {
        // Transform the individual property data to match the expected structure
        const transformedProperty = {
          id: response.data.propertyId,
          propertyId: response.data.propertyId,
          ownerName: response.data.ownerName,
          property: {
            title: response.data.title,
            type: response.data.type,
            constructionStatus: response.data.constructionStatus,
            propertyStatus: response.data.propertyStatus,
            location: response.data.location,
            actualPrice: response.data.actualPrice,
            discountPrice: response.data.discountPrice,
            price: response.data.actualPrice,
            // Add any other property fields that might be in the response
            description: response.data.description,
            bedrooms: response.data.bedrooms,
            bathrooms: response.data.bathrooms,
            squareFeet: response.data.squareFeet,
            furnishing: response.data.furnishing,
            amenities: response.data.amenities
          },
          files: convertImagesToUrls(response.data.images)
        };
        
        // Update localStorage with the fetched property
        localStorage.setItem('currentProperty', JSON.stringify(transformedProperty));
        
        return transformedProperty;
      } else {
        throw new Error("Property not found");
      }
    } catch (err) {
      console.error("Fetch individual property error:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch property details");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get individual property from localStorage or fetch from API
  const getIndividualProperty = async (propertyId = null) => {
    const targetPropertyId = propertyId || localStorage.getItem('currentPropertyId');
    
    if (!targetPropertyId) {
      setError("No property ID found");
      return null;
    }

    // First, try to get from localStorage
    const storedProperty = localStorage.getItem('currentProperty');
    if (storedProperty) {
      try {
        const parsedProperty = JSON.parse(storedProperty);
        if (parsedProperty.propertyId === targetPropertyId) {
          return parsedProperty;
        }
      } catch (e) {
        console.error("Error parsing stored property:", e);
      }
    }

    // If not found in localStorage or different property, fetch from API
    return await fetchIndividualProperty(targetPropertyId);
  };

  const fetchAllProperties = async (pincode = "") => {
    setIsLoading(true);
    setError(null);
    
    try {
      const url = pincode 
        ? `/properties/allProperties?pincode=${pincode}`
        : `/properties/allProperties`;
      
      const res = await api.get(url);
      console.log("API Response:", res.data);
      
      if (res.data && Array.isArray(res.data)) {
        // Transform the data to match the new DTO structure
        const transformedProperties = res.data.map(item => ({
          id: item.propertyId, // Map propertyId to id for consistency
          propertyId: item.propertyId,
          ownerName: item.ownerName,
          property: {
            title: item.title,
            type: item.type,
            constructionStatus: item.constructionStatus,
            propertyStatus: item.propertyStatus,
            location: item.location,
            actualPrice: item.actualPrice,
            discountPrice: item.discountPrice,
            price: item.actualPrice // Keep for backward compatibility
          },
          files: convertImagesToUrls(item.images) // Convert byte arrays to URLs
        }));
        
        setAllProperties(transformedProperties);
        
        // Since there's no isFeatured field, we'll use the first 6 properties as featured
        // or you can implement your own logic (e.g., highest priced, most recent, etc.)
        setFeaturedProperties(transformedProperties.slice(0, 6));
      } else {
        throw new Error("Invalid data format received");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addProperty = async (newProperty) => {
    // Check authentication before adding property
    if (!checkAuth()) {
      setShowAuthRedirect(true);
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
    const { userId, userData } = getAuthTokens();
    const ownerId = userId || userData?.userId;
    
    if (!ownerId) throw new Error("Authentication required");

    // Extract the property data from the form
    const propertyData = newProperty.property;
    
    // Transform the property data with proper type conversion
    const transformedProperty = {
      ...propertyData,
      ownerId: ownerId,
      // Convert numeric fields from strings to numbers
      actualPrice: parseFloat(propertyData.actualPrice) || 0,
      discountPrice: parseFloat(propertyData.discountPrice) || 0,
      bedrooms: parseInt(propertyData.bedrooms, 10) || 0,
      bathrooms: parseInt(propertyData.bathrooms, 10) || 0,
      areaSqft: parseInt(propertyData.areaSqft, 10) || 0,
      // Handle the location object (ensure it's properly structured)
      location: {
        addressLine1: propertyData.location?.addressLine1 || '',
        addressLine2: propertyData.location?.addressLine2 || '',
        city: propertyData.location?.city || '',
        country: propertyData.location?.country || '',
        landmark: propertyData.location?.landmark || '',
        pincode: propertyData.location?.pincode || '',
        state: propertyData.location?.state || '',
      },
      // Ensure arrays are properly formatted
      amenities: Array.isArray(propertyData.amenities) ? propertyData.amenities : [],
      propertyFeatures: Array.isArray(propertyData.propertyFeatures) ? propertyData.propertyFeatures : [],
    };


      const formData = new FormData();
      formData.append(
        "property",
        new Blob([JSON.stringify(transformedProperty)], { type: "application/json" })
      );

      if (newProperty.files?.length > 0) {
        Array.from(newProperty.files).forEach((file) => {
          formData.append("files", file);
        });
      } else {
        throw new Error("At least one image is required");
      }

      // FIX: Remove the redundant headers. The Axios interceptor handles them.
      const res = await api.post("/properties/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      console.log("Add property response:", res.data);
      
      if (res.data && res.data.propertyId) {
        const propertyId = res.data.propertyId;
        localStorage.setItem('currentPropertyId', propertyId);
        localStorage.setItem('currentProperty', JSON.stringify(res.data));
        console.log('Property saved to localStorage with ID:', propertyId);
      } else {
        console.warn('Unexpected response structure:', res.data);
        throw new Error('Received unexpected response format from server');
      }

      await fetchAllProperties();
      return res.data;
    } catch (err) {
      console.error("Add property error:", err);
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const scrollToCard = (direction) => {
    if (!scrollContainerRef.current || isSliding) return;
    
    setIsSliding(true);
    const container = scrollContainerRef.current;
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
    const start = container.scrollLeft;
    const end = start + scrollAmount;
    const duration = 400;
    let startTime = null;

    const animateScroll = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      container.scrollLeft = start + (end - start) * progress;
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        setIsSliding(false);
      }
    };
    requestAnimationFrame(animateScroll);
  };

  const filteredProperties =
    currentView === "featured"
      ? featuredProperties
      : allProperties.filter((item) => {
          if (!item.property) return false;
          
          const titleMatch = item.property.title
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());
          const cityMatch = item.property.location?.city
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());
          const pincodeMatch = 
            !filters.pincode || 
            item.property.location?.pincode === filters.pincode;
          const bedroomMatch =
            filters.bedroom === "" ||
            item.property.bedrooms === parseInt(filters.bedroom);
          const typeMatch =
            filters.type === "" || item.property.type === filters.type;
          const priceMatch =
            (!filters.minPrice || item.property.actualPrice >= parseFloat(filters.minPrice)) &&
            (!filters.maxPrice || item.property.actualPrice <= parseFloat(filters.maxPrice));

          return (titleMatch || cityMatch) && bedroomMatch && typeMatch && priceMatch && pincodeMatch;
        });

  useEffect(() => {
    // No need to verify auth for viewing properties
    fetchAllProperties();
  }, []);

  useEffect(() => {
    if (filters.pincode) {
      fetchAllProperties(filters.pincode);
    }
  }, [filters.pincode]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
          <p className="mt-4">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                {currentView === "featured"
                  ? "Exclusive Owner Properties"
                  : "All Properties"}
                <span className="text-white/50"> in Bangalore</span>
              </h1>
              <p className="text-white/60 text-lg">
                {currentView === "featured"
                  ? "Handpicked premium properties directly from owners"
                  : `${allProperties.length} results | Flats for Sale in Bangalore`}
              </p>
            </div>
          </div>
          
          {/* Show auth redirect message if user tries to add property without authentication */}
          {showAuthRedirect && (
            <div className="bg-yellow-900/50 border border-yellow-700 rounded-lg p-4 mb-6 text-center">
              <p className="text-yellow-200">Please login to add properties</p>
              <Link href="/auth">
                <a className="mt-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors block">
                  Go to Login
                </a>
              </Link>
            </div>
          )}
          
          <FormProperties onAddProperty={addProperty} />
          
          <div className="flex gap-8 mb-6">
            <button
              onClick={() => setCurrentView("featured")}
              className={`pb-3 border-b-2 transition-all duration-300 text-lg font-medium ${
                currentView === "featured"
                  ? "border-white text-white"
                  : "border-transparent text-white/60 hover:text-white hover:border-white/30"
              }`}
            >
              Featured Properties
            </button>
            <button
              onClick={() => setCurrentView("all")}
              className={`pb-3 border-b-2 transition-all duration-300 text-lg font-medium ${
                currentView === "all"
                  ? "border-white text-white"
                  : "border-transparent text-white/60 hover:text-white hover:border-white/30"
              }`}
            >
              All Properties ({allProperties.length})
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 text-center">
            <p className="text-red-200">Error: {error}</p>
            <button
              onClick={() => fetchAllProperties(filters.pincode)}
              className="mt-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Filters & Search */}
      {!error && currentView === "all" && (
        <div className="border-b border-white/10 bg-black/10 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-white placeholder-white/50 w-80 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300"
                />
              </div>
              <PropertyFilters
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-xl backdrop-blur-md border transition-all duration-300 ${
                  viewMode === "grid"
                    ? "bg-white/20 text-white border-white/30"
                    : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 rounded-xl backdrop-blur-md border transition-all duration-300 ${
                  viewMode === "list"
                    ? "bg-white/20 text-white border-white/30"
                    : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Property Listings */}
      {!error && (
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          {currentView === "featured" ? (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Premium Properties</h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => scrollToCard("left")}
                    disabled={isSliding}
                    className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-full text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => scrollToCard("right")}
                    disabled={isSliding}
                    className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-full text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
              >
                {featuredProperties.map((item) => (
                  <Link 
                    key={item.propertyId} 
                    href={`/properties/${item.propertyId}`}
                    onClick={() => {
                      localStorage.setItem('currentPropertyId', item.propertyId);
                      localStorage.setItem('currentProperty', JSON.stringify(item));
                    }}
                  >
                    <a>
                      <PropertyCard
                        property={item.property}
                        files={item.files}
                        ownerName={item.ownerName}
                        isSlider={true}
                      />
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          ) : viewMode === "list" ? (
            <div className="space-y-6">
              {filteredProperties.map((item) => (
                <Link 
                  key={item.propertyId} 
                  href={`/properties/${item.propertyId}`}
                  onClick={() => {
                    localStorage.setItem('currentPropertyId', item.propertyId);
                    localStorage.setItem('currentProperty', JSON.stringify(item));
                  }}
                >
                  <a>
                    <ListViewCard
                      property={item.property}
                      files={item.files}
                      ownerName={item.ownerName}
                    />
                  </a>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((item) => (
                <Link 
                  key={item.propertyId} 
                  href={`/properties/${item.propertyId}`}
                  onClick={() => {
                    localStorage.setItem('currentPropertyId', item.propertyId);
                    localStorage.setItem('currentProperty', JSON.stringify(item));
                  }}
                >
                  <a>
                    <PropertyCard
                      property={item.property}
                      files={item.files}
                      ownerName={item.ownerName}
                      isSlider={true}
                    />
                  </a>
                </Link>
              ))}
            </div>
          )}

          {filteredProperties.length === 0 && (
            <div className="text-center py-16">
              <Home className="w-20 h-20 mx-auto mb-6 text-white/60" />
              <p className="text-2xl mb-2">No properties found</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Properties;
