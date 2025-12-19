import { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Navbar } from '../../components/layout/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group'
import { Label } from '../../components/ui/label'
import { Separator } from '../../components/ui/separator'
import { 
  Clock, Shield, CreditCard, Smartphone, Building, Wallet,
  Calendar, MapPin, AlertTriangle, Lock
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { RootState } from '../../store'
import { bookingService } from '../../services/bookingService'

const paymentMethods = [
  { 
    id: 'upi', 
    label: 'UPI', 
    icon: Smartphone, 
    description: 'Pay using any UPI app' 
  },
  { 
    id: 'card', 
    label: 'Credit/Debit Card', 
    icon: CreditCard, 
    description: 'Visa, Mastercard, Amex' 
  },
  { 
    id: 'netbanking', 
    label: 'Net Banking', 
    icon: Building, 
    description: 'All major banks supported' 
  },
  { 
    id: 'wallet', 
    label: 'Wallets', 
    icon: Wallet, 
    description: 'PayPal, Apple Pay, etc.' 
  }
]

export function Checkout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    upiId: ''
  })

  const bookingData = location.state || {
    selectedSeats: [],
    subtotal: 0,
    fee: 0,
    total: 0,
    showId: null,
    eventTitle: '',
    showDate: '',
    showTime: '',
    venueName: ''
  }

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          navigate('/events')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePayment = async () => {
    if (!bookingData.selectedSeats?.length || !bookingData.showId) {
      alert('Invalid booking data')
      return
    }

    setIsProcessing(true)
    
    try {
      // Step 1: Initialize booking flow
      const seatIds = bookingData.selectedSeats.map((seat: any) => seat.showSeatId || seat.seatId)
      await bookingService.initializeBookingFlow(bookingData.showId, seatIds)
      
      // Step 2: Lock seats
      await bookingService.lockSeats(bookingData.showId, seatIds)
      
      // Step 3: Process payment
      const paymentResult = await bookingService.processPayment({
        showId: bookingData.showId,
        seatIds,
        totalAmount: bookingData.total,
        paymentMethod,
        customerDetails: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone
        }
      })
      
      // Step 4: Complete booking
      const result = await bookingService.completeBooking(paymentResult.bookingId)
      
      if (result.success) {
        navigate(`/booking/${paymentResult.bookingId}`)
      } else {
        throw new Error('Booking completion failed')
      }
    } catch (error: any) {
      console.error('Payment failed:', error)
      alert(error.message || 'Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (bookingData.selectedSeats.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">No Booking Data Found</h1>
          <p className="text-muted-foreground mb-6">
            Please select seats first to proceed with checkout.
          </p>
          <Button asChild>
            <Link to="/events">Browse Events</Link>
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
          <span className="text-foreground">Checkout</span>
        </div>

        {/* Timer Warning */}
        <div className="mb-6">
          <div className="p-4 rounded-lg bg-warning/10 border border-warning/30 flex items-center space-x-3">
            <Clock className="h-5 w-5 text-warning" />
            <div>
              <p className="font-semibold text-warning">
                Seats reserved for {formatTime(timeLeft)}
              </p>
              <p className="text-sm text-warning/80">
                Complete your payment to confirm booking
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                  />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-3">
                    {paymentMethods.map((method, idx) => {
                      const Icon = method.icon
                      return (
                        <div key={`payment-${method.id}-${idx}`} className="flex items-center space-x-3">
                          <RadioGroupItem value={method.id} id={method.id} />
                          <Label 
                            htmlFor={method.id} 
                            className="flex items-center space-x-3 cursor-pointer flex-1 p-3 rounded-lg border border-transparent hover:border-border transition-colors"
                          >
                            <Icon className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-medium">{method.label}</div>
                              <div className="text-sm text-muted-foreground">
                                {method.description}
                              </div>
                            </div>
                          </Label>
                        </div>
                      )
                    })}
                  </div>
                </RadioGroup>

                {/* Payment Form Fields */}
                {paymentMethod === 'card' && (
                  <div className="mt-6 p-4 rounded-lg bg-muted/30 space-y-4">
                    <Input
                      placeholder="Card Number (1234 5678 9012 3456)"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      />
                      <Input
                        placeholder="CVV"
                        type="password"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                      />
                    </div>
                    <Input
                      placeholder="Name on Card"
                      value={formData.nameOnCard}
                      onChange={(e) => handleInputChange('nameOnCard', e.target.value)}
                    />
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="mt-6 p-4 rounded-lg bg-muted/30">
                    <Input
                      placeholder="UPI ID (yourname@upi)"
                      value={formData.upiId}
                      onChange={(e) => handleInputChange('upiId', e.target.value)}
                    />
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="mt-6 p-4 rounded-lg bg-muted/30">
                    <p className="text-sm text-muted-foreground">
                      You will be redirected to your bank's website to complete the payment.
                    </p>
                  </div>
                )}

                {paymentMethod === 'wallet' && (
                  <div className="mt-6 p-4 rounded-lg bg-muted/30">
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred wallet on the next page.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Event Info */}
                <div>
                  <h3 className="font-semibold">{bookingData.eventTitle || 'Event'}</h3>
                  <div className="space-y-1 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{bookingData.showDate || 'TBD'} • {bookingData.showTime || 'TBD'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{bookingData.venueName || 'TBD'}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Selected Seats */}
                <div>
                  <h4 className="font-medium mb-3">
                    Seats ({bookingData.selectedSeats.length})
                  </h4>
                  <div className="space-y-2">
                    {bookingData.selectedSeats.map((seat: any, idx: number) => (
                      <div key={seat.seatId || idx} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {seat.seatNumber || seat.id}
                          </Badge>
                          <Badge variant="gold" className="text-xs">
                            {seat.seatType || seat.section || 'Standard'}
                          </Badge>
                        </div>
                        <span className="font-medium">₹{seat.seatPrice || seat.price || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{bookingData.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Service Fee</span>
                    <span>₹{bookingData.fee}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{bookingData.total}</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Processing...' : `Pay ₹{bookingData.total}`}
                </Button>

                <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Secured by 256-bit SSL encryption</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}