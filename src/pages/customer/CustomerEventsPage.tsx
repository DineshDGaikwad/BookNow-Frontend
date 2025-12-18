import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, List, X, Search } from 'lucide-react';
import Header from '../../components/common/Header';
import { EventCard } from '../../components/events/EventCard';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { customerAPI, CustomerEvent } from '../../services/customerAPI';

const CustomerEventsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState<CustomerEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CustomerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const categories = ['All', 'Music', 'Theatre', 'Comedy', 'Sports', 'Conference', 'Workshop', 'Festival', 'Exhibition', 'Dance'];
  const cities = ['All Cities', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad'];

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    // Refresh events when search params change
    loadEvents();
  }, [searchParams]);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, selectedCategory]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (searchTerm) params.search = searchTerm;
      
      const data = await customerAPI.getEvents(params);
      setEvents(data);
      console.log('Loaded events:', data.length);
    } catch (error) {
      console.error('Failed to load events:', error);
      setEvents([]);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
    loadEvents();
  };

  const handleCategoryChange = (category: string) => {
    const newCategory = category === 'All' ? '' : category;
    setSelectedCategory(newCategory);
    const params = new URLSearchParams(searchParams);
    if (newCategory) {
      params.set('category', newCategory);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };

  const getNextShow = (event: CustomerEvent) => {
    if (!event.shows || event.shows.length === 0) {
      return null;
    }
    const upcomingShows = event.shows
      .filter((show) => new Date(show.showStartTime) > new Date())
      .sort((a, b) => new Date(a.showStartTime).getTime() - new Date(b.showStartTime).getTime());
    
    return upcomingShows[0] || null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
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
      
      <div className="container px-4 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Discover Events</h1>
          <p className="text-gray-600">
            {searchTerm ? `Search results for "${searchTerm}"` : "Find your next unforgettable experience"}
          </p>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 min-w-[200px] max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search events..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          {/* Category Select */}
          <select 
            value={selectedCategory || 'All'}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* City Select */}
          <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white">
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          {/* Sort */}
          <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white">
            <option value="popular">Most Popular</option>
            <option value="date">Date</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>

          {/* View Toggle */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <Button
              variant={view === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('grid')}
              className="rounded-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('list')}
              className="rounded-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeFilters.map((filter) => (
              <Badge key={filter} variant="secondary" className="gap-1">
                {filter}
                <button onClick={() => removeFilter(filter)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <Button variant="ghost" size="sm" onClick={() => setActiveFilters([])}>
              Clear all
            </Button>
          </div>
        )}

        {/* Results Count */}
        <p className="text-sm text-gray-600 mb-6">
          Showing {filteredEvents.length} events
        </p>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎭</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Events Found</h2>
            <p className="text-gray-600">Try adjusting your search or category filter</p>
          </div>
        ) : (
          <div className={view === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "flex flex-col gap-4"
          }>
            {filteredEvents.map((event, index) => {
              const nextShow = getNextShow(event);
              return (
                <div 
                  key={event.eventId}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
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
                    availableSeats={nextShow?.availableSeats}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Events
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerEventsPage;