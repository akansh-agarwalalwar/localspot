import React, { useEffect, useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import StatCard from '../common/StatCard';
import PermissionsBadge from '../common/PermissionsBadge';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';
import { Subadmin, Pagination, SubadminFormData } from '../../types';
import { toast } from 'sonner';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'subadmins' | 'create' | 'activities'>('overview');
  const [subadmins, setSubadmins] = useState<Subadmin[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, pages: 0 });
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<SubadminFormData>({
    username: '',
    email: '',
    password: '',
    permissions: { canCreate: false, canRead: true, canUpdate: false, canDelete: false }
  });

  const fetchSubadmins = async (page = 1) => {
    setLoadingSubs(true);
    try {
      const res = await adminAPI.getAllSubadmins({ page, limit: pagination.limit });
      setSubadmins(res.data.subadmins);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to load subadmins');
    } finally {
      setLoadingSubs(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'subadmins') fetchSubadmins();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await adminAPI.createSubadmin(form);
      toast.success('Subadmin created');
      setForm({
        username: '',
        email: '',
        password: '',
        permissions: { canCreate: false, canRead: true, canUpdate: false, canDelete: false }
      });
      fetchSubadmins();
      setActiveTab('subadmins');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Create failed');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this subadmin?')) return;
    try {
      await adminAPI.deleteSubadmin(id);
      toast.success('Deleted');
      fetchSubadmins(pagination.page);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <DashboardLayout
      title="Admin Control Center"
      subtitle="Manage platform users and activities"
    >
      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(['overview','subadmins','create','activities'] as const).map(t => (
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
             t === 'create' ? 'Create Subadmin' : 'Activity Log'}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Subadmins" value={pagination.total || '—'} icon="👥" accent="indigo" loading={loadingSubs} />
            <StatCard label="Active Subadmins" value={subadmins.filter(s => s.isActive).length} icon="✅" accent="emerald" loading={loadingSubs} />
            <StatCard label="Permissions Sets" value="4" icon="🔐" accent="amber" />
            <StatCard label="System Status" value="Healthy" icon="🟢" accent="rose" />
          </div>
          <div className="bg-white/60 backdrop-blur rounded-xl border p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
              <li>Use the Subadmins tab to manage and audit user access.</li>
              <li>Assign only necessary permissions to maintain security.</li>
              <li>Revoke inactive accounts to reduce attack surface.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Subadmins Table */}
      {activeTab === 'subadmins' && (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b bg-gray-50">
            <h3 className="font-semibold text-gray-800">Subadmins</h3>
            <button
              onClick={() => fetchSubadmins(pagination.page)}
              className="text-xs px-3 py-1 rounded border bg-white hover:bg-gray-100"
            >
              Refresh
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  {['User','Email','Status','Permissions','Created','Actions'].map(h => (
                    <th key={h} className="px-4 py-2 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loadingSubs && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center">
                      <div className="animate-spin h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-3" />
                      <p className="text-xs text-gray-500">Loading subadmins…</p>
                    </td>
                  </tr>
                )}
                {!loadingSubs && subadmins.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-gray-500 text-sm">
                      No subadmins yet. Create one in the “Create Subadmin” tab.
                    </td>
                  </tr>
                )}
                {!loadingSubs && subadmins.map(s => (
                  <tr key={s.id} className="border-b last:border-0 hover:bg-indigo-50/40 transition">
                    <td className="px-4 py-3 font-medium text-gray-800">{s.username}</td>
                    <td className="px-4 py-3 text-gray-600">{s.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full
                        ${s.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <PermissionsBadge permissions={s.permissions} />
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="text-xs px-2 py-1 rounded bg-rose-50 text-rose-600 hover:bg-rose-100"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              {subadmins.length > 0 && (
                <tfoot>
                  <tr>
                    <td colSpan={6} className="px-4 py-3">
                      <div className="flex justify-between items-center text-xs text-gray-600">
                        <span>
                          Page {pagination.page} of {pagination.pages || 1}
                        </span>
                        <div className="space-x-2">
                          <button
                            disabled={pagination.page <= 1}
                            onClick={() => fetchSubadmins(pagination.page - 1)}
                            className="px-3 py-1 border rounded disabled:opacity-40"
                          >
                            Prev
                          </button>
                          <button
                            disabled={pagination.page >= pagination.pages}
                            onClick={() => fetchSubadmins(pagination.page + 1)}
                            className="px-3 py-1 border rounded disabled:opacity-40"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}

      {/* Create Subadmin */}
      {activeTab === 'create' && (
        <form
          onSubmit={handleCreate}
          className="max-w-2xl bg-white rounded-xl border shadow-sm p-6 space-y-6"
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-800">New Subadmin</h3>
            <p className="text-xs text-gray-500 mt-1">Grant only necessary permissions.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Username</label>
              <input
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                required
                className="w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                className="w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
              <input
                type="password"
                minLength={6}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
                className="w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-600">Permissions</p>
              <div className="flex flex-wrap gap-3">
                {Object.entries(form.permissions).map(([k, v]) => (
                  <label key={k} className="flex items-center gap-1 text-xs text-gray-600 select-none">
                    <input
                      type="checkbox"
                      checked={v}
                      onChange={e =>
                        setForm(f => ({
                          ...f,
                          permissions: { ...f.permissions, [k]: e.target.checked }
                        }))
                      }
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    {k.replace('can', 'Can ')}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() =>
                setForm({
                  username: '',
                  email: '',
                  password: '',
                  permissions: { canCreate: false, canRead: true, canUpdate: false, canDelete: false }
                })
              }
              className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              disabled={creating}
              className="px-5 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {creating ? 'Creating…' : 'Create Subadmin'}
            </button>
          </div>
        </form>
      )}

      {/* Activity Log Placeholder */}
      {activeTab === 'activities' && (
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Activity Log</h3>
          <p className="text-sm text-gray-500">
            Integrate activity listing here (reuse existing API). Consider virtualized list & filters.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-lg border animate-pulse bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100"
              />
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
