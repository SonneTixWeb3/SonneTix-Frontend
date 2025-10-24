import { useState, useEffect } from 'react';
import { PrivyProvider } from '@/providers/PrivyProvider';
import { Layout, RoleSwitcher } from '@/components/shared';
import { useAppStore } from '@/lib/store';
import { resetAllDemoData, getDataStats } from '@/lib/mockApi';
import { OrganizerDashboardPage } from '@/pages/organizer/DashboardPage';
import { OrganizerEventsPage } from '@/pages/organizer/EventsPage';
import { OrganizerVaultsPage } from '@/pages/organizer/VaultsPage';
import { CreateEventPage } from '@/pages/organizer/CreateEventPage';
import { CreateVaultPage } from '@/pages/organizer/CreateVaultPage';
import { InvestorDashboardPage } from '@/pages/investor/DashboardPage';
import { InvestorVaultsPage } from '@/pages/investor/VaultsPage';
import { InvestorPortfolioPage } from '@/pages/investor/PortfolioPage';
import { FanEventsPage } from '@/pages/fan/EventsPage';
import { FanMyTicketsPage } from '@/pages/fan/MyTicketsPage';
import { ScannerPage } from '@/pages/scanner/ScanPage';
import { ScanHistoryPage } from '@/pages/scanner/ScanHistoryPage';

function AppContent() {
  const { currentRole, setCurrentRole } = useAppStore();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  // Route to component mapping
  const getPageForPath = (path: string) => {
    // Handle dynamic routes
    if (path.startsWith('/organizer/create-vault/')) {
      const eventId = path.split('/').pop();
      return <CreateVaultPage eventId={eventId!} onNavigate={handleNavigate} />;
    }

    const routes: Record<string, JSX.Element> = {
      // Organizer routes
      '/organizer/dashboard': <OrganizerDashboardPage onNavigate={handleNavigate} />,
      '/organizer/events': <OrganizerEventsPage onNavigate={handleNavigate} />,
      '/organizer/vaults': <OrganizerVaultsPage onNavigate={handleNavigate} />,
      '/organizer/create-event': <CreateEventPage onNavigate={handleNavigate} />,
      // Investor routes
      '/investor/dashboard': <InvestorDashboardPage onNavigate={handleNavigate} />,
      '/investor/vaults': <InvestorVaultsPage />,
      '/investor/portfolio': <InvestorPortfolioPage onNavigate={handleNavigate} />,
      // Fan routes
      '/fan/events': <FanEventsPage />,
      '/fan/my-tickets': <FanMyTicketsPage onNavigate={handleNavigate} />,
      // Scanner routes
      '/scanner/scan': <ScannerPage />,
      '/scanner/history': <ScanHistoryPage />,
    };

    return routes[path];
  };

  // Default route based on role
  const getDefaultRoute = () => {
    const defaults: Record<string, string> = {
      ORGANIZER: '/organizer/dashboard',
      INVESTOR: '/investor/dashboard',
      FAN: '/fan/events',
      SCANNER: '/scanner/scan'
    };
    return defaults[currentRole] || '/fan/events';
  };

  // Set default route when role changes
  useEffect(() => {
    setCurrentPath(getDefaultRoute());
  }, [currentRole]);

  // Get current page or default
  const getCurrentPage = () => {
    if (!currentPath) return null;
    const page = getPageForPath(currentPath);
    if (!page) {
      const defaultRoute = getDefaultRoute();
      setCurrentPath(defaultRoute);
      return getPageForPath(defaultRoute);
    }
    return page;
  };

  // Handle navigation
  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  // Handle reset demo data
  const handleResetData = () => {
    const stats = getDataStats();
    const message = `Current Data:\n- Events: ${stats.events}\n- Vaults: ${stats.vaults}\n- Investments: ${stats.investments}\n- Tickets: ${stats.tickets}\n\nReset all demo data to initial state?\n\nThis will:\n✓ Clear all created events\n✓ Clear all vaults & investments\n✓ Clear all tickets & scans\n✓ Restore original mock data`;

    if (confirm(message)) {
      resetAllDemoData();
      alert('✅ Demo data has been reset!\n\nPage will reload to apply changes.');
      window.location.reload();
    }
  };

  return (
    <Layout
      currentRole={currentRole}
      onNavigate={handleNavigate}
      onRoleSwitcherToggle={() => setShowRoleSwitcher(!showRoleSwitcher)}
    >
      {/* Role Switcher */}
      {showRoleSwitcher && (
        <div className="mb-6">
          <RoleSwitcher
            currentRole={currentRole}
            onRoleChange={(role) => {
              setCurrentRole(role);
              setShowRoleSwitcher(false);
            }}
          />
        </div>
      )}

      {/* Current Page */}
      {getCurrentPage()}

      {/* Floating Reset Button (Bottom Right) */}
      <button
        onClick={handleResetData}
        className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 p-3 rounded-full shadow-lg transition-all z-50 flex items-center justify-center group"
        title="Reset Demo Data"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span className="ml-2 text-sm font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Reset Data
        </span>
      </button>
    </Layout>
  );
}

function App() {
  return (
    <PrivyProvider>
      <AppContent />
    </PrivyProvider>
  );
}

export default App;
