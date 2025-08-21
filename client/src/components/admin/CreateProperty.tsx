import React, { useState } from 'react';
import { PropertyFormData } from '../../types';
import { validateImageUrl, convertGoogleDriveUrl, getImagePreviewUrl } from '../../utils/imageUtils';
import PropertyImage from '../common/PropertyImage';

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
    pics: [''],
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
          pics: [''],
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

          {/* Image Links */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Image Links (Google Drive) *
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

            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-800">
                📌 <strong>Supported image sources:</strong>
              </p>
              <ul className="text-sm text-blue-700 mt-2 ml-4 list-disc">
                <li><strong>Google Drive:</strong> Share link and we'll convert it automatically</li>
                <li><strong>Direct images:</strong> URLs ending in .jpg, .png, .gif, etc.</li>
                <li><strong>Image hosts:</strong> Imgur, Cloudinary, AWS S3, etc.</li>
                <li><strong>Any HTTPS URL:</strong> That serves images</li>
              </ul>
              <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-600">
                <strong>Example:</strong> https://drive.google.com/file/d/1jpsSuHz1iS0HXjZMC_h7YG_ZUGhq9dew/view
              </div>
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
                  pics: [''],
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
