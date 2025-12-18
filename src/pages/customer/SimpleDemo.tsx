import React, { useState } from 'react';
import { ResponsiveSeatMap } from '../../components/customer/ResponsiveSeatMap';
import { BookingTimer } from '../../components/customer/BookingTimer';
import { BookingProgressIndicator } from '../../components/customer/BookingProgressIndicator';
import { EventCalendar } from '../../components/customer/EventCalendar';
import { Button } from '../../components/ui/button';

const SimpleDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Mock data
  const mockSeats = Array.from({ length: 50 }, (_, i) => ({
    id: `seat-${i}`,
    row: String.fromCharCode(65 + Math.floor(i / 10)),
    number: (i % 10) + 1,
    category: 'Standard',
    price: 50,
    isBooked: Math.random() > 0.8,
    isLocked: false,
    isAccessible: Math.random() > 0.9
  }));

  const mockEvents = [
    { id: '1', title: 'Concert Night', date: new Date(), venue: 'Music Hall', category: 'Music' },
    { id: '2', title: 'Theater Show', date: new Date(Date.now() + 86400000), venue: 'Theater Hall', category: 'Theater' }
  ];

  const handleSeatSelect = (seatId: string) => {
    if (!selectedSeats.includes(seatId)) {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleSeatDeselect = (seatId: string) => {
    setSelectedSeats(selectedSeats.filter(id => id !== seatId));
  };

  const handleTimerExpired = () => {
    alert('Booking timer expired!');
    setSelectedSeats([]);
  };

  const handleExtendTimer = async () => {
    alert('Timer extended by 5 minutes!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">BookNow - Complete Demo</h1>
          <p className="text-gray-600">Experience all features in one place</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-8">
        {/* Progress Indicator */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Booking Progress</h2>
          <BookingProgressIndicator currentStep={currentStep} />
          <div className="mt-4 flex space-x-2">
            {[0, 1, 2, 3, 4].map(step => (
              <Button
                key={step}
                variant={currentStep === step ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentStep(step)}
              >
                Step {step + 1}
              </Button>
            ))}
          </div>
        </div>

        {/* Event Calendar */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Event Calendar</h2>
          <EventCalendar 
            events={mockEvents}
            onEventClick={(event) => alert(`Selected: ${event.title}`)}
          />
        </div>

        {/* Seat Selection with Timer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Seat Selection</h2>
              <ResponsiveSeatMap
                seats={mockSeats}
                selectedSeats={selectedSeats}
                onSeatSelect={handleSeatSelect}
                onSeatDeselect={handleSeatDeselect}
                maxSeats={8}
              />
            </div>
          </div>

          <div className="space-y-6">
            {/* Booking Timer */}
            <BookingTimer
              showId="demo-show"
              initialTimeRemaining={900}
              onTimerExpired={handleTimerExpired}
              onExtendTimer={handleExtendTimer}
            />

            {/* Selection Summary */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold mb-4">Selection Summary</h3>
              <p className="text-sm text-gray-600 mb-2">
                Selected Seats: {selectedSeats.length}
              </p>
              <div className="space-y-1">
                {selectedSeats.map(seatId => (
                  <div key={seatId} className="text-sm">
                    Seat {seatId} - $50.00
                  </div>
                ))}
              </div>
              {selectedSeats.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="font-semibold">
                    Total: ${selectedSeats.length * 50}.00
                  </p>
                  <Button className="w-full mt-2">
                    Proceed to Checkout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feature Showcase */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">✅ Implemented Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-800">Real-time Seat Selection</h3>
              <p className="text-sm text-green-600">Interactive seat map with live updates</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800">Booking Timer</h3>
              <p className="text-sm text-blue-600">15-minute countdown with extend option</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-purple-800">Progress Tracking</h3>
              <p className="text-sm text-purple-600">Visual booking flow indicator</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-medium text-orange-800">Event Calendar</h3>
              <p className="text-sm text-orange-600">Monthly view with event details</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="font-medium text-red-800">Mobile Responsive</h3>
              <p className="text-sm text-red-600">Optimized for all screen sizes</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800">Error Handling</h3>
              <p className="text-sm text-gray-600">Comprehensive error boundaries</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SimpleDemo;