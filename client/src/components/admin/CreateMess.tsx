import React, { useState } from 'react';
import { MessFormData } from '../../types';

interface CreateMessProps {
  onSubmit: (data: MessFormData) => Promise<boolean>;
  loading: boolean;
}

const CreateMess: React.FC<CreateMessProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<MessFormData>({
    title: '',
    description: '',
    location: '',
    distanceFromDTU: '',
    images: [''],
    coverPhoto: '',
    timings: {
      breakfast: { available: false, time: '' },
      lunch: { available: false, time: '' },
      dinner: { available: false, time: '' },
      snacks: { available: false, time: '' }
    },
    hasAC: false,
    pricing: {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snacks: 0
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.distanceFromDTU.trim()) newErrors.distanceFromDTU = 'Distance from DTU is required';
    if (!formData.coverPhoto.trim()) newErrors.coverPhoto = 'Cover photo is required';

    const validImages = formData.images.filter(img => img.trim() !== '');
    if (validImages.length === 0) newErrors.images = 'At least one image is required';

    // Check if at least one meal is available
    const hasAvailableMeal = Object.values(formData.timings).some(timing => timing.available);
    if (!hasAvailableMeal) newErrors.timings = 'At least one meal timing must be available';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Filter out empty images
    const cleanedData = {
      ...formData,
      images: formData.images.filter(img => img.trim() !== '')
    };

    const success = await onSubmit(cleanedData);
    if (success) {
      // Reset form
      setFormData({
        title: '',
        description: '',
        location: '',
        distanceFromDTU: '',
        images: [''],
        coverPhoto: '',
        timings: {
          breakfast: { available: false, time: '' },
          lunch: { available: false, time: '' },
          dinner: { available: false, time: '' },
          snacks: { available: false, time: '' }
        },
        hasAC: false,
        pricing: {
          breakfast: 0,
          lunch: 0,
          dinner: 0,
          snacks: 0
        }
      });
      setErrors({});
    }
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const updateImageField = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
  };

  const updateTiming = (meal: keyof MessFormData['timings'], field: 'available' | 'time', value: boolean | string) => {
    setFormData(prev => ({
      ...prev,
      timings: {
        ...prev.timings,
        [meal]: {
          ...prev.timings[meal],
          [field]: value
        }
      }
    }));
  };

  const updatePricing = (meal: keyof MessFormData['pricing'], value: number) => {
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [meal]: value
      }
    }));
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900">Add New Mess</h2>
        <p className="text-sm text-gray-500 mt-1">Create a new mess listing with meal services</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Mess Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter mess name"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.location ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., Sector 7, Rohini"
            />
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="distanceFromDTU" className="block text-sm font-medium text-gray-700 mb-2">
            Distance from DTU *
          </label>
          <input
            type="text"
            id="distanceFromDTU"
            value={formData.distanceFromDTU}
            onChange={(e) => setFormData(prev => ({ ...prev, distanceFromDTU: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.distanceFromDTU ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="e.g., 500 meters, 2 km"
          />
          {errors.distanceFromDTU && <p className="mt-1 text-sm text-red-600">{errors.distanceFromDTU}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Describe the mess, food quality, specialties, etc."
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        {/* AC Facility */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.hasAC}
              onChange={(e) => setFormData(prev => ({ ...prev, hasAC: e.target.checked }))}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Air Conditioned</span>
          </label>
        </div>

        {/* Meal Timings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Meal Timings & Pricing</h3>
          {errors.timings && <p className="mb-3 text-sm text-red-600">{errors.timings}</p>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['breakfast', 'lunch', 'dinner', 'snacks'] as const).map((meal) => (
              <div key={meal} className="border rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    checked={formData.timings[meal].available}
                    onChange={(e) => updateTiming(meal, 'available', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700 capitalize">{meal}</span>
                </div>
                
                {formData.timings[meal].available && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Timing
                      </label>
                      <input
                        type="text"
                        value={formData.timings[meal].time}
                        onChange={(e) => updateTiming(meal, 'time', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="e.g., 8:00 AM - 10:00 AM"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                                                💰 Price (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.pricing[meal]}
                        onChange={(e) => updatePricing(meal, Number(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cover Photo */}
        <div>
          <label htmlFor="coverPhoto" className="block text-sm font-medium text-gray-700 mb-2">
            Cover Photo URL *
          </label>
          <input
            type="url"
            id="coverPhoto"
            value={formData.coverPhoto}
            onChange={(e) => setFormData(prev => ({ ...prev, coverPhoto: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.coverPhoto ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="https://drive.google.com/file/d/..."
          />
          {errors.coverPhoto && <p className="mt-1 text-sm text-red-600">{errors.coverPhoto}</p>}
          <p className="mt-1 text-xs text-gray-500">
            Main image that will be displayed prominently
          </p>
        </div>

        {/* Additional Images */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Additional Images *
            </label>
            <button
              type="button"
              onClick={addImageField}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              + Add Image
            </button>
          </div>
          {errors.images && <p className="mb-3 text-sm text-red-600">{errors.images}</p>}
          
          <div className="space-y-3">
            {formData.images.map((image, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="url"
                  value={image}
                  onChange={(e) => updateImageField(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://drive.google.com/file/d/..."
                />
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Upload images of food, dining area, kitchen, etc.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Mess'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMess;
