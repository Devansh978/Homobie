import FeaturedPropertiesData from "./FeaturedPropertiesData";

const AllPropertiesData = [
  ...FeaturedPropertiesData.map((item) => ({
    ...item,
    files: ["/assets/property-sample.jpg"],
  })),
  {
    id: "3",
    files: ["/assets/property-sample.jpg", "/assets/property-sample.jpg"],
    property: {
      actualPrice: 1500.75,
      amenities: ["CCTV", "Lift"],
      areaSqft: 1200,
      bathrooms: 2,
      bedrooms: 2,
      category: "Apartment",
      constructionStatus: "Under Construction",
      description: "Compact 2BHK flat with great ventilation.",
      furnishing: "Semi-Furnished",
      ownerId: "98765432-abcd-90ef-5678-1234567890ab",
      propertyFeatures: ["Balcony", "Power Backup"],
      status: "Available",
      title: "2 BHK Flat",
      type: "Flat",
      discountPrice: 100.5,
      location: {
        addressLine1: "45 MG Road",
        addressLine2: "Near Metro Station",
        city: "Bangalore",
        country: "India",
        landmark: "Next to Mall",
        pincode: "560038",
        state: "Karnataka",
      },
    },
  },
];
export default AllPropertiesData;
