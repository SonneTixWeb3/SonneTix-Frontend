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
      <Alert variant="info" className="mb-6">
        <div className="flex-1">
          <h4 className="font-comic font-bold mb-1">Welcome to SonneTix! 👋</h4>
          <p className="font-hand text-sm">
            This is a demo of the GatePay Vault platform. Connect your wallet to get started or{' '}
            <button
              onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
              className="underline-sketch font-bold"
            >
              switch roles
            </button>
            {' '}to explore different features.
          </p>
        </div>
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
          <div className="font-hand space-y-2">
            <p>
              <strong>Network:</strong> Base Sepolia Testnet
            </p>
            <p>
              <strong>Data:</strong> Using mock data stored in localStorage
            </p>
            <p>
              <strong>Web3:</strong> Connect MetaMask to interact with smart contracts
            </p>
            <p className="text-sm text-paper-600 mt-4">
              💡 Tip: This is a fully functional frontend ready to connect to your backend API.
              Check the documentation for migration instructions.
            </p>
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
