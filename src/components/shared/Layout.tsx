import React, { ReactNode } from 'react';
import { UserRole } from '@/types';
import { WalletConnect } from './WalletConnect';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
  currentRole: UserRole;
  onNavigate?: (path: string) => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: string;
  roles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  // Organizer routes
  { path: '/organizer/dashboard', label: 'Dashboard', icon: '📊', roles: ['ORGANIZER'] },
  { path: '/organizer/events', label: 'My Events', icon: '🎪', roles: ['ORGANIZER'] },
  { path: '/organizer/vaults', label: 'My Vaults', icon: '🏦', roles: ['ORGANIZER'] },
  { path: '/organizer/create-event', label: 'Create Event', icon: '➕', roles: ['ORGANIZER'] },

  // Investor routes
  { path: '/investor/dashboard', label: 'Dashboard', icon: '📊', roles: ['INVESTOR'] },
  { path: '/investor/vaults', label: 'Browse Vaults', icon: '🔍', roles: ['INVESTOR'] },
  { path: '/investor/portfolio', label: 'My Portfolio', icon: '💼', roles: ['INVESTOR'] },

  // Fan routes
  { path: '/fan/events', label: 'Browse Events', icon: '🎉', roles: ['FAN'] },
  { path: '/fan/my-tickets', label: 'My Tickets', icon: '🎟️', roles: ['FAN'] },

  // Scanner routes
  { path: '/scanner/scan', label: 'Scan Tickets', icon: '📱', roles: ['SCANNER'] },
  { path: '/scanner/history', label: 'Scan History', icon: '📋', roles: ['SCANNER'] },
];

/**
 * Main Layout Component
 *
 * Provides consistent layout with sidebar navigation, header, and content area.
 * Navigation items adapt based on the current user role.
 */
export const Layout: React.FC<LayoutProps> = ({ children, currentRole, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [currentPath, setCurrentPath] = React.useState('/');

  const filteredNavItems = NAV_ITEMS.filter((item) => item.roles.includes(currentRole));

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const getRoleConfig = (role: UserRole) => {
    const configs = {
      ORGANIZER: { title: 'Organizer Portal', icon: '🎭', color: 'bg-green-100 border-green-800' },
      INVESTOR: { title: 'Investor Portal', icon: '💰', color: 'bg-blue-100 border-blue-800' },
      FAN: { title: 'Fan Marketplace', icon: '🎉', color: 'bg-purple-100 border-purple-800' },
      SCANNER: { title: 'Gate Scanner', icon: '📱', color: 'bg-yellow-100 border-yellow-800' },
    };
    return configs[role];
  };

  const roleConfig = getRoleConfig(currentRole);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full bg-white border-r-3 border-ink transition-all duration-300 z-40',
          sidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b-3 border-ink">
          <div className="flex items-center gap-3">
            {sidebarOpen ? (
              <>
                <span className="text-3xl">🎫</span>
                <h1 className="font-comic font-bold text-xl">SonneTix</h1>
              </>
            ) : (
              <span className="text-3xl mx-auto">🎫</span>
            )}
          </div>
        </div>

        {/* Role Badge */}
        <div className="p-4">
          <div className={cn('badge-cartoon text-center w-full', roleConfig.color)}>
            <span className="mr-1">{roleConfig.icon}</span>
            {sidebarOpen && roleConfig.title}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {filteredNavItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={cn(
                'w-full text-left px-4 py-3 rounded-lg border-2 transition-all font-comic font-bold',
                'hover:shadow-sketch-sm hover:border-ink',
                currentPath === item.path
                  ? 'border-ink bg-paper-100 shadow-sketch'
                  : 'border-transparent bg-transparent'
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </div>
            </button>
          ))}
        </nav>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 p-2 border-2 border-ink rounded-full bg-white hover:bg-paper-100 transition-colors"
          aria-label="Toggle Sidebar"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className={cn('transition-transform', !sidebarOpen && 'rotate-180')}
          >
            <path
              d="M12 4L6 10L12 16"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </aside>

      {/* Main Content */}
      <div className={cn('flex-1 transition-all duration-300', sidebarOpen ? 'ml-64' : 'ml-20')}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b-3 border-ink px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-comic font-bold text-2xl">{roleConfig.title}</h2>
              <p className="font-hand text-paper-600 text-sm">
                Welcome to SonneTix - Event Financing on Base Sepolia
              </p>
            </div>
            <WalletConnect />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
