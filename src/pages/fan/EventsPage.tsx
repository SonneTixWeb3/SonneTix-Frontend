import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, Badge, Modal, Input } from '@/components/ui';
import { eventApi, ticketApi } from '@/lib/mockApi';
import { useAppStore } from '@/lib/store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Event } from '@/types';

export const FanEventsPage: React.FC = () => {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [purchaseModalOpen, setPurchaseModalOpen] = React.useState(false);
  const [successModalOpen, setSuccessModalOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  const [ticketQuantity, setTicketQuantity] = React.useState(1);
  const [isPurchasing, setIsPurchasing] = React.useState(false);
  const [purchasedTicketId, setPurchasedTicketId] = React.useState<string | null>(null);
  const currentUserId = useAppStore((state) => state.currentUserId);

  React.useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await eventApi.getUpcomingEvents();
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseClick = (event: Event) => {
    setSelectedEvent(event);
    setTicketQuantity(1);
    setPurchaseModalOpen(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedEvent || !currentUserId) return;

    setIsPurchasing(true);
    try {
      // Create ticket purchase (mock blockchain transaction)
      const newTicket = await ticketApi.createTicket({
        eventId: selectedEvent.eventId,
        ticketType: 'REGULAR',
        price: selectedEvent.ticketPrice * ticketQuantity,
        ownerAddress: currentUserId,
        status: 'OWNED',
        metadataUri: `ipfs://ticket/${selectedEvent.eventId}/${Date.now()}`,
      });

      setPurchasedTicketId(newTicket.ticketId);
      setPurchaseModalOpen(false);
      setSuccessModalOpen(true);
    } catch (error) {
      console.error('Failed to purchase ticket:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setIsPurchasing(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="spinner-cartoon"></div></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2">Browse Events</h2>
        <p className="font-hand text-paper-600">
          Discover amazing events and buy tickets with crypto
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.eventId}>
            {event.posterUrl && (
              <img
                src={event.posterUrl}
                alt={event.eventName}
                className="w-full h-48 object-cover border-b-3 border-ink"
              />
            )}
            <CardHeader>
              <div className="flex items-start justify-between gap-2 mb-2">
                <CardTitle className="text-xl">{event.eventName}</CardTitle>
                <Badge>{event.category}</Badge>
              </div>
              <CardDescription>{event.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm font-hand mb-4">
                <p>📍 {event.venue}</p>
                <p>📅 {formatDate(event.eventDate)}</p>
                <p className="font-comic font-bold text-lg">{formatCurrency(event.ticketPrice)}</p>
              </div>
              <button
                className="btn-primary w-full"
                onClick={() => handlePurchaseClick(event)}
              >
                Buy Tickets 🎟️
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Purchase Modal */}
      <Modal
        isOpen={purchaseModalOpen}
        onClose={() => setPurchaseModalOpen(false)}
        title="Purchase Tickets"
        size="lg"
      >
        {selectedEvent && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-primary">
              <h3 className="font-bold text-lg mb-2">{selectedEvent.eventName}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-gray-600">Venue:</span> {selectedEvent.venue}</div>
                <div><span className="text-gray-600">Date:</span> {formatDate(selectedEvent.eventDate)}</div>
                <div><span className="text-gray-600">Category:</span> <Badge>{selectedEvent.category}</Badge></div>
                <div><span className="text-gray-600">Price:</span> {formatCurrency(selectedEvent.ticketPrice)}</div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Tickets
              </label>
              <Input
                type="number"
                value={ticketQuantity}
                onChange={(e) => setTicketQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max="10"
              />
              <div className="mt-2 text-xs text-gray-500">
                Maximum 10 tickets per purchase
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">Purchase Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ticket Price:</span>
                  <span className="font-semibold">{formatCurrency(selectedEvent.ticketPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-semibold">{ticketQuantity}</span>
                </div>
                <div className="flex justify-between border-t pt-1 mt-2">
                  <span className="font-medium">Total Amount:</span>
                  <span className="font-bold text-green-700">
                    {formatCurrency(selectedEvent.ticketPrice * ticketQuantity)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="text-xs text-blue-800">
                  <strong>Blockchain Transaction:</strong> Your ticket will be minted as an NFT on Base Sepolia.
                  You'll receive a QR code for event entry.
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPurchaseModalOpen(false)}
                className="btn-outline flex-1"
                disabled={isPurchasing}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPurchase}
                className="btn-primary flex-1"
                disabled={isPurchasing || ticketQuantity < 1}
              >
                {isPurchasing ? (
                  <span>Processing...</span>
                ) : (
                  <span>Confirm Purchase ({formatCurrency(selectedEvent.ticketPrice * ticketQuantity)})</span>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title="🎉 Purchase Successful!"
        size="md"
      >
        {selectedEvent && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Ticket Purchased Successfully!</h3>
              <p className="text-gray-600 text-sm">
                Your ticket NFT has been minted on Base Sepolia
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Event:</span>
                <span className="font-semibold">{selectedEvent.eventName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-semibold">{ticketQuantity} ticket(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Paid:</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(selectedEvent.ticketPrice * ticketQuantity)}
                </span>
              </div>
              {purchasedTicketId && (
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">Ticket ID:</span>
                  <span className="font-mono text-xs">{purchasedTicketId}</span>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="text-xs text-blue-800">
                  Your ticket(s) are now available in the <strong>"My Tickets"</strong> section with QR codes for entry.
                </div>
              </div>
            </div>

            <button
              onClick={() => setSuccessModalOpen(false)}
              className="btn-primary w-full"
            >
              View My Tickets
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};
