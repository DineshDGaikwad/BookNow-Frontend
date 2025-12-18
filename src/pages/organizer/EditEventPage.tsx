import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import Header from '../../components/common/Header';
import { organizerAPI, EventResponse, VenueResponse } from '../../services/organizerAPI';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'react-toastify';

const EditEventPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [venues, setVenues] = useState<VenueResponse[]>([]);
  const [formData, setFormData] = useState({
    eventTitle: '',
    eventDescription: '',
    eventCategory: '',
    eventGenre: '',
    venueId: '',
    posterUrl: ''
  });

  useEffect(() => {
    if (user?.userId && eventId) {
      loadData();
    }
  }, [user, eventId]);

  const loadData = async () => {
    try {
      if (!user?.userId || !eventId) return;
      const [eventData, venuesData] = await Promise.all([
        organizerAPI.getEvent(eventId, user.userId),
        organizerAPI.getVenues(user.userId)
      ]);
      
      setFormData({
        eventTitle: eventData.eventTitle,
        eventDescription: eventData.eventDescription || '',
        eventCategory: eventData.eventCategory,
        eventGenre: eventData.eventGenre || '',
        venueId: '',
        posterUrl: eventData.posterUrl || ''
      });
      setVenues(venuesData);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.userId || !eventId) return;

    setSaving(true);
    try {
      await organizerAPI.updateEvent(eventId, user.userId, formData);
      toast.success('Event updated successfully');
      navigate(`/organizer/events/${eventId}`);
    } catch (error) {
      console.error('Failed to update event:', error);
      toast.error('Failed to update event');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(`/organizer/events/${eventId}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Event
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Event</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                value={formData.eventTitle}
                onChange={(e) => setFormData({ ...formData, eventTitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.eventDescription}
                onChange={(e) => setFormData({ ...formData, eventDescription: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.eventCategory}
                  onChange={(e) => setFormData({ ...formData, eventCategory: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Music">Music</option>
                  <option value="Sports">Sports</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Theater">Theater</option>
                  <option value="Conference">Conference</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Genre
                </label>
                <input
                  type="text"
                  value={formData.eventGenre}
                  onChange={(e) => setFormData({ ...formData, eventGenre: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Rock, Pop, Jazz"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poster URL
              </label>
              <input
                type="url"
                value={formData.posterUrl}
                onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/poster.jpg"
              />
            </div>

            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 font-medium"
              >
                <Save className="h-5 w-5 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/organizer/events/${eventId}`)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEventPage;
