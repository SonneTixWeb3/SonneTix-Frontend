import React from 'react';
import { Card, CardContent, Badge, Modal } from '@/components/ui';
import { formatDate, formatCurrency } from '@/lib/utils';
import { ticketApi, eventApi } from '@/lib/mockApi';
import { useAppStore } from '@/lib/store';
import { TicketNFT, Event } from '@/types';

interface TicketWithEvent extends TicketNFT {
  event?: Event;
}

interface FanMyTicketsPageProps {
  onNavigate?: (path: string) => void;
}

export const FanMyTicketsPage: React.FC<FanMyTicketsPageProps> = ({ onNavigate }) => {
  const [tickets, setTickets] = React.useState<TicketWithEvent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [qrModalOpen, setQrModalOpen] = React.useState(false);
  const [selectedTicket, setSelectedTicket] = React.useState<TicketWithEvent | null>(null);
  const currentUserId = useAppStore((state) => state.currentUserId);

  React.useEffect(() => {
    loadTickets();
  }, [currentUserId]);

  const loadTickets = async () => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    try {
      const ticketData = await ticketApi.getTicketsByOwner(currentUserId);

      // Enrich tickets with event details
      const enrichedTickets: TicketWithEvent[] = await Promise.all(
        ticketData.map(async (ticket): Promise<TicketWithEvent> => {
          try {
            const event = await eventApi.getEventById(ticket.eventId);
            return { ...ticket, event: event || undefined };
          } catch {
            return { ...ticket, event: undefined };
          }
        })
      );

      setTickets(enrichedTickets);
    } catch (error) {
      console.error('Failed to load tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="spinner-cartoon"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">My Tickets</h2>
        <p className="text-sm text-gray-600">
          View and manage your purchased tickets
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <Card key={ticket.ticketId} className="overflow-hidden">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-bold text-lg">{ticket.event?.eventName || 'Loading...'}</h3>
                <Badge variant="info">{ticket.ticketType}</Badge>
              </div>
              <p className="text-sm opacity-90">Ticket #{ticket.ticketId.slice(0, 8)}</p>
              <p className="text-xs opacity-75 mt-1">NFT Token ID: {ticket.tokenId}</p>
            </div>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">{ticket.event ? formatDate(ticket.event.eventDate) : '-'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Venue</span>
                  <span className="font-medium">{ticket.event?.venue || '-'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <Badge variant={ticket.status === 'BURNED' || ticket.status === 'SCANNED' ? 'danger' : 'success'}>
                    {ticket.status}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    className="btn-primary flex-1 text-sm"
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setQrModalOpen(true);
                    }}
                    disabled={ticket.status === 'BURNED' || ticket.status === 'SCANNED'}
                  >
                    View QR
                  </button>
                  <button
                    className="btn-outline flex-1 text-sm"
                    onClick={() => alert('NFT transfer functionality coming soon!')}
                    disabled={ticket.status === 'BURNED' || ticket.status === 'SCANNED'}
                  >
                    Transfer
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tickets.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600 mb-4">You don't have any tickets yet.</p>
            <button
              className="btn-primary"
              onClick={() => onNavigate?.('/fan/events')}
            >
              Browse Events
            </button>
          </CardContent>
        </Card>
      )}

      {/* QR Code Modal */}
      <Modal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        title="Ticket QR Code"
        size="md"
      >
        {selectedTicket && (
          <div className="space-y-6">
            {/* Event Info */}
            <div className="text-center">
              <h3 className="font-bold text-lg mb-1">{selectedTicket.event?.eventName}</h3>
              <p className="text-sm text-gray-600">{selectedTicket.event?.venue}</p>
              <p className="text-sm text-gray-600">{selectedTicket.event && formatDate(selectedTicket.event.eventDate)}</p>
            </div>

            {/* QR Code Display - Simple visual representation */}
            <div className="bg-white border-4 border-ink rounded-lg p-8 flex items-center justify-center">
              <div className="text-center">
                {/* Simulated QR Code Pattern */}
                <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg border-2 border-gray-300 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-1 p-2">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                      />
                    ))}
                  </div>
                  <div className="relative z-10 bg-white px-4 py-2 rounded-lg border-2 border-black">
                    <p className="text-xs font-mono font-bold">SCAN ME</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 font-mono">QR-{selectedTicket.ticketId}</p>
              </div>
            </div>

            {/* Ticket Details */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Ticket ID:</span>
                <span className="font-mono text-xs">{selectedTicket.ticketId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Token ID:</span>
                <span className="font-mono text-xs">#{selectedTicket.tokenId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <Badge>{selectedTicket.ticketType}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price Paid:</span>
                <span className="font-semibold">{formatCurrency(selectedTicket.price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge variant={selectedTicket.status === 'OWNED' ? 'success' : 'danger'}>
                  {selectedTicket.status}
                </Badge>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="text-xs text-blue-800">
                  <strong>Entry Instructions:</strong><br />
                  Present this QR code at the venue entrance. The scanner will verify your NFT ticket on the blockchain.
                </div>
              </div>
            </div>

            {/* Blockchain Info */}
            <div className="border-t pt-4 space-y-1 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Network:</span>
                <span className="font-mono">Base Sepolia</span>
              </div>
              <div className="flex justify-between">
                <span>Token ID:</span>
                <span className="font-mono">{selectedTicket.tokenId}</span>
              </div>
              <div className="flex justify-between">
                <span>Contract:</span>
                <span className="font-mono">TicketNFT.sol</span>
              </div>
            </div>

            <button
              onClick={() => setQrModalOpen(false)}
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
