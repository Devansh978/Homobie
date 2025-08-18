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

const baseUrl = "https://homobiebackend-railway-production.up.railway.app";

// Updated Auth helper functions to match your localStorage structure
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
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
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

// Updated response interceptor to match your token structure
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const { refreshToken } = getAuthTokens();
        if (refreshToken) {
          const response = await axios.post(`${baseUrl}/auth/refresh`, {
            refresh_token: refreshToken  // Changed to match your backend's expected parameter
          });
          
          // Update tokens in localStorage to match your structure
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
    bedroom: "",
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
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);

  const cardWidth = 374;

  const checkAuth = (showError = true) => {
    const { token, userId, userData } = getAuthTokens();
    
    if (!token) {
      if (showError) setError("Please login to access properties");
      return false;
    }
    
    if (!userId || !userData?.userId) {
      if (showError) setError("Authentication incomplete. Please login again.");
      return false;
    }
    
    return true;
  };

  const fetchAllProperties = async () => {
    if (!checkAuth()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await api.get("/properties/allProperties");
      
      if (res.data && Array.isArray(res.data)) {
        setAllProperties(res.data);
        setFeaturedProperties(res.data.filter((p) => p.isFeatured));
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
    if (!checkAuth()) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { userId, userData } = getAuthTokens();
      const ownerId = userId || userData?.userId;
      
      if (!ownerId) throw new Error("Authentication required");

      const formData = new FormData();
      formData.append(
        "property",
        new Blob([JSON.stringify({
          ...newProperty.property,
          ownerId: ownerId
        })], { type: "application/json" })
      );

      if (newProperty.files?.length > 0) {
        Array.from(newProperty.files).forEach((file) => {
          formData.append("files", file);
        });
      } else {
        throw new Error("At least one image is required");
      }

      const res = await api.post("/properties/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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
          const titleMatch = item.property?.title
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());
          const cityMatch = item.property?.location?.city
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());
          const bedroomMatch =
            filters.bedroom === "" ||
            item.property?.bedrooms === parseInt(filters.bedroom);
          const typeMatch =
            filters.type === "" || item.property?.type === filters.type;
          const priceMatch =
            (!filters.minPrice || item.property?.price >= parseFloat(filters.minPrice) * 1000000) &&
            (!filters.maxPrice || item.property?.price <= parseFloat(filters.maxPrice) * 1000000);

          return (titleMatch || cityMatch) && bedroomMatch && typeMatch && priceMatch;
        });

  useEffect(() => {
    const verifyAndFetch = async () => {
      setIsAuthChecking(true);
      try {
        const { token } = getAuthTokens();
        
        if (!token) {
          setError("Please login to view properties");
          return;
        }
        
        await api.get("/auth/verify");
        await fetchAllProperties();
      } catch (err) {
        console.error("Initialization error:", err);
        
        if (err.response?.status === 401) {
          setError("Session expired. Please login again.");
          clearAuthTokens();
          window.location.href = "/auth";
        } else {
          setError("Failed to load properties. Please try again.");
        }
      } finally {
        setIsAuthChecking(false);
      }
    };
    
    verifyAndFetch();
  }, []);

  if (isLoading || isAuthChecking) {
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
            {error.includes("login") || error.includes("Session expired") || error.includes("Please login") ? (
              <Link href="/auth">
                <a className="mt-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors block">
                  Go to Login
                </a>
              </Link>
            ) : (
              <button
                onClick={fetchAllProperties}
                className="mt-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                Retry
              </button>
            )}
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
                  <Link key={item.id} href={`/properties/${item.id}`}>
                    <a>
                      <PropertyCard
                        property={item.property}
                        files={item.files}
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
                <Link key={item.id} href={`/properties/${item.id}`}>
                  <a>
                    <ListViewCard
                      property={item.property}
                      files={item.files}
                      isSlider={true}
                    />
                  </a>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((item) => (
                <Link key={item.id} href={`/properties/${item.id}`}>
                  <a>
                    <PropertyCard
                      property={item.property}
                      files={item.files}
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