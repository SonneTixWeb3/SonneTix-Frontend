import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Modal } from '@/components/ui';
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
  const [detailsModalOpen, setDetailsModalOpen] = React.useState(false);
  const [selectedInvestment, setSelectedInvestment] = React.useState<InvestmentWithDetails | null>(null);
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
              <button
                key={investment.investmentId}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer text-left"
                onClick={() => {
                  setSelectedInvestment(investment);
                  setDetailsModalOpen(true);
                }}
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
              </button>
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

      {/* Investment Details Modal */}
      <Modal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title="Investment Details"
        size="lg"
      >
        {selectedInvestment && (
          <div className="space-y-6">
            {/* Event Info */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-primary">
              <h3 className="font-bold text-lg mb-2">{selectedInvestment.eventName}</h3>
              <div className="text-sm text-gray-600">
                Invested on {formatDate(selectedInvestment.investedAt)}
              </div>
            </div>

            {/* Investment Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-gray-500 mb-1">Amount Invested</div>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(selectedInvestment.amount)}</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-xs text-green-700 mb-1">Current Value</div>
                <div className="text-2xl font-bold text-green-900">{formatCurrency(selectedInvestment.currentValue || selectedInvestment.amount)}</div>
              </div>
            </div>

            {/* Returns */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Returns</span>
                <Badge variant={(selectedInvestment.currentValue || selectedInvestment.amount) > selectedInvestment.amount ? 'success' : 'warning'}>
                  {formatPercentage(((selectedInvestment.currentValue || selectedInvestment.amount) - selectedInvestment.amount) / selectedInvestment.amount)}
                </Badge>
              </div>
              <div className="text-lg font-bold text-blue-900">
                {formatCurrency((selectedInvestment.currentValue || selectedInvestment.amount) - selectedInvestment.amount)}
              </div>
            </div>

            {/* Vault Details */}
            {selectedInvestment.vault && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Vault Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vault ID:</span>
                    <span className="font-mono text-xs">{selectedInvestment.vaultId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant={selectedInvestment.vault.vaultStatus === 'ACTIVE' ? 'success' : 'warning'}>
                      {selectedInvestment.vault.vaultStatus}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">LTV Ratio:</span>
                    <span className="font-semibold">{selectedInvestment.vault.ltvRatio.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expected Yield:</span>
                    <span className="font-semibold text-purple-600">{(selectedInvestment.vault.yieldRate / 100).toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setDetailsModalOpen(false)}
              className="btn-primary w-full"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};
