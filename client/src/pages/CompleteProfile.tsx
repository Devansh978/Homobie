import React, { useState } from 'react';
import { User, Mail, Phone, ArrowRight, Building, MapPin, AlertCircle } from 'lucide-react';
import { UserWithRoleRegistrationRequest, Role, LocationRequest, BuilderRegistrationRequest } from '../lib/registration';

interface CompleteProfileProps {
  email?: string;
  firstName?: string;
}

const CompleteProfile: React.FC<CompleteProfileProps> = ({ 
  email = '', 
  firstName = '' 
}) => {

  const [formData, setFormData] = useState({
    firstName: firstName,
    lastName: '',
    phoneNumber: '',
    role: 'USER' as Role,
    // Builder-specific fields
    companyName: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const isBuilder = formData.role === 'BUILDER';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const userRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: email,
        phoneNumber: formData.phoneNumber,
      };

      let roleData = null;
      if (isBuilder) {
        const location: LocationRequest = {
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          landmark: formData.landmark,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        };

        roleData = {
          roleType: formData.role,
          companyName: formData.companyName,
          location: location,
        } as BuilderRegistrationRequest;
      }

      const requestPayload: UserWithRoleRegistrationRequest = {
        user: userRequest,
        roleData: roleData,
      };

      const response = await fetch('https://homobiebackend-railway-production.up.railway.app/register/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload),
      });

      if (response.ok) {
        alert('Profile completed successfully! Please log in again to continue.');
        window.location.href = '/auth'; // Redirect to login or auth page
      } else {
        const errorText = await response.text();
        setError(errorText || 'Failed to update profile. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mb-6">
            <User className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
          <p className="text-gray-600">Just a few more details to get started</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-gray-200">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input type="email" id="email" value={email} disabled
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
                </div>
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select id="role" name="role" value={formData.role} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200">
                  <option value="USER">User</option>
                  <option value="BUILDER">Builder</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" />
              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required
                  pattern="^\d{10}$" placeholder="Enter 10-digit phone number"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" />
              </div>
            </div>

            {/* Builder Fields */}
            {isBuilder && (
              <div className="space-y-6 pt-6 border-t border-gray-200">
                <div className="flex items-center mb-4">
                  <Building className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Builder Information</h3>
                </div>

                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" />
                </div>

                <div className="flex items-center mb-4">
                  <MapPin className="h-5 w-5 text-green-600 mr-2" />
                  <h4 className="text-md font-semibold text-gray-900">Company Address</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} placeholder="Address Line 1" required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" />
                  <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleChange} placeholder="Address Line 2" required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} placeholder="Landmark" required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" />
                  <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" />
                  <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" />
                </div>
              </div>
            )}

            <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <>
                <span>Complete Profile</span>
                <ArrowRight className="h-4 w-4" />
              </>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;