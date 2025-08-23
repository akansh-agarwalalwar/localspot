import React, { useState, useEffect } from 'react';
import { GamingZone, GamingZoneFormData } from '../../types';

interface EditGamingZoneProps {
  gamingZone: GamingZone;
  onSubmit: (id: string, data: GamingZoneFormData) => Promise<boolean>;
  onCancel: () => void;
  loading?: boolean;
}

const EditGamingZone: React.FC<EditGamingZoneProps> = ({ 
  gamingZone, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
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

  // Initialize form with gaming zone data
  useEffect(() => {
    if (gamingZone) {
      setFormData({
        title: gamingZone.title || '',
        description: gamingZone.description || '',
        location: gamingZone.location || '',
        monthlyPrice: gamingZone.monthlyPrice || 0,
        hourlyPrice: gamingZone.hourlyPrice || 0,
        images: gamingZone.images || [],
        coverPhoto: gamingZone.coverPhoto || '',
        amenities: {
          ac: gamingZone.amenities?.ac || false,
          gamingConsole: gamingZone.amenities?.gamingConsole || false,
          ps5: gamingZone.amenities?.ps5 || false,
          xbox: gamingZone.amenities?.xbox || false,
          wifi: gamingZone.amenities?.wifi || false,
          parking: gamingZone.amenities?.parking || false,
          powerBackup: gamingZone.amenities?.powerBackup || false,
          cctv: gamingZone.amenities?.cctv || false,
        },
      });
    }
  }, [gamingZone]);

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

    await onSubmit(gamingZone._id, formData);
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
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Edit Gaming Zone
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Gaming Zone Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter gaming zone name"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                  errors.location ? 'border-red-300' : 'border-gray-300'
                } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter location"
              />
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Describe the gaming zone, facilities, and features..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="hourlyPrice" className="block text-sm font-medium text-gray-700">
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
                className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                  errors.hourlyPrice ? 'border-red-300' : 'border-gray-300'
                } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="100"
              />
              {errors.hourlyPrice && <p className="mt-1 text-sm text-red-600">{errors.hourlyPrice}</p>}
            </div>

            <div>
              <label htmlFor="monthlyPrice" className="block text-sm font-medium text-gray-700">
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
                className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                  errors.monthlyPrice ? 'border-red-300' : 'border-gray-300'
                } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="2500"
              />
              {errors.monthlyPrice && <p className="mt-1 text-sm text-red-600">{errors.monthlyPrice}</p>}
            </div>
          </div>

          {/* Cover Photo */}
          <div>
            <label htmlFor="coverPhoto" className="block text-sm font-medium text-gray-700">
              Cover Photo URL *
            </label>
            <input
              type="url"
              id="coverPhoto"
              name="coverPhoto"
              value={formData.coverPhoto}
              onChange={handleInputChange}
              className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                errors.coverPhoto ? 'border-red-300' : 'border-gray-300'
              } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="https://example.com/cover-photo.jpg"
            />
            {errors.coverPhoto && <p className="mt-1 text-sm text-red-600">{errors.coverPhoto}</p>}
          </div>

          {/* Additional Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Images <span className="text-sm font-normal text-gray-500">(Optional)</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://example.com/image.jpg"
              />
              <button
                type="button"
                onClick={addImage}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Add
              </button>
            </div>
            {formData.images.length > 0 && (
              <div className="space-y-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-600 truncate">{image}</span>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Amenities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(formData.amenities).map(([key, value]) => (
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handleAmenityChange(key as keyof GamingZoneFormData['amenities'])}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">
                    {key === 'ac' ? 'AC' :
                     key === 'gamingConsole' ? 'Gaming Console' :
                     key === 'ps5' ? 'PS5' :
                     key === 'xbox' ? 'Xbox' :
                     key === 'wifi' ? 'WiFi' :
                     key === 'powerBackup' ? 'Power Backup' :
                     key === 'cctv' ? 'CCTV' :
                     key}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Gaming Zone'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGamingZone;
