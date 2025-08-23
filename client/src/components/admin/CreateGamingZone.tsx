import React, { useState } from 'react';
import { GamingZoneFormData } from '../../types';

interface CreateGamingZoneProps {
  onSubmit: (data: GamingZoneFormData) => Promise<boolean>;
  loading?: boolean;
}

const CreateGamingZone: React.FC<CreateGamingZoneProps> = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState<GamingZoneFormData>({
    title: '',
    description: '',
    location: '',
    monthlyPrice: 0,
    hourlyPrice: 0,
    images: [],
    coverPhoto: '',
    amenities: {
      ac: false,
      gamingConsole: false,
      ps5: false,
      xbox: false,
      wifi: false,
      parking: false,
      powerBackup: false,
      cctv: false,
    },
  });

  const [imageInput, setImageInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Gaming zone title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (formData.monthlyPrice <= 0) {
      newErrors.monthlyPrice = 'Monthly price must be greater than 0';
    }

    if (formData.hourlyPrice <= 0) {
      newErrors.hourlyPrice = 'Hourly price must be greater than 0';
    }

    if (!formData.coverPhoto.trim()) {
      newErrors.coverPhoto = 'Cover photo is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const success = await onSubmit(formData);
    if (success) {
      // Reset form
      setFormData({
        title: '',
        description: '',
        location: '',
        monthlyPrice: 0,
        hourlyPrice: 0,
        images: [],
        coverPhoto: '',
        amenities: {
          ac: false,
          gamingConsole: false,
          ps5: false,
          xbox: false,
          wifi: false,
          parking: false,
          powerBackup: false,
          cctv: false,
        },
      });
      setImageInput('');
      setErrors({});
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAmenityChange = (amenity: keyof GamingZoneFormData['amenities']) => {
    setFormData(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: !prev.amenities[amenity]
      }
    }));
  };

  const addImage = () => {
    if (imageInput.trim() && !formData.images.includes(imageInput.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageInput.trim()]
      }));
      setImageInput('');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Add New Gaming Zone</h2>
          <p className="text-purple-100 text-sm mt-1">
            Create a new gaming zone listing with amenities and pricing
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Gaming Zone Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Gaming Zone Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={`block w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 transition-colors ${
                    errors.title
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                  }`}
                  placeholder="Enter gaming zone name"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
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
                  onChange={handleInputChange}
                  disabled={loading}
                  className={`block w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 transition-colors ${
                    errors.location
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                  }`}
                  placeholder="Enter location"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                )}
              </div>
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
                onChange={handleInputChange}
                disabled={loading}
                className={`block w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 transition-colors ${
                  errors.description
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
                placeholder="Describe the gaming zone, facilities, and features..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="hourlyPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Hourly Price (₹) *
                </label>
                <input
                  type="number"
                  id="hourlyPrice"
                  name="hourlyPrice"
                  min="0"
                  step="1"
                  value={formData.hourlyPrice}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={`block w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 transition-colors ${
                    errors.hourlyPrice
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                  }`}
                  placeholder="100"
                />
                {errors.hourlyPrice && (
                  <p className="mt-1 text-sm text-red-600">{errors.hourlyPrice}</p>
                )}
              </div>

              <div>
                <label htmlFor="monthlyPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Price (₹) *
                </label>
                <input
                  type="number"
                  id="monthlyPrice"
                  name="monthlyPrice"
                  min="0"
                  step="1"
                  value={formData.monthlyPrice}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={`block w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 transition-colors ${
                    errors.monthlyPrice
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                  }`}
                  placeholder="2500"
                />
                {errors.monthlyPrice && (
                  <p className="mt-1 text-sm text-red-600">{errors.monthlyPrice}</p>
                )}
              </div>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Gaming Amenities Available
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { key: 'ac', label: 'Air Conditioning', icon: '❄️' },
                { key: 'gamingConsole', label: 'Gaming Console', icon: '🎮' },
                { key: 'ps5', label: 'PlayStation 5', icon: '🎯' },
                { key: 'xbox', label: 'Xbox', icon: '🎲' },
                { key: 'wifi', label: 'WiFi', icon: '📶' },
                { key: 'parking', label: 'Parking', icon: '🅿️' },
                { key: 'powerBackup', label: 'Power Backup', icon: '🔋' },
                { key: 'cctv', label: 'CCTV Security', icon: '📹' },
              ].map((amenity) => (
                <label
                  key={amenity.key}
                  className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all relative ${
                    formData.amenities[amenity.key as keyof GamingZoneFormData['amenities']]
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.amenities[amenity.key as keyof GamingZoneFormData['amenities']]}
                    onChange={() => handleAmenityChange(amenity.key as keyof GamingZoneFormData['amenities'])}
                    disabled={loading}
                    className="sr-only"
                  />
                  <div className="flex flex-col items-center text-center">
                    <span className="text-2xl mb-1">{amenity.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{amenity.label}</span>
                  </div>
                  {formData.amenities[amenity.key as keyof GamingZoneFormData['amenities']] && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
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

            <div className="bg-purple-50 border border-purple-200 rounded-md p-3">
              <p className="text-sm text-purple-800">
                📌 <strong>Cover Photo Guidelines:</strong>
              </p>
              <ul className="text-sm text-purple-700 mt-2 ml-4 list-disc">
                <li>This will be the main image shown on listings</li>
                <li>Use high-quality image of the gaming setup</li>
                <li>Should showcase the gaming environment</li>
              </ul>
            </div>

            <div>
              <input
                type="url"
                id="coverPhoto"
                name="coverPhoto"
                value={formData.coverPhoto}
                onChange={handleInputChange}
                disabled={loading}
                className={`block w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 transition-colors ${
                  errors.coverPhoto
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
                placeholder="https://example.com/cover-photo.jpg"
              />
              {errors.coverPhoto && (
                <p className="mt-1 text-sm text-red-600">{errors.coverPhoto}</p>
              )}
            </div>
          </div>

          {/* Additional Images Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Additional Images <span className="text-sm font-normal text-gray-500">(Optional - Gallery images)</span>
              </h3>
              <button
                type="button"
                onClick={addImage}
                disabled={loading}
                className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
              >
                Add Image
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-800">
                🎯 <strong>Additional Images Guidelines:</strong>
              </p>
              <ul className="text-sm text-blue-700 mt-2 ml-4 list-disc">
                <li>Show different gaming setups, consoles, and seating areas</li>
                <li>Multiple photos help users understand the gaming environment</li>
                <li>These will be displayed in the gaming zone details gallery</li>
              </ul>
            </div>

            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                disabled={loading}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://example.com/image.jpg"
              />
              <button
                type="button"
                onClick={addImage}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              >
                Add
              </button>
            </div>
            
            {formData.images.length > 0 && (
              <div className="space-y-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm text-gray-600 truncate flex-1 mr-2">{image}</span>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-800 px-2 py-1 text-sm transition-colors"
                    >
                      🗑️ Remove
                    </button>
                  </div>
                ))}
              </div>
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
                  location: '',
                  monthlyPrice: 0,
                  hourlyPrice: 0,
                  images: [],
                  coverPhoto: '',
                  amenities: {
                    ac: false,
                    gamingConsole: false,
                    ps5: false,
                    xbox: false,
                    wifi: false,
                    parking: false,
                    powerBackup: false,
                    cctv: false,
                  },
                });
                setImageInput('');
                setErrors({});
              }}
              disabled={loading}
              className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Gaming Zone...
                </>
              ) : (
                'Create Gaming Zone'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGamingZone;
