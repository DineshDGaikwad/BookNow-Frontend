import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Navbar } from '../../components/layout/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Separator } from '../../components/ui/separator'
import { 
  ChevronLeft, ZoomIn, ZoomOut, RotateCcw, 
  Calendar, MapPin, Clock, Users 
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { customerAPI, SeatInfo, ShowDetails } from '../../services/customerAPI'
import { RootState } from '../../store'

interface Seat {
  id: string
  row: string
  number: number
  section: 'VIP' | 'PREMIUM' | 'STANDARD' | 'ECONOMY'
  price: number
  status: 'available' | 'booked' | 'selected'
}

const mockShow = {
  id: 'show1',
  event: {
    title: 'Taylor Swift | The Eras Tour',
    image: '/api/placeholder/300/200'
  },
  date: 'December 15, 2024',
  time: '7:00 PM',
  venue: {
    name: 'Madison Square Garden',
    address: '4 Pennsylvania Plaza, New York, NY 10001'
  }
}

export function SeatSelection() {
  const { showId } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const [seats, setSeats] = useState<SeatInfo[]>([])
  const [selectedSeats, setSelectedSeats] = useState<SeatInfo[]>([])
  const [zoom, setZoom] = useState(1)
  const [showDetails, setShowDetails] = useState<ShowDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (showId) {
      fetchShowData()
    }
  }, [showId])

  const fetchShowData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // First get show details (cached)
      const showData = await customerAPI.getShowDetails(showId!)
      setShowDetails(showData)
      setLoading(false)
      
      // Then get seat data (real-time)
      const seatData = await customerAPI.getShowSeats(showId!, 1, 200)
      setSeats(seatData?.seats || [])
    } catch (err) {
      console.error('Failed to load show data:', err)
      setError('Failed to load show data')
      setLoading(false)
    }
  }

  const toggleSeat = async (seatId: string) => {
    if (!user) return
    
    const seat = seats.find(s => s.seatId === seatId)
    if (!seat || seat.status === 'Booked' || seat.status === 'Locked') return

    // Optimistic update
    const isSelecting = seat.status !== 'Selected'
    if (isSelecting) {
      setSelectedSeats(prev => [...prev, { ...seat, status: 'Selected' }])
      setSeats(prev => prev.map(s => s.seatId === seatId ? { ...s, status: 'Selected' } : s))
    } else {
      setSelectedSeats(prev => prev.filter(s => s.seatId !== seatId))
      setSeats(prev => prev.map(s => s.seatId === seatId ? { ...s, status: 'Available' } : s))
    }

    try {
      if (isSelecting) {
        await customerAPI.selectSeat(seat.showSeatId!, user.userId)
      } else {
        await customerAPI.deselectSeat(seat.showSeatId!, user.userId)
      }
    } catch (err) {
      console.error('Failed to toggle seat:', err)
      // Revert optimistic update on error
      if (isSelecting) {
        setSelectedSeats(prev => prev.filter(s => s.seatId !== seatId))
        setSeats(prev => prev.map(s => s.seatId === seatId ? { ...s, status: 'Available' } : s))
      } else {
        setSelectedSeats(prev => [...prev, seat])
        setSeats(prev => prev.map(s => s.seatId === seatId ? { ...s, status: 'Selected' } : s))
      }
    }
  }

  const getSeatClassName = (seat: SeatInfo) => {
    const baseClasses = "w-6 h-6 rounded-sm border-2 text-xs font-medium flex items-center justify-center transition-all duration-200"
    
    switch (seat.status) {
      case 'Available':
        return cn(baseClasses, 'seat-available')
      case 'Booked':
        return cn(baseClasses, 'seat-booked')
      case 'Selected':
        return cn(baseClasses, 'seat-selected')
      case 'Locked':
        return cn(baseClasses, 'seat-locked')
      default:
        return baseClasses
    }
  }

  const subtotal = selectedSeats.reduce((sum, seat) => sum + (seat.seatPrice || 0), 0)
  const fee = Math.round(subtotal * 0.05)
  const total = subtotal + fee

  const handleProceed = async () => {
    if (selectedSeats.length === 0 || !user) return
    
    try {
      const showSeatIds = selectedSeats.map(s => s.showSeatId!)
      const validation = await customerAPI.validateSeats(user.userId, showSeatIds)
      
      if (validation.isValid) {
        navigate('/checkout', {
          state: {
            selectedSeats,
            showId,
            subtotal,
            fee,
            total,
            eventTitle: showDetails?.eventTitle,
            showDate: showDetails?.showStartTime ? new Date(showDetails.showStartTime).toLocaleDateString() : 'TBD',
            showTime: showDetails?.showStartTime ? new Date(showDetails.showStartTime).toLocaleTimeString() : 'TBD',
            venueName: showDetails?.venueName
          }
        })
      } else {
        alert(validation.message)
        await fetchShowData()
      }
    } catch (err) {
      console.error('Validation failed:', err)
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

  if (error || !showDetails) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="text-center py-12">
          <p className="text-destructive">{error || 'Show not found'}</p>
          <Button asChild className="mt-4">
            <Link to="/events">Back to Events</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link to="/events" className="hover:text-foreground">Events</Link>
          <span>/</span>
          <Link to={`/events/${showDetails.eventId}`} className="hover:text-foreground">
            {showDetails.eventTitle}
          </Link>
          <span>/</span>
          <span className="text-foreground">Select Seats</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat Map */}
          <div className="lg:col-span-2">
            <Card className="card-elevated">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Select Your Seats</span>
                  </CardTitle>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setZoom(1)}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  {/* Stage */}
                  <div className="text-center">
                    <div className="inline-block px-8 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg text-white font-semibold">
                      STAGE
                    </div>
                  </div>

                  {/* Seat Map */}
                  <div 
                    className="overflow-auto"
                    style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
                  >
                    <div className="space-y-2 min-w-max">
                      {(seats?.length > 0 ? Array.from(new Set(seats.map(s => s.row || s.seatRowNumber || 'A'))).sort() : ['A', 'B', 'C']).map((row, idx) => (
                        <div key={`row-${row}-${idx}`} className="flex items-center justify-center space-x-1">
                          <div className="w-6 text-center text-sm font-medium text-muted-foreground">
                            {row}
                          </div>
                          
                          <div className="flex space-x-1">
                            {(seats || [])
                              .filter(seat => (seat.row || seat.seatRowNumber) === row)
                              .sort((a, b) => parseInt((a.seatNumber || '0').replace(/\D/g, '')) - parseInt((b.seatNumber || '0').replace(/\D/g, '')))
                              .map(seat => (
                                <button
                                  key={seat.seatId}
                                  onClick={() => toggleSeat(seat.seatId)}
                                  disabled={seat.status === 'Booked' || seat.status === 'Locked'}
                                  className={getSeatClassName(seat)}
                                  title={`${seat.seatNumber || 'N/A'} - ${seat.seatType || 'Standard'} - ₹${seat.seatPrice || seat.price || 0}`}
                                >
                                  {(seat.seatNumber || '0').replace(/\D/g, '') || '?'}
                                </button>
                              ))
                            }
                          </div>
                          
                          <div className="w-6 text-center text-sm font-medium text-muted-foreground">
                            {row}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-border/50">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-sm bg-accent/20 border-2 border-accent"></div>
                      <span className="text-sm">Available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-sm bg-primary border-2 border-primary"></div>
                      <span className="text-sm">Selected</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-sm bg-muted/50 border-2 border-muted-foreground/30 opacity-50"></div>
                      <span className="text-sm">Booked</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-sm bg-gold/20 border-2 border-gold"></div>
                      <span className="text-sm">Premium</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-sm bg-secondary/20 border-2 border-secondary"></div>
                      <span className="text-sm">VIP</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Event Info */}
                <div className="space-y-3">
                  <img
                    src={mockShow.event.image}
                    alt={mockShow.event.title}
                    className="w-full aspect-video rounded-lg object-cover"
                  />
                  
                  <div>
                    <h3 className="font-semibold line-clamp-2">{showDetails.eventTitle}</h3>
                    <div className="space-y-1 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{showDetails.showStartTime ? new Date(showDetails.showStartTime).toLocaleDateString() : 'TBD'} • {showDetails.showStartTime ? new Date(showDetails.showStartTime).toLocaleTimeString() : 'TBD'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">{showDetails.venueName}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Selected Seats */}
                <div>
                  <h4 className="font-medium mb-3">
                    Selected Seats ({selectedSeats.length})
                  </h4>
                  
                  {selectedSeats.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No seats selected
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {selectedSeats.map((seat, idx) => (
                        <div key={`sel-${seat.seatId}-${idx}`} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {seat.seatNumber}
                            </Badge>
                            <Badge variant="gold" className="text-xs">
                              {seat.section || 'Standard'}
                            </Badge>
                          </div>
                          <span className="font-medium">₹{seat.seatPrice || 0}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {selectedSeats.length > 0 && (
                  <>
                    <Separator />
                    
                    {/* Price Breakdown */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Service Fee (5%)</span>
                        <span>₹{fee}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>₹{total}</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={handleProceed}
                    >
                      Proceed to Checkout
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      Seats will be held for 10 minutes
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}