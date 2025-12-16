import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../store';
import Header from '../../components/common/Header';
import { organizerAPI, EventResponse } from '../../services/organizerAPI';

const OrganizerEventsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.userId) {
      loadEvents();
    }
  }, [user]);

  const loadEvents = async () => {
    try {
      if (!user?.userId) return;
      const data = await organizerAPI.getEvents(user.userId);
      setEvents(data);
    } catch (error: any) {
      console.error('Failed to load events:', error);
      if (error.response?.status === 401) {
        window.location.href = '/login/organizer';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await organizerAPI.deleteEvent(eventId, user!.userId);
        setEvents(events.filter(e => e.eventId !== eventId));
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  const getStatusColor = (status: string | number) => {
    const statusStr = typeof status === 'number' ? getStatusText(status) : status;
    switch (statusStr.toLowerCase()) {
      case 'published': case 'live': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string | number) => {
    if (typeof status === 'string') return status;
    switch (status) {
      case 0: return 'Draft';
      case 1: return 'Live';
      case 2: return 'Cancelled';
      default: return 'Unknown';
    }
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Events</h1>
            <p className="text-gray-600">Manage your event portfolio</p>
          </div>
          <Link
            to="/organizer/events/create"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            Create New Event
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-lg text-center">
            <div className="text-6xl mb-4">🎭</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Events Yet</h2>
            <p className="text-gray-600 mb-8">Start creating amazing events for your audience!</p>
            <Link
              to="/organizer/events/create"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.eventId} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  {event.posterUrl ? (
                    <img src={event.posterUrl} alt={event.eventTitle} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-white text-6xl">🎪</div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-900 truncate">{event.eventTitle}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.eventStatus)}`}>
                      {getStatusText(event.eventStatus)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.eventDescription || 'No description available'}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>Category: {event.eventCategory}</span>
                    <span>{new Date(event.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <div className="flex space-x-2">
                      <Link
                        to={`/organizer/events/${event.eventId}`}
                        className="flex-1 bg-blue-500 text-white text-center py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        View
                      </Link>
                      <Link
                        to={`/organizer/events/${event.eventId}/edit`}
                        className="flex-1 bg-gray-500 text-white text-center py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteEvent(event.eventId)}
                        className="px-3 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                    <Link
                      to={`/organizer/events/${event.eventId}/shows`}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all text-sm font-medium"
                    >
                      📅 Manage Shows ({event.showCount})
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerEventsPage;