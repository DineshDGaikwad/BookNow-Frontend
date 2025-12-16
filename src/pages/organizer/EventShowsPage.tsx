import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { RootState } from '../../store';
import Header from '../../components/common/Header';
import { showAPI, ShowResponse, CreateShowRequest } from '../../services/showAPI';
import { venueAPI, VenueResponse } from '../../services/venueAPI';
import { organizerAPI, EventResponse } from '../../services/organizerAPI';
import { toast } from 'react-toastify';

const EventShowsPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [event, setEvent] = useState<EventResponse | null>(null);
  const [shows, setShows] = useState<ShowResponse[]>([]);
  const [venues, setVenues] = useState<VenueResponse[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (eventId) {
      loadData();
    }
  }, [eventId, user]);

  const loadData = async () => {
    try {
      const userId = user?.userId || 'test-organizer-id';
      
      const eventData = await organizerAPI.getEvent(eventId!, userId);
      const showsData = await showAPI.getEventShows(eventId!, userId);
      const venuesData = await venueAPI.getVenues(userId);
      
      setEvent(eventData);
      setShows(showsData);
      setVenues(venuesData.filter(v => v.venueStatus === 1));
    } catch (error) {
      toast.error('Failed to load event data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShow = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate venue pricing
    const selectedVenue = venues.find(v => v.venueId === formData.venueId);
    if (selectedVenue && selectedVenue.defaultPriceMin && selectedVenue.defaultPriceMax) {
      if ((formData.showPriceMin || 0) < selectedVenue.defaultPriceMin) {
        toast.error(`Minimum price cannot be less than venue minimum: ₹${selectedVenue.defaultPriceMin}`);
        return;
      }
      if ((formData.showPriceMax || 0) > selectedVenue.defaultPriceMax) {
        toast.error(`Maximum price cannot exceed venue maximum: ₹${selectedVenue.defaultPriceMax}`);
        return;
      }
    }
    
    try {
      const userId = user?.userId || 'test-organizer-id';
      await showAPI.createShow(userId, formData);
      toast.success('Show created successfully!');
      setShowCreateForm(false);
      loadData();
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
    } catch (error) {
      toast.error('Failed to create show');
    }
  };

  const handleDeleteShow = async (showId: string) => {
    if (window.confirm('Are you sure you want to delete this show?')) {
      try {
        const userId = user?.userId || 'test-organizer-id';
        await showAPI.deleteShow(showId, userId);
        toast.success('Show deleted successfully');
        loadData();
      } catch (error) {
        toast.error('Failed to delete show');
      }
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return 'Scheduled';
      case 1: return 'Live';
      case 2: return 'Completed';
      case 3: return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: return 'bg-blue-100 text-blue-800';
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-gray-100 text-gray-800';
      case 3: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleVenueChange = (venueId: string) => {
    const selectedVenue = venues.find(v => v.venueId === venueId);
    setFormData({
      ...formData,
      venueId,
      showPriceMin: selectedVenue?.defaultPriceMin || 0,
      showPriceMax: selectedVenue?.defaultPriceMax || 0
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link to="/organizer/events" className="text-blue-500 hover:underline mb-2 block">← Back to Events</Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shows for "{event?.eventTitle}"</h1>
            <p className="text-gray-600">Manage performances for this event</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            Create New Show
          </button>
        </div>

        {/* Create Show Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Create New Show</h2>
            <form onSubmit={handleCreateShow} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue *</label>
                  <select
                    value={formData.venueId}
                    onChange={(e) => handleVenueChange(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select venue</option>
                    {venues.map(venue => (
                      <option key={venue.venueId} value={venue.venueId}>
                        {venue.venueName} - {venue.venueCity} (₹{venue.defaultPriceMin}-₹{venue.defaultPriceMax})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select
                    value={formData.showLanguage}
                    onChange={(e) => setFormData({...formData, showLanguage: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select language</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Kannada">Kannada</option>
                    <option value="Malayalam">Malayalam</option>
                    <option value="Bengali">Bengali</option>
                    <option value="Marathi">Marathi</option>
                    <option value="Gujarati">Gujarati</option>
                    <option value="Punjabi">Punjabi</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                  <input
                    type="datetime-local"
                    value={formData.showStartTime}
                    onChange={(e) => setFormData({...formData, showStartTime: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
                  <input
                    type="datetime-local"
                    value={formData.showEndTime}
                    onChange={(e) => setFormData({...formData, showEndTime: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                  <select
                    value={formData.showFormat}
                    onChange={(e) => setFormData({...formData, showFormat: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select format</option>
                    <option value="Live">Live Performance</option>
                    <option value="2D">2D</option>
                    <option value="3D">3D</option>
                    <option value="IMAX">IMAX</option>
                    <option value="4DX">4DX</option>
                    <option value="Dolby Atmos">Dolby Atmos</option>
                    <option value="Virtual">Virtual Event</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (₹)</label>
                  <input
                    type="number"
                    value={formData.showPriceMin}
                    onChange={(e) => setFormData({...formData, showPriceMin: Number(e.target.value)})}
                    min={venues.find(v => v.venueId === formData.venueId)?.defaultPriceMin || 0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.venueId && (
                    <p className="text-xs text-gray-500 mt-1">
                      Venue minimum: ₹{venues.find(v => v.venueId === formData.venueId)?.defaultPriceMin}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (₹)</label>
                  <input
                    type="number"
                    value={formData.showPriceMax}
                    onChange={(e) => setFormData({...formData, showPriceMax: Number(e.target.value)})}
                    max={venues.find(v => v.venueId === formData.venueId)?.defaultPriceMax || 10000}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.venueId && (
                    <p className="text-xs text-gray-500 mt-1">
                      Venue maximum: ₹{venues.find(v => v.venueId === formData.venueId)?.defaultPriceMax}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                >
                  Create Show
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Shows List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Shows ({shows.length})</h2>
          {shows.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎭</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Shows Yet</h3>
              <p className="text-gray-600 mb-6">Create your first show to start selling tickets</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
              >
                Create First Show
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {shows.map(show => (
                <div key={show.showId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{show.venueName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(show.showStatus)}`}>
                          {getStatusText(show.showStatus)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Start:</span><br />
                          {new Date(show.showStartTime).toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">End:</span><br />
                          {new Date(show.showEndTime).toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Language:</span><br />
                          {show.showLanguage || 'Not specified'}
                        </div>
                        <div>
                          <span className="font-medium">Price:</span><br />
                          ₹{show.showPriceMin} - ₹{show.showPriceMax}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteShow(show.showId)}
                      className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventShowsPage;