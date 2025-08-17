import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: string;
  accent?: 'indigo' | 'emerald' | 'amber' | 'rose';
  loading?: boolean;
}

const colorMap = {
  indigo: 'from-indigo-500 to-blue-500',
  emerald: 'from-emerald-500 to-green-500',
  amber: 'from-amber-500 to-orange-500',
  rose: 'from-rose-500 to-pink-500',
};

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, change, accent = 'indigo', loading }) => {
  return (
    <div className="relative group rounded-xl border bg-white p-5 shadow-sm hover:shadow transition">
      <div className={`absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r ${colorMap[accent]} opacity-80`} />
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">{label}</span>
          {loading ? (
            <span className="mt-2 h-7 w-20 bg-gray-200 rounded animate-pulse" />
          ) : (
            <span className="mt-2 text-2xl font-semibold text-gray-800 tracking-tight">{value}</span>
          )}
          {change && !loading && (
            <span className={`mt-2 inline-flex items-center text-xs font-medium ${
              change.startsWith('-') ? 'text-red-600' : 'text-emerald-600'
            }`}>
              {change.startsWith('-') ? '▼' : '▲'} {change}
            </span>
          )}
        </div>
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center text-xl">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
