import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, CreditCard, Smartphone, Building, Wallet, Lock, Clock } from 'lucide-react';
import Header from '../../components/common/Header';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { cn } from '../../lib/utils';

const paymentMethods = [
  { id: 'upi', label: 'UPI', icon: Smartphone, description: 'Pay using any UPI app' },
  { id: 'card', label: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, Amex' },
  { id: 'netbanking', label: 'Net Banking', icon: Building, description: 'All major banks supported' },
  { id: 'wallet', label: 'Wallets', icon: Wallet, description: 'PayPal, Apple Pay, etc.' },
];

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardName: '',
    upiId: ''
  });

  // Mock data if not passed via state
  const selectedSeats = location.state?.selectedSeats || [];
  const showDetails = location.state?.showDetails;

  const subtotal = selectedSeats.reduce((sum: number, s: any) => sum + s.price, 0);
  const convenienceFee = Math.round(subtotal * 0.05);
  const total = subtotal + convenienceFee;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      const bookingId = 'BK' + Math.random().toString(36).substr(2, 9).toUpperCase();
      navigate(`/booking/${bookingId}`, { 
        state: { 
          selectedSeats, 
          showDetails, 
          total,
          bookingId 
        } 
      });
    }, 2000);
  };

  if (!selectedSeats.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container px-4 py-6 max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Seats Selected</h1>
          <Link to="/events" className="text-blue-500 hover:underline">← Back to Events</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/events" className="hover:text-gray-900">Events</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900">Checkout</span>
        </nav>

        {/* Timer Warning */}
        <div className="mb-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200 flex items-center gap-3">
          <Clock className="h-5 w-5 text-yellow-600" />
          <div>
            <p className="font-semibold text-yellow-800">Seats reserved for 9:45</p>
            <p className="text-sm text-yellow-700">Complete payment to confirm your booking</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <Input 
                      placeholder="John Doe" 
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <Input 
                      type="email" 
                      placeholder="john@example.com" 
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <Input 
                      type="tel" 
                      placeholder="+91 98765 43210" 
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all",
                        paymentMethod === method.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      )}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-blue-500"
                      />
                      <div className="p-2 rounded-lg bg-gray-100">
                        <method.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{method.label}</p>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Card Details */}
                {paymentMethod === 'card' && (
                  <div className="mt-6 p-4 rounded-lg bg-gray-50 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                      <Input 
                        placeholder="1234 5678 9012 3456" 
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                        <Input 
                          placeholder="MM/YY" 
                          value={formData.expiry}
                          onChange={(e) => handleInputChange('expiry', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                        <Input 
                          placeholder="123" 
                          type="password" 
                          value={formData.cvv}
                          onChange={(e) => handleInputChange('cvv', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                      <Input 
                        placeholder="John Doe" 
                        value={formData.cardName}
                        onChange={(e) => handleInputChange('cardName', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* UPI */}
                {paymentMethod === 'upi' && (
                  <div className="mt-6 p-4 rounded-lg bg-gray-50">
                    <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                    <Input 
                      placeholder="yourname@upi" 
                      value={formData.upiId}
                      onChange={(e) => handleInputChange('upiId', e.target.value)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">{showDetails?.eventTitle || 'Event'}</p>
                  <p className="text-gray-600">
                    {showDetails ? new Date(showDetails.showStartTime).toLocaleDateString() : 'Date'} • 
                    {showDetails ? new Date(showDetails.showStartTime).toLocaleTimeString() : 'Time'}
                  </p>
                  <p className="text-gray-600">{showDetails?.venueName || 'Venue'}</p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold mb-2">Seats ({selectedSeats.length})</h4>
                  <div className="space-y-2">
                    {selectedSeats.map((seat: any) => (
                      <div key={seat.seatId} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {seat.seatId}
                          </Badge>
                          <span className="text-gray-600">{seat.section}</span>
                        </div>
                        <span>₹{seat.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Convenience Fee</span>
                    <span>₹{convenienceFee}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-blue-600">₹{total}</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Pay ₹{total}
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Lock className="h-3 w-3" />
                  <span>Secure 256-bit SSL encryption</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;