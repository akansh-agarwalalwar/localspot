import React from 'react';
import { User } from '../../types';

interface Props {
  permissions: User['permissions'];
}

const label = (k: string) => k.replace(/^can/, '');

const PermissionsBadge: React.FC<Props> = ({ permissions }) => {
  const enabled = Object.entries(permissions).filter(([, v]) => v);
  if (!enabled.length) {
    return <span className="text-xs text-gray-400 italic">No permissions</span>;
  }
  return (
    <div className="flex flex-wrap gap-1">
      {enabled.map(([k]) => (
        <span
          key={k}
            className="px-2 py-0.5 text-[10px] font-medium bg-indigo-50 text-indigo-600 rounded uppercase tracking-wide"
        >
          {label(k)}
        </span>
      ))}
    </div>
  );
};

export default PermissionsBadge;
