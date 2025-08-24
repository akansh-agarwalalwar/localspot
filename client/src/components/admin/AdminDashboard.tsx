import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { adminAPI, propertyAPI, messAPI, gamingZoneAPI } from '../../services/api';
import { toast } from 'sonner';
import { Subadmin, Pagination, SubadminFormData, Property, PropertyFormData, Mess, MessFormData, GamingZone, GamingZoneFormData } from '../../types';
import DashboardLayout from '../layout/DashboardLayout';
import StatCard from '../common/StatCard';
import SubadminList from './SubadminList';
import CreateSubadmin from './CreateSubadmin';
import PropertyList from './PropertyList';
import DormitoryList from './DormitoryList';
import CreateProperty from './CreateProperty';
import EditProperty from './EditProperty';
import MessList from './MessList';
import CreateMess from './CreateMess';
import EditMess from './EditMess';
import GamingZoneList from './GamingZoneList';
import CreateGamingZone from './CreateGamingZone';
import EditGamingZone from './EditGamingZone';
import ActivityLog from './ActivityLog';
import UserManagement from './UserManagement';

const AdminDashboard: React.FC = () => {
  const { user, logout, refreshUserProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get initial tab from URL query parameters
  const getInitialTab = () => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');
    return tabParam || 'overview';
  };
  
  const [activeTab, setActiveTab] = useState<string>(getInitialTab());
  const [subadmins, setSubadmins] = useState<Subadmin[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [messes, setMesses] = useState<Mess[]>([]);
  const [gamingZones, setGamingZones] = useState<GamingZone[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [creating, setCreating] = useState<boolean>(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [editingMess, setEditingMess] = useState<Mess | null>(null);
  const [editingGamingZone, setEditingGamingZone] = useState<GamingZone | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [propertyPagination, setPropertyPagination] = useState<Pagination>({
    page: 1,
    limit: 50, // Increased limit to show all properties on one page
    total: 0,
    pages: 0,
  });
  const [messPagination, setMessPagination] = useState<Pagination>({
    page: 1,
    limit: 50, // Increased limit to show all messes on one page
    total: 0,
    pages: 0,
  });
  const [gamingZonePagination, setGamingZonePagination] = useState<Pagination>({
    page: 1,
    limit: 50, // Increased limit to show all gaming zones on one page
    total: 0,
    pages: 0,
  });

  const fetchSubadmins = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllSubadmins({ page: 1, limit: 1000 }); // Large limit to get all subadmins
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
      const response = await propertyAPI.getAllPropertiesAdmin({ page, limit: 50 }); // Use fixed limit of 50
      setProperties(response.data.properties || []);
      setPropertyPagination(response.data.pagination || { page: 1, limit: 50, total: 0, pages: 0 });
    } catch (error) {
      toast.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const fetchMesses = async (page = 1): Promise<void> => {
    try {
      setLoading(true);
      const response = await messAPI.getAllMessesAdmin({ page, limit: 50 }); // Use fixed limit of 50
      setMesses(response.data.messes || []);
      setMessPagination(response.data.pagination || { page: 1, limit: 50, total: 0, pages: 0 });
    } catch (error) {
      toast.error('Failed to fetch messes');
    } finally {
      setLoading(false);
    }
  };

  const fetchGamingZones = async (page = 1): Promise<void> => {
    try {
      setLoading(true);
      const response = await gamingZoneAPI.getAllGamingZonesAdmin({ page, limit: 50 }); // Use fixed limit of 50
      setGamingZones(response.data.gamingZones || []);
      setGamingZonePagination(response.data.pagination || { page: 1, limit: 50, total: 0, pages: 0 });
    } catch (error) {
      toast.error('Failed to fetch gaming zones');
    } finally {
      setLoading(false);
    }
  };

  // Listen for URL changes to update active tab
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    } else {
      setActiveTab('overview');
    }
  }, [location.search]);

  // Fetch overview data for statistics
  const fetchOverviewData = async (): Promise<void> => {
    try {
      setLoading(true);
      // Fetch all data needed for overview statistics
      const [subadminsRes, propertiesRes, messesRes, gamingZonesRes] = await Promise.all([
        adminAPI.getAllSubadmins({ page: 1, limit: 1000 }), // Get all subadmins
        propertyAPI.getAllPropertiesAdmin({ page: 1, limit: 1 }),
        messAPI.getAllMessesAdmin({ page: 1, limit: 1 }),
        gamingZoneAPI.getAllGamingZonesAdmin({ page: 1, limit: 1 }),
      ]);
      
      // Update pagination data for overview stats
      setPagination(subadminsRes.data.pagination || { page: 1, limit: 10, total: 0, pages: 0 });
      setPropertyPagination(propertiesRes.data.pagination || { page: 1, limit: 12, total: 0, pages: 0 });
      setMessPagination(messesRes.data.pagination || { page: 1, limit: 12, total: 0, pages: 0 });
      setGamingZonePagination(gamingZonesRes.data.pagination || { page: 1, limit: 12, total: 0, pages: 0 });
      
      // Store the actual data for active subadmins count
      setSubadmins(subadminsRes.data.subadmins || []);
    } catch (error) {
      toast.error('Failed to fetch overview data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchOverviewData();
    } else if (activeTab === 'subadmins') {
      fetchSubadmins();
    } else if (activeTab === 'properties') {
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

  // Initial data fetch on component mount
  useEffect(() => {
    fetchOverviewData();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  // Function to handle tab changes and update URL
  const handleTabChange = (tab: string) => {
    if (tab === 'overview') {
      navigate('/admin');
    } else {
      navigate(`/admin?tab=${tab}`);
    }
  };

  const handleCreateSubadmin = async (data: SubadminFormData): Promise<boolean> => {
    try {
      setCreating(true);
      await adminAPI.createSubadmin(data);
      toast.success('Subadmin created successfully');
      fetchSubadmins();
      fetchOverviewData(); // Refresh overview stats
      handleTabChange('subadmins'); // Switch to subadmins tab to see the new user
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
        fetchOverviewData(); // Refresh overview stats
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
      fetchOverviewData(); // Refresh overview stats
      handleTabChange('properties');
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
        fetchOverviewData(); // Refresh overview stats
      } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to delete property';
        toast.error(message);
      }
    }
  };

  const handleCreateMess = async (data: MessFormData): Promise<boolean> => {
    try {
      setCreating(true);
      await messAPI.createMess(data);
      toast.success('Mess created successfully');
      fetchMesses();
      fetchOverviewData(); // Refresh overview stats
      handleTabChange('messes');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create mess';
      toast.error(message);
      return false;
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateMess = async (id: string, data: Partial<MessFormData>): Promise<boolean> => {
    try {
      await messAPI.updateMess(id, data);
      toast.success('Mess updated successfully');
      fetchMesses();
      setEditingMess(null); // Close edit modal after successful update
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update mess';
      toast.error(message);
      return false;
    }
  };

  const handleEditMess = (mess: Mess): void => {
    setEditingMess(mess);
  };

  const handleDeleteMess = async (id: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this mess?')) {
      try {
        await messAPI.deleteMess(id);
        toast.success('Mess deleted successfully');
        fetchMesses();
        fetchOverviewData(); // Refresh overview stats
      } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to delete mess';
        toast.error(message);
      }
    }
  };

  const handleCreateGamingZone = async (data: GamingZoneFormData): Promise<boolean> => {
    try {
      setCreating(true);
      await gamingZoneAPI.createGamingZone(data);
      toast.success('Gaming zone created successfully');
      fetchGamingZones();
      fetchOverviewData(); // Refresh overview stats
      handleTabChange('gaming-zones');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create gaming zone';
      toast.error(message);
      return false;
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateGamingZone = async (id: string, data: Partial<GamingZoneFormData>): Promise<boolean> => {
    try {
      await gamingZoneAPI.updateGamingZone(id, data);
      toast.success('Gaming zone updated successfully');
      fetchGamingZones();
      setEditingGamingZone(null);
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update gaming zone';
      toast.error(message);
      return false;
    }
  };

  const handleEditGamingZone = (gamingZone: GamingZone): void => {
    setEditingGamingZone(gamingZone);
  };

  const handleDeleteGamingZone = async (id: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this gaming zone?')) {
      try {
        await gamingZoneAPI.deleteGamingZone(id);
        toast.success('Gaming zone deleted successfully');
        fetchGamingZones();
        fetchOverviewData(); // Refresh overview stats
      } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to delete gaming zone';
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
        {(['overview','users','subadmins','create','properties','dormitories','add-property','messes','add-messes','gaming-zones','add-gaming-zone','activities'] as const).map(t => (
          <button
            key={t}
            onClick={() => handleTabChange(t)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition border
              ${activeTab === t
                ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                : 'bg-white text-gray-600 hover:text-indigo-600 hover:border-indigo-300 border-gray-200'
              }`}
          >
            {t === 'overview' ? 'Overview' :
             t === 'users' ? 'User Management' :
             t === 'subadmins' ? 'Subadmins' :
             t === 'create' ? 'Create Subadmin' :
             t === 'properties' ? 'Properties' :
             t === 'dormitories' ? 'Dormitories' :
             t === 'add-property' ? 'Add Property' :
             t === 'messes' ? 'Messes' :
             t === 'add-messes' ? 'Add Messes' :
             t === 'gaming-zones' ? 'Gaming Zones' :
             t === 'add-gaming-zone' ? 'Add Gaming Zone' : 'Activity Log'}
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
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4 mt-4">
            <StatCard label="Total Gaming Zones" value={gamingZonePagination.total || '—'} icon="🎮" accent="indigo" loading={loading} />
          </div>
          <div className="bg-white/60 backdrop-blur rounded-xl border p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Admin Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <button
                onClick={() => handleTabChange('create')}
                className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left"
              >
                <div className="text-blue-600 text-2xl mb-2">➕</div>
                <h4 className="font-medium text-gray-900">Create Subadmin</h4>
                <p className="text-sm text-gray-600 mt-1">Add a new subadmin user</p>
              </button>
              <button
                onClick={() => handleTabChange('subadmins')}
                className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left"
              >
                <div className="text-green-600 text-2xl mb-2">👥</div>
                <h4 className="font-medium text-gray-900">Manage Users</h4>
                <p className="text-sm text-gray-600 mt-1">View and edit subadmins</p>
              </button>
              <button
                onClick={() => handleTabChange('add-property')}
                className="p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors text-left"
              >
                <div className="text-orange-600 text-2xl mb-2">🏠</div>
                <h4 className="font-medium text-gray-900">Add Property</h4>
                <p className="text-sm text-gray-600 mt-1">Create new property listing</p>
              </button>
              <button
                onClick={() => handleTabChange('properties')}
                className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors text-left"
              >
                <div className="text-yellow-600 text-2xl mb-2">🏘️</div>
                <h4 className="font-medium text-gray-900">Properties</h4>
                <p className="text-sm text-gray-600 mt-1">Manage property listings</p>
              </button>
              <button
                onClick={() => handleTabChange('dormitories')}
                className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-left"
              >
                <div className="text-purple-600 text-2xl mb-2">🏠</div>
                <h4 className="font-medium text-gray-900">Dormitories</h4>
                <p className="text-sm text-gray-600 mt-1">Manage dormitory members</p>
              </button>
              <button
                onClick={() => handleTabChange('add-messes')}
                className="p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-left"
              >
                <div className="text-red-600 text-2xl mb-2">🍽️</div>
                <h4 className="font-medium text-gray-900">Add Messes</h4>
                <p className="text-sm text-gray-600 mt-1">Create new mess listing</p>
              </button>
              <button
                onClick={() => handleTabChange('messes')}
                className="p-4 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors text-left"
              >
                <div className="text-rose-600 text-2xl mb-2">🏪</div>
                <h4 className="font-medium text-gray-900">Messes</h4>
                <p className="text-sm text-gray-600 mt-1">Manage mess listings</p>
              </button>
              <button
                onClick={() => handleTabChange('add-gaming-zone')}
                className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors text-left"
              >
                <div className="text-indigo-600 text-2xl mb-2">🎮</div>
                <h4 className="font-medium text-gray-900">Add Gaming Zone</h4>
                <p className="text-sm text-gray-600 mt-1">Create new gaming zone</p>
              </button>
              <button
                onClick={() => handleTabChange('gaming-zones')}
                className="p-4 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors text-left"
              >
                <div className="text-teal-600 text-2xl mb-2">🕹️</div>
                <h4 className="font-medium text-gray-900">Gaming Zones</h4>
                <p className="text-sm text-gray-600 mt-1">Manage gaming zones</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Management */}
      {activeTab === 'users' && (
        <UserManagement onCreateSubadmin={() => handleTabChange('create')} />
      )}

      {/* Subadmins Table */}
      {activeTab === 'subadmins' && (
        <SubadminList
          subadmins={subadmins}
          loading={loading}
          pagination={pagination}
          onUpdate={handleUpdateSubadmin}
          onDelete={handleDeleteSubadmin}
          showPagination={false} // Disable pagination
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

      {/* Dormitories List */}
      {activeTab === 'dormitories' && (
        <DormitoryList
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

      {/* Messes List */}
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

      {/* Add Messes */}
      {activeTab === 'add-messes' && (
        <CreateMess onSubmit={handleCreateMess} loading={creating} />
      )}

      {/* Gaming Zones List */}
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

      {/* Add Gaming Zone */}
      {activeTab === 'add-gaming-zone' && (
        <CreateGamingZone onSubmit={handleCreateGamingZone} loading={creating} />
      )}

      {/* Activity Log */}
      {activeTab === 'activities' && (
        <ActivityLog />
      )}

      {/* Edit Property Modal */}
      {editingProperty && (
        <EditProperty
          property={editingProperty}
          onUpdate={handleUpdateProperty}
          onClose={() => setEditingProperty(null)}
        />
      )}

      {/* Edit Mess Modal */}
      {editingMess && (
        <EditMess
          mess={editingMess}
          onUpdate={handleUpdateMess}
          onClose={() => setEditingMess(null)}
        />
      )}

      {/* Edit Gaming Zone Modal */}
      {editingGamingZone && (
        <EditGamingZone
          gamingZone={editingGamingZone}
          onSubmit={handleUpdateGamingZone}
          onCancel={() => setEditingGamingZone(null)}
          loading={creating}
        />
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;