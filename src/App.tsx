import { useState } from 'react';
import { Web3Provider } from '@/contexts/Web3Context';
import { Layout, RoleSwitcher } from '@/components/shared';
import { useAppStore } from '@/lib/store';
import { OrganizerDashboardPage } from '@/pages/organizer/DashboardPage';
import { InvestorDashboardPage } from '@/pages/investor/DashboardPage';
import { FanEventsPage } from '@/pages/fan/EventsPage';
import { ScannerPage } from '@/pages/scanner/ScanPage';
import { Card, CardHeader, CardTitle, CardContent, Alert } from '@/components/ui';

function AppContent() {
  const { currentRole, setCurrentRole } = useAppStore();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  // Route to component mapping based on role
  const getCurrentPage = () => {
    switch (currentRole) {
      case 'ORGANIZER':
        return <OrganizerDashboardPage />;
      case 'INVESTOR':
        return <InvestorDashboardPage />;
      case 'FAN':
        return <FanEventsPage />;
      case 'SCANNER':
        return <ScannerPage />;
      default:
        return <FanEventsPage />;
    }
  };

  return (
    <Layout currentRole={currentRole}>
      {/* Welcome Banner */}
      <Alert variant="info" className="mb-6" title="Welcome to SonneTix!">
        <p className="text-sm">
          This is a demo of the GatePay Vault platform. Connect your wallet to get started or{' '}
          <button
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            className="text-primary-600 hover:text-primary-700 font-semibold underline"
          >
            switch roles
          </button>
          {' '}to explore different features.
        </p>
      </Alert>

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

      {/* Info Footer */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle>About This Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <strong className="text-gray-900">Network:</strong> Base Sepolia Testnet
            </p>
            <p>
              <strong className="text-gray-900">Data:</strong> Using mock data stored in localStorage
            </p>
            <p>
              <strong className="text-gray-900">Web3:</strong> Connect MetaMask to interact with smart contracts
            </p>
            <div className="mt-4 p-3 bg-info-50 border border-info-200 rounded-md">
              <p className="text-info-800">
                <strong>💡 Tip:</strong> This is a fully functional frontend ready to connect to your backend API.
                Check the documentation for migration instructions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}

function App() {
  return (
    <Web3Provider>
      <AppContent />
    </Web3Provider>
  );
}

export default App;
