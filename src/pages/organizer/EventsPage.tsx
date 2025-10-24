import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, Badge } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';

interface EventData {
  eventId: string;
  eventName: string;
  description: string;
  category: string;
  venue: string;
  eventDate: string;
  ticketPrice: number;
  totalCapacity: number;
}

interface OrganizerEventsPageProps {
  onNavigate?: (path: string) => void;
}

export const OrganizerEventsPage: React.FC<OrganizerEventsPageProps> = ({ onNavigate }) => {
  const [events] = React.useState<EventData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="spinner-cartoon"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2">My Events</h2>
          <p className="text-sm text-gray-600">
            Manage and track all your events
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => onNavigate?.('/organizer/create-event')}
        >
          + Create New Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.map((event) => (
          <Card key={event.eventId}>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle>{event.eventName}</CardTitle>
                  <CardDescription className="mt-1">{event.description}</CardDescription>
                </div>
                <Badge>{event.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">{formatDate(event.eventDate)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Venue</span>
                  <span className="font-medium">{event.venue}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Ticket Price</span>
                  <span className="font-medium">{formatCurrency(event.ticketPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Capacity</span>
                  <span className="font-medium">{event.totalCapacity}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    className="btn-primary flex-1 text-sm"
                    onClick={() => console.log(`Edit event: ${event.eventName} - Edit functionality to be implemented`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-secondary flex-1 text-sm"
                    onClick={() => console.log(`View details for: ${event.eventName} - Details page to be implemented`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {events.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600 mb-4">You haven't created any events yet.</p>
            <button
              className="btn-primary"
              onClick={() => onNavigate?.('/organizer/create-event')}
            >
              Create Your First Event
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
