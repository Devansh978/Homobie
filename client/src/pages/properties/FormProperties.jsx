import React, { useState } from 'react';
import { X, Plus, Upload, MapPin, Home, DollarSign, Bed, Bath, Square } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select"; 

const FormProperties = ({ onAddProperty }) => { 
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    files: [],
    property: {
      actualPrice: '',
      amenities: [],
      areaSqft: '',
      bathrooms: '',
      bedrooms: '',
      category: '',
      constructionStatus: '',
      description: '',
      furnishing: '',
      ownerId: '',
      propertyFeatures: [],
      status: '',
      title: '',
      type: '',
      discountPrice: '',
      location: {
        addressLine1: '',
        addressLine2: '',
        city: '',
        country: '',
        landmark: '',
        pincode: '',
        state: '',
      },
    },
  });

  const [currentAmenity, setCurrentAmenity] = useState('');
  const [currentFeature, setCurrentFeature] = useState('');

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...selectedFiles]
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        property: {
          ...prev.property,
          location: {
            ...prev.property.location,
            [locationField]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        property: {
          ...prev.property,
          [name]: value
        }
      }));
    }
  };

  const addAmenity = () => {
    if (currentAmenity.trim()) {
      setFormData(prev => ({
        ...prev,
        property: {
          ...prev.property,
          amenities: [...prev.property.amenities, currentAmenity.trim()]
        }
      }));
      setCurrentAmenity('');
    }
  };

  const removeAmenity = (index) => {
    setFormData(prev => ({
      ...prev,
      property: {
        ...prev.property,
        amenities: prev.property.amenities.filter((_, i) => i !== index)
      }
    }));
  };

  const addFeature = () => {
    if (currentFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        property: {
          ...prev.property,
          propertyFeatures: [...prev.property.propertyFeatures, currentFeature.trim()]
        }
      }));
      setCurrentFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      property: {
        ...prev.property,
        propertyFeatures: prev.property.propertyFeatures.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = async () => {
    if (!onAddProperty) return;
    await onAddProperty(formData); 
    setIsFormOpen(false);
    // Reset form
    setFormData({
      files: [],
      property: {
        actualPrice: '',
        amenities: [],
        areaSqft: '',
        bathrooms: '',
        bedrooms: '',
        category: '',
        constructionStatus: '',
        description: '',
        furnishing: '',
        ownerId: '',
        propertyFeatures: [],
        status: '',
        title: '',
        type: '',
        discountPrice: '',
        location: {
          addressLine1: '',
          addressLine2: '',
          city: '',
          country: '',
          landmark: '',
          pincode: '',
          state: '',
        },
      },
    });
  };

  return (
    <div className="p-6 bg-black min-h-screen">
      {/* Main Button */}
      <button
        onClick={() => setIsFormOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
      >
        <Plus size={20} />
        Add New Property
      </button>

      {/* Modal Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-black rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-white">
            {/* Modal Header */}
            <div className="sticky top-0 bg-black border-b border-white px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Home size={24} />
                Add New Property
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-white pb-2">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Property Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.property.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-white bg-black text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Category</label>
                    <Select
                      value={formData.property.category}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          property: { ...prev.property, category: value },
                        }))
                      }
                    >
                      <SelectTrigger className="w-full px-3 py-2 border border-white bg-black text-white rounded-lg">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SELL">For Sale</SelectItem>
                        <SelectItem value="RENT">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Property Type</label>
                    <Select
                      value={formData.property.type}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          property: { ...prev.property, type: value },
                        }))
                      }
                    >
                      <SelectTrigger className="w-full px-3 py-2 border border-white bg-black text-white rounded-lg">
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RESIDENTIAL">Residential</SelectItem>
                        <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                        <SelectItem value="PLOT">Plot</SelectItem>
                        <SelectItem value="VILLA">Villa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.property.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-white bg-black text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Property Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-white pb-2 flex items-center gap-2">
                  <Square size={20} />
                  Property Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1 flex items-center gap-1">
                      <Bed size={16} />
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={formData.property.bedrooms}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-white bg-black text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1 flex items-center gap-1">
                      <Bath size={16} />
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      name="bathrooms"
                      value={formData.property.bathrooms}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-white bg-black text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Area (Sqft)</label>
                    <input
                      type="number"
                      name="areaSqft"
                      value={formData.property.areaSqft}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-white bg-black text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Construction Status</label>
                    <Select
                      value={formData.property.constructionStatus}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          property: { ...prev.property, constructionStatus: value },
                        }))
                      }
                    >
                      <SelectTrigger className="w-full px-3 py-2 border border-white bg-black text-white rounded-lg">
                        <SelectValue placeholder="Select construction status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UNDER_CONSTRUCTION">Under Construction</SelectItem>
                        <SelectItem value="READY_TO_MOVE">Ready to Move</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Furnishing</label>
                    <Select
                      value={formData.property.furnishing}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          property: { ...prev.property, furnishing: value },
                        }))
                      }
                    >
                      <SelectTrigger className="w-full px-3 py-2 border border-white bg-black text-white rounded-lg">
                        <SelectValue placeholder="Select furnishing type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FURNISHED">Furnished</SelectItem>
                        <SelectItem value="SEMI_FURNISHED">Semi-Furnished</SelectItem>
                        <SelectItem value="UNFURNISHED">Unfurnished</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Status</label>
                    <select
                      name="status"
                      value={formData.property.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-white bg-black text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="available">Available</option>
                      <option value="sold">Sold</option>
                      <option value="rented">Rented</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-white pb-2 flex items-center gap-2">
                  <DollarSign size={20} />
                  Pricing
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Actual Price</label>
                    <input
                      type="number"
                      name="actualPrice"
                      value={formData.property.actualPrice}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-white bg-black text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Discount Price</label>
                    <input
                      type="number"
                      name="discountPrice"
                      value={formData.property.discountPrice}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-white bg-black text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-white pb-2 flex items-center gap-2">
                  <MapPin size={20} />
                  Location
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Address Line 1</label>
                    <input
                      type="text"
                      name="location.addressLine1"
                      value={formData.property.location.addressLine1}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-white bg-black text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Address Line 2</label>
                    <input
                      type="text"
                      name="location.addressLine2"
                      value={formData.property.location.addressLine2}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-white bg-black text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">City</label>
                    <input
                      type="text"
                      name="location.city"
                      value={formData.property.location.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-white bg-black text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">State</label>
                    <input
                      type="text"
                      name="location.state"
                      value={formData.property.location.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-white bg-black text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Country</label>
                    <input
                      type="text"
                      name="location.country"
                      value={formData.property.location.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-white bg-black text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Pincode</label>
                    <input
                      type="text"
                      name="location.pincode"
                      value={formData.property.location.pincode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-white bg-black text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-white mb-1">Landmark</label>
                    <input
                      type="text"
                      name="location.landmark"
                      value={formData.property.location.landmark}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-white bg-black text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Photos and Videos */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-white pb-2 flex items-center gap-2">
                  <Upload size={20} />
                  Photos & Videos
                </h3>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Upload Property Images/Videos
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-white bg-black text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-white file:bg-blue-600 file:hover:bg-blue-700 file:cursor-pointer"
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Select multiple images and videos (JPG, PNG, MP4, etc.)
                  </p>
                </div>
                
                {/* File Preview */}
                {formData.files.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white">Selected Files:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {formData.files.map((file, index) => (
                        <div key={index} className="relative bg-gray-800 rounded-lg p-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-white truncate" title={file.name}>
                              {file.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-red-400 hover:text-red-600 ml-1"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {(file.size / 1024 / 1024).toFixed(1)} MB
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Amenities */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-white pb-2">Amenities</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentAmenity}
                    onChange={(e) => setCurrentAmenity(e.target.value)}
                    placeholder="Add amenity"
                    className="flex-1 px-3 py-2 border border-white bg-black text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                  />
                  <button
                    type="button"
                    onClick={addAmenity}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.property.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                    >
                      {amenity}
                      <button
                        type="button"
                        onClick={() => removeAmenity(index)}
                        className="text-blue-600 hover:text-red-600"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Property Features */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-white pb-2">Property Features</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentFeature}
                    onChange={(e) => setCurrentFeature(e.target.value)}
                    placeholder="Add feature"
                    className="flex-1 px-3 py-2 border border-white bg-black text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.property.propertyFeatures.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-green-600 hover:text-red-600"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t border-white">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-2 border border-white text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Property
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormProperties;