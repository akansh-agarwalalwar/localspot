import React, { useState } from 'react';
import { Property, Pagination, PropertyFormData, User } from '../../types';
import { extractGoogleDriveFileId } from '../../utils/imageUtils';
import PropertyImage from '../common/PropertyImage';
import DormitoryMembersManager from './DormitoryMembersManager';

interface DormitoryListProps {
  properties: Property[];
  loading: boolean;
  pagination: Pagination;
  currentUser?: User | null;
  onUpdate: (id: string, data: Partial<PropertyFormData>) => Promise<boolean>;
  onDelete: (id: string) => Promise<void>;
  onPageChange: (page: number) => Promise<void>;
  onEdit?: (property: Property) => void;
}

const DormitoryList: React.FC<DormitoryListProps> = ({
  properties,
  loading,
  pagination,
  currentUser,
  onUpdate,
  onDelete,
  onPageChange,
  onEdit
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Filter properties to show only dormitories
  const dormitoryProperties = properties.filter(property => 
    property.roomTypes?.dormitory === true
  );

  // Further filter by search term
  const filteredProperties = dormitoryProperties.filter(property =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function to check if user can edit/delete a property
  const canModifyProperty = (property: Property, action: 'update' | 'delete') => {
    if (!currentUser) return false;
    
    // Admin can modify any property (if they have the permission)
    if (currentUser.role === 'admin') {
      return action === 'update' ? currentUser.permissions.canUpdate : currentUser.permissions.canDelete;
    }
    
    // Subadmin can only modify properties they created (if they have the permission)
    if (currentUser.role === 'subadmin') {
      const isOwner = typeof property.createdBy === 'string' 
        ? property.createdBy === currentUser.id 
        : property.createdBy.id === currentUser.id;
      
      if (!isOwner) return false;
      
      return action === 'update' ? currentUser.permissions.canUpdate : currentUser.permissions.canDelete;
    }
    
    return false;
  };

  const handleMembersUpdate = async (propertyId: string, members: any[]) => {
    setIsUpdating(true);
    try {
      const success = await onUpdate(propertyId, { dormitoryMembers: members });
      if (success && selectedProperty) {
        // Update the selected property with new members
        setSelectedProperty({
          ...selectedProperty,
          dormitoryMembers: members
        });
      }
    } catch (error) {
      console.error('Failed to update dormitory members:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border rounded-lg p-6">
              <div className="flex space-x-4">
                <div className="w-24 h-24 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Dormitory Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage dormitory properties and their residents
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {filteredProperties.length} dormitory properties found
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">Search dormitories</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="search"
                type="text"
                placeholder="Search dormitories by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dormitory Properties List */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-purple-400 text-6xl mb-4">🏠</div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No dormitory properties found</h3>
            <p className="mt-2 text-sm text-gray-500">
              {searchTerm 
                ? 'Try adjusting your search criteria.' 
                : 'Create properties with dormitory room type to manage residents.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredProperties.map((property) => (
              <div key={property._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  {/* Property Image */}
                  <div className="w-24 h-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                    {(property.coverPhoto || (property.pics && property.pics.length > 0)) ? (
                      <PropertyImage 
                        src={property.coverPhoto || property.pics[0]} 
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200">
                        <span className="text-purple-400 text-2xl">🏠</span>
                      </div>
                    )}
                  </div>

                  {/* Property Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{property.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{property.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span>📍 {property.location}</span>
                          <span>💰 ₹{property.price}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            property.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {property.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        {/* Dormitory Members Summary */}
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-purple-600 font-medium">
                            👥 {property.dormitoryMembers?.length || 0} Current Residents
                          </span>
                          {property.dormitoryMembers && property.dormitoryMembers.length > 0 && (
                            <div className="flex gap-1">
                              {property.dormitoryMembers.slice(0, 3).map((member, index) => (
                                <span 
                                  key={index}
                                  className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-medium text-purple-600"
                                  title={member.fullName}
                                >
                                  {member.fullName.charAt(0)}
                                </span>
                              ))}
                              {property.dormitoryMembers.length > 3 && (
                                <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                                  +{property.dormitoryMembers.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => setSelectedProperty(property)}
                          className="px-3 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors text-sm font-medium"
                        >
                          👥 Manage Residents
                        </button>
                        {canModifyProperty(property, 'update') && onEdit && (
                          <button
                            onClick={() => onEdit(property)}
                            className="px-3 py-2 bg-yellow-50 text-yellow-700 rounded-md hover:bg-yellow-100 transition-colors text-sm font-medium"
                          >
                            ✏️ Edit Property
                          </button>
                        )}
                        {canModifyProperty(property, 'delete') && (
                          <button
                            onClick={() => onDelete(property._id)}
                            className="px-3 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors text-sm font-medium"
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dormitory Members Management Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedProperty.title}</h2>
                <p className="text-sm text-gray-500">📍 {selectedProperty.location}</p>
              </div>
              <button
                onClick={() => setSelectedProperty(null)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <DormitoryMembersManager
              members={selectedProperty.dormitoryMembers || []}
              onMembersChange={(members) => handleMembersUpdate(selectedProperty._id, members)}
              propertyTitle={selectedProperty.title}
              disabled={isUpdating || !canModifyProperty(selectedProperty, 'update')}
            />

            {isUpdating && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">🔄 Updating dormitory members...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
          <div className="flex items-center text-sm text-gray-500">
            <span>
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              disabled={pagination.page === 1}
              onClick={() => onPageChange(pagination.page - 1)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              disabled={pagination.page === pagination.pages}
              onClick={() => onPageChange(pagination.page + 1)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DormitoryList;
