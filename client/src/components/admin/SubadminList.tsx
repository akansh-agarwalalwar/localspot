import React, { useState } from 'react';
import { Subadmin, Pagination, SubadminFormData } from '../../types';

interface SubadminListProps {
  subadmins: Subadmin[];
  loading: boolean;
  pagination: Pagination;
  onUpdate: (id: string, data: Partial<SubadminFormData>) => Promise<boolean>;
  onDelete: (id: string) => Promise<void>;
  onPageChange: (page: number) => Promise<void>;
}

const SubadminList: React.FC<SubadminListProps> = ({ 
  subadmins, 
  loading, 
  pagination, 
  onUpdate, 
  onDelete, 
  onPageChange 
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<SubadminFormData>>({});

  const handleEdit = (subadmin: Subadmin): void => {
    setEditingId(subadmin.id);
    setEditData({
      username: subadmin.username,
      email: subadmin.email,
      isActive: subadmin.isActive,
      permissions: subadmin.permissions,
    });
  };

  const handleSave = async (id: string): Promise<void> => {
    const success = await onUpdate(id, editData);
    if (success) {
      setEditingId(null);
      setEditData({});
    }
  };

  const handleCancel = (): void => {
    setEditingId(null);
    setEditData({});
  };

  const handleInputChange = (field: string, value: string | boolean): void => {
    setEditData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePermissionChange = (permission: string, value: boolean): void => {
    setEditData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: value,
      },
    }));
  };

  if (loading) {
    return <div className="loading">Loading subadmins...</div>;
  }

  return (
    <div className="subadmin-list">
      <h2>Subadmin Management</h2>
      
      {subadmins.length === 0 ? (
        <div className="no-data">No subadmins found</div>
      ) : (
        <>
          <div className="table-container">
            <table className="subadmin-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Permissions</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subadmins.map((subadmin) => (
                  <tr key={subadmin.id}>
                    <td>
                      {editingId === subadmin.id ? (
                        <input
                          type="text"
                          value={editData.username || ''}
                          onChange={(e) => handleInputChange('username', e.target.value)}
                        />
                      ) : (
                        subadmin.username
                      )}
                    </td>
                    <td>
                      {editingId === subadmin.id ? (
                        <input
                          type="email"
                          value={editData.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      ) : (
                        subadmin.email
                      )}
                    </td>
                    <td>
                      {editingId === subadmin.id ? (
                        <select
                          value={editData.isActive?.toString() || 'true'}
                          onChange={(e) => handleInputChange('isActive', e.target.value === 'true')}
                        >
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>
                      ) : (
                        <span className={`status ${subadmin.isActive ? 'active' : 'inactive'}`}>
                          {subadmin.isActive ? 'Active' : 'Inactive'}
                        </span>
                      )}
                    </td>
                    <td>
                      {editingId === subadmin.id ? (
                        <div className="permissions-edit">
                          {Object.entries(editData.permissions || {}).map(([permission, value]) => (
                            <label key={permission}>
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                              />
                              {permission.replace('can', '')}
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div className="permissions">
                          {Object.entries(subadmin.permissions || {})
                            .filter(([, value]) => value)
                            .map(([permission]) => (
                              <span key={permission} className="permission-tag">
                                {permission.replace('can', '')}
                              </span>
                            ))}
                        </div>
                      )}
                    </td>
                    <td>{subadmin.createdAt ? new Date(subadmin.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <div className="actions">
                        {editingId === subadmin.id ? (
                          <>
                            <button
                              className="save-btn"
                              onClick={() => handleSave(subadmin.id)}
                            >
                              Save
                            </button>
                            <button
                              className="cancel-btn"
                              onClick={handleCancel}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="edit-btn"
                              onClick={() => handleEdit(subadmin)}
                            >
                              Edit
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => onDelete(subadmin.id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              disabled={pagination.page === 1}
              onClick={() => onPageChange(pagination.page - 1)}
            >
              Previous
            </button>
            <span>
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              disabled={pagination.page === pagination.pages}
              onClick={() => onPageChange(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SubadminList;
