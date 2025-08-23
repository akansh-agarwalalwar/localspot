import React, { useState } from 'react';
import { PropertyFormData } from '../../types';
import { validateImageUrl, convertGoogleDriveUrl, getImagePreviewUrl } from '../../utils/imageUtils';
import PropertyImage from '../common/PropertyImage';
import { propertyAPI } from '../../services/api';

interface CreatePropertyProps {
  onSubmit: (data: PropertyFormData) => Promise<boolean>;
  loading?: boolean;
}

const CreateProperty: React.FC<CreatePropertyProps> = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    price: 0,
    location: '',
    amenities: {
      ac: false,
      wifi: false,
      ro: false,
      mess: false,
      securityGuard: false,
      maid: false,
      parking: false,
      laundry: false,
      powerBackup: false,
      cctv: false,
    },
    roomTypes: {
      single: false,
      double: false,
      triple: false,
      dormitory: false,
    },
    pics: [''],
    coverPhoto: '',
    facilityPhotos: [''],
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (!formData.price || formData.price <= 0) {
      errors.price = 'Price must be greater than 0';
    }

    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    }

    // Validate cover photo
    if (!formData.coverPhoto.trim()) {
      errors.coverPhoto = 'Cover photo is required';
    } else {
      const url = formData.coverPhoto.trim();
      if (!/^https?:\/\/.+\..+/.test(url)) {
        errors.coverPhoto = 'Please provide a valid cover photo URL (must start with http:// or https://)';
      }
    }

    // Validate facility photos (optional)
    const validFacilityPhotos = formData.facilityPhotos.filter(pic => pic.trim() !== '');
    if (validFacilityPhotos.length > 0) {
      const invalidUrls = validFacilityPhotos.filter(pic => {
        const url = pic.trim();
        return !/^https?:\/\/.+\..+/.test(url);
      });
      if (invalidUrls.length > 0) {
        errors.facilityPhotos = 'Please provide valid facility photo URLs (must start with http:// or https://)';
      }
    }

    // Keep original pics validation for backward compatibility
    const validPics = formData.pics.filter(pic => pic.trim() !== '');
    if (validPics.length === 0) {
      errors.pics = 'At least one image URL is required';
    } else {
      // Enhanced URL validation on frontend
      const invalidUrls = validPics.filter(pic => {
        const url = pic.trim();
        // Accept any HTTPS URL
        return !/^https?:\/\/.+\..+/.test(url);
      });
      
      if (invalidUrls.length > 0) {
        errors.pics = 'Please provide valid URLs (must start with http:// or https://)';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value,
    }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleAmenityChange = (amenity: keyof PropertyFormData['amenities']): void => {
    setFormData(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: !prev.amenities[amenity],
      },
    }));
  };

  const handleRoomTypeChange = (roomType: keyof PropertyFormData['roomTypes']): void => {
    setFormData(prev => ({
      ...prev,
      roomTypes: {
        ...prev.roomTypes,
        [roomType]: !prev.roomTypes[roomType],
      },
    }));
  };

  const handlePicChange = (index: number, value: string): void => {
    const newPics = [...formData.pics];
    newPics[index] = value;
    setFormData(prev => ({
      ...prev,
      pics: newPics,
    }));
    
    // Clear validation error for this field
    if (validationErrors.pics) {
      setValidationErrors(prev => ({
        ...prev,
        pics: '',
      }));
    }
  };

  const addPicField = (): void => {
    setFormData(prev => ({
      ...prev,
      pics: [...prev.pics, ''],
    }));
  };

  const removePicField = (index: number): void => {
    if (formData.pics.length > 1) {
      const newPics = formData.pics.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        pics: newPics,
      }));
    }
  };

  // Cover photo handlers
  const handleCoverPhotoChange = (value: string): void => {
    setFormData(prev => ({
      ...prev,
      coverPhoto: value,
    }));
    
    // Clear validation error for this field
    if (validationErrors.coverPhoto) {
      setValidationErrors(prev => ({
        ...prev,
        coverPhoto: '',
      }));
    }
  };

  // Facility photos handlers
  const handleFacilityPhotoChange = (index: number, value: string): void => {
    const newFacilityPhotos = [...formData.facilityPhotos];
    newFacilityPhotos[index] = value;
    setFormData(prev => ({
      ...prev,
      facilityPhotos: newFacilityPhotos,
    }));
    
    // Clear validation error for this field
    if (validationErrors.facilityPhotos) {
      setValidationErrors(prev => ({
        ...prev,
        facilityPhotos: '',
      }));
    }
  };

  const addFacilityPhotoField = (): void => {
    setFormData(prev => ({
      ...prev,
      facilityPhotos: [...prev.facilityPhotos, ''],
    }));
  };

  const removeFacilityPhotoField = (index: number): void => {
    if (formData.facilityPhotos.length > 1) {
      const newFacilityPhotos = formData.facilityPhotos.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        facilityPhotos: newFacilityPhotos,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Filter out empty pic URLs
      const cleanedData = {
        ...formData,
        pics: formData.pics.filter(pic => pic.trim() !== ''),
      };
      
      const success = await onSubmit(cleanedData);
      
      if (success) {
        setFormData({
          title: '',
          description: '',
          price: 0,
          location: '',
          amenities: {
            ac: false,
            wifi: false,
            ro: false,
            mess: false,
            securityGuard: false,
            maid: false,
            parking: false,
            laundry: false,
            powerBackup: false,
            cctv: false,
          },
          roomTypes: {
            single: false,
            double: false,
            triple: false,
            dormitory: false,
          },
          pics: [''],
          coverPhoto: '',
          facilityPhotos: [''],
        });
        setValidationErrors({});
      }
    } catch (error) {
      console.error('Create property error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Add New Property</h2>
          <p className="text-green-100 text-sm mt-1">
            Create a new property listing with images and details
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Property Information
            </h3>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Property Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={isSubmitting || loading}
                className={`block w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 transition-colors ${
                  validationErrors.title
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
                placeholder="Enter property title"
              />
              {validationErrors.title && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                disabled={isSubmitting || loading}
                className={`block w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 transition-colors ${
                  validationErrors.description
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
                placeholder="Describe the property..."
              />
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  disabled={isSubmitting || loading}
                  className={`block w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 transition-colors ${
                    validationErrors.price
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                  }`}
                  placeholder="0"
                />
                {validationErrors.price && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.price}</p>
                )}
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={isSubmitting || loading}
                  className={`block w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 transition-colors ${
                    validationErrors.location
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                  }`}
                  placeholder="Enter location"
                />
                {validationErrors.location && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.location}</p>
                )}
              </div>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Amenities Available
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { key: 'ac', label: 'Air Conditioning', icon: '❄️' },
                { key: 'wifi', label: 'WiFi', icon: '📶' },
                { key: 'ro', label: 'RO Water', icon: '💧' },
                { key: 'mess', label: 'Mess Facility', icon: '🍽️' },
                { key: 'securityGuard', label: 'Security Guard', icon: '🛡️' },
                { key: 'maid', label: 'Maid Service', icon: '🧹' },
                { key: 'parking', label: 'Parking', icon: '🅿️' },
                { key: 'laundry', label: 'Laundry', icon: '👕' },
                { key: 'powerBackup', label: 'Power Backup', icon: '🔋' },
                { key: 'cctv', label: 'CCTV Security', icon: '📹' },
              ].map((amenity) => (
                <label
                  key={amenity.key}
                  className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.amenities[amenity.key as keyof PropertyFormData['amenities']]
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.amenities[amenity.key as keyof PropertyFormData['amenities']]}
                    onChange={() => handleAmenityChange(amenity.key as keyof PropertyFormData['amenities'])}
                    disabled={isSubmitting || loading}
                    className="sr-only"
                  />
                  <div className="flex flex-col items-center text-center">
                    <span className="text-2xl mb-1">{amenity.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{amenity.label}</span>
                  </div>
                  {formData.amenities[amenity.key as keyof PropertyFormData['amenities']] && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Room Types Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Room Types Available
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { key: 'single', label: 'Single Room', icon: '🛏️', description: 'Single occupancy' },
                { key: 'double', label: 'Double Room', icon: '🛏️🛏️', description: 'Double occupancy' },
                { key: 'triple', label: 'Triple Room', icon: '🛏️🛏️🛏️', description: 'Triple occupancy' },
                { key: 'dormitory', label: 'Dormitory', icon: '🏠', description: 'Shared accommodation' },
              ].map((roomType) => (
                <label
                  key={roomType.key}
                  className={`flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all relative ${
                    formData.roomTypes[roomType.key as keyof PropertyFormData['roomTypes']]
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.roomTypes[roomType.key as keyof PropertyFormData['roomTypes']]}
                    onChange={() => handleRoomTypeChange(roomType.key as keyof PropertyFormData['roomTypes'])}
                    disabled={isSubmitting || loading}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-3xl mb-2">{roomType.icon}</div>
                    <h4 className="font-medium text-gray-900">{roomType.label}</h4>
                    <p className="text-sm text-gray-500 mt-1">{roomType.description}</p>
                  </div>
                  {formData.roomTypes[roomType.key as keyof PropertyFormData['roomTypes']] && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Cover Photo Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Cover Photo * <span className="text-sm font-normal text-gray-500">(Main display image)</span>
            </h3>

            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-sm text-green-800">
                📌 <strong>Cover Photo Guidelines:</strong>
              </p>
              <ul className="text-sm text-green-700 mt-2 ml-4 list-disc">
                <li>This will be the main image shown on listings and home page</li>
                <li>Use high-quality exterior or main view of the property</li>
                <li>Should represent the property best</li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <input
                  type="url"
                  value={formData.coverPhoto}
                  onChange={(e) => handleCoverPhotoChange(e.target.value)}
                  disabled={isSubmitting || loading}
                  className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 transition-colors ${
                    validationErrors.coverPhoto
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                  }`}
                  placeholder="https://drive.google.com/file/d/... or direct image URL"
                />
                
                {/* Cover Photo Preview */}
                {formData.coverPhoto && validateImageUrl(formData.coverPhoto) && (
                  <div className="ml-2">
                    <div className="text-xs text-gray-500 mb-1">Cover Photo Preview:</div>
                    <div className="w-48 h-32 border rounded overflow-hidden">
                      <PropertyImage
                        src={formData.coverPhoto}
                        alt="Cover Photo Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
                
                {formData.coverPhoto && !validateImageUrl(formData.coverPhoto) && (
                  <div className="ml-2 text-xs text-red-500">
                    Invalid URL format. Please provide a Google Drive link or direct image URL.
                  </div>
                )}
              </div>
            </div>
            {validationErrors.coverPhoto && (
              <p className="text-sm text-red-600">{validationErrors.coverPhoto}</p>
            )}
          </div>

          {/* Facility Photos Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Facility Photos <span className="text-sm font-normal text-gray-500">(Optional - Interior, amenities, rooms)</span>
              </h3>
              <button
                type="button"
                onClick={addFacilityPhotoField}
                disabled={isSubmitting || loading}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              >
                Add Photo
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-800">
                � <strong>Facility Photos Guidelines:</strong>
              </p>
              <ul className="text-sm text-blue-700 mt-2 ml-4 list-disc">
                <li>Show interior rooms, common areas, amenities</li>
                <li>Multiple photos help users understand the property better</li>
                <li>These will be displayed in the property details gallery</li>
              </ul>
            </div>

            <div className="space-y-3">
              {formData.facilityPhotos.map((photo, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={photo}
                      onChange={(e) => handleFacilityPhotoChange(index, e.target.value)}
                      disabled={isSubmitting || loading}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="https://drive.google.com/file/d/... or direct image URL"
                    />
                    {formData.facilityPhotos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFacilityPhotoField(index)}
                        disabled={isSubmitting || loading}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  {/* Facility Photo Preview */}
                  {photo && validateImageUrl(photo) && (
                    <div className="ml-2">
                      <div className="text-xs text-gray-500 mb-1">Preview:</div>
                      <div className="w-32 h-24 border rounded overflow-hidden">
                        <PropertyImage
                          src={photo}
                          alt={`Facility Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  
                  {photo && !validateImageUrl(photo) && (
                    <div className="ml-2 text-xs text-red-500">
                      Invalid URL format. Please provide a Google Drive link or direct image URL.
                    </div>
                  )}
                </div>
              ))}
            </div>
            {validationErrors.facilityPhotos && (
              <p className="text-sm text-red-600">{validationErrors.facilityPhotos}</p>
            )}
          </div>

          {/* Legacy Image Links (for backward compatibility) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Image Links (Legacy) *
              </h3>
              <button
                type="button"
                onClick={addPicField}
                disabled={isSubmitting || loading}
                className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
              >
                Add Image
              </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-sm text-yellow-800">
                ⚠️ <strong>Note:</strong> This section is for backward compatibility. Please use Cover Photo and Facility Photos sections above for new properties.
              </p>
            </div>

            <div className="space-y-3">
              {formData.pics.map((pic, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={pic}
                      onChange={(e) => handlePicChange(index, e.target.value)}
                      disabled={isSubmitting || loading}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="https://drive.google.com/file/d/..."
                    />
                    {formData.pics.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePicField(index)}
                        disabled={isSubmitting || loading}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  {/* Image Preview */}
                  {pic && validateImageUrl(pic) && (
                    <div className="ml-2">
                      <div className="text-xs text-gray-500 mb-1">Preview:</div>
                      <div className="w-32 h-24 border rounded overflow-hidden">
                        <PropertyImage
                          src={pic}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  
                  {pic && !validateImageUrl(pic) && (
                    <div className="ml-2 text-xs text-red-500">
                      Invalid URL format. Please provide a Google Drive link or direct image URL.
                    </div>
                  )}
                </div>
              ))}
            </div>
            {validationErrors.pics && (
              <p className="text-sm text-red-600">{validationErrors.pics}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  title: '',
                  description: '',
                  price: 0,
                  location: '',
                  amenities: {
                    ac: false,
                    wifi: false,
                    ro: false,
                    mess: false,
                    securityGuard: false,
                    maid: false,
                    parking: false,
                    laundry: false,
                    powerBackup: false,
                    cctv: false,
                  },
                  roomTypes: {
                    single: false,
                    double: false,
                    triple: false,
                    dormitory: false,
                  },
                  pics: [''],
                  coverPhoto: '',
                  facilityPhotos: [''],
                });
                setValidationErrors({});
              }}
              disabled={isSubmitting || loading}
              className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              {isSubmitting || loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Property...
                </>
              ) : (
                'Add Property'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProperty;
// All API calls are already using the imported propertyAPI from services/api.ts
