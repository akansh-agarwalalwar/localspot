import React from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import StatCard from '../common/StatCard';
import PermissionsBadge from '../common/PermissionsBadge';
import { useAuth } from '../../context/AuthContext';

const SubadminDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout
      title="Subadmin Overview"
      subtitle="Your permissions and recent context"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard label="Role" value={user?.role || '—'} icon="🧩" accent="indigo" />
        <StatCard label="Can Create" value={user?.permissions.canCreate ? 'Yes' : 'No'} icon="➕" accent="emerald" />
        <StatCard label="Can Update" value={user?.permissions.canUpdate ? 'Yes' : 'No'} icon="✏️" accent="amber" />
        <StatCard label="Can Delete" value={user?.permissions.canDelete ? 'Yes' : 'No'} icon="🗑️" accent="rose" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Permissions</h3>
            <PermissionsBadge permissions={user?.permissions || {}} />
            <p className="mt-4 text-xs text-gray-500">
              Permissions define what actions you can perform. Contact an admin to request changes.
            </p>
          </section>

          <section className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Guidance</h3>
            <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
              <li>Operate within your permission scope.</li>
              <li>Report suspicious activity promptly.</li>
              <li>Keep credentials secure—never share passwords.</li>
            </ul>
          </section>
        </div>

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
    </DashboardLayout>
  );
};

export default SubadminDashboard;
