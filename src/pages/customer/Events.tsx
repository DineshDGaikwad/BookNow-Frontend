import { useState, useEffect, useMemo } from 'react'
import { Navbar } from '../../components/layout/Navbar'
import { EventCard } from '../../components/customer/EventCard'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../components/ui/sheet'
import { Checkbox } from '../../components/ui/checkbox'
import { Slider } from '../../components/ui/slider'
import { Search, Filter, Grid, List, X, SlidersHorizontal } from 'lucide-react'
import { cn } from '../../lib/utils'
import { customerAPI, CustomerEvent } from '../../services/customerAPI'

const categories = ['All', 'Concert', 'Sports', 'Movie', 'Comedy', 'Theater', 'Gaming']
const cities = ['All Cities', 'New York', 'Los Angeles', 'Chicago', 'Miami', 'Las Vegas']
const sortOptions = ['Relevance', 'Date', 'Price: Low to High', 'Price: High to Low', 'Rating']

const dateFilters = ['Today', 'Tomorrow', 'This Weekend', 'This Week', 'This Month']
const genreFilters = ['Pop', 'Rock', 'Jazz', 'Classical', 'Hip-Hop', 'Electronic', 'Country']

export function Events() {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedCity, setSelectedCity] = useState('All Cities')
  const [sortBy, setSortBy] = useState('Relevance')
  const [priceRange, setPriceRange] = useState([0, 500])
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [allEvents, setAllEvents] = useState<CustomerEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastFetch, setLastFetch] = useState(0)

  // Filter events locally
  const filteredEvents = useMemo(() => {
    let filtered = allEvents

    if (searchQuery?.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(event => 
        event.eventTitle.toLowerCase().includes(query) ||
        event.eventCategory.toLowerCase().includes(query) ||
        event.venueName?.toLowerCase().includes(query)
      )
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(event => event.eventCategory === selectedCategory)
    }

    if (selectedCity !== 'All Cities') {
      filtered = filtered.filter(event => event.venueCity === selectedCity)
    }

    return filtered
  }, [allEvents, searchQuery, selectedCategory, selectedCity])

  useEffect(() => {
    // Load immediately from cache, then fetch if stale
    const cached = localStorage.getItem('events-cache');
    const cacheTime = localStorage.getItem('events-cache-time');
    
    if (cached && cacheTime && Date.now() - parseInt(cacheTime) < 300000) {
      setAllEvents(JSON.parse(cached));
      setLastFetch(parseInt(cacheTime));
    } else {
      fetchEvents();
    }
  }, [])

  const fetchEvents = async () => {
    if (loading) return
    
    setLoading(true)
    setError(null)
    
    try {
      const events = await customerAPI.getEvents({})
      setAllEvents(events)
      const now = Date.now()
      setLastFetch(now)
      
      // Cache in localStorage for instant loading
      localStorage.setItem('events-cache', JSON.stringify(events))
      localStorage.setItem('events-cache-time', now.toString())
    } catch (err: any) {
      setError(err.message)
      setAllEvents([])
    } finally {
      setLoading(false)
    }
  }

  const removeFilter = (filter: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filter))
  }

  const clearAllFilters = () => {
    setActiveFilters([])
    setSelectedDates([])
    setSelectedGenres([])
    setPriceRange([0, 500])
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Discover Events</h1>
          <p className="text-muted-foreground">Find amazing events happening near you</p>
        </div>

        {/* Search & Filters */}
        <div className="space-y-4 mb-8">
          {/* Main Search Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events, artists, venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-muted/50 border-border/50 focus:border-primary"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40 h-12 bg-muted/50">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-40 h-12 bg-muted/50">
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 h-12 bg-muted/50">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="lg" className="px-4">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-80 glass">
                  <SheetHeader>
                    <SheetTitle>Advanced Filters</SheetTitle>
                  </SheetHeader>
                  
                  <div className="space-y-6 mt-6">
                    {/* Price Range */}
                    <div>
                      <label className="text-sm font-medium mb-3 block">
                        Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                      </label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={500}
                        step={10}
                        className="w-full"
                      />
                    </div>

                    {/* Date Filters */}
                    <div>
                      <label className="text-sm font-medium mb-3 block">Date</label>
                      <div className="space-y-2">
                        {dateFilters.map(date => (
                          <div key={date} className="flex items-center space-x-2">
                            <Checkbox
                              id={date}
                              checked={selectedDates.includes(date)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedDates(prev => [...prev, date])
                                } else {
                                  setSelectedDates(prev => prev.filter(d => d !== date))
                                }
                              }}
                            />
                            <label htmlFor={date} className="text-sm">{date}</label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Genre Filters */}
                    <div>
                      <label className="text-sm font-medium mb-3 block">Genre</label>
                      <div className="space-y-2">
                        {genreFilters.map(genre => (
                          <div key={genre} className="flex items-center space-x-2">
                            <Checkbox
                              id={genre}
                              checked={selectedGenres.includes(genre)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedGenres(prev => [...prev, genre])
                                } else {
                                  setSelectedGenres(prev => prev.filter(g => g !== genre))
                                }
                              }}
                            />
                            <label htmlFor={genre} className="text-sm">{genre}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <div className="flex border border-border/50 rounded-lg bg-muted/50">
                <Button
                  variant={view === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setView('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={view === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setView('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {activeFilters.map(filter => (
                <Badge key={filter} variant="secondary" className="gap-1">
                  {filter}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeFilter(filter)}
                  />
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear all
              </Button>
            </div>
          )}

          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            {loading ? 'Loading...' : `Showing ${filteredEvents.length} events`}
          </div>
        </div>

        {/* Events Grid */}
        <div className={cn(
          "gap-6 mb-8",
          view === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "space-y-4"
        )}>
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading events...</p>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <p className="text-destructive mb-4">{error}</p>
              {error.includes('Backend server') && (
                <div className="text-sm text-muted-foreground mb-4">
                  <p>Make sure the backend server is running:</p>
                  <code className="bg-muted px-2 py-1 rounded">cd Booknow && dotnet run</code>
                </div>
              )}
              <Button onClick={fetchEvents} className="mt-4">Try Again</Button>
            </div>
          ) : !Array.isArray(filteredEvents) || filteredEvents.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No events found. Try adjusting your search criteria.</p>
              <Button onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedCity('All Cities');
                fetchEvents();
              }} className="mt-4" variant="outline">
                Clear Filters
              </Button>
            </div>
          ) : (
            filteredEvents.map(event => {
              const eventSlug = event.eventTitle.toLowerCase().replace(/\s+/g, '-')
              return (
                <EventCard 
                  key={event.eventId} 
                  event={{
                    id: eventSlug,
                    title: event.eventTitle,
                    category: event.eventCategory,
                    image: event.posterUrl || '/api/placeholder/400/300',
                    date: event.nextShowDate ? new Date(event.nextShowDate).toLocaleDateString('en-IN') : 'TBD',
                    time: event.nextShowDate ? new Date(event.nextShowDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'TBD',
                    venue: event.venueName || 'TBD',
                    location: event.venueCity || 'TBD',
                    price: event.priceMin || 0,
                    rating: event.averageRating || 0,
                    reviews: event.reviewCount || 0,
                    duration: '2h',
                    availability: 'available' as const
                  }}
                  className={view === 'list' ? 'flex-row' : ''}
                />
              )
            })
          )}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline" size="lg" className="px-8">
            Load More Events
          </Button>
        </div>
      </div>
    </div>
  )
}