import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { formatCurrency, formatPercentage, formatDate } from '@/lib/utils';

interface InvestmentData {
  investmentId: string;
  eventName: string;
  amountInvested: number;
  currentValue: number;
  investmentDate: string;
}

interface InvestorPortfolioPageProps {
  onNavigate?: (path: string) => void;
}

export const InvestorPortfolioPage: React.FC<InvestorPortfolioPageProps> = ({ onNavigate }) => {
  const [investments] = React.useState<InvestmentData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="spinner-cartoon"></div></div>;
  }

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amountInvested, 0);
  const totalReturns = investments.reduce((sum, inv) => sum + (inv.currentValue - inv.amountInvested), 0);

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
                    Invested on {formatDate(investment.investmentDate)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(investment.amountInvested)}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Current: {formatCurrency(investment.currentValue)}
                  </p>
                  <Badge
                    variant={investment.currentValue > investment.amountInvested ? 'success' : 'warning'}
                    className="mt-2"
                  >
                    {formatPercentage((investment.currentValue - investment.amountInvested) / investment.amountInvested)}
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
