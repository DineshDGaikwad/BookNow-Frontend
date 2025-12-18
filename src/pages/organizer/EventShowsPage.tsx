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
  const [editingShow, setEditingShow] = useState<ShowResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<CreateShowRequest>({
    eventId: eventId || '',
    venueId: '',
    showStartTime: '',
    showEndTime: '',
    showLanguage: '',
    showFormat: ''
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
    

    
    try {
      const userId = user?.userId || 'test-organizer-id';
      if (editingShow) {
        await showAPI.updateShow(editingShow.showId, userId, {
          showStartTime: formData.showStartTime,
          showEndTime: formData.showEndTime,
          showLanguage: formData.showLanguage,
          showFormat: formData.showFormat
        });

        toast.success('Show updated successfully!');
      } else {
        // Convert datetime-local format to ISO format
        const showData = {
          ...formData,
          showStartTime: new Date(formData.showStartTime).toISOString(),
          showEndTime: new Date(formData.showEndTime).toISOString()
        };
        await showAPI.createShow(userId, showData);
        toast.success('Show created successfully!');
      }
      resetForm();
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${editingShow ? 'update' : 'create'} show`);
    }
  };

  const resetForm = () => {
    setShowCreateForm(false);
    setEditingShow(null);
    setFormData({
      eventId: eventId || '',
      venueId: '',
      showStartTime: '',
      showEndTime: '',
      showLanguage: '',
      showFormat: ''
    });
  };

  const handleEditShow = (show: ShowResponse) => {
    setEditingShow(show);
    setFormData({
      eventId: show.eventId,
      venueId: show.venueId,
      showStartTime: new Date(show.showStartTime).toISOString().slice(0, 16),
      showEndTime: new Date(show.showEndTime).toISOString().slice(0, 16),
      showLanguage: show.showLanguage || '',
      showFormat: show.showFormat || ''
    });
    setShowCreateForm(true);
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

  const getStatusText = (status: number | undefined) => {
    if (status === undefined) return 'Unknown';
    switch (status) {
      case 0: return 'Scheduled';
      case 1: return 'Live';
      case 2: return 'Completed';
      case 3: return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status: number | undefined) => {
    if (status === undefined) return 'bg-gray-100 text-gray-800';
    switch (status) {
      case 0: return 'bg-blue-100 text-blue-800';
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-gray-100 text-gray-800';
      case 3: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleVenueChange = (venueId: string) => {
    setFormData({
      ...formData,
      venueId
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-800 rounded w-1/3"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-800 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link to="/organizer/events" className="text-blue-400 hover:text-blue-300 hover:underline mb-2 block">← Back to Events</Link>
            <h1 className="text-3xl font-bold text-white mb-2">Shows for "{event?.eventTitle}"</h1>
            <p className="text-gray-300">Manage performances for this event</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Create New Show
          </button>
        </div>

        {/* Create/Edit Show Form */}
        {showCreateForm && (
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 mb-8 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4">{editingShow ? 'Edit Show' : 'Create New Show'}</h2>
            <form onSubmit={handleCreateShow} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Venue *</label>
                  <select
                    value={formData.venueId}
                    onChange={(e) => handleVenueChange(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                  >
                    <option value="">Select venue</option>
                    {venues.map(venue => (
                      <option key={venue.venueId} value={venue.venueId}>
                        {venue.venueName} - {venue.venueCity}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Language</label>
                  <select
                    value={formData.showLanguage}
                    onChange={(e) => setFormData({...formData, showLanguage: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
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
                  <label className="block text-sm font-medium text-gray-300 mb-1">Start Time *</label>
                  <input
                    type="datetime-local"
                    value={formData.showStartTime}
                    onChange={(e) => setFormData({...formData, showStartTime: e.target.value})}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">End Time *</label>
                  <input
                    type="datetime-local"
                    value={formData.showEndTime}
                    onChange={(e) => setFormData({...formData, showEndTime: e.target.value})}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Format</label>
                <select
                  value={formData.showFormat}
                  onChange={(e) => setFormData({...formData, showFormat: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
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

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 border border-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingShow ? 'Update Show' : 'Create Show'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Shows List */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">Shows ({shows.length})</h2>
          {shows.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎭</div>
              <h3 className="text-xl font-semibold text-white mb-2">No Shows Yet</h3>
              <p className="text-gray-300 mb-6">Create your first show to start selling tickets</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Create First Show
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {shows.map(show => (
                <div key={show.showId} className="border border-gray-700 rounded-lg p-4 bg-gray-800">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-white">{show.venueName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(show.showStatus)}`}>
                          {getStatusText(show.showStatus)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-gray-300">
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
                          {show.seatPricing && show.seatPricing.length > 0 ? (
                            `₹${Math.min(...show.seatPricing.map(sp => sp.showPrice))} - ₹${Math.max(...show.seatPricing.map(sp => sp.showPrice))}`
                          ) : (
                            'Pricing not set'
                          )}
                        </div>
                        <div>
                          <span className="font-medium">Seats:</span><br />
                          {show.availableSeats}/{show.totalSeats} available
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex space-x-2">
                      <button
                        onClick={() => handleEditShow(show)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteShow(show.showId)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
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