import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI, propertyAPI } from '../../services/api';
import { toast } from 'sonner';
import { Subadmin, Pagination, SubadminFormData, Property, PropertyFormData } from '../../types';
import DashboardLayout from '../layout/DashboardLayout';
import StatCard from '../common/StatCard';
import SubadminList from './SubadminList';
import CreateSubadmin from './CreateSubadmin';
import PropertyList from './PropertyList';
import CreateProperty from './CreateProperty';
import EditProperty from './EditProperty';
import { API_BASE_URL } from '../../services/api';
const AdminDashboard: React.FC = () => {
  const { user, logout, refreshUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [subadmins, setSubadmins] = useState<Subadmin[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [creating, setCreating] = useState<boolean>(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [propertyPagination, setPropertyPagination] = useState<Pagination>({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  const fetchSubadmins = async (page = 1): Promise<void> => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllSubadmins({ page, limit: pagination.limit });
      setSubadmins(response.data.subadmins);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch subadmins');
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async (page = 1): Promise<void> => {
    try {
      setLoading(true);
      const response = await propertyAPI.getAllPropertiesAdmin({ page, limit: propertyPagination.limit });
      setProperties(response.data.properties || []);
      setPropertyPagination(response.data.pagination || { page: 1, limit: 12, total: 0, pages: 0 });
    } catch (error) {
      toast.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'subadmins') {
      fetchSubadmins();
    } else if (activeTab === 'properties') {
      fetchProperties();
    }
  }, [activeTab]);

  const handleLogout = async () => {
    await logout();
  };

  const handleCreateSubadmin = async (data: SubadminFormData): Promise<boolean> => {
    try {
      setCreating(true);
      await adminAPI.createSubadmin(data);
      toast.success('Subadmin created successfully');
      fetchSubadmins();
      setActiveTab('subadmins'); // Switch to subadmins tab to see the new user
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create subadmin';
      toast.error(message);
      return false;
    } finally {
      setCreating(false);
    }
  };

    const handleUpdateSubadmin = async (id: string, data: Partial<SubadminFormData>): Promise<boolean> => {
    try {
      await adminAPI.updateSubadmin(id, data);
      toast.success('Subadmin updated successfully');
      fetchSubadmins();
      
      // If the updated subadmin is currently logged in, refresh their profile
      if (user && user.id === id) {
        await refreshUserProfile();
        toast.info('Your permissions have been updated');
      }
      
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update subadmin';
      toast.error(message);
      return false;
    }
  };

  const handleDeleteSubadmin = async (id: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this subadmin?')) {
      try {
        await adminAPI.deleteSubadmin(id);
        toast.success('Subadmin deleted successfully');
        fetchSubadmins();
      } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to delete subadmin';
        toast.error(message);
      }
    }
  };

  const handleCreateProperty = async (data: PropertyFormData): Promise<boolean> => {
    try {
      setCreating(true);
      await propertyAPI.createProperty(data);
      toast.success('Property created successfully');
      fetchProperties();
      setActiveTab('properties');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create property';
      toast.error(message);
      return false;
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateProperty = async (id: string, data: Partial<PropertyFormData>): Promise<boolean> => {
    try {
      await propertyAPI.updateProperty(id, data);
      toast.success('Property updated successfully');
      fetchProperties();
      setEditingProperty(null); // Close edit modal after successful update
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update property';
      toast.error(message);
      return false;
    }
  };

  const handleEditProperty = (property: Property): void => {
    setEditingProperty(property);
  };

  const handleDeleteProperty = async (id: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await propertyAPI.deleteProperty(id);
        toast.success('Property deleted successfully');
        fetchProperties();
      } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to delete property';
        toast.error(message);
      }
    }
  };

  return (
    <DashboardLayout
      title="Admin Control Center"
      subtitle="Manage platform users, properties and activities"
    >
      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(['overview','subadmins','create','properties','add-property'] as const).map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition border
              ${activeTab === t
                ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                : 'bg-white text-gray-600 hover:text-indigo-600 hover:border-indigo-300 border-gray-200'
              }`}
          >
            {t === 'overview' ? 'Overview' :
             t === 'subadmins' ? 'Subadmins' :
             t === 'create' ? 'Create Subadmin' :
             t === 'properties' ? 'Properties' :
             t === 'add-property' ? 'Add Property' : 'Activity Log'}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Subadmins" value={pagination.total || '—'} icon="👥" accent="indigo" loading={loading} />
            <StatCard label="Active Subadmins" value={subadmins.filter(s => s.isActive).length} icon="✅" accent="emerald" loading={loading} />
            <StatCard label="Total Properties" value={propertyPagination.total || '—'} icon="🏠" accent="amber" loading={loading} />
            <StatCard label="Total Messes" value={messPagination.total || '—'} icon="🍽️" accent="rose" loading={loading} />
          </div>
          <div className="bg-white/60 backdrop-blur rounded-xl border p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Admin Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <button
                onClick={() => setActiveTab('create')}
                className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left"
              >
                <div className="text-blue-600 text-2xl mb-2">➕</div>
                <h4 className="font-medium text-gray-900">Create Subadmin</h4>
                <p className="text-sm text-gray-600 mt-1">Add a new subadmin user</p>
              </button>
              <button
                onClick={() => setActiveTab('subadmins')}
                className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left"
              >
                <div className="text-green-600 text-2xl mb-2">👥</div>
                <h4 className="font-medium text-gray-900">Manage Users</h4>
                <p className="text-sm text-gray-600 mt-1">View and edit subadmins</p>
              </button>
              <button
                onClick={() => setActiveTab('add-property')}
                className="p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors text-left"
              >
                <div className="text-orange-600 text-2xl mb-2">🏠</div>
                <h4 className="font-medium text-gray-900">Add Property</h4>
                <p className="text-sm text-gray-600 mt-1">Create new property listing</p>
              </button>
              <button
                onClick={() => setActiveTab('properties')}
                className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors text-left"
              >
                <div className="text-yellow-600 text-2xl mb-2">🏘️</div>
                <h4 className="font-medium text-gray-900">Properties</h4>
                <p className="text-sm text-gray-600 mt-1">Manage property listings</p>
              </button>
              <button
                onClick={() => setActiveTab('add-messes')}
                className="p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-left"
              >
                <div className="text-red-600 text-2xl mb-2">🍽️</div>
                <h4 className="font-medium text-gray-900">Add Messes</h4>
                <p className="text-sm text-gray-600 mt-1">Create new mess listing</p>
              </button>
              <button
                onClick={() => setActiveTab('messes')}
                className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-left"
              >
                <div className="text-purple-600 text-2xl mb-2">🏪</div>
                <h4 className="font-medium text-gray-900">Messes</h4>
                <p className="text-sm text-gray-600 mt-1">Manage mess listings</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subadmins Table */}
      {activeTab === 'subadmins' && (
        <SubadminList
          subadmins={subadmins}
          loading={loading}
          pagination={pagination}
          onUpdate={handleUpdateSubadmin}
          onDelete={handleDeleteSubadmin}
          onPageChange={fetchSubadmins}
        />
      )}

      {/* Create Subadmin */}
      {activeTab === 'create' && (
        <CreateSubadmin onSubmit={handleCreateSubadmin} loading={creating} />
      )}

      {/* Properties List */}
      {activeTab === 'properties' && (
        <PropertyList
          properties={properties}
          loading={loading}
          pagination={propertyPagination}
          currentUser={user}
          onUpdate={handleUpdateProperty}
          onDelete={handleDeleteProperty}
          onPageChange={fetchProperties}
          onEdit={handleEditProperty}
        />
      )}

      {/* Add Property */}
      {activeTab === 'add-property' && (
        <CreateProperty onSubmit={handleCreateProperty} loading={creating} />
      )}

      {/* Activity Log Placeholder */}
      {activeTab === 'activities' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Activity Log
            </h3>
            <div className="text-center py-8">
              <p className="text-gray-500">Activity log will be implemented here</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Property Modal */}
      {editingProperty && (
        <EditProperty
          property={editingProperty}
          onUpdate={handleUpdateProperty}
          onClose={() => setEditingProperty(null)}
        />
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;