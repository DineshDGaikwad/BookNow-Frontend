import { useState, useEffect } from 'react'
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

const mockEvents = [
  {
    id: '1',
    title: 'Taylor Swift | The Eras Tour',
    category: 'Concert',
    image: '/api/placeholder/400/300',
    date: 'Dec 15, 2024',
    time: '7:00 PM',
    venue: 'Madison Square Garden',
    location: 'New York, NY',
    price: 199,
    rating: 4.9,
    reviews: 2847,
    duration: '3h 15m',
    ageRating: 'All Ages',
    availability: 'filling-fast' as const
  },
  {
    id: '2',
    title: 'NBA Finals 2024',
    category: 'Sports',
    image: '/api/placeholder/400/300',
    date: 'Dec 22, 2024',
    time: '8:00 PM',
    venue: 'Crypto.com Arena',
    location: 'Los Angeles, CA',
    price: 420,
    rating: 4.8,
    reviews: 1523,
    duration: '3h',
    availability: 'available' as const
  },
  {
    id: '3',
    title: 'Avengers: Secret Wars',
    category: 'Movie',
    image: '/api/placeholder/400/300',
    date: 'Dec 18, 2024',
    time: '9:30 PM',
    venue: 'AMC Empire 25',
    location: 'New York, NY',
    price: 25,
    rating: 4.7,
    reviews: 892,
    duration: '2h 45m',
    ageRating: 'PG-13',
    availability: 'available' as const
  },
  {
    id: '4',
    title: 'Dave Chappelle Live',
    category: 'Comedy',
    image: '/api/placeholder/400/300',
    date: 'Dec 20, 2024',
    time: '10:00 PM',
    venue: 'Comedy Cellar',
    location: 'New York, NY',
    price: 85,
    rating: 4.9,
    reviews: 456,
    duration: '1h 30m',
    ageRating: '18+',
    availability: 'sold-out' as const
  }
]

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
  const [events, setEvents] = useState<CustomerEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [searchQuery, selectedCategory, selectedCity])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      const params: any = {}
      if (searchQuery) params.search = searchQuery
      if (selectedCategory !== 'All') params.category = selectedCategory
      if (selectedCity !== 'All Cities') params.city = selectedCity
      
      const data = await customerAPI.getEvents(params)
      setEvents(data || [])
    } catch (err: any) {
      console.error('Failed to load events:', err)
      setError(err?.response?.data?.message || 'Failed to load events. Please try again.')
      setEvents([])
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
            {loading ? 'Loading...' : `Showing ${events.length} events`}
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
              <p className="text-destructive">{error}</p>
              <Button onClick={fetchEvents} className="mt-4">Try Again</Button>
            </div>
          ) : events.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No events found</p>
            </div>
          ) : (
            events.map(event => (
              <EventCard 
                key={event.eventId} 
                event={{
                  id: event.eventId,
                  title: event.eventTitle,
                  category: event.eventCategory,
                  image: event.posterUrl || '/api/placeholder/400/300',
                  date: event.nextShowDate ? new Date(event.nextShowDate).toLocaleDateString('en-IN') : 'TBD',
                  time: event.nextShowDate ? new Date(event.nextShowDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '',
                  venue: event.venueName || 'TBD',
                  location: event.venueCity || '',
                  price: event.priceMin || 0,
                  rating: event.averageRating || 0,
                  reviews: event.reviewCount || 0,
                  duration: '2h',
                  availability: 'available' as const
                }}
                className={view === 'list' ? 'flex-row' : ''}
              />
            ))
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