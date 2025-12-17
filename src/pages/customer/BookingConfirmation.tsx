import React from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { CheckCircle, Download, Share2, Calendar, MapPin, Clock, Ticket } from 'lucide-react';
import Header from '../../components/common/Header';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

const BookingConfirmation: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const location = useLocation();
  
  const selectedSeats = location.state?.selectedSeats || [];
  const showDetails = location.state?.showDetails;
  const total = location.state?.total || 0;

  const handleDownloadTicket = () => {
    // Simulate ticket download
    const element = document.createElement('a');
    const file = new Blob(['Ticket content'], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `ticket-${bookingId}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShareBooking = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Booking Confirmation',
        text: `I just booked tickets for ${showDetails?.eventTitle}!`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Booking link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container px-4 py-8 max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Your tickets have been successfully booked</p>
        </div>

        {/* Booking Details Card */}
        <Card className="mb-6">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-xl">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{showDetails?.eventTitle || 'Event'}</CardTitle>
                <p className="text-blue-100">Booking ID: {bookingId}</p>
              </div>
              <Ticket className="h-8 w-8" />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Event Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 mb-3">Event Details</h3>
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">
                      {showDetails ? new Date(showDetails.showStartTime).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Date'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">
                      {showDetails ? new Date(showDetails.showStartTime).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Time'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{showDetails?.venueName || 'Venue'}</p>
                    <p className="text-sm text-gray-600">{showDetails?.venueAddress || 'Address'}</p>
                  </div>
                </div>
              </div>

              {/* Seat Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 mb-3">Your Seats</h3>
                
                <div className="space-y-2">
                  {selectedSeats.map((seat: any) => (
                    <div key={seat.seatId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{seat.seatId}</Badge>
                        <span className="text-sm text-gray-600">{seat.section} Section</span>
                      </div>
                      <span className="font-medium">₹{seat.price}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Paid</span>
                    <span className="text-xl font-bold text-green-600">₹{total}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button onClick={handleDownloadTicket} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Tickets
          </Button>
          <Button variant="outline" onClick={handleShareBooking} className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share Booking
          </Button>
        </div>

        {/* Important Information */}
        <Card>
          <CardHeader>
            <CardTitle>Important Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Entry Guidelines</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Arrive at least 30 minutes before the show</li>
                  <li>• Carry a valid photo ID for verification</li>
                  <li>• Mobile tickets are accepted</li>
                  <li>• No outside food or beverages allowed</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Cancellation Policy</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Cancellation allowed up to 24 hours before show</li>
                  <li>• Refund processing takes 5-7 business days</li>
                  <li>• Convenience fees are non-refundable</li>
                  <li>• Contact support for assistance</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Links */}
        <div className="text-center mt-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/my-bookings" className="text-blue-500 hover:text-blue-600 font-medium">
              View All Bookings
            </Link>
            <Link to="/events" className="text-blue-500 hover:text-blue-600 font-medium">
              Book More Events
            </Link>
          </div>
          <p className="text-sm text-gray-500">
            Need help? Contact our support team at support@booknow.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;