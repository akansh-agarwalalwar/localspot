import React, { useEffect, useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import StatCard from '../common/StatCard';
import PermissionsBadge from '../common/PermissionsBadge';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Pagination, Property, PropertyFormData } from '../../types';
import PropertyList from '../admin/PropertyList';
import CreateProperty from '../admin/CreateProperty';
import EditProperty from '../admin/EditProperty';
import { propertyAPI } from '../../services/api';

const SubadminDashboard: React.FC = () => {
  const { user, refreshUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'add-property'>('overview');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [creating, setCreating] = useState<boolean>(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [propertyPagination, setPropertyPagination] = useState<Pagination>({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  const fetchProperties = async (page = 1): Promise<void> => {
    if (!user?.permissions.canRead) return;
    
    try {
      setLoading(true);
      // For subadmins, only fetch properties they created
      const params = user?.role === 'subadmin' 
        ? { page, limit: propertyPagination.limit, createdBy: user.id }
        : { page, limit: propertyPagination.limit };
        
      const response = await propertyAPI.getAllPropertiesAdmin(params);
      setProperties(response.data.properties || []);
      setPropertyPagination(response.data.pagination || { page: 1, limit: 12, total: 0, pages: 0 });
    } catch (error) {
      toast.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'properties') {
      fetchProperties();
    }
  }, [activeTab]);

    const handleCreateProperty = async (data: PropertyFormData): Promise<boolean> => {
    if (!user?.permissions.canCreate) {
      toast.error('You do not have permission to create properties');
      return false;
    }

    try {
      setCreating(true);
      await propertyAPI.createProperty(data);
      toast.success('Property created successfully');
      fetchProperties();
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create property';
      toast.error(message);
      return false;
    } finally {
      setCreating(false);
    }
  };

  const handleEditProperty = (property: Property): void => {
    // Check if subadmin owns the property - handle both string ID and User object
    const propertyCreatorId = typeof property.createdBy === 'string' 
      ? property.createdBy 
      : property.createdBy?.id;
      
    if (user?.role === 'subadmin' && propertyCreatorId !== user.id) {
      toast.error('You can only edit properties that you created');
      return;
    }

    if (!user?.permissions.canUpdate) {
      toast.error('You need update permission to edit properties');
      return;
    }

    setEditingProperty(property);
  };

  const handleCloseEdit = (): void => {
    setEditingProperty(null);
  };

  const handleUpdateProperty = async (id: string, data: Partial<PropertyFormData>): Promise<boolean> => {
    // Subadmins can ONLY update properties they created (ownership-based access)
    const property = properties.find(p => p._id === id);
    const propertyCreatorId = typeof property?.createdBy === 'string' 
      ? property.createdBy 
      : property?.createdBy?.id;
      
    const isOwner = propertyCreatorId === user?.id;
    
    if (!isOwner) {
      toast.error('You can only update properties that you created');
      return false;
    }

    if (!user?.permissions.canUpdate) {
      toast.error('You need update permission to modify properties');
      return false;
    }

    try {
      await propertyAPI.updateProperty(id, data);
      toast.success('Property updated successfully');
      fetchProperties();
      setEditingProperty(null); // Close the edit modal
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update property';
      toast.error(message);
      return false;
    }
  };

  const handleDeleteProperty = async (id: string): Promise<void> => {
    // Subadmins can ONLY delete properties they created (ownership-based access)
    const property = properties.find(p => p._id === id);
    const propertyCreatorId = typeof property?.createdBy === 'string' 
      ? property.createdBy 
      : property?.createdBy?.id;
      
    const isOwner = propertyCreatorId === user?.id;
    
    if (!isOwner) {
      toast.error('You can only delete properties that you created');
      return;
    }

    if (!user?.permissions.canDelete) {
      toast.error('You need delete permission to remove properties');
      return;
    }

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
      title="Subadmin Panel"
      subtitle="Manage your assigned properties and content"
    >
      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(['overview', 'properties', user?.permissions.canCreate && 'add-property'] as const).filter(Boolean).map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition border
              ${activeTab === t
                ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                : 'bg-white text-gray-600 hover:text-indigo-600 hover:border-indigo-300 border-gray-200'
              }`}
          >
            {t === 'overview' ? 'Overview' :
             t === 'properties' ? 'Properties' : 'Add Property'}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <StatCard label="Your Role" value={user?.role || '—'} icon="🧩" accent="indigo" />
              <StatCard label="Total Properties" value={propertyPagination.total || '—'} icon="🏠" accent="emerald" />
            </div>

            <section className="bg-white rounded-xl border p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Your Permissions</h3>
                <button
                  onClick={refreshUserProfile}
                  className="text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                >
                  Refresh
                </button>
              </div>
              <PermissionsBadge permissions={user?.permissions || {
                canCreate: false,
                canRead: false,
                canUpdate: false,
                canDelete: false
              }} />
              <p className="mt-4 text-xs text-gray-500">
                Permissions define what actions you can perform. Contact an admin to request changes.
              </p>
            </section>

            {user?.permissions.canCreate && (
              <section className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setActiveTab('add-property')}
                    className="p-4 bg-white border border-green-200 rounded-lg hover:shadow-md transition-all text-left"
                  >
                    <div className="text-green-600 text-2xl mb-2">🏠</div>
                    <h4 className="font-medium text-gray-900">Add Property</h4>
                    <p className="text-sm text-gray-600 mt-1">Create a new property listing</p>
                  </button>
                  <button
                    onClick={() => setActiveTab('properties')}
                    className="p-4 bg-white border border-blue-200 rounded-lg hover:shadow-md transition-all text-left"
                  >
                    <div className="text-blue-600 text-2xl mb-2">📋</div>
                    <h4 className="font-medium text-gray-900">View Properties</h4>
                    <p className="text-sm text-gray-600 mt-1">Manage existing listings</p>
                  </button>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar content */}
          <div className="space-y-6">
            <section className="bg-white rounded-xl border p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Info</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Username</dt>
                  <dd className="font-medium">{user?.username}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Email</dt>
                  <dd className="font-medium">{user?.email}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Last Login</dt>
                  <dd className="font-medium">
                    {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : '—'}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="bg-gradient-to-br from-indigo-600 to-blue-500 rounded-xl p-6 text-white shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-indigo-100 mb-4">
                Reach out to an administrator if you need additional access or support.
              </p>
              <button className="px-4 py-2 rounded-md bg-white/15 backdrop-blur hover:bg-white/25 text-sm font-medium transition">
                Contact Admin
              </button>
            </section>
          </div>
        </div>
      )}

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

      {activeTab === 'add-property' && user?.permissions.canCreate && (
        <CreateProperty onSubmit={handleCreateProperty} loading={creating} />
      )}

      {/* Edit Property Modal */}
      {editingProperty && (
        <EditProperty
          property={editingProperty}
          onUpdate={handleUpdateProperty}
          onClose={handleCloseEdit}
        />
      )}
    </DashboardLayout>
  );
};

export default SubadminDashboard;
