import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, Badge, Modal, Input } from '@/components/ui';
import { formatCurrency, formatPercentage, formatDate } from '@/lib/utils';
import { vaultApi, eventApi, investmentApi } from '@/lib/mockApi';
import { useAppStore } from '@/lib/store';
import { Vault, Event } from '@/types';

interface VaultWithEvent extends Vault {
  eventName?: string;
  event?: Event;
}

type FilterType = 'all' | 'low-risk' | 'medium-risk' | 'high-risk' | 'high-yield';

export const InvestorVaultsPage: React.FC = () => {
  const [vaults, setVaults] = React.useState<VaultWithEvent[]>([]);
  const [filteredVaults, setFilteredVaults] = React.useState<VaultWithEvent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [detailsModalOpen, setDetailsModalOpen] = React.useState(false);
  const [investModalOpen, setInvestModalOpen] = React.useState(false);
  const [selectedVault, setSelectedVault] = React.useState<VaultWithEvent | null>(null);
  const [investmentAmount, setInvestmentAmount] = React.useState<number>(0);
  const [isInvesting, setIsInvesting] = React.useState(false);
  const [activeFilter, setActiveFilter] = React.useState<FilterType>('all');
  const currentUserId = useAppStore((state) => state.currentUserId);

  React.useEffect(() => {
    loadVaults();
  }, []);

  React.useEffect(() => {
    applyFilter();
  }, [vaults, activeFilter]);

  const loadVaults = async () => {
    try {
      // Get vaults that are available for funding
      const vaultData = await vaultApi.getVaultsByStatus('FUNDING');

      // Enrich vaults with full event data
      const enrichedVaults: VaultWithEvent[] = await Promise.all(
        vaultData.map(async (vault: Vault): Promise<VaultWithEvent> => {
          try {
            const event = await eventApi.getEventById(vault.eventId);
            return { ...vault, eventName: event?.eventName, event: event || undefined };
          } catch {
            return { ...vault, eventName: 'Unknown Event', event: undefined };
          }
        })
      );

      setVaults(enrichedVaults);
    } catch (error) {
      console.error('Failed to load vaults:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    let filtered = [...vaults];

    switch (activeFilter) {
      case 'low-risk':
        filtered = filtered.filter(v => v.riskScore < 40);
        break;
      case 'medium-risk':
        filtered = filtered.filter(v => v.riskScore >= 40 && v.riskScore < 60);
        break;
      case 'high-risk':
        filtered = filtered.filter(v => v.riskScore >= 60);
        break;
      case 'high-yield':
        filtered = filtered.filter(v => v.yieldRate >= 1000); // >= 10%
        break;
      default:
        break;
    }

    setFilteredVaults(filtered);
  };

  const handleViewDetails = (vault: VaultWithEvent) => {
    setSelectedVault(vault);
    setDetailsModalOpen(true);
  };

  const handleInvestClick = (vault: VaultWithEvent) => {
    setSelectedVault(vault);
    setInvestmentAmount(0);
    setInvestModalOpen(true);
  };

  const handleConfirmInvestment = async () => {
    if (!selectedVault || !currentUserId || investmentAmount <= 0) return;

    setIsInvesting(true);
    try {
      const expectedReturn = investmentAmount * (1 + selectedVault.yieldRate / 10000);

      await investmentApi.createInvestment({
        vaultId: selectedVault.vaultId,
        investorId: currentUserId,
        amount: investmentAmount,
        status: 'ACTIVE',
        expectedReturn,
      });

      // Reload vaults to show updated funding
      await loadVaults();
      setInvestModalOpen(false);
      setInvestmentAmount(0);
    } catch (error) {
      console.error('Failed to invest:', error);
      alert('Investment failed. Please check the amount and try again.');
    } finally {
      setIsInvesting(false);
    }
  };

  const handleRefresh = () => {
    loadVaults();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="spinner-cartoon"></div></div>;
  }

  const displayVaults = filteredVaults.length > 0 ? filteredVaults : vaults;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2">Browse Vaults</h2>
          <p className="text-sm text-gray-600">
            Discover and invest in event financing opportunities
          </p>
        </div>
        <button onClick={handleRefresh} className="btn-secondary">
          <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border-3 border-ink p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-700 mr-2">Filter by:</span>
          {[
            { label: 'All Vaults', value: 'all' as FilterType },
            { label: 'Low Risk', value: 'low-risk' as FilterType },
            { label: 'Medium Risk', value: 'medium-risk' as FilterType },
            { label: 'High Risk', value: 'high-risk' as FilterType },
            { label: 'High Yield (≥10%)', value: 'high-yield' as FilterType },
          ].map(filter => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === filter.value
                  ? 'bg-primary text-white shadow-cartoon'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="mt-3 text-xs text-gray-500">
          Showing {displayVaults.length} of {vaults.length} vaults
        </div>
      </div>

      {/* Vault Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayVaults.map((vault) => {
          const fundingPercentage = (vault.totalFunded / vault.loanAmount) * 100;
          const yieldPercentage = vault.yieldRate / 100; // Convert basis points to percentage

          return (
            <Card key={vault.vaultId}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="text-lg">{vault.eventName || 'Loading...'}</CardTitle>
                  <Badge variant={vault.vaultStatus === 'FUNDING' ? 'warning' : vault.vaultStatus === 'ACTIVE' ? 'success' : 'default'}>
                    {vault.vaultStatus}
                  </Badge>
                </div>
                <CardDescription>Expected ROI: {formatPercentage(yieldPercentage / 100)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Funding Progress</span>
                      <span className="font-medium text-xs">
                        {Math.round(fundingPercentage)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{formatCurrency(vault.totalFunded)}</span>
                      <span>Goal: {formatCurrency(vault.loanAmount)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">LTV Ratio</span>
                    <span className="font-medium">{vault.ltvRatio.toFixed(1)}%</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Investors</span>
                    <span className="font-medium">{vault.investors?.length || 0}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Risk Score</span>
                    <Badge variant={vault.riskScore >= 80 ? 'success' : vault.riskScore >= 60 ? 'warning' : 'danger'}>
                      {vault.riskScore}/100
                    </Badge>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <button
                      className="btn-secondary flex-1 text-sm"
                      onClick={() => handleViewDetails(vault)}
                    >
                      View Details
                    </button>
                    <button
                      className="btn-primary flex-1 text-sm"
                      onClick={() => handleInvestClick(vault)}
                      disabled={vault.vaultStatus !== 'FUNDING'}
                    >
                      {vault.vaultStatus === 'FUNDING' ? 'Invest' : 'Closed'}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {displayVaults.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600 mb-4">
              {activeFilter === 'all'
                ? 'No active vaults available at the moment.'
                : 'No vaults match your filter criteria.'}
            </p>
            <button className="btn-secondary" onClick={() => setActiveFilter('all')}>
              Clear Filters
            </button>
          </CardContent>
        </Card>
      )}

      {/* Vault Details Modal */}
      <Modal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title="Vault Details"
        size="xl"
      >
        {selectedVault && (
          <div className="space-y-6">
            {/* Event Info */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-primary">
              <h3 className="font-bold text-lg mb-2">{selectedVault.eventName}</h3>
              {selectedVault.event && (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-gray-600">Venue:</span> {selectedVault.event.venue}</div>
                  <div><span className="text-gray-600">Date:</span> {formatDate(selectedVault.event.eventDate)}</div>
                  <div><span className="text-gray-600">Ticket Price:</span> {formatCurrency(selectedVault.event.ticketPrice)}</div>
                  <div><span className="text-gray-600">Capacity:</span> {selectedVault.event.totalTickets} tickets</div>
                </div>
              )}
            </div>

            {/* Funding Progress */}
            <div>
              <h4 className="font-semibold mb-2">Funding Progress</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    {formatCurrency(selectedVault.totalFunded)} raised
                  </span>
                  <span className="text-sm font-bold">
                    {((selectedVault.totalFunded / selectedVault.loanAmount) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all"
                    style={{ width: `${Math.min((selectedVault.totalFunded / selectedVault.loanAmount) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Goal: {formatCurrency(selectedVault.loanAmount)}</span>
                  <span>Remaining: {formatCurrency(selectedVault.loanAmount - selectedVault.totalFunded)}</span>
                </div>
              </div>
            </div>

            {/* Vault Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-xs text-blue-700 mb-1">Expected Yield</div>
                <div className="text-2xl font-bold text-blue-900">
                  {(selectedVault.yieldRate / 100).toFixed(1)}%
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="text-xs text-purple-700 mb-1">LTV Ratio</div>
                <div className="text-2xl font-bold text-purple-900">
                  {selectedVault.ltvRatio.toFixed(1)}%
                </div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="text-xs text-orange-700 mb-1">Risk Score</div>
                <div className="text-2xl font-bold text-orange-900">
                  {selectedVault.riskScore}/100
                </div>
              </div>
            </div>

            {/* Collateral Info */}
            <div>
              <h4 className="font-semibold mb-2">Collateral Details</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Collateral Tickets:</span>
                  <span className="font-semibold">{selectedVault.totalTickets} tickets</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ticket Value:</span>
                  <span className="font-semibold">
                    {selectedVault.event ? formatCurrency(selectedVault.event.ticketPrice) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">Total Collateral Value:</span>
                  <span className="font-bold text-green-600">
                    {selectedVault.event
                      ? formatCurrency(selectedVault.totalTickets * selectedVault.event.ticketPrice)
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Investor Info */}
            <div>
              <h4 className="font-semibold mb-2">Investment Activity</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Investors:</span>
                    <span className="font-semibold">{selectedVault.investors?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Funding Deadline:</span>
                    <span className="font-semibold">{formatDate(selectedVault.fundingDeadline)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => {
                setDetailsModalOpen(false);
                handleInvestClick(selectedVault);
              }}
              className="btn-primary w-full"
              disabled={selectedVault.vaultStatus !== 'FUNDING'}
            >
              {selectedVault.vaultStatus === 'FUNDING' ? 'Invest in This Vault' : 'Not Available'}
            </button>
          </div>
        )}
      </Modal>

      {/* Investment Modal */}
      <Modal
        isOpen={investModalOpen}
        onClose={() => setInvestModalOpen(false)}
        title="Invest in Vault"
        size="lg"
      >
        {selectedVault && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2">{selectedVault.eventName}</h4>
              <div className="text-sm text-gray-700">
                Expected Yield: <span className="font-bold text-blue-700">
                  {(selectedVault.yieldRate / 100).toFixed(1)}%
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investment Amount (USDC)
              </label>
              <Input
                type="number"
                value={investmentAmount || ''}
                onChange={(e) => setInvestmentAmount(parseFloat(e.target.value) || 0)}
                placeholder="Enter amount"
                min="0"
                max={selectedVault.loanAmount - selectedVault.totalFunded}
                step="100"
              />
              <div className="mt-2 text-xs text-gray-500">
                Remaining funding needed: {formatCurrency(selectedVault.loanAmount - selectedVault.totalFunded)}
              </div>
            </div>

            {investmentAmount > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-2">Expected Returns</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Your Investment:</span>
                    <span className="font-semibold">{formatCurrency(investmentAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Yield ({(selectedVault.yieldRate / 100).toFixed(1)}%):</span>
                    <span className="font-semibold text-green-600">
                      +{formatCurrency(investmentAmount * (selectedVault.yieldRate / 10000))}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-1 mt-2">
                    <span className="font-medium">Total Return:</span>
                    <span className="font-bold text-green-700">
                      {formatCurrency(investmentAmount * (1 + selectedVault.yieldRate / 10000))}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="text-xs text-yellow-800">
                  <strong>Investment Risk:</strong> Returns are dependent on event success and ticket sales.
                  Funds are locked until vault settlement after the event.
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setInvestModalOpen(false)}
                className="btn-outline flex-1"
                disabled={isInvesting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmInvestment}
                className="btn-primary flex-1"
                disabled={isInvesting || investmentAmount <= 0 || investmentAmount > (selectedVault.loanAmount - selectedVault.totalFunded)}
              >
                {isInvesting ? (
                  <span>Processing...</span>
                ) : (
                  <span>Confirm Investment</span>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
