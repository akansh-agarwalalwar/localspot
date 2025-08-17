import React, { useState } from 'react';
import { SubadminFormData } from '../../types';

interface CreateSubadminProps {
  onSubmit: (data: SubadminFormData) => Promise<boolean>;
}

const CreateSubadmin: React.FC<CreateSubadminProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<SubadminFormData>({
    username: '',
    email: '',
    password: '',
    permissions: {
      canCreate: false,
      canRead: true,
      canUpdate: false,
      canDelete: false,
    },
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePermissionChange = (permission: string, value: boolean): void => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    
    const success = await onSubmit(formData);
    
    if (success) {
      setFormData({
        username: '',
        email: '',
        password: '',
        permissions: {
          canCreate: false,
          canRead: true,
          canUpdate: false,
          canDelete: false,
        },
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="create-subadmin">
      <h2>Create New Subadmin</h2>
      
      <form onSubmit={handleSubmit} className="subadmin-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Permissions</label>
          <div className="permissions-grid">
            {Object.entries(formData.permissions).map(([permission, value]) => (
              <label key={permission} className="permission-checkbox">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                  disabled={loading}
                />
                {permission.replace('can', 'Can ')}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Creating...' : 'Create Subadmin'}
        </button>
      </form>
    </div>
  );
};

export default CreateSubadmin;
