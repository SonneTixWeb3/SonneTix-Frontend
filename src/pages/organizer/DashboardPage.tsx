import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { organizerApi } from '@/lib/mockApi';
import { formatCurrency, formatCompactNumber } from '@/lib/utils';

export const OrganizerDashboardPage: React.FC = () => {
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await organizerApi.getOrganizerStats('ORG-001');
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner-cartoon"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2">Organizer Dashboard</h2>
        <p className="font-hand text-paper-600">
          Manage your events, track sales, and monitor vault performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="font-hand text-paper-600 text-sm mb-2">Total Events</p>
            <p className="font-comic font-bold text-4xl">{stats?.totalEvents || 0}</p>
            <Badge variant="success" className="mt-3">+2 this month</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="font-hand text-paper-600 text-sm mb-2">Tickets Sold</p>
            <p className="font-comic font-bold text-4xl">{formatCompactNumber(stats?.totalTicketsSold || 0)}</p>
            <Badge variant="info" className="mt-3">85% avg capacity</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="font-hand text-paper-600 text-sm mb-2">Total Revenue</p>
            <p className="font-comic font-bold text-3xl">{formatCurrency(stats?.totalRevenue || 0)}</p>
            <Badge variant="success" className="mt-3">+12% vs last month</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="font-hand text-paper-600 text-sm mb-2">Active Vaults</p>
            <p className="font-comic font-bold text-4xl">{stats?.activeVaults || 0}</p>
            <Badge variant="warning" className="mt-3">2 funding</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary">
            ➕ Create New Event
          </button>
          <button className="btn-secondary">
            🎟️ Mint Tickets
          </button>
          <button className="btn-outline">
            🏦 Create Vault
          </button>
        </CardContent>
      </Card>
    </div>
  );
};
