import React from 'react';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const ROLES: { value: UserRole; label: string; icon: string; color: string }[] = [
  { value: 'ORGANIZER', label: 'Organizer', icon: '🎭', color: 'bg-green-100 border-green-800 text-green-900' },
  { value: 'INVESTOR', label: 'Investor', icon: '💰', color: 'bg-blue-100 border-blue-800 text-blue-900' },
  { value: 'FAN', label: 'Fan', icon: '🎉', color: 'bg-purple-100 border-purple-800 text-purple-900' },
  { value: 'SCANNER', label: 'Scanner', icon: '📱', color: 'bg-yellow-100 border-yellow-800 text-yellow-900' },
];

/**
 * Role Switcher Component
 *
 * Allows switching between different user roles for demo purposes.
 * In production, this would be based on actual user authentication.
 */
export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentRole, onRoleChange }) => {
  return (
    <div className="paper-card p-4">
      <p className="font-comic font-bold text-sm mb-3 text-center">Switch Role (Demo)</p>
      <div className="grid grid-cols-2 gap-2">
        {ROLES.map((role) => (
          <button
            key={role.value}
            onClick={() => onRoleChange(role.value)}
            className={cn(
              'px-4 py-3 rounded-lg border-3 transition-all font-comic font-bold text-sm',
              'hover:shadow-sketch-sm hover:-translate-y-0.5',
              currentRole === role.value
                ? `${role.color} shadow-sketch`
                : 'bg-white border-paper-300 text-paper-600 hover:border-ink'
            )}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl">{role.icon}</span>
              <span>{role.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
