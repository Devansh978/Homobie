import React, { useState, useEffect, useMemo } from "react";
import { ArrowLeft, MapPin, Bed, Bath, Ruler, Car, X, ChevronLeft, ChevronRight, Phone, Mail, Heart, Share2, Calendar, Shield, Eye } from "lucide-react";

// API Configuration
const BASE_URL = 'https://homobiebackend-railway-production.up.railway.app';

// This function should ONLY return an actual authentication token (JWT).
const getAuthToken = () => {
  return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
};

// Function to get propertyId from localStorage
const getPropertyIdFromLocalStorage = () => {
  const propertyId = localStorage.getItem('currentPropertyId');
  if (propertyId) {
    return propertyId.replace(/^"|"$/g, '');
  }
  return null;
};

// STEP 1: Convert image data to displayable URL
const convertByteArrayToImageUrl = (imageData) => {
  if (!imageData) {
    console.warn("No image data provided");
    return null;
  }
  
  try {
    // Handle different input formats
    if (typeof imageData === 'string') {
      // Already a proper data URL
      if (imageData.startsWith('data:image/')) {
        return imageData;
      }
      // Base64 JPEG without prefix (common case from your backend)
      else if (imageData.startsWith('/9j/')) {
        return `data:image/jpeg;base64,${imageData}`;
      }
      // Base64 PNG without prefix
      else if (imageData.startsWith('iVBORw')) {
        return `data:image/png;base64,${imageData}`;
      }
      // Already a URL
      else if (imageData.startsWith('http') || imageData.startsWith('blob:')) {
        return imageData;
      }
      // Assume it's base64 data without prefix
      else {
        // Try to detect image type from content
        const firstChars = imageData.substring(0, 20);
        let mimeType = 'image/jpeg'; // default
        
        if (firstChars.includes('PNG') || firstChars.includes('iVBORw')) {
          mimeType = 'image/png';
        } else if (firstChars.includes('GIF')) {
          mimeType = 'image/gif';
        } else if (firstChars.includes('WEBP')) {
          mimeType = 'image/webp';
        }
        
        return `data:${mimeType};base64,${imageData}`;
      }
    }
    // Handle Uint8Array or Array
    else if (imageData instanceof Uint8Array || Array.isArray(imageData)) {
      // Convert to base64 first, then create data URL
      const uint8Array = imageData instanceof Uint8Array ? imageData : new Uint8Array(imageData);
      const binaryString = Array.from(uint8Array).map(byte => String.fromCharCode(byte)).join('');
      const base64 = btoa(binaryString);
      return `data:image/jpeg;base64,${base64}`;
    }
    
    console.warn("Unsupported image data format:", typeof imageData);
    return null;
    
  } catch (error) {
    console.error("Error converting image data to URL:", error);
    return null;
  }
};

// STEP 2: Convert array of image data to array of image URLs
const convertImageArrayToUrls = (imageArray) => {
  console.log("Converting image array to URLs:", imageArray);
  
  if (!imageArray || !Array.isArray(imageArray)) {
    console.warn("Invalid or missing image array");
    return [];
  }
  
  const imageUrls = [];
  
  for (let i = 0; i < imageArray.length; i++) {
    const imageData = imageArray[i];
    console.log(`Processing image ${i}:`, typeof imageData);
    
    const imageUrl = convertByteArrayToImageUrl(imageData);
    
    if (imageUrl) {
      imageUrls.push(imageUrl);
      console.log(`Successfully converted image ${i}`);
    } else {
      console.warn(`Failed to convert image ${i}`);
    }
  }
  
  console.log(`Converted ${imageUrls.length} out of ${imageArray.length} images`);
  return imageUrls;
};

