import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

interface Event {
  eventId: string;
  eventTitle: string;
  eventDescription: string;
  eventCategory: string;
  eventGenre: string;
  posterUrl: string;
  eventStatus: string;
  createdAt: string;
  updatedAt: string;
  organizer: {
    userId: string;
    email: string;
    name: string;
  };
  venue: {
    venueId: string;
    venueName: string;
    venueCity: string;
    venueState: string;
  };
  showsCount: number;
}

const EventOverview: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalView, setModalView] = useState<'details' | 'shows' | 'bookings'>('details');
  const [modalData, setModalData] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllEvents();
      setEvents(data);
    } catch (err) {
      setError('Failed to load events');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      Live: 'bg-green-100 text-green-800',
      Draft: 'bg-yellow-100 text-yellow-800',
      Cancelled: 'bg-red-100 text-red-800',
      Completed: 'bg-gray-100 text-gray-800'
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
  };

  const handleEventClick = async (event: Event) => {
    try {
      setModalLoading(true);
      const eventDetails = await adminService.getEventById(event.eventId);
      setSelectedEvent(eventDetails);
      setModalView('details');
      setModalData(eventDetails);
      setShowModal(true);
    } catch (err) {
      console.error('Error loading event details:', err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleViewShows = async () => {
    if (!selectedEvent) return;
    try {
      setModalLoading(true);
      const shows = await adminService.getEventShows(selectedEvent.eventId);
      setModalData(shows);
      setModalView('shows');
    } catch (err) {
      console.error('Error loading shows:', err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleViewBookings = async () => {
    if (!selectedEvent) return;
    try {
      setModalLoading(true);
      const bookings = await adminService.getEventBookings(selectedEvent.eventId);
      setModalData(bookings);
      setModalView('bookings');
    } catch (err) {
      console.error('Error loading bookings:', err);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setModalData(null);
    setModalView('details');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Event Overview</h2>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Event Overview</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-red-900 mb-2">{error}</h3>
          <button 
            onClick={loadEvents}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Event Overview</h2>
        <div className="text-sm text-gray-500">
          Total Events: {events.length}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organizer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Venue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shows
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr 
                  key={event.eventId} 
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleEventClick(event)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        {event.posterUrl ? (
                          <img 
                            className="h-12 w-12 rounded-lg object-cover" 
                            src={event.posterUrl} 
                            alt={event.eventTitle}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                            🎭
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {event.eventTitle}
                        </div>
                        <div className="text-sm text-gray-500">
                          {event.eventCategory} • {event.eventGenre}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{event.organizer.name}</div>
                    <div className="text-sm text-gray-500">{event.organizer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{event.venue.venueName}</div>
                    <div className="text-sm text-gray-500">
                      {event.venue.venueCity}, {event.venue.venueState}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(event.eventStatus)}`}>
                      {event.eventStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.showsCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(event.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {events.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">🎭</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500">There are no events in the system yet.</p>
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {modalView === 'details' && 'Event Details'}
                {modalView === 'shows' && 'Event Shows'}
                {modalView === 'bookings' && 'Event Bookings'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {modalLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <>
                  {modalView === 'details' && selectedEvent && (
                    <div className="space-y-6">
                      <div className="flex items-start space-x-6">
                        <div className="flex-shrink-0">
                          {selectedEvent.posterUrl ? (
                            <img 
                              className="h-32 w-32 rounded-lg object-cover" 
                              src={selectedEvent.posterUrl} 
                              alt={selectedEvent.eventTitle}
                            />
                          ) : (
                            <div className="h-32 w-32 rounded-lg bg-gray-200 flex items-center justify-center text-4xl">
                              🎭
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold text-gray-900 mb-2">{selectedEvent.eventTitle}</h4>
                          <p className="text-gray-600 mb-4">{selectedEvent.eventDescription}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Category:</span>
                              <span className="ml-2 text-gray-600">{selectedEvent.eventCategory}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Genre:</span>
                              <span className="ml-2 text-gray-600">{selectedEvent.eventGenre}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Status:</span>
                              <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedEvent.eventStatus)}`}>
                                {selectedEvent.eventStatus}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Created:</span>
                              <span className="ml-2 text-gray-600">{new Date(selectedEvent.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-2">Organizer</h5>
                          <p className="text-sm text-gray-600">{selectedEvent.organizer.name}</p>
                          <p className="text-sm text-gray-500">{selectedEvent.organizer.email}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-2">Venue</h5>
                          <p className="text-sm text-gray-600">{selectedEvent.venue.venueName}</p>
                          <p className="text-sm text-gray-500">{selectedEvent.venue.venueCity}, {selectedEvent.venue.venueState}</p>
                          {selectedEvent.venue.venueAddress && (
                            <p className="text-sm text-gray-500">{selectedEvent.venue.venueAddress}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-4 pt-4">
                        <button
                          onClick={handleViewShows}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                        >
                          View Shows
                        </button>
                        <button
                          onClick={handleViewBookings}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                        >
                          View Bookings
                        </button>
                      </div>
                    </div>
                  )}

                  {modalView === 'shows' && modalData && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-lg font-medium text-gray-900">Shows for {selectedEvent?.eventTitle}</h4>
                        <button
                          onClick={() => { setModalView('details'); setModalData(selectedEvent); }}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          ← Back to Details
                        </button>
                      </div>
                      {modalData.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Show Time</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Venue</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {modalData.map((show: any) => (
                                <tr key={show.showId}>
                                  <td className="px-4 py-4 text-sm text-gray-900">
                                    {new Date(show.showStartTime).toLocaleString()}
                                  </td>
                                  <td className="px-4 py-4 text-sm text-gray-900">₹{show.showPriceMin || 'N/A'}</td>
                                  <td className="px-4 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(show.showStatus)}`}>
                                      {show.showStatus}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4 text-sm text-gray-600">
                                    {show.venue.venueName}, {show.venue.venueCity}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No shows found for this event.
                        </div>
                      )}
                    </div>
                  )}

                  {modalView === 'bookings' && modalData && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-lg font-medium text-gray-900">Bookings for {selectedEvent?.eventTitle}</h4>
                        <button
                          onClick={() => { setModalView('details'); setModalData(selectedEvent); }}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          ← Back to Details
                        </button>
                      </div>
                      {modalData.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Show</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seats</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {modalData.map((booking: any) => (
                                <tr key={booking.bookingId}>
                                  <td className="px-4 py-4 text-sm text-gray-900">
                                    {new Date(booking.createdAt).toLocaleDateString()}
                                  </td>
                                  <td className="px-4 py-4">
                                    <div className="text-sm text-gray-900">{booking.user.name}</div>
                                    <div className="text-sm text-gray-500">{booking.user.email}</div>
                                  </td>
                                  <td className="px-4 py-4 text-sm text-gray-900">
                                    {new Date(booking.show.showStartTime).toLocaleString()}
                                  </td>
                                  <td className="px-4 py-4 text-sm text-gray-900">₹{booking.bookingTotalAmount}</td>
                                  <td className="px-4 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(booking.bookingStatus)}`}>
                                      {booking.bookingStatus}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4 text-sm text-gray-900">{booking.seatsCount}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No bookings found for this event.
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventOverview;