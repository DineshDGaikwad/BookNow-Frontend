import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Sparkles, Ticket, LayoutDashboard, Star } from 'lucide-react';
import { RootState } from '../../store';
import Header from '../../components/common/Header';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { EventCard } from '../../components/events/EventCard';
import { customerAPI, CustomerEvent } from '../../services/customerAPI';

const HomePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredEvents, setFeaturedEvents] = useState<CustomerEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFeaturedEvents();
  }, []);

  const loadFeaturedEvents = async () => {
    try {
      setLoading(true);
      const events = await customerAPI.getFeaturedEvents(6);
      setFeaturedEvents(events);
    } catch (error) {
      console.error('Failed to load events:', error);
      // Fallback to regular events
      try {
        const fallbackEvents = await customerAPI.getEvents({ limit: 6 });
        setFeaturedEvents(fallbackEvents);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (!user) {
    // Public Hero Section
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-700 to-blue-800" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          <div className="relative container px-4 py-20 text-center text-white">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/30 mb-8">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Discover 10,000+ Events</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              Book Your Next
              <br />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Unforgettable
              </span>{' '}
              Experience
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
              Concerts, movies, comedy shows, sports events, and more. 
              Find and book the best experiences in your city.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70" />
                  <Input
                    placeholder="Search events, artists, venues..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 bg-white/10 border-0 text-lg text-white placeholder:text-white/70"
                  />
                </div>
                <div className="flex gap-3">
                  <div className="relative flex-1 md:w-40">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70" />
                    <Input
                      placeholder="City"
                      className="pl-12 h-14 bg-white/10 border-0 text-white placeholder:text-white/70"
                    />
                  </div>
                  <Button type="submit" variant="hero" size="xl" className="px-8">
                    Search
                  </Button>
                </div>
              </div>
            </form>

            {/* Quick Categories */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <span className="text-sm text-blue-100">Popular:</span>
              {['Concerts', 'Movies', 'Stand-up Comedy', 'Sports', 'Theatre'].map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  className="rounded-full border-white/30 text-white hover:bg-white/20"
                  onClick={() => navigate(`/events?category=${category.toLowerCase()}`)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Events Section for Public Users */}
        {featuredEvents.length > 0 && (
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Events</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Discover amazing events happening near you. Join thousands of others for unforgettable experiences.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredEvents.slice(0, 6).map((event, index) => (
                  <div key={event.eventId} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <EventCard
                      id={event.eventId}
                      title={event.eventTitle}
                      image={event.posterUrl}
                      category={event.eventCategory}
                      genre={event.eventGenre}
                      venue={event.venueName || 'TBA'}
                      city={event.venueCity}
                      date={event.nextShowDate ? new Date(event.nextShowDate).toLocaleDateString() : 'TBA'}
                      price={event.priceMin ? `₹${event.priceMin}` : 'TBA'}
                      rating={event.averageRating}
                      featured={index < 2}
                    />
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Link to="/events" className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  View All Events →
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    );
  }

  // Authenticated user dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-gray-600">Ready to discover your next amazing event?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="text-2xl mb-3">🎭</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Events</h3>
            <p className="text-gray-600 mb-4">Discover exciting events happening near you</p>
            <Link to="/events" className="text-blue-500 hover:text-blue-600 font-medium">
              Explore Now →
            </Link>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="text-2xl mb-3">🎫</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">My Bookings</h3>
            <p className="text-gray-600 mb-4">View and manage your upcoming events</p>
            <Link to="/my-bookings" className="text-blue-500 hover:text-blue-600 font-medium">
              View Bookings →
            </Link>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="text-2xl mb-3">⭐</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reviews</h3>
            <p className="text-gray-600 mb-4">Share your experience with others</p>
            <Link to="/reviews" className="text-blue-500 hover:text-blue-600 font-medium">
              Write Review →
            </Link>
          </div>
        </div>

        {/* Featured Events Section */}
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Events</h2>
            <Link to="/events" className="text-blue-500 hover:text-blue-600 font-medium">
              View All →
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-[3/4] rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event, index) => (
                <div key={event.eventId} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <EventCard
                    id={event.eventId}
                    title={event.eventTitle}
                    image={event.posterUrl}
                    category={event.eventCategory}
                    genre={event.eventGenre}
                    venue={event.venueName || 'TBA'}
                    city={event.venueCity}
                    date={event.nextShowDate ? new Date(event.nextShowDate).toLocaleDateString() : 'TBA'}
                    price={event.priceMin ? `₹${event.priceMin}` : 'TBA'}
                    rating={event.averageRating}
                    featured={index < 2}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;