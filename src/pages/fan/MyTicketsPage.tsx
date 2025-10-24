import React from 'react';
import { Card, CardContent, Badge } from '@/components/ui';
import { formatDate } from '@/lib/utils';

interface Ticket {
  ticketId: string;
  eventName: string;
  eventDate: string;
  venue: string;
  seatNumber?: string;
  isUsed: boolean;
}

interface FanMyTicketsPageProps {
  onNavigate?: (path: string) => void;
}

export const FanMyTicketsPage: React.FC<FanMyTicketsPageProps> = ({ onNavigate }) => {
  const [tickets] = React.useState<Ticket[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Mock loading
    setTimeout(() => setLoading(false), 500);
  }, []);

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
                <h3 className="font-bold text-lg">{ticket.eventName}</h3>
                <Badge variant="info">{ticket.seatNumber || 'General'}</Badge>
              </div>
              <p className="text-sm opacity-90">Ticket #{ticket.ticketId.slice(0, 8)}</p>
            </div>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">{formatDate(ticket.eventDate)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Venue</span>
                  <span className="font-medium">{ticket.venue}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <Badge variant={ticket.isUsed ? 'danger' : 'success'}>
                    {ticket.isUsed ? 'Used' : 'Valid'}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    className="btn-primary flex-1 text-sm"
                    onClick={() => console.log(`Show QR code for ticket ${ticket.ticketId} - QR modal to be implemented`)}
                  >
                    View QR
                  </button>
                  <button
                    className="btn-outline flex-1 text-sm"
                    onClick={() => console.log(`Transfer ticket ${ticket.ticketId} - NFT transfer to be implemented`)}
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
    </div>
  );
};
