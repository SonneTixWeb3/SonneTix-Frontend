import { useState, useEffect } from 'react';
import { PrivyProvider } from '@/providers/PrivyProvider';
import { Layout, RoleSwitcher } from '@/components/shared';
import { useAppStore } from '@/lib/store';
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
