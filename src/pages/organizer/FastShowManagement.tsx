import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { RootState } from '../../store';
import Header from '../../components/common/Header';
import { showAPI, ShowResponse, CreateShowWithSeatPricingRequest, SeatPricingRequest } from '../../services/showAPI';
import { venueAPI, VenueResponse, VenueSeatConstraint } from '../../services/venueAPI';
import { organizerAPI, EventResponse } from '../../services/organizerAPI';
import { toast } from 'react-toastify';

interface SeatPricing {
  seatType: string;
  price: number;
}

const FastShowManagement: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [event, setEvent] = useState<EventResponse | null>(null);
  const [shows, setShows] = useState<ShowResponse[]>([]);
  const [venues, setVenues] = useState<VenueResponse[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [seatConfigurations, setSeatConfigurations] = useState<VenueSeatConstraint[]>([]);
  const [seatPricing, setSeatPricing] = useState<SeatPricing[]>([]);

  const userId = useMemo(() => user?.userId || '', [user?.userId]);

  const [formData, setFormData] = useState<CreateShowWithSeatPricingRequest>({
    eventId: eventId || '',
    venueId: '',
    showStartTime: '',
    showEndTime: '',
    showLanguage: '',
    showFormat: '',
    seatPricing: []
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
      setVenues((venuesData || []).filter((v: any) => v.venueStatus === 1));
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

  useEffect(() => {
    if (formData.venueId && userId) {
      loadVenueSeatConfigurations(formData.venueId);
    } else {
      setSeatConfigurations([]);
      setSeatPricing([]);
    }
  }, [formData.venueId, userId]);

  const loadVenueSeatConfigurations = useCallback(async (venueId: string) => {
    try {
      const configurations = await venueAPI.getVenueSeatConfigurations(venueId);
      setSeatConfigurations(configurations);
      
      // Initialize seat pricing with base prices
      const initialPricing = configurations.map((config: any) => ({
        seatType: config.seatType,
        price: config.minPrice
      }));
      setSeatPricing(initialPricing);
      
      // Update form data with seat pricing
      setFormData(prev => ({
        ...prev,
        seatPricing: initialPricing
      }));
      
    } catch (error) {
      console.error('Failed to load venue seat configurations:', error);
      setSeatConfigurations([]);
      setSeatPricing([]);
    }
  }, []);

  const handleSeatPriceChange = useCallback((seatType: string, price: number) => {
    const updatedPricing = seatPricing.map(sp => 
      sp.seatType === seatType ? { ...sp, price } : sp
    );
    
    setSeatPricing(updatedPricing);
    setFormData(prev => ({
      ...prev,
      seatPricing: updatedPricing
    }));
  }, [seatPricing]);

  const handleCreateShow = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await showAPI.createShowWithSeatPricing(userId, formData);
      toast.success('Show created successfully!');
      resetForm();
      loadData();
    } catch (error: any) {
      toast.error('Failed to create show');
    }
  }, [userId, formData, loadData]);

  const resetForm = useCallback(() => {
    setShowCreateForm(false);
    setFormData({
      eventId: eventId || '',
      venueId: '',
      showStartTime: '',
      showEndTime: '',
      showLanguage: '',
      showFormat: '',
      seatPricing: []
    });
    setSeatConfigurations([]);
    setSeatPricing([]);
  }, [eventId]);

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
                <div>
                  <label className="block text-sm font-medium mb-1">Venue *</label>
                  <select
                    value={formData.venueId}
                    onChange={(e) => setFormData({...formData, venueId: e.target.value})}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
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
                  <label className="block text-sm font-medium mb-1">Language</label>
                  <select
                    value={formData.showLanguage}
                    onChange={(e) => setFormData({...formData, showLanguage: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Select language</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Tamil">Tamil</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Time *</label>
                  <input
                    type="datetime-local"
                    value={formData.showStartTime}
                    onChange={(e) => setFormData({...formData, showStartTime: e.target.value})}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">End Time *</label>
                  <input
                    type="datetime-local"
                    value={formData.showEndTime}
                    onChange={(e) => setFormData({...formData, showEndTime: e.target.value})}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Format</label>
                <select
                  value={formData.showFormat}
                  onChange={(e) => setFormData({...formData, showFormat: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Select format</option>
                  <option value="Live">Live Performance</option>
                  <option value="2D">2D</option>
                  <option value="3D">3D</option>
                </select>
              </div>

              {/* Seat Pricing Section */}
              {seatConfigurations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Seat Pricing</h3>
                  <div className="space-y-3">
                    {seatConfigurations.map((config) => {
                      const currentPricing = seatPricing.find(sp => sp.seatType === config.seatType);
                      return (
                        <div key={config.seatType} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-medium">{config.seatType}</h4>
                              <p className="text-sm text-gray-600">{config.totalSeats} seats</p>
                            </div>
                            <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                              ₹{config.minPrice} - ₹{config.maxPrice}
                            </span>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Set Price (₹{config.minPrice} - ₹{config.maxPrice})
                            </label>
                            <input
                              type="number"
                              min={config.minPrice}
                              max={config.maxPrice}
                              value={currentPricing?.price || config.minPrice}
                              onChange={(e) => handleSeatPriceChange(config.seatType, Number(e.target.value))}
                              className="w-full px-3 py-2 border rounded-lg"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg"
                  disabled={!formData.venueId || seatConfigurations.length === 0}
                >
                  Create Show
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
                    <p className="text-sm">
                      {show.seatPricing && show.seatPricing.length > 0 ? (
                        `₹${Math.min(...show.seatPricing.map(sp => sp.showPrice))} - ₹${Math.max(...show.seatPricing.map(sp => sp.showPrice))}`
                      ) : (
                        'Pricing not set'
                      )}
                    </p>
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