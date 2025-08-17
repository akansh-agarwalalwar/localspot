import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = (role?: string) => [
  { to: role === 'admin' ? '/admin' : '/subadmin', label: 'Dashboard', icon: '📊' },
  role === 'admin' && { to: '/admin?tab=subadmins', label: 'Subadmins', icon: '👥' },
  role === 'admin' && { to: '/admin?tab=activities', label: 'Activity Log', icon: '📝' },
].filter(Boolean) as { to: string; label: string; icon: string }[];

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white border-r shadow-sm flex flex-col transform transition-transform duration-200
      ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
    >
      <div className="h-16 flex items-center px-5 border-b">
        <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent select-none">
          Localspot {user?.role === 'admin' ? 'Admin' : 'Panel'}
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems(user?.role).map(item => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                  ${active
                    ? 'bg-indigo-50 text-indigo-600 ring-1 ring-inset ring-indigo-200'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
                {active && <span className="ml-auto h-2 w-2 rounded-full bg-indigo-500" />}
              </Link>
            );
          })}
      </nav>

      <div className="p-4 border-t space-y-3">
        <div className="text-xs text-gray-500 truncate">
          {user?.email}
        </div>
        <button
          onClick={logout}
          className="w-full inline-flex justify-center items-center gap-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 py-2 text-sm font-medium transition"
        >
          <span>↩</span> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
