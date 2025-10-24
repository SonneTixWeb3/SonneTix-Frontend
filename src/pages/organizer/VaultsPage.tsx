import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Modal } from '@/components/ui';
import { formatCurrency, formatPercentage, formatDate } from '@/lib/utils';
import { vaultApi, eventApi } from '@/lib/mockApi';
import { useAppStore } from '@/lib/store';
import { Vault, Event } from '@/types';

interface VaultWithEvent extends Vault {
  eventName?: string;
}

interface OrganizerVaultsPageProps {
  onNavigate?: (path: string) => void;
}

export const OrganizerVaultsPage: React.FC<OrganizerVaultsPageProps> = ({ onNavigate }) => {
  const [vaults, setVaults] = React.useState<VaultWithEvent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [eventSelectModalOpen, setEventSelectModalOpen] = React.useState(false);
  const [availableEvents, setAvailableEvents] = React.useState<Event[]>([]);
  const currentUserId = useAppStore((state) => state.currentUserId);

  React.useEffect(() => {
    loadVaults();
  }, [currentUserId]);

  const loadVaults = async () => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    try {
      // Get all vaults and filter by current user's events
      const allVaults = await vaultApi.getAllVaults();
      const userEvents = await eventApi.getEventsByOrganizer(currentUserId);
      const userEventIds = userEvents.map(e => e.eventId);
      const vaultData = allVaults.filter(v => userEventIds.includes(v.eventId));

      // Enrich vaults with event names
      const enrichedVaults = await Promise.all(
        vaultData.map(async (vault: Vault) => {
          try {
            const event = await eventApi.getEventById(vault.eventId);
            return { ...vault, eventName: event?.eventName };
          } catch {
            return { ...vault, eventName: 'Unknown Event' };
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

  const handleCreateVaultClick = async () => {
    if (!currentUserId) return;

    try {
      // Get organizer's events
      const userEvents = await eventApi.getEventsByOrganizer(currentUserId);

      // Filter out events that already have vaults
      const allVaults = await vaultApi.getAllVaults();
      const eventsWithVaults = allVaults.map(v => v.eventId);
      const eventsWithoutVaults = userEvents.filter(e => !eventsWithVaults.includes(e.eventId));

      setAvailableEvents(eventsWithoutVaults);
      setEventSelectModalOpen(true);
    } catch (error) {
      console.error('Failed to load events:', error);
    }
  };

  const handleEventSelect = (eventId: string) => {
    setEventSelectModalOpen(false);
    onNavigate?.(`/organizer/create-vault/${eventId}`);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="spinner-cartoon"></div></div>;
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'info' | 'danger'> = {
      'ACTIVE': 'success',
      'FUNDING': 'warning',
      'SETTLED': 'info',
      'DEFAULTED': 'danger'
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
          onClick={handleCreateVaultClick}
        >
          + Create New Vault
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {vaults.map((vault) => {
          const fundingPercentage = (vault.totalFunded / vault.loanAmount) * 100;
          const yieldPercentage = vault.yieldRate / 100; // Convert basis points to percentage

          return (
            <Card key={vault.vaultId}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle>{vault.eventName || 'Loading...'}</CardTitle>
                  {getStatusBadge(vault.vaultStatus)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Funding Progress</span>
                      <span className="font-medium">
                        {formatCurrency(vault.totalFunded)} / {formatCurrency(vault.loanAmount)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Investors</span>
                    <span className="font-medium">{vault.investors?.length || 0}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Yield Rate</span>
                    <span className="font-medium text-green-600">{formatPercentage(yieldPercentage / 100)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Debt Remaining</span>
                    <span className="font-medium">{formatCurrency(vault.debtRemaining)}</span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      className="btn-primary flex-1 text-sm"
                      onClick={() => alert(`Vault Management for "${vault.eventName}"\n\nFeatures coming soon:\n- Adjust loan terms\n- Manage collateral\n- View funding status\n- Debt repayment tracking`)}
                    >
                      Manage
                    </button>
                    <button
                      className="btn-outline flex-1 text-sm"
                      onClick={() => alert(`Vault Analytics for "${vault.eventName}"\n\nFeatures coming soon:\n- Funding progress charts\n- Investor breakdown\n- Revenue projections\n- Risk metrics`)}
                    >
                      Analytics
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {vaults.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600 mb-4">You haven't created any vaults yet.</p>
            <button
              className="btn-primary"
              onClick={handleCreateVaultClick}
            >
              Create Your First Vault
            </button>
          </CardContent>
        </Card>
      )}

      {/* Event Selection Modal */}
      <Modal
        isOpen={eventSelectModalOpen}
        onClose={() => setEventSelectModalOpen(false)}
        title="Select Event for Vault"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Choose which event you want to create a vault for. Only events without existing vaults are shown.
          </p>

          {availableEvents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">All your events already have vaults, or you haven't created any events yet.</p>
              <button
                onClick={() => {
                  setEventSelectModalOpen(false);
                  onNavigate?.('/organizer/create-event');
                }}
                className="btn-primary"
              >
                Create New Event
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {availableEvents.map((event) => (
                <button
                  key={event.eventId}
                  onClick={() => handleEventSelect(event.eventId)}
                  className="w-full text-left p-4 bg-white border-2 border-gray-200 hover:border-primary rounded-lg transition-all hover:shadow-cartoon"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{event.eventName}</h3>
                      <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>📍 {event.venue}</span>
                        <span>📅 {formatDate(event.eventDate)}</span>
                        <span>🎫 {event.totalTickets} tickets @ {formatCurrency(event.ticketPrice)}</span>
                      </div>
                    </div>
                    <Badge>{event.category}</Badge>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
