import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/common/Header';
import { customerAPI, CustomerEvent } from '../../services/customerAPI';

const CustomerEventsPage: React.FC = () => {
  const [events, setEvents] = useState<CustomerEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CustomerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = ['All', 'Music', 'Theatre', 'Comedy', 'Sports', 'Conference', 'Workshop', 'Festival', 'Exhibition', 'Dance'];

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, selectedCategory]);

  const loadEvents = async () => {
    try {
      const data = await customerAPI.getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(event => event.eventCategory === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.eventDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.eventGenre?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  };

  const getNextShow = (event: CustomerEvent) => {
    const upcomingShows = event.upcomingShows
      .filter(show => new Date(show.showStartTime) > new Date())
      .sort((a, b) => new Date(a.showStartTime).getTime() - new Date(b.showStartTime).getTime());
    
    return upcomingShows[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-xl"></div>
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
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Discover Amazing Events</h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8">Find and book tickets for the best events in your city</p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search events, artists, venues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 text-gray-900 rounded-full text-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
              />
              <button className="absolute right-2 top-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
                🔍
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category === 'All' ? '' : category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  (selectedCategory === category) || (category === 'All' && !selectedCategory)
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎭</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Events Found</h2>
            <p className="text-gray-600">Try adjusting your search or category filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map(event => {
              const nextShow = getNextShow(event);
              return (
                <Link
                  key={event.eventId}
                  to={`/events/${event.eventId}`}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  {/* Event Image */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden">
                    {event.posterUrl ? (
                      <img 
                        src={event.posterUrl} 
                        alt={event.eventTitle}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-4xl">
                        🎪
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {event.eventCategory}
                      </span>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {event.eventTitle}
                    </h3>
                    
                    {event.eventGenre && (
                      <p className="text-sm text-gray-500 mb-2">{event.eventGenre}</p>
                    )}

                    {nextShow ? (
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">📍</span>
                          <span className="truncate">{nextShow.venueName}, {nextShow.venueCity}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">📅</span>
                          <span>{new Date(nextShow.showStartTime).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            <span className="mr-2">🎫</span>
                            <span>From ₹{nextShow.showPriceMin}</span>
                          </div>
                          <div className="text-xs text-green-600 font-medium">
                            {nextShow.availableSeats} seats left
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        <span className="mr-2">📅</span>
                        <span>Shows coming soon</span>
                      </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{event.showCount} shows</span>
                        <span className="text-blue-500 font-medium text-sm group-hover:text-blue-700">
                          Book Now →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerEventsPage;