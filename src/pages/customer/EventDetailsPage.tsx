import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/common/Header';
import { customerAPI, CustomerEvent, CustomerShow } from '../../services/customerAPI';

const EventDetailsPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<CustomerEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    if (eventId) {
      loadEventDetails();
    }
  }, [eventId]);

  const loadEventDetails = async () => {
    try {
      const data = await customerAPI.getEventDetails(eventId!);
      setEvent(data);
    } catch (error) {
      console.error('Failed to load event details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingShows = () => {
    if (!event) return [];
    return event.upcomingShows
      .filter(show => new Date(show.showStartTime) > new Date())
      .sort((a, b) => new Date(a.showStartTime).getTime() - new Date(b.showStartTime).getTime());
  };

  const getUniqueDates = () => {
    const shows = getUpcomingShows();
    const dates = [...new Set(shows.map(show => 
      new Date(show.showStartTime).toDateString()
    ))];
    return dates;
  };

  const getShowsForDate = (date: string) => {
    const shows = getUpcomingShows();
    return shows.filter(show => 
      new Date(show.showStartTime).toDateString() === date
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <Link to="/events" className="text-blue-500 hover:underline">← Back to Events</Link>
        </div>
      </div>
    );
  }

  const upcomingShows = getUpcomingShows();
  const uniqueDates = getUniqueDates();
  const currentDate = selectedDate || uniqueDates[0];
  const showsForSelectedDate = getShowsForDate(currentDate);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/events" className="text-blue-500 hover:underline mb-6 block">← Back to Events</Link>
        
        {/* Event Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="md:flex">
            {/* Event Image */}
            <div className="md:w-1/3">
              <div className="h-64 md:h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                {event.posterUrl ? (
                  <img 
                    src={event.posterUrl} 
                    alt={event.eventTitle}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-white text-6xl">🎪</div>
                )}
              </div>
            </div>
            
            {/* Event Info */}
            <div className="md:w-2/3 p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                    {event.eventCategory}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{event.eventTitle}</h1>
                  {event.eventGenre && (
                    <p className="text-lg text-gray-600 mb-4">{event.eventGenre}</p>
                  )}
                </div>
              </div>
              
              {event.eventDescription && (
                <p className="text-gray-700 mb-6 leading-relaxed">{event.eventDescription}</p>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center">
                  <span className="mr-2">👤</span>
                  <span className="text-gray-600">By {event.organizerName}</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">🎭</span>
                  <span className="text-gray-600">{event.showCount} Shows</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">📅</span>
                  <span className="text-gray-600">
                    {upcomingShows.length > 0 
                      ? `${upcomingShows.length} upcoming`
                      : 'No upcoming shows'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shows Section */}
        {upcomingShows.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Tickets</h2>
            
            {/* Date Selector */}
            {uniqueDates.length > 1 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Select Date</h3>
                <div className="flex flex-wrap gap-2">
                  {uniqueDates.map(date => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        date === currentDate
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-blue-50'
                      }`}
                    >
                      {new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Shows for Selected Date */}
            <div className="space-y-4">
              {showsForSelectedDate.map(show => (
                <div key={show.showId} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1 mb-4 md:mb-0">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center text-gray-600">
                          <span className="mr-2">🕐</span>
                          <span className="font-medium">
                            {new Date(show.showStartTime).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <span className="mr-2">📍</span>
                          <span>{show.venueName}, {show.venueCity}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {show.showLanguage && (
                          <span>🗣️ {show.showLanguage}</span>
                        )}
                        {show.showFormat && (
                          <span>🎬 {show.showFormat}</span>
                        )}
                        <span>🎫 {show.availableSeats} seats available</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          ₹{show.showPriceMin} - ₹{show.showPriceMax}
                        </div>
                        <div className="text-sm text-gray-500">per ticket</div>
                      </div>
                      
                      <Link
                        to={`/shows/${show.showId}/book`}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Upcoming Shows</h2>
            <p className="text-gray-600">This event doesn't have any upcoming shows scheduled yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetailsPage;