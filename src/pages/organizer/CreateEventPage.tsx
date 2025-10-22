import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Input, Textarea } from '@/components/ui';

export const CreateEventPage: React.FC = () => {
  const [formData, setFormData] = React.useState({
    eventName: '',
    description: '',
    venue: '',
    eventDate: '',
    ticketPrice: '',
    totalCapacity: '',
    category: 'MUSIC'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating event:', formData);
    alert(`Event "${formData.eventName}" will be created! This will mint an NFT and deploy event contracts.`);
    // TODO: Implement event creation logic
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="mb-2">Create New Event</h2>
        <p className="text-sm text-gray-600">
          Fill in the details to create your event
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Name
              </label>
              <Input
                value={formData.eventName}
                onChange={(e) => handleChange('eventName', e.target.value)}
                placeholder="Enter event name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe your event"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Venue
                </label>
                <Input
                  value={formData.venue}
                  onChange={(e) => handleChange('venue', e.target.value)}
                  placeholder="Event location"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Date
                </label>
                <Input
                  type="datetime-local"
                  value={formData.eventDate}
                  onChange={(e) => handleChange('eventDate', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ticket Price (USDC)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.ticketPrice}
                  onChange={(e) => handleChange('ticketPrice', e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Capacity
                </label>
                <Input
                  type="number"
                  value={formData.totalCapacity}
                  onChange={(e) => handleChange('totalCapacity', e.target.value)}
                  placeholder="1000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="MUSIC">Music</option>
                  <option value="SPORTS">Sports</option>
                  <option value="CONFERENCE">Conference</option>
                  <option value="FESTIVAL">Festival</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" className="btn-primary flex-1">
                Create Event
              </button>
              <button
                type="button"
                className="btn-outline flex-1"
                onClick={() => alert('Go back to dashboard')}
              >
                Cancel
              </button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};
