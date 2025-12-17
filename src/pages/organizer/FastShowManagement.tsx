import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { RootState } from '../../store';
import Header from '../../components/common/Header';
import { showAPI, ShowResponse, CreateShowRequest } from '../../services/showAPI';
import { venueAPI, VenueResponse } from '../../services/venueAPI';
import { organizerAPI, EventResponse } from '../../services/organizerAPI';
import { toast } from 'react-toastify';

const FastShowManagement: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [event, setEvent] = useState<EventResponse | null>(null);
  const [shows, setShows] = useState<ShowResponse[]>([]);
  const [venues, setVenues] = useState<VenueResponse[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const userId = useMemo(() => user?.userId || '', [user?.userId]);

  const [formData, setFormData] = useState<CreateShowRequest>({
    eventId: eventId || '',
    venueId: '',
    showStartTime: '',
    showEndTime: '',
    showLanguage: '',
    showFormat: '',
    showPriceMin: 0,
    showPriceMax: 0
  });

  const loadData = useCallback(async () => {
    if (!eventId || !userId) return;
    
    try {
      const [eventData, showsData, venuesData] = await Promise.all([
        organizerAPI.getEvent(eventId, userId),
        showAPI.getEventShows(eventId, userId),
        venueAPI.getVenues(userId)
      ]);
      
      setEvent(eventData);
      setShows(showsData || []);
      setVenues((venuesData || []).filter(v => v.venueStatus === 1));
    } catch (error) {
      toast.error('Failed to load data');
      setShows([]);
      setVenues([]);
    } finally {
      setLoading(false);
    }
  }, [eventId, userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateShow = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await showAPI.createShow(userId, formData);
      toast.success('Show created successfully!');
      setShowCreateForm(false);
      setFormData({
        eventId: eventId || '',
        venueId: '',
        showStartTime: '',
        showEndTime: '',
        showLanguage: '',
        showFormat: '',
        showPriceMin: 0,
        showPriceMax: 0
      });
      loadData();
    } catch (error: any) {
      toast.error('Failed to create show');
    }
  }, [userId, formData, eventId, loadData]);

  const handleDeleteShow = useCallback(async (showId: string) => {
    if (window.confirm('Delete this show?')) {
      try {
        await showAPI.deleteShow(showId, userId);
        toast.success('Show deleted');
        loadData();
      } catch (error) {
        toast.error('Failed to delete show');
      }
    }
  }, [userId, loadData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link to="/organizer/events" className="text-blue-500 hover:underline mb-2 block">← Back</Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shows for "{event?.eventTitle}"</h1>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Create Show
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Create New Show</h2>
            <form onSubmit={handleCreateShow} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={formData.venueId}
                  onChange={(e) => setFormData({...formData, venueId: e.target.value})}
                  required
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="">Select venue</option>
                  {venues.map(venue => (
                    <option key={venue.venueId} value={venue.venueId}>
                      {venue.venueName}
                    </option>
                  ))}
                </select>
                
                <input
                  type="datetime-local"
                  value={formData.showStartTime}
                  onChange={(e) => setFormData({...formData, showStartTime: e.target.value})}
                  required
                  className="px-3 py-2 border rounded-lg"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="datetime-local"
                  value={formData.showEndTime}
                  onChange={(e) => setFormData({...formData, showEndTime: e.target.value})}
                  required
                  className="px-3 py-2 border rounded-lg"
                />
                
                <input
                  type="number"
                  placeholder="Min Price"
                  value={formData.showPriceMin}
                  onChange={(e) => setFormData({...formData, showPriceMin: Number(e.target.value)})}
                  className="px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Shows ({shows.length})</h2>
          {shows.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No Shows Yet</h3>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg"
              >
                Create First Show
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {shows.map(show => (
                <div key={show.showId} className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{show.venueName}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(show.showStartTime).toLocaleString()} - {new Date(show.showEndTime).toLocaleString()}
                    </p>
                    <p className="text-sm">₹{show.showPriceMin} - ₹{show.showPriceMax}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteShow(show.showId)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FastShowManagement;