import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { formatCurrency, formatPercentage, formatDate } from '@/lib/utils';
import { investmentApi, vaultApi, eventApi } from '@/lib/mockApi';
import { useAppStore } from '@/lib/store';
import { Investment, Vault } from '@/types';

interface InvestmentWithDetails extends Investment {
  vault?: Vault;
  eventName?: string;
  currentValue?: number;
}

interface InvestorPortfolioPageProps {
  onNavigate?: (path: string) => void;
}

export const InvestorPortfolioPage: React.FC<InvestorPortfolioPageProps> = ({ onNavigate }) => {
  const [investments, setInvestments] = React.useState<InvestmentWithDetails[]>([]);
  const [loading, setLoading] = React.useState(true);
  const currentUserId = useAppStore((state) => state.currentUserId);

  React.useEffect(() => {
    loadInvestments();
  }, [currentUserId]);

  const loadInvestments = async () => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    try {
      const investmentData = await investmentApi.getInvestmentsByInvestor(currentUserId);

      // Enrich investments with vault and event details
      const enrichedInvestments = await Promise.all(
        investmentData.map(async (investment: Investment): Promise<InvestmentWithDetails> => {
          try {
            const vault = await vaultApi.getVaultById(investment.vaultId);
            const event = vault ? await eventApi.getEventById(vault.eventId) : null;

            // Calculate current value based on vault status
            let currentValue = investment.amount;
            if (vault && vault.vaultStatus === 'SETTLED') {
              // If settled, include yield
              currentValue = investment.amount + (investment.amount * vault.yieldRate / 10000);
            }

            return {
              ...investment,
              vault: vault || undefined,
              eventName: event?.eventName,
              currentValue,
            };
          } catch {
            return {
              ...investment,
              vault: undefined,
              eventName: 'Unknown Event',
              currentValue: investment.amount,
            };
          }
        })
      );

      setInvestments(enrichedInvestments);
    } catch (error) {
      console.error('Failed to load investments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="spinner-cartoon"></div></div>;
  }

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalReturns = investments.reduce((sum, inv) => sum + ((inv.currentValue || inv.amount) - inv.amount), 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">My Portfolio</h2>
        <p className="text-sm text-gray-600">
          Track your investments and returns
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-2">Total Invested</p>
            <p className="text-3xl font-bold">{formatCurrency(totalInvested)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-2">Total Returns</p>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(totalReturns)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-2">Active Investments</p>
            <p className="text-3xl font-bold">{investments.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Investment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {investments.map((investment) => (
              <div
                key={investment.investmentId}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{investment.eventName}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Invested on {formatDate(investment.investedAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(investment.amount)}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Current: {formatCurrency(investment.currentValue || investment.amount)}
                  </p>
                  <Badge
                    variant={(investment.currentValue || investment.amount) > investment.amount ? 'success' : 'warning'}
                    className="mt-2"
                  >
                    {formatPercentage(((investment.currentValue || investment.amount) - investment.amount) / investment.amount)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {investments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">You don't have any investments yet.</p>
              <button
                className="btn-primary"
                onClick={() => onNavigate?.('/investor/vaults')}
              >
                Browse Vaults
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
