export const formatAddress = (location) => {
  if (!location || typeof location !== "object") return "";
  return [
    location.addressLine1,
    location.addressLine2,
    location.city,
    location.state,
    location.pincode,
    location.country
  ].filter(Boolean).join(", ");
};
