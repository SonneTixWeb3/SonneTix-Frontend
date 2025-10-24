import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, Badge, Modal, Input, Textarea } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import { eventApi } from '@/lib/mockApi';
import { useAppStore } from '@/lib/store';
import { Event } from '@/types';

interface OrganizerEventsPageProps {
  onNavigate?: (path: string) => void;
}

export const OrganizerEventsPage: React.FC<OrganizerEventsPageProps> = ({ onNavigate }) => {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [viewModalOpen, setViewModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [progressModalOpen, setProgressModalOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  const [ticketSales, setTicketSales] = React.useState<{ sold: number; total: number; revenue: number; soldPercentage: number } | null>(null);
  const [editFormData, setEditFormData] = React.useState<Partial<Event>>({});
  const currentUserId = useAppStore((state) => state.currentUserId);

  React.useEffect(() => {
    loadEvents();
  }, [currentUserId]);

  const loadEvents = async () => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    try {
      const data = await eventApi.getEventsByOrganizer(currentUserId);
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (event: Event) => {
    setSelectedEvent(event);
    // Load real ticket sales data
    const salesData = await eventApi.getTicketSales(event.eventId);
    setTicketSales(salesData);
    setViewModalOpen(true);
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setEditFormData({
      eventName: event.eventName,
      description: event.description,
      venue: event.venue,
      eventDate: event.eventDate,
      ticketPrice: event.ticketPrice,
      totalTickets: event.totalTickets,
      category: event.category,
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedEvent) return;

    try {
      // Update event in mockApi
      const updatedEvent = {
        ...selectedEvent,
        ...editFormData,
      };

      // In a real app, you'd call eventApi.updateEvent()
      // For now, just update local state
      setEvents(events.map(e => e.eventId === selectedEvent.eventId ? updatedEvent as Event : e));
      setEditModalOpen(false);
      console.log('Event updated:', updatedEvent);
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  };

  const handleProgressEvent = (event: Event) => {
    setSelectedEvent(event);
    setProgressModalOpen(true);
  };

  const handleUpdateStatus = async (newStatus: 'PUBLISHED' | 'ACTIVE' | 'COMPLETED') => {
    if (!selectedEvent) return;

    try {
      await eventApi.updateEvent(selectedEvent.eventId, { status: newStatus });

      // Update local state
      setEvents(events.map(e =>
        e.eventId === selectedEvent.eventId
          ? { ...e, status: newStatus }
          : e
      ));

      setProgressModalOpen(false);
      setViewModalOpen(false);
      alert(`✅ Event status updated to ${newStatus}!`);
      loadEvents(); // Refresh events
    } catch (error) {
      console.error('Failed to update event status:', error);
      alert('Failed to update event status. Please try again.');
    }
  };

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
                  <span className="text-gray-600">Total Tickets</span>
                  <span className="font-medium">{event.totalTickets}</span>
                </div>
                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-gray-600">Status</span>
                  <Badge variant={event.status === 'COMPLETED' ? 'success' : event.status === 'ACTIVE' ? 'warning' : 'default'}>
                    {event.status}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn-primary flex-1 text-sm"
                    onClick={() => handleProgressEvent(event)}
                  >
                    ⏩ Progress
                  </button>
                  <button
                    className="btn-secondary flex-1 text-sm"
                    onClick={() => handleViewDetails(event)}
                  >
                    View
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

      {/* View Details Modal - Enhanced */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title={selectedEvent?.eventName || "Event Details"}
        size="xl"
      >
        {selectedEvent && (
          <div className="space-y-6">
            {/* Event Header */}
            <div className="flex items-start justify-between pb-4 border-b">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge>{selectedEvent.category}</Badge>
                  <Badge variant={selectedEvent.status === 'PUBLISHED' ? 'success' : 'default'}>
                    {selectedEvent.status}
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm mt-2">{selectedEvent.description}</p>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-blue-700 uppercase">Tickets Sold</span>
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {ticketSales?.sold || 0} / {ticketSales?.total || selectedEvent.totalTickets}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  {ticketSales ? `${Math.round(ticketSales.soldPercentage)}% sold` : 'No sales yet'}
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-green-700 uppercase">Revenue</span>
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-green-900">
                  {formatCurrency(ticketSales?.revenue || 0)}
                </div>
                <div className="text-xs text-green-600 mt-1">of {formatCurrency(selectedEvent.ticketPrice * selectedEvent.totalTickets)} potential</div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-purple-700 uppercase">Sales Status</span>
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-purple-900">
                  {selectedEvent.status === 'DRAFT' ? 'Not Started' : selectedEvent.status === 'PUBLISHED' ? 'Open' : 'Closed'}
                </div>
                <div className="text-xs text-purple-600 mt-1">
                  {selectedEvent.status === 'DRAFT' ? 'Publish to start sales' : selectedEvent.status === 'PUBLISHED' ? 'Tickets available' : 'Event concluded'}
                </div>
              </div>
            </div>

            {/* Ticket Sales Progress */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">Ticket Sales Progress</h3>
                <span className="text-sm text-gray-600">
                  {ticketSales ? `${Math.round(ticketSales.soldPercentage)}% sold` : '0% sold'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{width: `${ticketSales?.soldPercentage || 0}%`}}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>{ticketSales?.sold || 0} sold</span>
                <span>{selectedEvent.totalTickets} total</span>
              </div>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <div className="text-xs text-gray-500">Venue</div>
                    <div className="font-medium text-gray-900">{selectedEvent.venue}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <div className="text-xs text-gray-500">Event Date</div>
                    <div className="font-medium text-gray-900">{formatDate(selectedEvent.eventDate)}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="text-xs text-gray-500">Ticket Price</div>
                    <div className="font-medium text-gray-900">{formatCurrency(selectedEvent.ticketPrice)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <div>
                    <div className="text-xs text-gray-500">Total Capacity</div>
                    <div className="font-medium text-gray-900">{selectedEvent.totalTickets} tickets</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Event Lifecycle</h3>
              <div className="flex items-center justify-between relative">
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-300"></div>
                <div className="absolute top-4 left-0 h-0.5 bg-blue-500 transition-all" style={{width: selectedEvent.status === 'PUBLISHED' ? '33%' : '66%'}}></div>

                <div className="flex flex-col items-center z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedEvent.status === 'PUBLISHED' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-xs mt-2 font-medium">Published</span>
                </div>

                <div className="flex flex-col items-center z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedEvent.status === 'ACTIVE' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-xs mt-2 font-medium">Active</span>
                </div>

                <div className="flex flex-col items-center z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedEvent.status === 'COMPLETED' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-xs mt-2 font-medium">Completed</span>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="border-t pt-4 space-y-2">
              <div>
                <span className="text-xs text-gray-500">Event ID:</span>
                <p className="text-xs font-mono text-gray-700 mt-1">{selectedEvent.eventId}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">IP Certificate Hash:</span>
                <p className="text-xs font-mono text-gray-700 mt-1 break-all">{selectedEvent.ipCertificateHash}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={() => {
                  setViewModalOpen(false);
                  onNavigate?.(`/organizer/create-vault/${selectedEvent.eventId}`);
                }}
                className="btn-primary flex-1"
              >
                <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Create Vault
              </button>
              <button
                onClick={() => handleEdit(selectedEvent)}
                className="btn-secondary flex-1"
              >
                <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Event
              </button>
              <button
                onClick={() => setViewModalOpen(false)}
                className="btn-outline"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Event Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Event"
        size="lg"
      >
        {selectedEvent && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Name
              </label>
              <Input
                value={editFormData.eventName || ''}
                onChange={(e) => setEditFormData({ ...editFormData, eventName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                value={editFormData.description || ''}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Venue
              </label>
              <Input
                value={editFormData.venue || ''}
                onChange={(e) => setEditFormData({ ...editFormData, venue: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Date
              </label>
              <Input
                type="date"
                value={editFormData.eventDate || ''}
                onChange={(e) => setEditFormData({ ...editFormData, eventDate: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ticket Price
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={editFormData.ticketPrice || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, ticketPrice: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Tickets
                </label>
                <Input
                  type="number"
                  value={editFormData.totalTickets || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, totalTickets: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-4">
              <button onClick={() => setEditModalOpen(false)} className="btn-outline">
                Cancel
              </button>
              <button onClick={handleSaveEdit} className="btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Progress Event Modal - Milestone Based */}
      <Modal
        isOpen={progressModalOpen}
        onClose={() => setProgressModalOpen(false)}
        title="Progress Event Milestone"
        size="lg"
      >
        {selectedEvent && (
          <div className="space-y-6">
            {/* Current Status */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{selectedEvent.eventName}</h3>
                  <p className="text-sm text-gray-600 mt-1">Current Status: <Badge>{selectedEvent.status}</Badge></p>
                </div>
              </div>
            </div>

            {/* Milestone Progress Flow */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Event Lifecycle Milestones</h3>

              {/* Milestone 1: Published */}
              <div className={`border-2 rounded-lg p-4 transition-all ${
                selectedEvent.status === 'PUBLISHED' ? 'border-blue-500 bg-blue-50' :
                selectedEvent.status === 'DRAFT' ? 'border-gray-300 bg-white hover:border-blue-400 cursor-pointer' :
                'border-green-500 bg-green-50'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {selectedEvent.status !== 'DRAFT' && (
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                      <h4 className="font-semibold text-gray-900">1. Event Published</h4>
                    </div>
                    <p className="text-sm text-gray-600">Event is visible to fans and investors. Ticket sales open.</p>
                    <div className="mt-3 text-xs text-gray-500">
                      ✓ Event details finalized<br/>
                      ✓ Tickets available for purchase<br/>
                      ✓ Vault can be created for funding
                    </div>
                  </div>
                  {selectedEvent.status === 'DRAFT' && (
                    <button
                      onClick={() => handleUpdateStatus('PUBLISHED')}
                      className="btn-primary text-sm"
                    >
                      Publish Event →
                    </button>
                  )}
                </div>
              </div>

              {/* Milestone 2: Active */}
              <div className={`border-2 rounded-lg p-4 transition-all ${
                selectedEvent.status === 'ACTIVE' ? 'border-blue-500 bg-blue-50' :
                selectedEvent.status === 'PUBLISHED' ? 'border-gray-300 bg-white hover:border-blue-400 cursor-pointer' :
                selectedEvent.status === 'COMPLETED' ? 'border-green-500 bg-green-50' :
                'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {selectedEvent.status === 'COMPLETED' && (
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                      <h4 className="font-semibold text-gray-900">2. Event Active (Happening Now)</h4>
                    </div>
                    <p className="text-sm text-gray-600">Event is currently taking place. Ticket scanning active.</p>
                    <div className="mt-3 text-xs text-gray-500">
                      ✓ Event day arrived<br/>
                      ✓ Attendees checking in<br/>
                      ✓ QR code scanning operational
                    </div>
                  </div>
                  {selectedEvent.status === 'PUBLISHED' && (
                    <button
                      onClick={() => handleUpdateStatus('ACTIVE')}
                      className="btn-primary text-sm"
                    >
                      Start Event →
                    </button>
                  )}
                </div>
              </div>

              {/* Milestone 3: Completed */}
              <div className={`border-2 rounded-lg p-4 transition-all ${
                selectedEvent.status === 'COMPLETED' ? 'border-green-500 bg-green-50' :
                selectedEvent.status === 'ACTIVE' ? 'border-gray-300 bg-white hover:border-blue-400 cursor-pointer' :
                'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {selectedEvent.status === 'COMPLETED' && (
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                      <h4 className="font-semibold text-gray-900">3. Event Completed</h4>
                    </div>
                    <p className="text-sm text-gray-600">Event finished successfully. Settlement and payouts processing.</p>
                    <div className="mt-3 text-xs text-gray-500">
                      ✓ Event concluded<br/>
                      ✓ Final attendance recorded<br/>
                      ✓ Vault debt settlement begins<br/>
                      ✓ Investor returns distributed
                    </div>
                  </div>
                  {selectedEvent.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleUpdateStatus('COMPLETED')}
                      className="btn-primary text-sm"
                    >
                      Complete Event →
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-yellow-800">
                  <strong>Important:</strong> Progressing through milestones is irreversible. Make sure you're ready before advancing the event status.
                </div>
              </div>
            </div>

            <button
              onClick={() => setProgressModalOpen(false)}
              className="btn-outline w-full"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};
