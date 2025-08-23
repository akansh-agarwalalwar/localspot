import React, { useState } from 'react';
import { GamingZone, User, Pagination } from '../../types';

interface GamingZoneListProps {
  gamingZones: GamingZone[];
  loading: boolean;
  pagination: Pagination;
  currentUser?: User | null;
  onUpdate: (id: string, data: Partial<GamingZone>) => Promise<boolean>;
  onDelete: (id: string) => Promise<void>;
  onPageChange: (page: number) => void;
  onEdit: (gamingZone: GamingZone) => void;
}

const GamingZoneList: React.FC<GamingZoneListProps> = ({
  gamingZones,
  loading,
  pagination,
  currentUser,
  onUpdate,
  onDelete,
  onPageChange,
  onEdit
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredGamingZones = gamingZones.filter(gamingZone => {
    const matchesSearch = gamingZone.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         gamingZone.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && gamingZone.isActive) ||
                         (statusFilter === 'inactive' && !gamingZone.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = async (gamingZone: GamingZone) => {
    await onUpdate(gamingZone._id, { isActive: !gamingZone.isActive });
  };

  if (loading) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
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
          <h2 className="text-xl font-semibold text-gray-900">Gaming Zone Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage gaming zone listings and availability
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {pagination.total} total gaming zones
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">Search gaming zones</label>
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <label htmlFor="status-filter" className="sr-only">Filter by status</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Gaming Zones Grid */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {filteredGamingZones.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No gaming zones found</h3>
            <p className="mt-2 text-sm text-gray-500">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Get started by adding your first gaming zone.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredGamingZones.map((gamingZone) => (
                <div key={gamingZone._id} className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  {/* Gaming Zone Image */}
                  <div className="h-48 bg-gray-200 relative overflow-hidden rounded-t-lg">
                    {gamingZone.coverPhoto ? (
                      <img
                        src={gamingZone.coverPhoto}
                        alt={gamingZone.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-200">
                        <div className="text-center">
                          <svg className="h-12 w-12 text-purple-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                          <span className="text-xs text-purple-500 font-medium">🎮 No Image</span>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${
                        gamingZone.isActive 
                          ? 'bg-green-100/90 text-green-800' 
                          : 'bg-red-100/90 text-red-800'
                      }`}>
                        {gamingZone.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* Gaming Zone Details */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{gamingZone.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">📍 {gamingZone.location}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-purple-600">₹{gamingZone.hourlyPrice}/hr</span>
                        <span className="text-sm text-gray-500">₹{gamingZone.monthlyPrice}/month</span>
                      </div>
                    </div>

                    {/* Amenities with Icons */}
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {gamingZone.amenities.ac && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800 font-medium">
                            ❄️ AC
                          </span>
                        )}
                        {gamingZone.amenities.ps5 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-800 font-medium">
                            🎮 PS5
                          </span>
                        )}
                        {gamingZone.amenities.xbox && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 font-medium">
                            🎯 Xbox
                          </span>
                        )}
                        {gamingZone.amenities.wifi && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800 font-medium">
                            📶 WiFi
                          </span>
                        )}
                        {gamingZone.amenities.parking && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800 font-medium">
                            🅿️ Parking
                          </span>
                        )}
                        {gamingZone.amenities.cctv && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800 font-medium">
                            📹 CCTV
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {new Date(gamingZone.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onEdit(gamingZone)}
                          className="text-xs px-3 py-1 rounded-md bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition-colors font-medium"
                          title={`Edit ${gamingZone.title}`}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleToggleStatus(gamingZone)}
                          className={`text-xs px-3 py-1 rounded-md transition-colors font-medium ${
                            gamingZone.isActive
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-green-50 text-green-600 hover:bg-green-100'
                          }`}
                          title={gamingZone.isActive ? 'Deactivate gaming zone' : 'Activate gaming zone'}
                        >
                          {gamingZone.isActive ? '🔴 Deactivate' : '🟢 Activate'}
                        </button>
                        <button
                          onClick={() => onDelete(gamingZone._id)}
                          className="text-xs px-3 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium"
                          title={`Delete ${gamingZone.title}`}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination - only show if there are multiple pages */}
            {pagination.pages > 1 && (
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
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GamingZoneList;
