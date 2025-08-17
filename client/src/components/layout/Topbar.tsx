import React from 'react';
import { useAuth } from '../../context/AuthContext';

interface TopbarProps {
  onMenu: () => void;
  title?: string;
  subtitle?: string;
}

const Topbar: React.FC<TopbarProps> = ({ onMenu, title, subtitle }) => {
  const { user } = useAuth();
  return (
    <header className="h-16 bg-white border-b flex items-center px-4 gap-4">
      <button
        onClick={onMenu}
        className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-md border text-gray-600 hover:bg-gray-50"
        aria-label="Open sidebar"
      >
        ☰
      </button>
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-semibold text-gray-800 truncate">{title || 'Dashboard'}</h1>
        <p className="text-xs text-gray-500 truncate">{subtitle || `Signed in as ${user?.username}`}</p>
      </div>
      <div className="hidden md:flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-700">{user?.username}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-semibold">
          {user?.username?.[0]?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
