import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Navbar } from '../../components/layout/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Progress } from '../../components/ui/progress'
import { 
  Calendar, MapPin, Clock, Users, Star, Heart, Share2, 
  ChevronLeft, Music, Ticket, Info, Building2, MessageSquare 
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { customerAPI, CustomerEvent } from '../../services/customerAPI'

const mockEvent = {
  id: '1',
  title: 'Taylor Swift | The Eras Tour',
  category: 'Concert',
  genre: 'Pop',
  ageRating: 'All Ages',
  image: '/api/placeholder/800/400',
  description: 'Experience the magic of Taylor Swift\'s most ambitious tour yet. The Eras Tour celebrates her entire musical journey with stunning visuals, incredible performances, and all your favorite songs from every era.',
  rating: 4.9,
  reviews: 2847,
  duration: '3h 15m',
  venue: {
    name: 'Madison Square Garden',
    address: '4 Pennsylvania Plaza, New York, NY 10001',
    capacity: 20000,
    image: '/api/placeholder/400/300'
  },
  shows: [
    {
      id: 'show1',
      date: 'December 15, 2024',
      time: '7:00 PM',
      price: 199,
      availability: 'available',
      seatsLeft: 234
    },
    {
      id: 'show2',
      date: 'December 16, 2024',
      time: '7:00 PM',
      price: 199,
      availability: 'filling-fast',
      seatsLeft: 89
    },
    {
      id: 'show3',
      date: 'December 17, 2024',
      time: '7:00 PM',
      price: 199,
      availability: 'sold-out',
      seatsLeft: 0
    }
  ],
  reviewBreakdown: {
    5: 78,
    4: 15,
    3: 4,
    2: 2,
    1: 1
  }
}

export function EventDetails() {
  const { id } = useParams()
  const [isLiked, setIsLiked] = useState(false)
  const [event, setEvent] = useState<CustomerEvent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchEventDetails()
    }
  }, [id])

  const fetchEventDetails = async () => {
    try {
      setLoading(true)
      const data = await customerAPI.getEventDetails(id!, true)
      setEvent(data)
    } catch (err) {
      console.error('Failed to load event:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  const displayEvent = event || mockEvent

  const getAvailabilityConfig = (availability: string, seatsLeft: number) => {
    switch (availability) {
      case 'available':
        return { 
          variant: 'success' as const, 
          text: 'Available', 
          subtext: `${seatsLeft} seats left` 
        }
      case 'filling-fast':
        return { 
          variant: 'warning' as const, 
          text: 'Filling Fast', 
          subtext: `Only ${seatsLeft} seats left` 
        }
      case 'sold-out':
        return { 
          variant: 'destructive' as const, 
          text: 'Sold Out', 
          subtext: 'No seats available' 
        }
      default:
        return { 
          variant: 'muted' as const, 
          text: 'Unknown', 
          subtext: '' 
        }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="relative">
        {/* Hero Section */}
        <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
          <img
            src={event?.posterUrl || mockEvent.image}
            alt={event?.eventTitle || mockEvent.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          
          {/* Floating Actions */}
          <div className="absolute top-6 right-6 flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLiked(!isLiked)}
              className={cn(
                "transition-colors",
                isLiked && "text-red-500"
              )}
            >
              <Heart className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} />
            </Button>
            <Button variant="ghost" size="icon" className="glass">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Back Button */}
          <div className="absolute top-6 left-6">
            <Button variant="ghost" size="icon" className="glass" asChild>
              <Link to="/events">
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Header */}
              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">{event?.eventCategory || mockEvent.category}</Badge>
                    {event?.eventGenre && <Badge variant="accent">{event.eventGenre}</Badge>}
                  </div>
                  
                  <h1 className="text-4xl font-bold mb-4">{event?.eventTitle || mockEvent.title}</h1>
                  
                  <div className="flex items-center space-x-6 text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 text-gold fill-gold" />
                      <span className="font-semibold text-foreground">{event?.averageRating?.toFixed(1) || mockEvent.rating}</span>
                      <span>({(event?.reviewCount || mockEvent.reviews).toLocaleString()} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-5 w-5" />
                      <span>{(event?.venueCapacity || mockEvent.venue.capacity).toLocaleString()} capacity</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs */}
              <Tabs defaultValue="about" className="space-y-6">
                <TabsList className="w-full justify-start bg-card border border-border">
                  <TabsTrigger value="about" className="flex items-center space-x-2">
                    <Info className="h-4 w-4" />
                    <span>About</span>
                  </TabsTrigger>
                  <TabsTrigger value="venue" className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4" />
                    <span>Venue</span>
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Reviews</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="about">
                  <Card>
                    <CardHeader>
                      <CardTitle>About This Event</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {event?.eventDescription || mockEvent.description}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="venue">
                  <Card>
                    <CardHeader>
                      <CardTitle>Venue Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <img
                          src={mockEvent.venue.image}
                          alt={mockEvent.venue.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{event?.venueName || mockEvent.venue.name}</h3>
                        <p className="text-muted-foreground">{event?.venueAddress || mockEvent.venue.address}</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Capacity: {(event?.venueCapacity || mockEvent.venue.capacity).toLocaleString()} people
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews">
                  <Card>
                    <CardHeader>
                      <CardTitle>Reviews & Ratings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Rating Breakdown */}
                      <div className="space-y-3">
                        {Object.entries(mockEvent.reviewBreakdown)
                          .reverse()
                          .map(([stars, percentage]) => (
                          <div key={stars} className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1 w-12">
                              <span className="text-sm">{stars}</span>
                              <Star className="h-3 w-3 text-gold fill-gold" />
                            </div>
                            <Progress value={percentage} className="flex-1" />
                            <span className="text-sm text-muted-foreground w-10">
                              {percentage}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Available Shows</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(event?.shows && event.shows.length > 0 ? event.shows : mockEvent.shows).map((show: any) => {
                    const isRealShow = 'showId' in show
                    const seatsLeft = isRealShow ? show.availableSeats : show.seatsLeft
                    const availability = isRealShow ? (seatsLeft > 0 ? 'available' : 'sold-out') : show.availability
                    const config = getAvailabilityConfig(availability, seatsLeft)
                    
                    return (
                      <div
                        key={isRealShow ? show.showId : show.id}
                        className={cn(
                          "p-4 rounded-lg border transition-all duration-200",
                          availability !== 'sold-out' 
                            ? "hover:border-primary/50 cursor-pointer" 
                            : "opacity-60"
                        )}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-semibold">
                              {isRealShow ? new Date(show.showStartTime).toLocaleDateString('en-IN') : show.date}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {isRealShow ? new Date(show.showStartTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : show.time}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground mb-1">Starts at</div>
                            <div className="font-bold text-xl text-primary">₹{isRealShow ? show.showPriceMin : show.price}</div>
                            <Badge variant={config.variant} className="text-xs mt-1">
                              {config.text}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="text-xs text-muted-foreground mb-3">
                          {config.subtext}
                        </div>
                        
                        <Button 
                          className="w-full" 
                          disabled={availability === 'sold-out'}
                          asChild={availability !== 'sold-out'}
                        >
                          {availability === 'sold-out' ? (
                            'Sold Out'
                          ) : (
                            <Link to={`/shows/${isRealShow ? show.showId : show.id}`}>
                              Select Seats
                            </Link>
                          )}
                        </Button>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}