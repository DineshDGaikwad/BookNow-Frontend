import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Navbar } from '../../components/layout/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Separator } from '../../components/ui/separator'
import { 
  CheckCircle2, Download, Share2, Calendar, MapPin, 
  Clock, Ticket, CreditCard, HelpCircle
} from 'lucide-react'
import { bookingService, Booking } from '../../services/bookingService'

export function BookingConfirmation() {
  const { bookingId } = useParams()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (bookingId) {
      fetchBooking()
    }
  }, [bookingId])

  const fetchBooking = async () => {
    try {
      const data = await bookingService.getBookingDetails(bookingId!)
      setBooking(data)
    } catch (err) {
      console.error('Failed to load booking:', err)
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

  const mockBooking = {
    id: bookingId || 'BK123456',
    event: {
      title: 'Taylor Swift | The Eras Tour',
      category: 'Concert',
      image: '/api/placeholder/600/300',
      date: 'December 15, 2024',
      time: '7:00 PM',
      venue: {
        name: 'Madison Square Garden',
        address: '4 Pennsylvania Plaza, New York, NY 10001'
      }
    },
    seats: [
      { id: 'A5', section: 'VIP', price: 499 },
      { id: 'A6', section: 'VIP', price: 499 }
    ],
    payment: {
      subtotal: 998,
      fee: 50,
      total: 1048,
      method: 'Credit Card',
      last4: '4567',
      date: 'December 10, 2024'
    },
    qrCode: '/api/placeholder/200/200'
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Animation */}
        <div className="text-center mb-8 animate-scale-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-4">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground">
            Your tickets have been booked successfully. Check your email for confirmation details.
          </p>
        </div>

        {/* Main Booking Card */}
        <Card className="card-elevated animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {/* Event Header */}
          <div className="relative">
            <div className="aspect-[2/1] overflow-hidden rounded-t-2xl">
              <img
                src={mockBooking.event.image}
                alt={mockBooking.event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            
            <div className="absolute bottom-4 left-6 right-6">
              <Badge variant="secondary" className="mb-2">
                {mockBooking.event.category}
              </Badge>
              <h2 className="text-2xl font-bold text-white">
                {mockBooking.event.title}
              </h2>
            </div>
          </div>

          <CardContent className="p-6">
            {/* Booking Reference */}
            <div className="flex items-center justify-between mb-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div>
                <p className="text-sm text-muted-foreground">Booking Reference</p>
                <p className="font-mono font-semibold text-lg">{mockBooking.id}</p>
              </div>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* QR Code */}
              <div className="text-center">
                <div className="inline-block p-4 bg-foreground rounded-xl mb-4">
                  <img
                    src={mockBooking.qrCode}
                    alt="QR Code"
                    className="w-32 h-32 invert"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Scan this QR code at the venue entrance
                </p>
              </div>

              {/* Event Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Event Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span>{mockBooking.event.date}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <span>{mockBooking.event.time}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <div>{mockBooking.event.venue.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {mockBooking.event.venue.address}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Seat Information */}
                <div>
                  <h3 className="font-semibold mb-3">Your Seats</h3>
                  <div className="flex flex-wrap gap-2">
                    {mockBooking.seats.map((seat) => (
                      <Badge key={seat.id} variant="gold" className="text-sm">
                        {seat.id} • {seat.section}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Payment Summary */}
                <div>
                  <h3 className="font-semibold mb-3">Payment Summary</h3>
                  <div className="space-y-2">
                    {mockBooking.seats.map((seat) => (
                      <div key={seat.id} className="flex justify-between text-sm">
                        <span>Seat {seat.id} ({seat.section})</span>
                        <span>₹{seat.price}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm">
                      <span>Service Fee</span>
                      <span>₹{mockBooking.payment.fee}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total Paid</span>
                      <span>₹{booking?.totalAmount || mockBooking.payment.total}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
                      <CreditCard className="h-4 w-4" />
                      <span>
                        Paid via {mockBooking.payment.method} ****{mockBooking.payment.last4} on {mockBooking.payment.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Button size="lg" className="flex-1">
            <Download className="h-5 w-5 mr-2" />
            Download Ticket (PDF)
          </Button>
          <Button variant="outline" size="lg" className="flex-1" asChild>
            <Link to="/bookings">
              <Ticket className="h-5 w-5 mr-2" />
              View All Bookings
            </Link>
          </Button>
        </div>

        {/* Help Section */}
        <div className="text-center mt-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <p className="text-muted-foreground mb-2">
            Need help with your booking?
          </p>
          <Button variant="ghost" size="sm">
            <HelpCircle className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  )
}