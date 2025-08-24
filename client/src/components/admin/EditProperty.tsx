import React, { useState, useEffect } from 'react';
import { Property, PropertyFormData, DormitoryMember } from '../../types';
import { validateImageUrl, convertGoogleDriveUrl, getImagePreviewUrl } from '../../utils/imageUtils';
import PropertyImage from '../common/PropertyImage';

interface EditPropertyProps {
  property: Property;
  onUpdate: (id: string, data: Partial<PropertyFormData>) => Promise<boolean>;
  onClose: () => void;
}

const EditProperty: React.FC<EditPropertyProps> = ({ property, onUpdate, onClose }) => {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: property.title || '',
    description: property.description || '',
    price: property.price || 0,
    location: property.location || '',
    amenities: property.amenities || {
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
    roomTypes: property.roomTypes || {
      single: false,
      double: false,
      triple: false,
      dormitory: false,
    },
    pics: property.pics || [''],
    coverPhoto: property.coverPhoto || '',
    facilityPhotos: property.facilityPhotos || [''],
    dormitoryMembers: property.dormitoryMembers || [],
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    // Validate dormitory members if dormitory is selected
    if (formData.roomTypes.dormitory) {
      if (formData.dormitoryMembers.length === 0) {
        errors.dormitoryMembers = 'At least one dormitory member is required when dormitory is selected';
      } else {
        const incompleteMembers = formData.dormitoryMembers.filter(member => 
          !member.fullName.trim() || !member.year.trim() || !member.state.trim() || !member.branch.trim()
        );
        if (incompleteMembers.length > 0) {
          errors.dormitoryMembers = 'Please fill in all details for each dormitory member';
        }
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
    setFormData(prev => {
      const newRoomTypes = {
        ...prev.roomTypes,
        [roomType]: !prev.roomTypes[roomType],
      };
      
      // If dormitory is being selected and there are no members, add one empty member
      if (roomType === 'dormitory' && !prev.roomTypes.dormitory && prev.dormitoryMembers.length === 0) {
        return {
          ...prev,
          roomTypes: newRoomTypes,
          dormitoryMembers: [{ fullName: '', year: '', state: '', branch: '' }],
        };
      }
      
      // If dormitory is being deselected, clear members
      if (roomType === 'dormitory' && prev.roomTypes.dormitory) {
        return {
          ...prev,
          roomTypes: newRoomTypes,
          dormitoryMembers: [],
        };
      }
      
      return {
        ...prev,
        roomTypes: newRoomTypes,
      };
    });
  };

  const handlePicChange = (index: number, value: string): void => {
    const newPics = [...formData.pics];
    newPics[index] = value;
    setFormData(prev => ({
      ...prev,
      pics: newPics,
    }));
    
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

  const handleCoverPhotoChange = (value: string): void => {
    setFormData(prev => ({
      ...prev,
      coverPhoto: value,
    }));
    
    if (validationErrors.coverPhoto) {
      setValidationErrors(prev => ({
        ...prev,
        coverPhoto: '',
      }));
    }
  };

  const handleFacilityPhotoChange = (index: number, value: string): void => {
    const newFacilityPhotos = [...formData.facilityPhotos];
    newFacilityPhotos[index] = value;
    setFormData(prev => ({
      ...prev,
      facilityPhotos: newFacilityPhotos,
    }));
    
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

  // Dormitory member handlers
  const handleDormitoryMemberChange = (index: number, field: keyof DormitoryMember, value: string): void => {
    const newMembers = [...formData.dormitoryMembers];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      dormitoryMembers: newMembers,
    }));
    
    // Clear validation error for dormitory members
    if (validationErrors.dormitoryMembers) {
      setValidationErrors(prev => ({
        ...prev,
        dormitoryMembers: '',
      }));
    }
  };

  const addDormitoryMember = (): void => {
    setFormData(prev => ({
      ...prev,
      dormitoryMembers: [...prev.dormitoryMembers, { fullName: '', year: '', state: '', branch: '' }],
    }));
    
    // Clear validation error for dormitory members
    if (validationErrors.dormitoryMembers) {
      setValidationErrors(prev => ({
        ...prev,
        dormitoryMembers: '',
      }));
    }
  };

  const removeDormitoryMember = (index: number): void => {
    if (formData.dormitoryMembers.length > 0) {
      const newMembers = formData.dormitoryMembers.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        dormitoryMembers: newMembers,
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
      const success = await onUpdate(property._id, formData);
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Error updating property:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Property</h2>
              <p className="text-sm text-gray-600 mt-1">Update property information and settings</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    disabled={isSubmitting}
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
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    💰 Price per Month (₹) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    min="0"
                    step="500"
                    className={`block w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 transition-colors ${
                      validationErrors.price
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                    }`}
                    placeholder="Enter monthly rent"
                  />
                  {validationErrors.price && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.price}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`block w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 transition-colors resize-none ${
                    validationErrors.description
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                  }`}
                  placeholder="Describe the property features, facilities, and other details"
                />
                {validationErrors.description && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
                )}
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
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

            {/* Dormitory Section - Only show if dormitory is selected */}
            {formData.roomTypes.dormitory && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    Dormitory Members <span className="text-sm font-normal text-gray-500">(Current residents)</span>
                  </h3>
                  <button
                    type="button"
                    onClick={addDormitoryMember}
                    disabled={isSubmitting}
                    className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                  >
                    Add Member
                  </button>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <p className="text-sm text-green-800">
                    🏠 <strong>Dormitory Information:</strong>
                  </p>
                  <ul className="text-sm text-green-700 mt-2 ml-4 list-disc">
                    <li>Add details of current members staying in the dormitory</li>
                    <li>This helps potential residents know who they'll be sharing with</li>
                    <li>Include full name, academic year, home state, and branch of study</li>
                  </ul>
                </div>

                {formData.dormitoryMembers.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500 mb-3">No dormitory members added yet</p>
                    <button
                      type="button"
                      onClick={addDormitoryMember}
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Add First Member
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.dormitoryMembers.map((member, index) => (
                      <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">Member {index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeDormitoryMember(index)}
                            disabled={isSubmitting}
                            className="text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              value={member.fullName}
                              onChange={(e) => handleDormitoryMemberChange(index, 'fullName', e.target.value)}
                              disabled={isSubmitting}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              placeholder="Enter full name"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Academic Year *
                            </label>
                            <select
                              value={member.year}
                              onChange={(e) => handleDormitoryMemberChange(index, 'year', e.target.value)}
                              disabled={isSubmitting}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                              <option value="">Select year</option>
                              <option value="1st Year">1st Year</option>
                              <option value="2nd Year">2nd Year</option>
                              <option value="3rd Year">3rd Year</option>
                              <option value="4th Year">4th Year</option>
                              <option value="Final Year">Final Year</option>
                              <option value="Post Graduate">Post Graduate</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Home State *
                            </label>
                            <input
                              type="text"
                              value={member.state}
                              onChange={(e) => handleDormitoryMemberChange(index, 'state', e.target.value)}
                              disabled={isSubmitting}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              placeholder="e.g., Delhi, Punjab, Maharashtra"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Branch of Study *
                            </label>
                            <input
                              type="text"
                              value={member.branch}
                              onChange={(e) => handleDormitoryMemberChange(index, 'branch', e.target.value)}
                              disabled={isSubmitting}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              placeholder="e.g., Computer Science, Mechanical, ECE"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {validationErrors.dormitoryMembers && (
              <p className="text-sm text-red-600">{validationErrors.dormitoryMembers}</p>
            )}

            {/* Cover Photo Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Cover Photo * <span className="text-sm font-normal text-gray-500">(Main display image)</span>
              </h3>

              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <p className="text-sm text-green-800">
                  � <strong>Cover Photo Guidelines:</strong>
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
                    disabled={isSubmitting}
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
                  disabled={isSubmitting}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  Add Photo
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm text-blue-800">
                  📷 <strong>Facility Photos Guidelines:</strong>
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
                        disabled={isSubmitting}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="https://drive.google.com/file/d/... or direct image URL"
                      />
                      {formData.facilityPhotos.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFacilityPhotoField(index)}
                          disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                        disabled={isSubmitting}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="https://drive.google.com/file/d/..."
                      />
                      {formData.pics.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePicField(index)}
                          disabled={isSubmitting}
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

            {/* Form Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? 'Updating...' : 'Update Property'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProperty;
