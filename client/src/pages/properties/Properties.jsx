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

const proxyUrl = "https://cors-anywhere.herokuapp.com/"; //temporary
const baseUrl = proxyUrl + "https://homobiebackend-railway-production.up.railway.app";

const Properties = () => {
  const [currentView, setCurrentView] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [bedroomFilter, setBedroomFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [pincode, setPincode] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [furnishing, setFurnishing] = useState("");
  const [category, setCategory] = useState("");
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [isSliding, setIsSliding] = useState(false);
  const scrollContainerRef = useRef(null);

  const cardWidth = 374;

<<<<<<< HEAD
  const getAuthHeaders = () => {
    const token = localStorage.getItem("auth_token") || localStorage.getItem("token") || "";
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  };

  const getOwnerId = () => {
    const ownerId = localStorage.getItem("userId");
    console.log("Current Owner ID (from userId):", ownerId);
    return ownerId;
  };

  // Add property with ownerId in DTO
  const addProperty = async (newProperty) => {
    try {
      const ownerId = getOwnerId();
      console.log("Preparing to add property with ownerId:", ownerId);

      const propertyData = {
        ...newProperty.property,
        ownerId: ownerId // Include ownerId in the DTO
      };

      // Log the DTO being sent
      console.log("DTO being sent to server:", propertyData);

      const formData = new FormData();
      formData.append(
        "property",
        new Blob([JSON.stringify(propertyData)], { type: "application/json" })
      );

      // Add files if any
      if (Array.isArray(newProperty.files)) {
        newProperty.files.forEach((file) => {
          formData.append("files", file);
        });
      }

      const config = {
        ...getAuthHeaders(),
        headers: {
          ...getAuthHeaders().headers,
          'Content-Type': 'multipart/form-data'
        }
      };

      const response = await axios.post(
        `${baseUrl}/properties/add`,
        formData,
        config
      );
      console.log("Owner ID:", ownerId);
      console.log(auth_token);
      fetchAllProperties();
      return response.data;
    } catch (error) {
      console.error("Error adding property:", error);
      console.log("Owner ID at time of error:", getOwnerId());
      return null;
    }
  };

  // Example of other API calls (GET all properties)
  const fetchAllProperties = async () => {
    try {
      const response = await axios.get(`${baseUrl}/properties/allProperties`, getAuthHeaders());
      setAllProperties(response.data);
      setFeaturedProperties(response.data.filter((p) => p.isFeatured));
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };


  // 2. GET a
  const fetchPropertyById = async (propertyId) => {
    try {
      const res = await axios.get(
        `${baseUrl}/properties/getIndividualProperty?propertyId=${propertyId}`
      );
=======
  // 1. GET all
  const fetchAllProperties = async () => {
    try {
      const res = await axios.get(`${baseUrl}/properties/allProperties`);
      setAllProperties(res.data);
      setFeaturedProperties(res.data.filter((p) => p.isFeatured));
    } catch (err) {
      console.error("Error fetching properties:", err);
    }
  };

  // 2. GET a
  const fetchPropertyById = async (propertyId) => {
    try {
      const res = await axios.get(`${baseUrl}/properties/getIndividualProperty?propertyId=${propertyId}`);
>>>>>>> 67c74150bc430593ce17afe789113a8a0af1fd6f
      return res.data;
    } catch (err) {
      console.error("Error fetching property:", err);
      return null;
    }
  };

<<<<<<< HEAD
  // 3. POST add
  

=======
  // 3. POST add a property
  const addProperty = async (newProperty) => {
    try {
      const formData = new FormData();

      formData.append(
        "property",
        new Blob([JSON.stringify(newProperty.property)], { type: "application/json" })
      );

      // Append all files (if any)
      if (Array.isArray(newProperty.files)) {
        newProperty.files.forEach((file) => {
          formData.append("files", file);
        });
      }

      const res = await axios.post(`${baseUrl}/properties/add`, formData);

      // Refresh property list after adding
      fetchAllProperties();
      return res.data;
    } catch (err) {
      console.error("Error adding property:", err);
      return null;
    }
  };

  // Pass this to your FormProperties component
>>>>>>> 67c74150bc430593ce17afe789113a8a0af1fd6f
  const handleAddProperty = async (propertyData) => {
    await addProperty(propertyData);
  };

  const scrollToCard = (direction) => {
    if (!scrollContainerRef.current || isSliding) return;
    setIsSliding(true);
    const container = scrollContainerRef.current;
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
    const start = container.scrollLeft,
      end = start + scrollAmount,
      duration = 400;
    let startTime = null;

    function animateScroll(currentTime) {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime,
        progress = Math.min(elapsed / duration, 1);
      container.scrollLeft = start + (end - start) * progress;
      if (progress < 1) requestAnimationFrame(animateScroll);
      else setIsSliding(false);
    }
    requestAnimationFrame(animateScroll);
  };

  // Filtered list
  const filteredProperties =
    currentView === "featured"
      ? featuredProperties
      : allProperties.filter((item) => {
          const titleMatch = item.property.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
          const cityMatch = item.property.location.city
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
          const bedroomMatch =
            bedroomFilter === "" ||
            item.property.bedrooms === parseInt(bedroomFilter);
          const typeMatch =
            typeFilter === "" || item.property.type === typeFilter;
          const priceMatch =
<<<<<<< HEAD
            (!minPrice ||
              item.property.price >= parseFloat(minPrice) * 10000000) &&
            (!maxPrice ||
              item.property.price <= parseFloat(maxPrice) * 10000000);

          return (
            (titleMatch || cityMatch) && bedroomMatch && typeMatch && priceMatch
          );
=======
            (!minPrice || item.property.price >= parseFloat(minPrice) * 10000000) &&
            (!maxPrice || item.property.price <= parseFloat(maxPrice) * 10000000);

          return (titleMatch || cityMatch) && bedroomMatch && typeMatch && priceMatch;
>>>>>>> 67c74150bc430593ce17afe789113a8a0af1fd6f
        });

  useEffect(() => {
    fetchAllProperties();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className=" border-b border-white/10 bg-black/20 backdrop-blur-xl">
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
          {/* Pass the handler to the form */}
          <FormProperties onAddProperty={handleAddProperty} />
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

      {/* Filters & Search */}
      {currentView === "all" && (
        <div className=" border-b border-white/10 bg-black/10 backdrop-blur-xl">
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
                bedroomFilter={bedroomFilter}
                setBedroomFilter={setBedroomFilter}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                pincode={pincode}
                setPincode={setPincode}
                location={location}
                setLocation={setLocation}
                city={city}
                setCity={setCity}
                stateValue={stateValue}
                setStateValue={setStateValue}
                furnishing={furnishing}
                setFurnishing={setFurnishing}
                category={category}
                setCategory={setCategory}
              />
            </div>
            {/* View Mode Switch */}
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
      <div className="relative max-w-7xl mx-auto px-4 py-12">
        {currentView === "featured" ? (
          <div>
            <div className="flex items-center justify-between mb-8">
<<<<<<< HEAD
              <h2 className="text-2xl font-bold text-white">
                Premium Properties
              </h2>
=======
              <h2 className="text-2xl font-bold text-white">Premium Properties</h2>
>>>>>>> 67c74150bc430593ce17afe789113a8a0af1fd6f
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

        {/* No Results */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-16">
            <Home className="w-20 h-20 mx-auto mb-6 text-white/60" />
            <p className="text-2xl mb-2">No properties found</p>
            <p className="text-sm">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;
