import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import Header from '../../components/common/Header';
import { organizerAPI, CreateEventRequest, VenueResponse } from '../../services/organizerAPI';
import { toast } from 'react-toastify';

const CreateEventPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [venues, setVenues] = useState<VenueResponse[]>([]);
  const [formData, setFormData] = useState<CreateEventRequest>({
    eventTitle: '',
    eventDescription: '',
    eventCategory: '',
    eventGenre: '',
    venueId: '',
    posterUrl: ''
  });

  const categories = [
    'Music', 'Theatre', 'Comedy', 'Sports', 'Conference', 
    'Workshop', 'Festival', 'Exhibition', 'Dance', 'Other'
  ];

  useEffect(() => {
    const loadVenues = async () => {
      if (user?.userId) {
        try {
          const venueData = await organizerAPI.getVenues(user.userId);
          setVenues(venueData);
        } catch (error) {
          console.error('Failed to load venues:', error);
        }
      }
    };
    loadVenues();
  }, [user?.userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.userId) return;

    setLoading(true);
    try {
      await organizerAPI.createEvent(user.userId, formData);
      toast.success('Event created successfully! Now create shows for this event.');
      navigate('/organizer/events');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Event</h1>
          <p className="text-gray-600">Create an event concept. You'll add shows with venues later.</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Title */}
            <div>
              <label htmlFor="eventTitle" className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                id="eventTitle"
                name="eventTitle"
                required
                value={formData.eventTitle}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your event title"
              />
            </div>

            {/* Event Description */}
            <div>
              <label htmlFor="eventDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Event Description
              </label>
              <textarea
                id="eventDescription"
                name="eventDescription"
                rows={4}
                value={formData.eventDescription}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your event..."
              />
            </div>

            {/* Venue Selection */}
            <div>
              <label htmlFor="venueId" className="block text-sm font-medium text-gray-700 mb-2">
                Venue *
              </label>
              <select
                id="venueId"
                name="venueId"
                required
                value={formData.venueId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a venue</option>
                {venues.map((venue) => (
                  <option key={venue.venueId} value={venue.venueId}>
                    {venue.venueName} - {venue.venueCity} (Capacity: {venue.venueCapacity})
                  </option>
                ))}
              </select>
              {venues.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  No venues available. Create a venue first or contact admin for venue approval.
                </p>
              )}
            </div>

            {/* Category and Genre */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="eventCategory" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="eventCategory"
                  name="eventCategory"
                  required
                  value={formData.eventCategory}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="eventGenre" className="block text-sm font-medium text-gray-700 mb-2">
                  Genre
                </label>
                <input
                  type="text"
                  id="eventGenre"
                  name="eventGenre"
                  value={formData.eventGenre}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Rock, Classical, Stand-up"
                />
              </div>
            </div>

            {/* Poster URL */}
            <div>
              <label htmlFor="posterUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Poster Image URL
              </label>
              <input
                type="url"
                id="posterUrl"
                name="posterUrl"
                value={formData.posterUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/poster.jpg"
              />
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Next Step:</strong> After creating the event, you'll be able to create shows 
                with specific venues, dates, and pricing for this event.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/organizer/events')}
                className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;