import { normalizePropertyData } from './AllPropertiesData';

// Inside an async function in your component...
const response = await fetch('http://homobie.ap-south-1.elasticbeanstalk.com/properties/allProperties?pincode=string');
const apiData = await response.json();

// Normalize the messy API data into a clean format
const cleanProperties = normalizePropertyData(apiData);

// Now you can safely use cleanProperties to render your UI
setProperties(cleanProperties);

export const normalizePropertyData = (apiData) => {
  if (!apiData) return [];
  
  return apiData.map(item => ({
    id: item.propertyId || `temp-${Math.random().toString(36).substr(2, 9)}`,
    files: item.images || [DEFAULT_PROPERTY_IMAGE],
    property: {
      actualPrice: item.actualPrice,
      discountPrice: item.discountPrice || 0,
      title: item.title || "Untitled Property",
      type: item.type,
      constructionStatus: item.constructionStatus,
      status: item.propertyStatus,
      location: {
        addressLine1: item.location?.addressLine1 || "",
        addressLine2: item.location?.addressLine2 || "",
        city: item.location?.city || "",
        state: item.location?.state || "",
        pincode: item.location?.pincode || "",
        country: item.location?.country || "",
        landmark: item.location?.landmark || ""
      },
      // Add default values for missing fields
      bedrooms: 0,
      bathrooms: 0,
      areaSqft: 0,
      furnishing: "Not Specified",
      category: "Not Specified",
      description: "No description available",
      amenities: [],
      propertyFeatures: []
    },
    isFeatured: false // You might want to add this field in your API
  }));
};

export default AllPropertiesData;