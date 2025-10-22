import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, Badge } from '@/components/ui';
import { eventApi } from '@/lib/mockApi';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Event } from '@/types';

export const FanEventsPage: React.FC = () => {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);

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
              <button className="btn-primary w-full">
                Buy Tickets 🎟️
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
