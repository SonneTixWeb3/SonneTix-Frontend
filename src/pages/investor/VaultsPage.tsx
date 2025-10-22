import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, Badge } from '@/components/ui';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface VaultData {
  vaultId: string;
  eventName: string;
  currentFunding: number;
  fundingGoal: number;
  minInvestment: number;
  investorCount: number;
  expectedROI: number;
}

export const InvestorVaultsPage: React.FC = () => {
  const [vaults] = React.useState<VaultData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="spinner-cartoon"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Browse Vaults</h2>
        <p className="text-sm text-gray-600">
          Discover and invest in event financing opportunities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vaults.map((vault) => (
          <Card key={vault.vaultId}>
            <CardHeader>
              <div className="flex items-start justify-between gap-2 mb-2">
                <CardTitle className="text-lg">{vault.eventName}</CardTitle>
                <Badge variant="success">FUNDING</Badge>
              </div>
              <CardDescription>Expected ROI: {formatPercentage(vault.expectedROI)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Funding Progress</span>
                    <span className="font-medium text-xs">
                      {Math.round((vault.currentFunding / vault.fundingGoal) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${(vault.currentFunding / vault.fundingGoal) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{formatCurrency(vault.currentFunding)}</span>
                    <span>Goal: {formatCurrency(vault.fundingGoal)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Min Investment</span>
                  <span className="font-medium">{formatCurrency(vault.minInvestment)}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Investors</span>
                  <span className="font-medium">{vault.investorCount}</span>
                </div>

                <button
                  className="btn-primary w-full mt-2"
                  onClick={() => alert(`Invest in ${vault.eventName} - Connect wallet to invest!`)}
                >
                  Invest Now
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {vaults.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600 mb-4">No active vaults available at the moment.</p>
            <button
              className="btn-secondary"
              onClick={() => alert('Refreshing vault list...')}
            >
              Refresh
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
