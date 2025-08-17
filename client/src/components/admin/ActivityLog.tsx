import React, { useState, useEffect } from 'react';
import { activityAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { Activity, Pagination, ActivityFilters } from '../../types';

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

  const getStatusBadge = (status: string): JSX.Element => {
    return (
      <span className={`status-badge ${status.toLowerCase()}`}>
        {status}
      </span>
    );
  };

  const getActionBadge = (action: string): JSX.Element => {
    return (
      <span className={`action-badge ${action.toLowerCase()}`}>
        {action}
      </span>
    );
  };

  return (
    <div className="activity-log">
      <h2>Activity Log</h2>
      
      <form onSubmit={handleFilterSubmit} className="filters-form">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Action</label>
            <select
              value={filters.action || ''}
              onChange={(e) => handleFilterChange('action', e.target.value)}
            >
              <option value="">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="READ">Read</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="LOGIN">Login</option>
              <option value="LOGOUT">Logout</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Resource</label>
            <select
              value={filters.resource || ''}
              onChange={(e) => handleFilterChange('resource', e.target.value)}
            >
              <option value="">All Resources</option>
              <option value="USER">User</option>
              <option value="SUBADMIN">Subadmin</option>
              <option value="ACTIVITY">Activity</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Start Date</label>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>End Date</label>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>
        </div>

        <div className="filter-actions">
          <button type="submit">Apply Filters</button>
          <button type="button" onClick={clearFilters}>Clear Filters</button>
        </div>
      </form>

      {loading ? (
        <div className="loading">Loading activities...</div>
      ) : (
        <>
          <div className="activities-table-container">
            <table className="activities-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Action</th>
                  <th>Resource</th>
                  <th>Details</th>
                  <th>Status</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity._id}>
                    <td>
                      <div className="user-info">
                        <div>{typeof activity.userId === 'object' ? activity.userId.username : 'Unknown'}</div>
                        <div className="user-role">
                          {typeof activity.userId === 'object' ? activity.userId.role : ''}
                        </div>
                      </div>
                    </td>
                    <td>{getActionBadge(activity.action)}</td>
                    <td>{activity.resource}</td>
                    <td className="details">{activity.details}</td>
                    <td>{getStatusBadge(activity.status)}</td>
                    <td>{new Date(activity.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              disabled={pagination.page === 1}
              onClick={() => fetchActivities(pagination.page - 1)}
            >
              Previous
            </button>
            <span>
              Page {pagination.page} of {pagination.pages} ({pagination.total} total)
            </span>
            <button
              disabled={pagination.page === pagination.pages}
              onClick={() => fetchActivities(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ActivityLog;
