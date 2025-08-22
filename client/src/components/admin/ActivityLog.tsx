import React, { useState, useEffect } from 'react';
import { activityAPI } from '../../services/api';
import { toast } from 'sonner';
import { Activity, Pagination, ActivityFilters } from '../../types';
import { 
  User, 
  UserPlus, 
  LogIn, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  MapPin,
  Clock,
  Filter,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Building,
  Settings
} from 'lucide-react';

const ActivityLog: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<ActivityFilters>({
    action: '',
    resource: '',
    userId: '',
    startDate: '',
    endDate: '',
  });
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const fetchActivities = async (page = 1, currentFilters = filters): Promise<void> => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pagination.limit,
        ...currentFilters,
      };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key as keyof typeof params] === '') delete params[key as keyof typeof params];
      });

      const response = await activityAPI.getAllActivities(params);
      setActivities(response.data.activities);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleFilterChange = (field: keyof ActivityFilters, value: string): void => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    fetchActivities(1, filters);
  };

  const clearFilters = (): void => {
    const emptyFilters: ActivityFilters = {
      action: '',
      resource: '',
      userId: '',
      startDate: '',
      endDate: '',
    };
    setFilters(emptyFilters);
    fetchActivities(1, emptyFilters);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return <Plus className="h-4 w-4" />;
      case 'UPDATE': return <Edit className="h-4 w-4" />;
      case 'DELETE': return <Trash2 className="h-4 w-4" />;
      case 'READ': return <Eye className="h-4 w-4" />;
      case 'LOGIN': return <LogIn className="h-4 w-4" />;
      case 'LOGOUT': return <LogOut className="h-4 w-4" />;
      case 'SIGNUP': return <UserPlus className="h-4 w-4" />;
      case 'BOOKING': return <Calendar className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-green-100 text-green-800 border-green-200';
      case 'UPDATE': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DELETE': return 'bg-red-100 text-red-800 border-red-200';
      case 'READ': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'LOGIN': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'LOGOUT': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'SIGNUP': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'BOOKING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    return status === 'SUCCESS' ? 
      <CheckCircle className="h-4 w-4 text-green-600" /> : 
      <XCircle className="h-4 w-4 text-red-600" />;
  };

  const getResourceIcon = (resource: string) => {
    switch (resource) {
      case 'USER': return <User className="h-4 w-4" />;
      case 'SUBADMIN': return <Settings className="h-4 w-4" />;
      case 'PROPERTY': return <Building className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const formatActivityMessage = (activity: Activity) => {
    const username = typeof activity.userId === 'object' ? activity.userId.username : 'Unknown User';
    const userRole = typeof activity.userId === 'object' ? activity.userId.role : '';
    
    switch (activity.action) {
      case 'SIGNUP':
        return `${username} signed up to the platform`;
      case 'LOGIN':
        return `${username} logged into the system`;
      case 'LOGOUT':
        return `${username} logged out`;
      case 'CREATE':
        if (activity.resource === 'SUBADMIN') {
          return `${username} created a new subadmin`;
        } else if (activity.resource === 'PROPERTY') {
          return `${username} listed a new property`;
        }
        return `${username} created a ${activity.resource.toLowerCase()}`;
      case 'DELETE':
        if (activity.resource === 'SUBADMIN') {
          return `${username} removed a subadmin`;
        }
        return `${username} deleted a ${activity.resource.toLowerCase()}`;
      case 'UPDATE':
        return `${username} updated a ${activity.resource.toLowerCase()}`;
      case 'BOOKING':
        return `${username} booked a property`;
      default:
        return activity.details || `${username} performed ${activity.action} on ${activity.resource}`;
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - activityDate.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return activityDate.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Activity Log</h2>
          <p className="text-sm text-gray-500 mt-1">
            Track all system activities and user actions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchActivities(1, filters)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              showFilters 
                ? 'text-indigo-700 bg-indigo-100 border border-indigo-200' 
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <form onSubmit={handleFilterSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
                <select
                  value={filters.action || ''}
                  onChange={(e) => handleFilterChange('action', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Actions</option>
                  <option value="SIGNUP">Sign Up</option>
                  <option value="LOGIN">Login</option>
                  <option value="LOGOUT">Logout</option>
                  <option value="CREATE">Create</option>
                  <option value="UPDATE">Update</option>
                  <option value="DELETE">Delete</option>
                  <option value="BOOKING">Booking</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resource</label>
                <select
                  value={filters.resource || ''}
                  onChange={(e) => handleFilterChange('resource', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Resources</option>
                  <option value="USER">User</option>
                  <option value="SUBADMIN">Subadmin</option>
                  <option value="PROPERTY">Property</option>
                  <option value="BOOKING">Booking</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <Search className="h-4 w-4" />
                Apply Filters
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Clear All
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Activities</p>
              <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserPlus className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">User Signups</p>
              <p className="text-2xl font-bold text-gray-900">
                {activities.filter(a => a.action === 'SIGNUP').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Building className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Properties Listed</p>
              <p className="text-2xl font-bold text-gray-900">
                {activities.filter(a => a.action === 'CREATE' && a.resource === 'PROPERTY').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Bookings</p>
              <p className="text-2xl font-bold text-gray-900">
                {activities.filter(a => a.action === 'BOOKING').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="w-20 h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No activities found</h3>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your search criteria or check back later.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {activities.map((activity) => (
              <div key={activity._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg border ${getActionColor(activity.action)}`}>
                    {getActionIcon(activity.action)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-900">
                        {formatActivityMessage(activity)}
                      </p>
                      {getStatusIcon(activity.status)}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        {getResourceIcon(activity.resource)}
                        {activity.resource}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {getTimeAgo(activity.createdAt)}
                      </span>
                      {activity.ipAddress && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {activity.ipAddress}
                        </span>
                      )}
                    </div>
                    
                    {activity.details && activity.details !== formatActivityMessage(activity) && (
                      <p className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                        {activity.details}
                      </p>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xs text-gray-500">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(activity.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && activities.length > 0 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <span>
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} activities
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  disabled={pagination.page === 1}
                  onClick={() => fetchActivities(pagination.page - 1)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  disabled={pagination.page === pagination.pages}
                  onClick={() => fetchActivities(pagination.page + 1)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