// API function to fetch individual property
const fetchIndividualProperty = async (propertyId) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication token not found. Please log in again.');
  }

  try {
    console.log(`Fetching property: ${propertyId}`);
    
    const response = await fetch(`${BASE_URL}/properties/getIndividualProperty?propertyId=${propertyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      }
      if (response.status === 404) {
        throw new Error('Property not found.');
      }
      throw new Error(`Failed to fetch property: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Raw API Response:", data);
    
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

// STEP 3: Process property data and convert images
const processPropertyData = (rawData) => {
  if (!rawData) {
    console.warn("No property data to process");
    return null;
  }

  console.log("Processing property data:", rawData);

  // Convert images from various possible fields
  let imageUrls = [];
  
  // Check different possible image fields
  const imageSources = [
    rawData.images,
    rawData.mediaFiles,
    rawData.imageUrls // if already processed
  ];
  
  for (const source of imageSources) {
    if (source && Array.isArray(source) && source.length > 0) {
      console.log("Found images array with length:", source.length);
      imageUrls = convertImageArrayToUrls(source);
      if (imageUrls.length > 0) break;
    }
  }

  if (imageUrls.length === 0) {
    console.log("No images found in data");
  }

  // SECOND: Structure the property data
  const processedProperty = {
    // IDs
    id: rawData.propertyId || `temp-${Date.now()}`,
    propertyId: rawData.propertyId,

    // Core Details
    title: rawData.title || "Untitled Property",
    description: rawData.description || "No description available.",
    actualPrice: rawData.actualPrice || 0,
    discountPrice: rawData.discountPrice || 0,
    areaSqft: rawData.areaSqft || 0,
    bedrooms: rawData.bedrooms || 0,
    bathrooms: rawData.bathrooms || 0,

    // Categorization
    type: rawData.type || "N/A",
    category: rawData.category || "N/A",
    status: rawData.status || "N/A",
    furnishing: rawData.furnishing || "N/A",
    constructionStatus: rawData.constructionStatus || "N/A",

    // Location
    location: {
      address: rawData.location?.address || rawData.location?.addressLine1 || "Address not available",
      city: rawData.location?.city || "",
      state: rawData.location?.state || "",
      pincode: rawData.location?.pincode || "",
    },

    // PROCESSED IMAGES - This is the key part!
    imageUrls: imageUrls, // Array of blob URLs ready for display
    
    // Other arrays
    amenities: rawData.amenities || [],
    propertyFeatures: rawData.propertyFeatures || [],

    // Owner
    ownerName: rawData.ownerName || "Private Owner",
  };

  console.log("Processed property with image URLs:", processedProperty.imageUrls);
  return processedProperty;
};

// Simple image component with loading and error states
const PropertyImage = ({ src, alt, className, onClick, loading = "lazy" }) => {
  const [imageState, setImageState] = useState('loading'); // 'loading', 'loaded', 'error'

  const handleLoad = () => {
    setImageState('loaded');
  };

  const handleError = () => {
    console.error("Failed to load image:", src);
    setImageState('error');
  };

  // Show placeholder while loading or on error
  if (imageState === 'loading') {
    return (
      <div className={`${className} bg-gray-800 flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (imageState === 'error' || !src) {
    return (
      <div className={`${className} bg-gray-800 flex items-center justify-center text-white/60`}>
        <div className="text-center">
          <div className="text-4xl mb-2">🖼️</div>
          <div className="text-sm">Image not available</div>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onClick={onClick}
      onLoad={handleLoad}
      onError={handleError}
      loading={loading}
    />
  );
};

const PropertyDetail = () => {
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const goBack = () => {
    window.history.back();
  };

  // Cleanup blob URLs when component unmounts
  useEffect(() => {
    return () => {
      if (property?.imageUrls) {
        property.imageUrls.forEach(url => {
          if (url && url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        });
      }
    };
  }, [property]);

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      const propertyId = getPropertyIdFromLocalStorage();
      
      if (!propertyId) {
        setError("Property ID not found. Please select a property to view.");
        setIsLoading(false);
        return;
      }

      try {
        // STEP 1: Fetch raw data from API
        const rawPropertyData = await fetchIndividualProperty(propertyId);
        
        // STEP 2: Process data and convert images
        const processedProperty = processPropertyData(rawPropertyData);
        
        if (!processedProperty) {
          throw new Error("Failed to process property data");
        }
        
        // STEP 3: Set the processed data with image URLs
        setProperty(processedProperty);
        
        // Handle favorites
        try {
          const favorites = JSON.parse(sessionStorage.getItem('favorites') || '[]');
          setIsFavorite(favorites.includes(propertyId));
        } catch {
          sessionStorage.setItem('favorites', '[]');
        }
        
      } catch (err) {
        console.error('Error fetching property:', err);
        setError(err.message || "Failed to load property details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyDetail();
  }, []);
  
  // Memoized calculations
  const discountPercentage = useMemo(() => {
    if (!property?.discountPrice || !property?.actualPrice) return 0;
    return Math.round(((property.actualPrice - property.discountPrice) / property.actualPrice) * 100);
  }, [property]);
  
  const pricePerSqft = useMemo(() => {
    if (!property?.discountPrice && !property?.actualPrice) return 0;
    const price = property.discountPrice || property.actualPrice;
    if (!property.areaSqft) return 0;
    return Math.round(price / property.areaSqft);
  }, [property]);

  const nextImage = () => {
    if (!property?.imageUrls || property.imageUrls.length === 0) return;
    setSelectedImageIndex((prev) => 
      prev === property.imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!property?.imageUrls || property.imageUrls.length === 0) return;
    setSelectedImageIndex((prev) => 
      prev === 0 ? property.imageUrls.length - 1 : prev - 1
    );
  };

  const toggleFavorite = () => {
    const propertyId = getPropertyIdFromLocalStorage();
    if (!propertyId) return;

    try {
      const favorites = JSON.parse(sessionStorage.getItem('favorites') || '[]');
      if (isFavorite) {
        const updatedFavorites = favorites.filter(id => id !== propertyId);
        sessionStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      } else {
        favorites.push(propertyId);
        sessionStorage.setItem('favorites', JSON.stringify(favorites));
      }
      setIsFavorite(!isFavorite);
    } catch {
      sessionStorage.setItem('favorites', JSON.stringify([propertyId]));
      setIsFavorite(true);
    }
  };

  const shareProperty = async () => {
    const shareData = {
      title: property.title,
      text: `Check out this amazing property: ${property.title}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Property link copied to clipboard!');
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-white/5 border border-white/10 rounded-lg p-8">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
          <p className="text-red-200 mb-6">{error}</p>
          <button
            onClick={goBack}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!property?.title) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🏠</div>
          <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
          <p className="text-white/60 mb-6">The property you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={goBack}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Properties
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleFavorite}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isFavorite ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/60 hover:text-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={shareProperty}
                aria-label="Share property"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white/60 hover:text-white"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Property Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {property.imageUrls && property.imageUrls.length > 0 ? (
            <>
              <div className="relative group">
                <PropertyImage
                  src={property.imageUrls[0]}
                  alt={property.title}
                  className="w-full h-96 object-cover rounded-xl cursor-pointer"
                  onClick={() => {
                    setSelectedImageIndex(0);
                    setShowImageModal(true);
                  }}
                  loading="eager"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                  <div className="bg-black/50 px-3 py-1 rounded-lg text-sm">
                    <Eye className="w-4 h-4 inline mr-1" />
                    View Gallery ({property.imageUrls.length} photos)
                  </div>
                </div>
              </div>
              <div className="hidden lg:grid grid-cols-2 gap-4">
                {property.imageUrls.slice(1, 5).map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <PropertyImage
                      src={imageUrl}
                      alt={`${property.title} ${index + 2}`}
                      className="w-full h-44 object-cover rounded-xl cursor-pointer"
                      onClick={() => {
                        setSelectedImageIndex(index + 1);
                        setShowImageModal(true);
                      }}
                    />
                    {index === 3 && property.imageUrls.length > 5 && (
                      <div 
                        className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center cursor-pointer" 
                        onClick={() => { 
                          setSelectedImageIndex(4); 
                          setShowImageModal(true); 
                        }}
                      >
                        <span className="text-white font-semibold">+{property.imageUrls.length - 5} more</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="lg:col-span-2 h-96 bg-white/5 rounded-xl flex items-center justify-center text-white/40">
              <div className="text-center">
                <div className="text-6xl mb-4">📷</div>
                <p>No images available for this property</p>
              </div>
            </div>
          )}
        </div>

        {/* Property Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-4xl font-bold flex-1">{property.title}</h1>
              {discountPercentage > 0 && (
                <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                  {discountPercentage}% OFF
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4 mb-6 text-white/60">
              <MapPin className="w-5 h-5 flex-shrink-0" />
              <span>
                {property.location?.address}, {property.location?.city}, {property.location?.state} - {property.location?.pincode}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-white/10 to-white/5 p-4 rounded-xl text-center border border-white/10">
                <Bed className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                <p className="text-sm font-medium">{property.bedrooms} Bedrooms</p>
              </div>
              <div className="bg-gradient-to-br from-white/10 to-white/5 p-4 rounded-xl text-center border border-white/10">
                <Bath className="w-6 h-6 mx-auto mb-2 text-green-400" />
                <p className="text-sm font-medium">{property.bathrooms} Bathrooms</p>
              </div>
              <div className="bg-gradient-to-br from-white/10 to-white/5 p-4 rounded-xl text-center border border-white/10">
                <Ruler className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                <p className="text-sm font-medium">{property.areaSqft} sq.ft.</p>
              </div>
              <div className="bg-gradient-to-br from-white/10 to-white/5 p-4 rounded-xl text-center border border-white/10">
                <Car className="w-6 h-6 mx-auto mb-2 text-orange-400" />
                <p className="text-sm font-medium">Parking</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                Description
                <div className="h-0.5 bg-gradient-to-r from-white/20 to-transparent flex-1"></div>
              </h2>
              <p className="text-white/80 leading-relaxed text-lg">{property.description}</p>
            </div>

            {property.propertyFeatures && property.propertyFeatures.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  Property Features
                  <div className="h-0.5 bg-gradient-to-r from-white/20 to-transparent flex-1"></div>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.propertyFeatures.map((feature, index) => (
                    <div key={index} className="bg-gradient-to-r from-white/10 to-white/5 px-4 py-3 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                      <span className="text-green-400 mr-2">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {property.amenities && property.amenities.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  Amenities
                  <div className="h-0.5 bg-gradient-to-r from-white/20 to-transparent flex-1"></div>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="bg-gradient-to-r from-white/10 to-white/5 px-4 py-3 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                      <span className="text-blue-400 mr-2">★</span>
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 sticky top-24">
              <div className="mb-6 text-center">
                <h3 className="text-lg font-medium mb-3 text-white/80">Price</h3>
                {property.discountPrice ? (
                  <div>
                    <p className="text-4xl font-bold text-green-400 mb-1">
                      ₹{property.discountPrice.toLocaleString()}
                    </p>
                    <p className="text-white/60 line-through text-lg">
                      ₹{property.actualPrice.toLocaleString()}
                    </p>
                    <p className="text-sm text-green-400 mt-2">
                      You save ₹{(property.actualPrice - property.discountPrice).toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-4xl font-bold">
                    ₹{property.actualPrice.toLocaleString()}
                  </p>
                )}
                <p className="text-sm text-white/60 mt-2">
                  {pricePerSqft > 0 ? `₹${pricePerSqft.toLocaleString()} per sq.ft.` : 'Price on request'}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3">Quick Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/60">Type:</span>
                    <span className="font-medium">{property.type}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/60">Category:</span>
                    <span className="font-medium">{property.category}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/60">Status:</span>
                    <span className="font-medium text-green-400">{property.status}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/60">Furnishing:</span>
                    <span className="font-medium">{property.furnishing}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-white/60">Construction:</span>
                    <span className="font-medium">{property.constructionStatus}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Owner Information
                </h3>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="font-medium text-white/90">{property.ownerName}</p>
                  <p className="text-sm text-white/60 mt-1">Property Owner</p>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-white/90 transition-all duration-300 flex items-center justify-center gap-2 group">
                  <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Contact Owner
                </button>
                <button className="w-full border border-white/20 text-white py-3 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Schedule Visit
                </button>
                <button className="w-full border border-white/20 text-white py-3 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2">
                  <Mail className="w-5 h-5" />
                  Send Enquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && property.imageUrls && property.imageUrls.length > 0 && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowImageModal(false)}>
          <div className="relative max-w-6xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowImageModal(false)}
              aria-label="Close image gallery"
              className="absolute -top-4 -right-4 z-10 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <PropertyImage
              src={property.imageUrls[selectedImageIndex]}
              alt={`${property.title} ${selectedImageIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              loading="eager"
            />
            {property.imageUrls.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  aria-label="Previous image"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white text-sm">
                  {selectedImageIndex + 1} / {property.imageUrls.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;