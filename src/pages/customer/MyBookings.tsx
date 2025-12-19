import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Navbar } from '../../components/layout/Navbar'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { 
  Calendar, MapPin, Clock, Download, QrCode, 
  RotateCcw, Ticket, CheckCircle2
} from 'lucide-react'
import { RootState } from '../../store'
import { bookingService, Booking } from '../../services/bookingService'

const mockBookings = {
  upcoming: [
    {
      id: 'BK123456',
      event: {
        title: 'Taylor Swift | The Eras Tour',
        category: 'Concert',
        image: '/api/placeholder/300/200',
        date: 'December 15, 2024',
        time: '7:00 PM',
        venue: 'Madison Square Garden'
      },
      seats: ['A5', 'A6'],
      total: 1048,
      status: 'confirmed'
    },
    {
      id: 'BK123457',
      event: {
        title: 'NBA Finals 2024',
        category: 'Sports',
        image: '/api/placeholder/300/200',
        date: 'December 22, 2024',
        time: '8:00 PM',
        venue: 'Crypto.com Arena'
      },
      seats: ['C12'],
      total: 420,
      status: 'confirmed'
    }
  ],
  past: [
    {
      id: 'BK123455',
      event: {
        title: 'Avengers: Endgame',
        category: 'Movie',
        image: '/api/placeholder/300/200',
        date: 'November 28, 2024',
        time: '9:30 PM',
        venue: 'AMC Empire 25'
      },
      seats: ['F8', 'F9'],
      total: 50,
      status: 'completed'
    }
  ]
}

export function MyBookings() {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user])

  const fetchBookings = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const data = await bookingService.getUserBookings()
      setBookings(data)
    } catch (err) {
      setError('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const upcomingBookings = bookings.filter(b => new Date(b.showStartTime) > new Date())
  const pastBookings = bookings.filter(b => new Date(b.showStartTime) <= new Date())

  const BookingCard = ({ booking, isPast = false }: { booking: any, isPast?: boolean }) => (
    <Card className="overflow-hidden hover:border-primary/20 transition-all duration-200">
      <CardContent className="p-0">
        <div className="flex">
          {/* Event Image */}
          <div className="w-32 h-32 flex-shrink-0">
            <img
              src={booking.event.image}
              alt={booking.event.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Booking Details */}
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Badge variant={isPast ? 'muted' : 'success'}>
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {isPast ? 'Completed' : 'Confirmed'}
                </Badge>
                <span className="text-sm text-muted-foreground font-mono">
                  #{booking.id}
                </span>
              </div>
              <div className="text-right">
                <div className="font-semibold">₹{booking.total}</div>
              </div>
            </div>

            <h3 className="font-semibold text-lg mb-2 line-clamp-1">
              {booking.event.title}
            </h3>

            <div className="space-y-1 text-sm text-muted-foreground mb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{booking.event.date} • {booking.event.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span className="line-clamp-1">{booking.event.venue}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Seats:</span>
                <div className="flex space-x-1">
                  {booking.seats.map((seat: string) => (
                    <Badge key={seat} variant="outline" className="text-xs">
                      {seat}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                {!isPast && (
                  <Button variant="outline" size="sm">
                    <QrCode className="h-4 w-4 mr-1" />
                    QR
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  {isPast ? 'Receipt' : 'Ticket'}
                </Button>
                {isPast && (
                  <Button variant="default" size="sm">
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Book Again
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const EmptyState = ({ type }: { type: 'upcoming' | 'past' }) => (
    <Card>
      <CardContent className="py-12 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold mb-2">
          No {type} bookings
        </h3>
        <p className="text-muted-foreground mb-4">
          {type === 'upcoming' 
            ? "You don't have any upcoming events booked yet."
            : "You haven't attended any events yet."
          }
        </p>
        <Button asChild>
          <Link to="/events">
            <Ticket className="h-4 w-4 mr-2" />
            Browse Events
          </Link>
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">My Bookings</h1>
          <p className="text-muted-foreground">
            Manage your event tickets and booking history
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
            <TabsTrigger value="upcoming" className="flex items-center space-x-2">
              <span>Upcoming</span>
              <Badge variant="secondary" className="ml-2">
                {upcomingBookings.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="past" className="flex items-center space-x-2">
              <span>Past</span>
              <Badge variant="muted" className="ml-2">
                {pastBookings.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading bookings...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-destructive">{error}</p>
                <Button onClick={fetchBookings} className="mt-4">Try Again</Button>
              </div>
            ) : upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking) => (
                <BookingCard key={booking.bookingId} booking={{
                  id: booking.bookingId,
                  event: {
                    title: booking.eventTitle,
                    category: 'Event',
                    image: '/api/placeholder/300/200',
                    date: new Date(booking.showStartTime).toLocaleDateString(),
                    time: new Date(booking.showStartTime).toLocaleTimeString(),
                    venue: booking.venueName
                  },
                  seats: booking.seats.map(s => s.seatNumber),
                  total: booking.totalAmount,
                  status: booking.bookingStatus
                }} />
              ))
            ) : (
              <EmptyState type="upcoming" />
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading bookings...</p>
              </div>
            ) : pastBookings.length > 0 ? (
              pastBookings.map((booking) => (
                <BookingCard key={booking.bookingId} booking={{
                  id: booking.bookingId,
                  event: {
                    title: booking.eventTitle,
                    category: 'Event',
                    image: '/api/placeholder/300/200',
                    date: new Date(booking.showStartTime).toLocaleDateString(),
                    time: new Date(booking.showStartTime).toLocaleTimeString(),
                    venue: booking.venueName
                  },
                  seats: booking.seats.map(s => s.seatNumber),
                  total: booking.totalAmount,
                  status: 'completed'
                }} isPast />
              ))
            ) : (
              <EmptyState type="past" />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}