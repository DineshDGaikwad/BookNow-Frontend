import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { Plus, Trash2, Calendar, MapPin, Clock, Users } from 'lucide-react';
import { RootState } from '../../store';
import Header from '../../components/common/Header';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { showAPI, ShowResponse, CreateShowWithSeatPricingRequest, SeatPricingRequest } from '../../services/showAPI';
import { venueAPI, VenueResponse, VenueSeatConstraint } from '../../services/venueAPI';
import { organizerAPI, EventResponse } from '../../services/organizerAPI';

interface SeatPricing {
  seatType: string;
  price: number;
}

const ShowManagementPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [event, setEvent] = useState<EventResponse | null>(null);
  const [shows, setShows] = useState<ShowResponse[]>([]);
  const [venues, setVenues] = useState<VenueResponse[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [seatConfigurations, setSeatConfigurations] = useState<VenueSeatConstraint[]>([]);
  const [seatPricing, setSeatPricing] = useState<SeatPricing[]>([]);
  const [formData, setFormData] = useState<CreateShowWithSeatPricingRequest>({
    eventId: eventId || '',
    venueId: '',
    showStartTime: '',
    showEndTime: '',
    showLanguage: '',
    showFormat: '',
    seatPricing: []
  });

  useEffect(() => {
    if (eventId && user?.userId) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [eventId, user?.userId]);

  useEffect(() => {
    if (formData.venueId && user?.userId) {
      loadVenueSeatConfigurations(formData.venueId);
    } else {
      setSeatConfigurations([]);
      setSeatPricing([]);
    }
  }, [formData.venueId, user?.userId]);

  const loadData = async () => {
    try {
      const userId = user?.userId || '';
      
      const [eventData, showsData, venuesData] = await Promise.all([
        organizerAPI.getEvent(eventId!, userId),
        showAPI.getEventShows(eventId!, userId),
        venueAPI.getVenues(userId)
      ]);
      
      setEvent(eventData);
      setShows(showsData || []);
      setVenues((venuesData || []).filter(v => v.venueStatus === 1));
      
    } catch (error) {
      console.error('Failed to load data:', error);
      setShows([]);
      setVenues([]);
    } finally {
      setLoading(false);
    }
  };

  const loadVenueSeatConfigurations = async (venueId: string) => {
    try {
      const configurations = await venueAPI.getVenueSeatConfigurations(venueId);
      setSeatConfigurations(configurations);
      
      // Initialize seat pricing with base prices
      const initialPricing = configurations.map((config) => ({
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
  };

  const handleSeatPriceChange = (seatType: string, price: number) => {
    const updatedPricing = seatPricing.map(sp => 
      sp.seatType === seatType ? { ...sp, price } : sp
    );
    
    setSeatPricing(updatedPricing);
    setFormData(prev => ({
      ...prev,
      seatPricing: updatedPricing
    }));
  };

  const handleCreateShow = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const userId = user?.userId || '';
      await showAPI.createShowWithSeatPricing(userId, formData);
      resetForm();
      loadData();
    } catch (error: any) {
      console.error('Failed to create show:', error);
    }
  };

  const resetForm = () => {
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
  };

  const handleDeleteShow = async (showId: string) => {
    if (window.confirm('Are you sure you want to delete this show?')) {
      try {
        const userId = user?.userId || '';
        await showAPI.deleteShow(showId, userId);
        loadData();
      } catch (error) {
        console.error('Failed to delete show:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-700 rounded w-1/3"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link to="/organizer/events" className="text-purple-400 hover:underline mb-2 block">← Back to Events</Link>
            <h1 className="text-3xl font-bold text-white mb-2">
              Shows for "{event?.eventTitle || 'Loading...'}"
            </h1>
            <p className="text-gray-400">Manage performances for this event</p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="h-4 w-4" />
            Create New Show
          </Button>
        </div>

        {/* Create Show Form */}
        {showCreateForm && (
          <Card className="bg-gray-800 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Create New Show</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateShow} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Venue *</label>
                    <select
                      value={formData.venueId}
                      onChange={(e) => setFormData({...formData, venueId: e.target.value})}
                      required
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                    <select
                      value={formData.showLanguage}
                      onChange={(e) => setFormData({...formData, showLanguage: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select language</option>
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Tamil">Tamil</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Start Time *</label>
                    <input
                      type="datetime-local"
                      value={formData.showStartTime}
                      onChange={(e) => setFormData({...formData, showStartTime: e.target.value})}
                      required
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">End Time *</label>
                    <input
                      type="datetime-local"
                      value={formData.showEndTime}
                      onChange={(e) => setFormData({...formData, showEndTime: e.target.value})}
                      required
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Format</label>
                  <select
                    value={formData.showFormat}
                    onChange={(e) => setFormData({...formData, showFormat: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
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
                    <h3 className="text-lg font-semibold text-white mb-4">Seat Pricing</h3>
                    <div className="space-y-4">
                      {seatConfigurations.map((config) => {
                        const currentPricing = seatPricing.find(sp => sp.seatType === config.seatType);
                        return (
                          <div key={config.seatType} className="bg-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="text-white font-medium">{config.seatType}</h4>
                                <p className="text-gray-400 text-sm">{config.totalSeats} seats available</p>
                              </div>
                              <Badge variant="outline" className="border-gray-600 text-gray-300">
                                ₹{config.minPrice} - ₹{config.maxPrice}
                              </Badge>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Set Price (₹{config.minPrice} - ₹{config.maxPrice})
                              </label>
                              <input
                                type="number"
                                min={config.minPrice}
                                max={config.maxPrice}
                                value={currentPricing?.price || config.minPrice}
                                onChange={(e) => handleSeatPriceChange(config.seatType, Number(e.target.value))}
                                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    onClick={resetForm}
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={!formData.venueId || seatConfigurations.length === 0}
                  >
                    Create Show
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Shows List */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Shows ({shows.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {shows.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Shows Yet</h3>
                <p className="text-gray-400 mb-6">Create your first show to start selling tickets</p>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Show
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {shows.map(show => (
                  <div key={show.showId} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-700/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-2">{show.venueName}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <div>
                              <span className="font-medium text-gray-300">Start:</span><br />
                              {new Date(show.showStartTime).toLocaleString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <div>
                              <span className="font-medium text-gray-300">End:</span><br />
                              {new Date(show.showEndTime).toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-300">Language:</span><br />
                            {show.showLanguage || 'Not specified'}
                          </div>
                          <div>
                            <span className="font-medium text-gray-300">Price:</span><br />
                            ₹{show.showPriceMin} - ₹{show.showPriceMax}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDeleteShow(show.showId)}
                        variant="destructive"
                        size="sm"
                        className="ml-4"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShowManagementPage;