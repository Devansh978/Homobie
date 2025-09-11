import React, { useState, useEffect, useMemo } from "react";
import { ArrowLeft, MapPin, Bed, Bath, Ruler, Car, X, ChevronLeft, ChevronRight, Phone, Mail, Heart, Share2, Calendar, Shield, Eye } from "lucide-react";

// API Configuration
const BASE_URL = 'http://homobie.ap-south-1.elasticbeanstalk.com';

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

// Debug function to analyze image data
const debugImageData = (imageData, index = 0) => {
  console.log(`=== DEBUG Image ${index} ===`);
  console.log('Type:', typeof imageData);
  
  if (typeof imageData === 'string') {
    console.log('Length:', imageData.length);
    console.log('First 100 chars:', imageData.substring(0, 100));
    
    // Check for the specific malformed pattern from your backend
    if (imageData.includes('image/jpeg/poses')) {
      console.log('Detected malformed JPEG data URL with "poses"');
    } else if (imageData.startsWith('/9j/')) {
      console.log('Detected: JPEG base64 data (without prefix)');
    } else if (imageData.startsWith('iVBORw')) {
      console.log('Detected: PNG base64 data (without prefix)');
    } else if (imageData.startsWith('data:image/')) {
      console.log('Detected: Data URL');
    } else if (imageData.startsWith('http')) {
      console.log('Detected: HTTP URL');
    } else {
      console.log('Unknown format - assuming base64 without prefix');
    }
  }
  
  console.log(`=== END DEBUG Image ${index} ===`);
};

// Corrected image conversion function
const convertImageDataToUrl = (imageData) => {
  if (!imageData) {
    console.warn("No image data provided");
    return null;
  }
  
  try {
    // If it's already a proper URL, return it
    if (typeof imageData === 'string' && (imageData.startsWith('http') || imageData.startsWith('blob:') || imageData.startsWith('data:image/'))) {
      // Fix malformed data URLs from your backend
      if (imageData.includes('image/jpeg/poses')) {
        const base64Data = imageData.split('image/jpeg/poses/')[1];
        return `data:image/jpeg;base64,${base64Data}`;
      }
      return imageData;
    }
    
    // If it's a base64 string without prefix, add the proper prefix
    if (typeof imageData === 'string') {
      // Check if it looks like base64 data
      if (imageData.match(/^[A-Za-z0-9+/=]+$/)) {
        return `data:image/jpeg;base64,${imageData}`;
      }
      
      // Handle the specific malformed pattern from your backend
      if (imageData.includes('image/jpeg/poses')) {
        const base64Data = imageData.split('image/jpeg/poses/')[1];
        return `data:image/jpeg;base64,${base64Data}`;
      }
    }
    
    // Handle byte arrays
    if (imageData instanceof Uint8Array || Array.isArray(imageData)) {
      const bytes = imageData instanceof Uint8Array ? imageData : new Uint8Array(imageData);
      const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
      const base64 = btoa(binary);
      return `data:image/jpeg;base64,${base64}`;
    }
    
    console.warn("Unsupported image data format:", typeof imageData, imageData);
    return null;
    
  } catch (error) {
    console.error("Error converting image data to URL:", error);
    return null;
  }
};

// Enhanced convertImageArrayToUrls with debugging
const convertImageArrayToUrls = (imageArray) => {
  if (!imageArray || !Array.isArray(imageArray)) {
    console.warn("Invalid or missing image array");
    return [];
  }
  
  const urls = [];
  
  for (let i = 0; i < imageArray.length; i++) {
    const imgData = imageArray[i];
    debugImageData(imgData, i);
    
    const url = convertImageDataToUrl(imgData);
    if (url) {
      urls.push(url);
      console.log(`Successfully converted image ${i}:`, url.substring(0, 50) + '...');
    } else {
      console.warn(`Failed to convert image ${i}`);
    }
  }
  
  return urls;
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

// Process property data and convert images
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
    console.log("No images found in data, using placeholder");
    // Add a placeholder image
    imageUrls = ['https://via.placeholder.com/800x600/333/fff?text=No+Image+Available'];
  }

  // Structure the property data
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

    // PROCESSED IMAGES
    imageUrls: imageUrls,
    
    // Other arrays
    amenities: rawData.amenities || [],
    propertyFeatures: rawData.propertyFeatures || [],

    // Owner
    ownerName: rawData.ownerName || "Private Owner",
  };

  console.log("Processed property with image URLs:", processedProperty.imageUrls);
  return processedProperty;
};

// FIXED: Simple image component with better loading and error states
const PropertyImage = ({ src, alt, className, onClick, loading = "lazy" }) => {
  const [imageState, setImageState] = useState('loading');
  const [imgRef, setImgRef] = useState(null);

  useEffect(() => {
    if (!src) {
      setImageState('error');
      return;
    }

    // Reset state when src changes
    setImageState('loading');
    
    // Create a new image to test if it loads
    const img = new Image();
    
    img.onload = () => {
      console.log('Image loaded successfully:', src.substring(0, 50) + '...');
      setImageState('loaded');
    };
    
    img.onerror = (e) => {
      console.error('Failed to load image:', src.substring(0, 50) + '...', e);
      setImageState('error');
    };
    
    // Start loading the image
    img.src = src;
    setImgRef(img);
    
    // Cleanup
    return () => {
      if (img) {
        img.onload = null;
        img.onerror = null;
      }
    };
  }, [src]);

  // Show error state
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

  // Show loading state
  if (imageState === 'loading') {
    return (
      <div className={`${className} bg-gray-800 flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  // Show loaded image
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onClick={onClick}
      loading={loading}
      onError={() => {
        console.error('Image failed to display:', src.substring(0, 50) + '...');
        setImageState('error');
      }}
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
    setIsFavorite(!isFavorite);
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
      <div className="min-h-screen bg-transparent text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-transparent text-white flex items-center justify-center p-4">
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
      <div className="bg-black min-h-screen bg-transparent text-white flex items-center justify-center p-4">
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
    <div className="bg-black min-h-screen text-white pt-[80px]">
      {/* Header */}
      <div className="border-b border-white/10 bg-transparent/20 backdrop-blur-xl sticky top-0 z-40">
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
                <div className="absolute inset-0 bg-transparent/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                  <div className="bg-transparent/50 px-3 py-1 rounded-lg text-sm">
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
                        className="absolute inset-0 bg-transparent/60 rounded-xl flex items-center justify-center cursor-pointer" 
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
        <div className="fixed inset-0 bg-transparent/90 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowImageModal(false)}>
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-transparent/50 hover:bg-transparent/70 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent/50 hover:bg-transparent/70 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-transparent/50 px-4 py-2 rounded-full text-white text-sm">
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
