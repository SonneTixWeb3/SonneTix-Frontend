import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface VaultData {
  vaultId: string;
  eventName: string;
  status: string;
  currentFunding: number;
  fundingGoal: number;
  investorCount: number;
  expectedROI: number;
}

export const OrganizerVaultsPage: React.FC = () => {
  const [vaults] = React.useState<VaultData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="spinner-cartoon"></div></div>;
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'info' | 'danger'> = {
      'ACTIVE': 'success',
      'FUNDING': 'warning',
      'COMPLETED': 'info',
      'CLOSED': 'danger'
    };
    return <Badge variant={variants[status] || 'info'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2">My Vaults</h2>
          <p className="text-sm text-gray-600">
            Track funding and manage your event vaults
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => alert('Create Vault - This will deploy a new vault smart contract!')}
        >
          + Create New Vault
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {vaults.map((vault) => (
          <Card key={vault.vaultId}>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle>{vault.eventName}</CardTitle>
                {getStatusBadge(vault.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Funding Progress</span>
                    <span className="font-medium">
                      {formatCurrency(vault.currentFunding)} / {formatCurrency(vault.fundingGoal)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${(vault.currentFunding / vault.fundingGoal) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Investors</span>
                  <span className="font-medium">{vault.investorCount}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Expected ROI</span>
                  <span className="font-medium text-green-600">{formatPercentage(vault.expectedROI)}</span>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    className="btn-primary flex-1 text-sm"
                    onClick={() => alert(`Manage vault: ${vault.eventName}`)}
                  >
                    Manage
                  </button>
                  <button
                    className="btn-outline flex-1 text-sm"
                    onClick={() => alert(`View analytics for: ${vault.eventName}`)}
                  >
                    Analytics
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {vaults.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600 mb-4">You haven't created any vaults yet.</p>
            <button
              className="btn-primary"
              onClick={() => alert('Create your first vault - Smart contract deployment coming soon!')}
            >
              Create Your First Vault
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
