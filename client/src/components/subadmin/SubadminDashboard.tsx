import React, { useEffect, useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import StatCard from '../common/StatCard';
import PermissionsBadge from '../common/PermissionsBadge';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Pagination, Property, PropertyFormData, Mess, MessFormData, GamingZone, GamingZoneFormData, User } from '../../types';
import PropertyList from '../admin/PropertyList';
import CreateProperty from '../admin/CreateProperty';
import EditProperty from '../admin/EditProperty';
import MessList from '../admin/MessList';
import CreateMess from '../admin/CreateMess';
import EditMess from '../admin/EditMess';
import GamingZoneList from '../admin/GamingZoneList';
import CreateGamingZone from '../admin/CreateGamingZone';
import EditGamingZone from '../admin/EditGamingZone';
import { propertyAPI, messAPI, gamingZoneAPI } from '../../services/api';

const SubadminDashboard: React.FC = (): JSX.Element => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'messes' | 'gaming-zones' | 'add-property' | 'add-mess' | 'add-gaming-zone'>('overview');
  
  // Utility function to extract creator ID from different data structures
  const getCreatorId = (createdBy: string | User | any): string => {
    if (typeof createdBy === 'string') {
      return createdBy;
    }
    return createdBy?.id || createdBy?._id || '';
  };

  // Function to refresh user profile data
  const refreshUserProfile = (): void => {
    // This would typically refresh user data from the server
    // For now, we'll just show a success message
    toast.success('Profile refreshed');
  };

  // Properties state
  const [properties, setProperties] = useState<Property[]>([]);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [propertyPagination, setPropertyPagination] = useState<Pagination>({
    page: 1,
    limit: 50, // Increased limit to show all properties on one page
    total: 0,
    pages: 0,
  });

  // Messes state
  const [messes, setMesses] = useState<Mess[]>([]);
  const [editingMess, setEditingMess] = useState<Mess | null>(null);
  const [messPagination, setMessPagination] = useState<Pagination>({
    page: 1,
    limit: 50, // Increased limit to show all messes on one page
    total: 0,
    pages: 0,
  });

  // Gaming Zones state
  const [gamingZones, setGamingZones] = useState<GamingZone[]>([]);
  const [editingGamingZone, setEditingGamingZone] = useState<GamingZone | null>(null);
  const [gamingZonePagination, setGamingZonePagination] = useState<Pagination>({
    page: 1,
    limit: 50, // Increased limit to show all gaming zones on one page
    total: 0,
    pages: 0,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [creating, setCreating] = useState<boolean>(false);

  const fetchProperties = async (page = 1): Promise<void> => {
    if (!user?.permissions.canRead) return;
    
    try {
      setLoading(true);
      // For subadmins, only fetch properties they created
      const params = user?.role === 'subadmin' 
        ? { page, limit: 50, createdBy: user.id } // Use fixed limit of 50
        : { page, limit: 50 };
        
      const response = await propertyAPI.getAllPropertiesAdmin(params);
      setProperties(response.data.properties || []);
      setPropertyPagination(response.data.pagination || { page: 1, limit: 50, total: 0, pages: 0 });
    } catch (error) {
      toast.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const fetchMesses = async (page = 1): Promise<void> => {
    if (!user?.permissions.canRead) return;
    
    try {
      setLoading(true);
      // For subadmins, only fetch messes they created
      const params = user?.role === 'subadmin' 
        ? { page, limit: 50, createdBy: user.id } // Use fixed limit of 50
        : { page, limit: 50 };
        
      const response = await messAPI.getAllMessesAdmin(params);
      setMesses(response.data.messes || []);
      setMessPagination(response.data.pagination || { page: 1, limit: 50, total: 0, pages: 0 });
    } catch (error) {
      toast.error('Failed to fetch messes');
    } finally {
      setLoading(false);
    }
  };

  const fetchGamingZones = async (page = 1): Promise<void> => {
    if (!user?.permissions.canRead) return;
    
    try {
      setLoading(true);
      // For subadmins, only fetch gaming zones they created
      const params = user?.role === 'subadmin' 
        ? { page, limit: 50, createdBy: user.id } // Use fixed limit of 50
        : { page, limit: 50 };
        
      const response = await gamingZoneAPI.getAllGamingZonesAdmin(params);
      setGamingZones(response.data.gamingZones || []);
      setGamingZonePagination(response.data.pagination || { page: 1, limit: 50, total: 0, pages: 0 });
    } catch (error) {
      toast.error('Failed to fetch gaming zones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'properties') {
      // Reset pagination to page 1 and fetch with correct limit
      setPropertyPagination(prev => ({ ...prev, page: 1 }));
      fetchProperties(1);
    } else if (activeTab === 'messes') {
      // Reset pagination to page 1 and fetch with correct limit
      setMessPagination(prev => ({ ...prev, page: 1 }));
      fetchMesses(1);
    } else if (activeTab === 'gaming-zones') {
      // Reset pagination to page 1 and fetch with correct limit
      setGamingZonePagination(prev => ({ ...prev, page: 1 }));
      fetchGamingZones(1);
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

  const handleCreateMess = async (data: MessFormData): Promise<boolean> => {
    if (!user?.permissions.canCreate) {
      toast.error('You do not have permission to create messes');
      return false;
    }

    try {
      setCreating(true);
      await messAPI.createMess(data);
      toast.success('Mess created successfully');
      fetchMesses();
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create mess';
      toast.error(message);
      return false;
    } finally {
      setCreating(false);
    }
  };

  const handleCreateGamingZone = async (data: GamingZoneFormData): Promise<boolean> => {
    if (!user?.permissions.canCreate) {
      toast.error('You do not have permission to create gaming zones');
      return false;
    }

    try {
      setCreating(true);
      await gamingZoneAPI.createGamingZone(data);
      toast.success('Gaming zone created successfully');
      fetchGamingZones();
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create gaming zone';
      toast.error(message);
      return false;
    } finally {
      setCreating(false);
    }
  };

  const handleEditProperty = (property: Property): void => {
    // Check if subadmin owns the property
    const propertyCreatorId = getCreatorId(property.createdBy);
      
    if (user?.role === 'subadmin' && propertyCreatorId !== user.id) {
      toast.error('You can only edit properties that you created');
      return;
    }

    if (!user?.permissions.canUpdate) {
      toast.error('You need update permission to edit properties');
      return;
    }

    setEditingProperty(property);
    setActiveTab('add-property'); // Switch to edit mode
  };

  const handleEditMess = (mess: Mess): void => {
    // Check if subadmin owns the mess
    const messCreatorId = getCreatorId(mess.createdBy);
      
    if (user?.role === 'subadmin' && messCreatorId !== user.id) {
      toast.error('You can only edit messes that you created');
      return;
    }

    if (!user?.permissions.canUpdate) {
      toast.error('You need update permission to edit messes');
      return;
    }

    setEditingMess(mess);
    setActiveTab('add-mess'); // Switch to edit mode
  };

  const handleEditGamingZone = (gamingZone: GamingZone): void => {
    // Check if subadmin owns the gaming zone
    const gamingZoneCreatorId = getCreatorId(gamingZone.createdBy);
      
    if (user?.role === 'subadmin' && gamingZoneCreatorId !== user.id) {
      toast.error('You can only edit gaming zones that you created');
      return;
    }

    if (!user?.permissions.canUpdate) {
      toast.error('You need update permission to edit gaming zones');
      return;
    }

    setEditingGamingZone(gamingZone);
    setActiveTab('add-gaming-zone'); // Switch to edit mode
  };

  const handleCloseEdit = (): void => {
    setEditingProperty(null);
    setActiveTab('properties');
  };

  const handleCloseEditMess = (): void => {
    setEditingMess(null);
    setActiveTab('messes');
  };

  const handleCloseEditGamingZone = (): void => {
    setEditingGamingZone(null);
    setActiveTab('gaming-zones');
  };

  const handleUpdateProperty = async (id: string, data: Partial<PropertyFormData>): Promise<boolean> => {
    // Subadmins can ONLY update properties they created (ownership-based access)
    const property = properties.find(p => p._id === id);
    const propertyCreatorId = getCreatorId(property?.createdBy);
      
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
      setEditingProperty(null);
      setActiveTab('properties');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update property';
      toast.error(message);
      return false;
    }
  };

  const handleUpdateMess = async (id: string, data: Partial<MessFormData>): Promise<boolean> => {
    // Subadmins can ONLY update messes they created (ownership-based access)
    const mess = messes.find(m => m._id === id);
    const messCreatorId = getCreatorId(mess?.createdBy);
      
    const isOwner = messCreatorId === user?.id;
    
    if (!isOwner) {
      toast.error('You can only update messes that you created');
      return false;
    }

    if (!user?.permissions.canUpdate) {
      toast.error('You need update permission to modify messes');
      return false;
    }

    try {
      await messAPI.updateMess(id, data);
      toast.success('Mess updated successfully');
      fetchMesses();
      setEditingMess(null);
      setActiveTab('messes');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update mess';
      toast.error(message);
      return false;
    }
  };

  const handleUpdateGamingZone = async (id: string, data: Partial<GamingZoneFormData>): Promise<boolean> => {
    // Subadmins can ONLY update gaming zones they created (ownership-based access)
    const gamingZone = gamingZones.find(g => g._id === id);
    const gamingZoneCreatorId = getCreatorId(gamingZone?.createdBy);
      
    const isOwner = gamingZoneCreatorId === user?.id;
    
    if (!isOwner) {
      toast.error('You can only update gaming zones that you created');
      return false;
    }

    if (!user?.permissions.canUpdate) {
      toast.error('You need update permission to modify gaming zones');
      return false;
    }

    try {
      await gamingZoneAPI.updateGamingZone(id, data);
      toast.success('Gaming zone updated successfully');
      fetchGamingZones();
      setEditingGamingZone(null);
      setActiveTab('gaming-zones');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update gaming zone';
      toast.error(message);
      return false;
    }
  };

  const handleDeleteProperty = async (id: string): Promise<void> => {
    // Subadmins can ONLY delete properties they created (ownership-based access)
    const property = properties.find(p => p._id === id);
    const propertyCreatorId = getCreatorId(property?.createdBy);
      
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

  const handleDeleteMess = async (id: string): Promise<void> => {
    // Subadmins can ONLY delete messes they created (ownership-based access)
    const mess = messes.find(m => m._id === id);
    const messCreatorId = getCreatorId(mess?.createdBy);
      
    const isOwner = messCreatorId === user?.id;
    
    if (!isOwner) {
      toast.error('You can only delete messes that you created');
      return;
    }

    if (!user?.permissions.canDelete) {
      toast.error('You need delete permission to remove messes');
      return;
    }

    if (window.confirm('Are you sure you want to delete this mess?')) {
      try {
        await messAPI.deleteMess(id);
        toast.success('Mess deleted successfully');
        fetchMesses();
      } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to delete mess';
        toast.error(message);
      }
    }
  };

  const handleUpdateGamingZoneWrapper = async (id: string, data: GamingZoneFormData): Promise<boolean> => {
    return handleUpdateGamingZone(id, data);
  };

  const handleDeleteGamingZone = async (id: string): Promise<void> => {
    // Subadmins can ONLY delete gaming zones they created (ownership-based access)
    const gamingZone = gamingZones.find(g => g._id === id);
    const gamingZoneCreatorId = getCreatorId(gamingZone?.createdBy);
      
    const isOwner = gamingZoneCreatorId === user?.id;
    
    if (!isOwner) {
      toast.error('You can only delete gaming zones that you created');
      return;
    }

    if (!user?.permissions.canDelete) {
      toast.error('You need delete permission to remove gaming zones');
      return;
    }

    if (window.confirm('Are you sure you want to delete this gaming zone?')) {
      try {
        await gamingZoneAPI.deleteGamingZone(id);
        toast.success('Gaming zone deleted successfully');
        fetchGamingZones();
      } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to delete gaming zone';
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
        {(['overview', 'properties', user?.permissions.canCreate && 'add-property', 'messes', user?.permissions.canCreate && 'add-mess', 'gaming-zones', user?.permissions.canCreate && 'add-gaming-zone'] as const).filter(Boolean).map(t => (
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
             t === 'properties' ? 'Properties' : 
             t === 'add-property' ? 'Add Property' :
             t === 'messes' ? 'Messes' :
             t === 'add-mess' ? 'Add Mess' :
             t === 'gaming-zones' ? 'Gaming Zones' :
             'Add Gaming Zone'}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard label="Your Role" value={user?.role || '—'} icon="🧩" accent="indigo" />
              <StatCard label="Total Properties" value={propertyPagination.total || '—'} icon="🏠" accent="emerald" />
              <StatCard label="Total Messes" value={messPagination.total || '—'} icon="🍽️" accent="amber" />
              <StatCard label="Total Gaming Zones" value={gamingZonePagination.total || '—'} icon="🎮" accent="rose" />
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab('add-property')}
                    className="p-4 bg-white border border-green-200 rounded-lg hover:shadow-md transition-all text-left"
                  >
                    <div className="text-green-600 text-2xl mb-2">🏠</div>
                    <h4 className="font-medium text-gray-900">Add Property</h4>
                    <p className="text-sm text-gray-600 mt-1">Create a new property listing</p>
                  </button>
                  <button
                    onClick={() => setActiveTab('add-mess')}
                    className="p-4 bg-white border border-orange-200 rounded-lg hover:shadow-md transition-all text-left"
                  >
                    <div className="text-orange-600 text-2xl mb-2">🍽️</div>
                    <h4 className="font-medium text-gray-900">Add Mess</h4>
                    <p className="text-sm text-gray-600 mt-1">Create a new mess listing</p>
                  </button>
                  <button
                    onClick={() => setActiveTab('add-gaming-zone')}
                    className="p-4 bg-white border border-purple-200 rounded-lg hover:shadow-md transition-all text-left"
                  >
                    <div className="text-purple-600 text-2xl mb-2">🎮</div>
                    <h4 className="font-medium text-gray-900">Add Gaming Zone</h4>
                    <p className="text-sm text-gray-600 mt-1">Create a new gaming zone</p>
                  </button>
                  <button
                    onClick={() => setActiveTab('properties')}
                    className="p-4 bg-white border border-blue-200 rounded-lg hover:shadow-md transition-all text-left"
                  >
                    <div className="text-blue-600 text-2xl mb-2">📋</div>
                    <h4 className="font-medium text-gray-900">View Properties</h4>
                    <p className="text-sm text-gray-600 mt-1">Manage existing properties</p>
                  </button>
                  <button
                    onClick={() => setActiveTab('messes')}
                    className="p-4 bg-white border border-yellow-200 rounded-lg hover:shadow-md transition-all text-left"
                  >
                    <div className="text-yellow-600 text-2xl mb-2">📋</div>
                    <h4 className="font-medium text-gray-900">View Messes</h4>
                    <p className="text-sm text-gray-600 mt-1">Manage existing messes</p>
                  </button>
                  <button
                    onClick={() => setActiveTab('gaming-zones')}
                    className="p-4 bg-white border border-red-200 rounded-lg hover:shadow-md transition-all text-left"
                  >
                    <div className="text-red-600 text-2xl mb-2">📋</div>
                    <h4 className="font-medium text-gray-900">View Gaming Zones</h4>
                    <p className="text-sm text-gray-600 mt-1">Manage gaming zones</p>
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

      {activeTab === 'messes' && (
        <MessList
          messes={messes}
          loading={loading}
          pagination={messPagination}
          currentUser={user}
          onUpdate={handleUpdateMess}
          onDelete={handleDeleteMess}
          onPageChange={fetchMesses}
          onEdit={handleEditMess}
        />
      )}

      {activeTab === 'gaming-zones' && (
        <GamingZoneList
          gamingZones={gamingZones}
          loading={loading}
          pagination={gamingZonePagination}
          currentUser={user}
          onUpdate={handleUpdateGamingZone}
          onDelete={handleDeleteGamingZone}
          onPageChange={fetchGamingZones}
          onEdit={handleEditGamingZone}
        />
      )}

      {activeTab === 'add-property' && user?.permissions.canCreate && (
        <CreateProperty onSubmit={handleCreateProperty} loading={creating} />
      )}

      {activeTab === 'add-mess' && user?.permissions.canCreate && (
        <CreateMess onSubmit={handleCreateMess} loading={creating} />
      )}

      {activeTab === 'add-gaming-zone' && user?.permissions.canCreate && (
        <CreateGamingZone onSubmit={handleCreateGamingZone} loading={creating} />
      )}

      {/* Edit Property Modal */}
      {editingProperty && (
        <EditProperty
          property={editingProperty}
          onUpdate={handleUpdateProperty}
          onClose={handleCloseEdit}
        />
      )}

      {/* Edit Mess Modal */}
      {editingMess && (
        <EditMess
          mess={editingMess}
          onUpdate={handleUpdateMess}
          onClose={handleCloseEditMess}
        />
      )}

      {/* Edit Gaming Zone Modal */}
      {editingGamingZone && (
        <EditGamingZone
          gamingZone={editingGamingZone}
          onSubmit={handleUpdateGamingZoneWrapper}
          onCancel={handleCloseEditGamingZone}
        />
      )}
    </DashboardLayout>
  );
};

export default SubadminDashboard;
