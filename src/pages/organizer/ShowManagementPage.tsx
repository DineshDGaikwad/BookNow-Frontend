import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { Plus, Trash2, Calendar, MapPin, Clock, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import { RootState } from '../../store';
import Header from '../../components/common/Header';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { showAPI, ShowResponse, CreateShowWithSeatPricingRequest, SeatPricingRequest } from '../../services/showAPI';
import { venueAPI, VenueResponse } from '../../services/venueAPI';
import { organizerAPI, EventResponse } from '../../services/organizerAPI';
import { seatConfigAPI, VenueSeatConfiguration } from '../../services/seatConfigAPI';

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
  const [seatConfigurations, setSeatConfigurations] = useState<VenueSeatConfiguration[]>([]);
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
      setVenues((venuesData || []).filter((v: any) => v.venueStatus === 1));
      
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
      console.log('Loading seat configurations for venue:', venueId);
      const configurations = await seatConfigAPI.getVenueSeatConfigurations(venueId);
      console.log('Received configurations:', configurations);
      
      if (!configurations || configurations.length === 0) {
        console.warn('No seat configurations found for venue:', venueId);
        toast.error('This venue has no seat configurations. Please contact admin to set up seat types and pricing.');
        setSeatConfigurations([]);
        setSeatPricing([]);
        return;
      }
      
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
      toast.error('Failed to load venue seat configurations. Please try again.');
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
    
    // Validate that all seat types have pricing
    if (seatConfigurations.length > 0 && seatPricing.length !== seatConfigurations.length) {
      toast.error('Please set pricing for all seat types');
      return;
    }

    // Validate pricing is within allowed range
    for (const pricing of seatPricing) {
      const config = seatConfigurations.find(c => c.seatType === pricing.seatType);
      if (config && (pricing.price < config.minPrice || pricing.price > config.maxPrice)) {
        toast.error(`Price for ${pricing.seatType} must be between ₹${config.minPrice} and ₹${config.maxPrice}`);
        return;
      }
    }
    
    try {
      const userId = user?.userId || '';
      await showAPI.createShowWithSeatPricing(userId, formData);
      toast.success('Show created successfully!');
      resetForm();
      loadData();
    } catch (error: any) {
      console.error('Failed to create show:', error);
      toast.error(error.response?.data?.error || 'Failed to create show');
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

  const handleQuickSetup = async (venueId: string) => {
    if (!venueId || !user?.userId) return;
    
    try {
      // Basic seat configuration for quick setup
      const basicConfigs = [
        {
          seatType: 'Regular',
          rowsCount: 10,
          seatsPerRow: 10,
          rowPrefix: 'R',
          basePrice: 299,
          maxPrice: 599
        },
        {
          seatType: 'Premium',
          rowsCount: 5,
          seatsPerRow: 10,
          rowPrefix: 'P',
          basePrice: 599,
          maxPrice: 999
        },
        {
          seatType: 'VIP',
          rowsCount: 2,
          seatsPerRow: 10,
          rowPrefix: 'V',
          basePrice: 999,
          maxPrice: 1499
        }
      ];
      
      const response = await fetch(`/api/organizer/venues/${venueId}/seat-configurations?organizerId=${user.userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(basicConfigs)
      });
      
      if (response.ok) {
        toast.success('Seat configurations added successfully!');
        // Reload seat configurations
        await loadVenueSeatConfigurations(venueId);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to add seat configurations');
      }
    } catch (error) {
      console.error('Failed to add seat configurations:', error);
      toast.error('Failed to add seat configurations. Please try again.');
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
                      {venues.map(venue => {
                        return (
                          <option key={venue.venueId} value={venue.venueId}>
                            {venue.venueName} - {venue.venueCity}
                          </option>
                        );
                      })}
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
                {formData.venueId && (
                  <div>
                    {seatConfigurations.length > 0 ? (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Seat Pricing Configuration</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {seatConfigurations.map((config) => {
                            const currentPricing = seatPricing.find(sp => sp.seatType === config.seatType);
                            return (
                              <div key={config.seatType} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                                <div className="flex items-center justify-between mb-3">
                                  <div>
                                    <h4 className="text-white font-semibold text-lg">{config.seatType}</h4>
                                    <p className="text-gray-300 text-sm font-medium">{config.totalSeats} seats available</p>
                                  </div>
                                  <Badge 
                                    variant={config.seatType === 'VIP' ? 'default' : config.seatType === 'Premium' ? 'secondary' : 'outline'}
                                    className="px-3 py-1"
                                  >
                                    Base: ₹{config.minPrice} | Max: ₹{config.maxPrice}
                                  </Badge>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-200 mb-2">
                                    Set Show Price
                                    <span className="text-xs text-gray-400 block">
                                      Range: ₹{config.minPrice} - ₹{config.maxPrice}
                                    </span>
                                  </label>
                                  <input
                                    type="number"
                                    min={config.minPrice}
                                    max={config.maxPrice}
                                    step="1"
                                    value={currentPricing?.price || config.minPrice}
                                    onChange={(e) => handleSeatPriceChange(config.seatType, Number(e.target.value))}
                                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    placeholder={`₹${config.minPrice}`}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-yellow-400 mb-2">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <h4 className="font-semibold">No Seat Configuration Found</h4>
                        </div>
                        <p className="text-yellow-300 text-sm mb-4">
                          This venue doesn't have seat types configured yet. You can quickly set up basic seat configurations now.
                        </p>
                        <Button
                          type="button"
                          onClick={() => handleQuickSetup(formData.venueId)}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm px-4 py-2"
                        >
                          Quick Setup: Add Basic Seat Types
                        </Button>
                      </div>
                    )}
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
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-600 disabled:cursor-not-allowed"
                    disabled={!formData.venueId || seatConfigurations.length === 0 || !formData.showStartTime || !formData.showEndTime}
                  >
                    {seatConfigurations.length === 0 && formData.venueId ? 'Venue Setup Required' : 'Create Show'}
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
                            <span className="font-medium text-gray-300">Price Range:</span><br />
                            {show.seatPricing && show.seatPricing.length > 0 ? (
                              `₹${Math.min(...show.seatPricing.map(sp => sp.showPrice))} - ₹${Math.max(...show.seatPricing.map(sp => sp.showPrice))}`
                            ) : (
                              'Pricing not set'
                            )}
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