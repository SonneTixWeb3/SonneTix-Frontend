import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { investmentApi } from '@/lib/mockApi';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { useAppStore } from '@/lib/store';

interface InvestorDashboardPageProps {
  onNavigate?: (path: string) => void;
}

export const InvestorDashboardPage: React.FC<InvestorDashboardPageProps> = ({ onNavigate }) => {
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const currentUserId = useAppStore((state) => state.currentUserId);

  React.useEffect(() => {
    loadStats();
  }, [currentUserId]);

  const loadStats = async () => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    try {
      const data = await investmentApi.getInvestorStats(currentUserId);
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="spinner-cartoon"></div></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2">Investor Dashboard</h2>
        <p className="font-hand text-paper-600">
          Track your investments and discover new opportunities
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="font-hand text-paper-600 text-sm mb-2">Total Invested</p>
            <p className="font-comic font-bold text-3xl">{formatCurrency(stats?.totalInvested || 0)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="font-hand text-paper-600 text-sm mb-2">Active Investments</p>
            <p className="font-comic font-bold text-4xl">{stats?.activeInvestments || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="font-hand text-paper-600 text-sm mb-2">Total Returns</p>
            <p className="font-comic font-bold text-3xl text-green-700">{formatCurrency(stats?.totalReturns || 0)}</p>
            <Badge variant="success" className="mt-3">+{formatPercentage(stats?.averageROI || 0)}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="font-hand text-paper-600 text-sm mb-2">Portfolio Value</p>
            <p className="font-comic font-bold text-3xl">{formatCurrency(stats?.portfolioValue || 0)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            className="btn-primary"
            onClick={() => onNavigate?.('/investor/vaults')}
          >
            🔍 Browse Vaults
          </button>
          <button
            className="btn-secondary"
            onClick={() => onNavigate?.('/investor/portfolio')}
          >
            💼 View Portfolio
          </button>
        </CardContent>
      </Card>
    </div>
  );
};
