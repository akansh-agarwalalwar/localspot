import React, { useState } from 'react';
import { Mess, Pagination, MessFormData, User } from '../../types';
import { extractGoogleDriveFileId } from '../../utils/imageUtils';
import PropertyImage from '../common/PropertyImage';
import MessAmenities from '../common/MessAmenities';

interface MessListProps {
  messes: Mess[];
  loading: boolean;
  pagination: Pagination;
  currentUser?: User | null;
  onUpdate: (id: string, data: Partial<MessFormData>) => Promise<boolean>;
  onDelete: (id: string) => Promise<void>;
  onPageChange: (page: number) => Promise<void>;
  onEdit?: (mess: Mess) => void;
}

const MessList: React.FC<MessListProps> = ({ 
  messes, 
  loading, 
  pagination, 
  currentUser,
  onUpdate, 
  onDelete, 
  onPageChange,
  onEdit 
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Helper function to check if user can edit/delete a mess
  const canModifyMess = (mess: Mess, action: 'update' | 'delete') => {
    if (!currentUser) return false;
    
    // Admin can modify any mess (if they have the permission)
    if (currentUser.role === 'admin') {
      return action === 'update' 
        ? currentUser.permissions.canUpdate 
        : currentUser.permissions.canDelete;
    }
    
    // For subadmins - they can modify if they have the permission
    // The ownership check will be enforced on the backend
    const hasPermission = action === 'update' 
      ? currentUser.permissions.canUpdate 
      : currentUser.permissions.canDelete;
    
    return hasPermission;
  };

  const filteredMesses = messes.filter(mess => {
    const matchesSearch = mess.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mess.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && mess.isActive) ||
                         (statusFilter === 'inactive' && !mess.isActive);
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-xl border shadow-sm p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Mess Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage mess listings and meal services
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {pagination.total} total messes
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">Search messes</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="search"
                type="text"
                placeholder="Search by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <label htmlFor="status-filter" className="sr-only">Filter by status</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messes Grid */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {filteredMesses.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h4M9 21v-9a2 2 0 012-2h2a2 2 0 012 2v9" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No messes found</h3>
            <p className="mt-2 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Get started by adding your first mess.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredMesses.map((mess) => (
                <div key={mess._id} className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  {/* Mess Image */}
                  <div className="h-48 bg-gray-200 relative overflow-hidden rounded-t-lg">
                    {mess.coverPhoto ? (
                      <PropertyImage 
                        src={mess.coverPhoto} 
                        alt={mess.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <div className="text-center">
                          <svg className="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs text-gray-500">No Image</span>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${
                        mess.isActive 
                          ? 'bg-green-100/90 text-green-800' 
                          : 'bg-red-100/90 text-red-800'
                      }`}>
                        {mess.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {mess.hasAC && (
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100/90 text-blue-800 backdrop-blur-sm">
                          ❄️ AC
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Mess Details */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{mess.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{mess.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-500">{mess.location}</span>
                      <span className="text-xs text-gray-400">{mess.distanceFromDTU} from DTU</span>
                    </div>

                    {/* Available Meals */}
                    <div className="mb-3">
                      <MessAmenities 
                        mess={mess} 
                        compact={true} 
                        className="text-xs"
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {new Date(mess.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            const imageUrl = mess.coverPhoto;
                            if (imageUrl) {
                              const fileId = extractGoogleDriveFileId(imageUrl);
                              if (fileId) {
                                window.open(`https://drive.google.com/uc?export=view&id=${fileId}`, '_blank');
                              } else {
                                window.open(imageUrl, '_blank');
                              }
                            }
                          }}
                          disabled={!mess.coverPhoto}
                          className="text-xs px-3 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-50 transition-colors font-medium"
                          title="View full image with direct URL"
                        >
                          🔗 View Direct
                        </button>
                        <button
                          onClick={() => {
                            const imageUrl = mess.coverPhoto;
                            if (imageUrl) {
                              const fileId = extractGoogleDriveFileId(imageUrl);
                              if (fileId) {
                                window.open(`https://drive.google.com/file/d/${fileId}/view`, '_blank');
                              } else {
                                window.open(imageUrl, '_blank');
                              }
                            }
                          }}
                          disabled={!mess.coverPhoto}
                          className="text-xs px-2 py-1 rounded-md bg-green-50 text-green-600 hover:bg-green-100 disabled:opacity-50 transition-colors"
                          title="Open in Google Drive"
                        >
                          📁
                        </button>
                        {canModifyMess(mess, 'update') && (
                          <button
                            onClick={() => onEdit?.(mess)}
                            className="text-xs px-3 py-1 rounded-md bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition-colors font-medium"
                            title={`Edit ${mess.title}`}
                          >
                            ✏️ Edit
                          </button>
                        )}
                        {canModifyMess(mess, 'delete') && (
                          <button
                            onClick={() => onDelete(mess._id)}
                            className="text-xs px-3 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium"
                            title={`Delete ${mess.title}`}
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 px-6 py-3 border-t">
              <div className="flex items-center justify-between">
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
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MessList;
