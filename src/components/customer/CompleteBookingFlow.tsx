import React, { useState, useEffect } from 'react';
import { BookingProgressIndicator } from './BookingProgressIndicator';
import { BookingTimer } from './BookingTimer';
import { ResponsiveSeatMap } from './ResponsiveSeatMap';
import { EventCalendar } from './EventCalendar';
import { FullPageLoader } from './LoadingStates';
import { Button } from '../ui/button';
import { useOptimisticSeatSelection } from './OptimisticUI';
import { apiService } from '../../services/api';

export const CompleteBookingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedShow, setSelectedShow] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookingTimer, setBookingTimer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [events, setEvents] = useState<any[]>([]);
  const [shows, setShows] = useState<any[]>([]);
  const [seats, setSeats] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const { optimisticSeats, selectSeatOptimistically } = useOptimisticSeatSelection();

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      loadShows();
    }
  }, [selectedEvent]);

  useEffect(() => {
    if (selectedShow) {
      loadSeats();
      loadRecommendations();
    }
  }, [selectedShow]);

  const loadEvents = async () => {
    try {
      const eventsData = await apiService.getEvents();
      setEvents(eventsData as any[]);
    } catch (error) {
      console.error('Failed to load events:', error);
    }
  };

  const loadShows = async () => {
    try {
      const showsData = await apiService.getEventById(selectedEvent.id) as any;
      setShows(showsData.shows || []);
    } catch (error) {
      console.error('Failed to load shows:', error);
    }
  };

  const loadSeats = async () => {
    try {
      const seatsData = await apiService.getShowSeats(selectedShow.id);
      setSeats(seatsData as any[]);
    } catch (error) {
      console.error('Failed to load seats:', error);
    }
  };

  const loadRecommendations = async () => {
    try {
      const recsData = await apiService.getSeatRecommendations(selectedShow.id, 4);
      setRecommendations(recsData as any[]);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    }
  };

  const selectEvent = (event: any) => {
    setSelectedEvent(event);
    setCurrentStep(1);
  };

  const selectShow = (show: any) => {
    setSelectedShow(show);
    setCurrentStep(2);
  };

  const selectSeats = async (seatIds: string[]) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await apiService.lockSeats(selectedShow.id, seatIds);
      const timer = await apiService.startBookingTimer(selectedShow.id, seatIds);
      
      setSelectedSeats(seatIds);
      setBookingTimer(timer);
      setCurrentStep(3);
      setIsLoading(false);
    } catch (error: any) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const handleSeatSelect = async (seatId: string) => {
    await selectSeatOptimistically(seatId, async () => {
      const newSeats = [...selectedSeats, seatId];
      await selectSeats(newSeats);
      return true;
    });
  };

  const handleSeatDeselect = (seatId: string) => {
    const newSeats = selectedSeats.filter(id => id !== seatId);
    selectSeats(newSeats);
  };

  const proceedToCheckout = () => {
    setCurrentStep(3);
  };

  const completeBooking = async (bookingData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await apiService.createBooking({
        ...bookingData,
        showId: selectedShow.id,
        seatIds: selectedSeats
      });
      
      setCurrentStep(4);
      setIsLoading(false);
    } catch (error: any) {
      setError(error.message);
      setIsLoading(false);
      throw error;
    }
  };

  const handleTimerExpired = () => {
    alert('Your booking session has expired. Please select seats again.');
    setSelectedSeats([]);
    setCurrentStep(2);
  };

  const handleExtendTimer = async () => {
    await apiService.extendBookingTimer(selectedShow.id);
    const timer = await apiService.getBookingTimer(selectedShow.id);
    setBookingTimer(timer);
  };

  const handleCompleteBooking = async () => {
    const bookingData = {
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '+1234567890'
    };

    try {
      await completeBooking(bookingData);
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  if (isLoading) {
    return <FullPageLoader message="Processing your booking..." />;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <BookingProgressIndicator currentStep={currentStep} />
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Step 0: Event Selection */}
      {currentStep === 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Select an Event</h2>
          <EventCalendar 
            events={events.map(event => ({
              id: event.id,
              title: event.title,
              date: new Date(event.date),
              venue: event.venue?.name || '',
              category: event.category
            }))}
            onEventClick={selectEvent}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event: any) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => selectEvent(event)}
              >
                <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-2">{event.description}</p>
                <p className="text-sm text-gray-500">{event.venue?.name}</p>
                <p className="text-sm text-gray-500">{event.category}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Show Selection */}
      {currentStep === 1 && selectedEvent && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Select Show Time</h2>
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">{selectedEvent.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shows.map((show: any) => (
                <div
                  key={show.id}
                  className="border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => selectShow(show)}
                >
                  <p className="font-medium">{new Date(show.showDateTime).toLocaleDateString()}</p>
                  <p className="text-gray-600">{new Date(show.showDateTime).toLocaleTimeString()}</p>
                  <p className="text-sm text-gray-500">Available: {show.availableSeats} seats</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Seat Selection */}
      {currentStep === 2 && selectedShow && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Select Your Seats</h2>
            {bookingTimer && (
              <BookingTimer
                showId={selectedShow.id}
                initialTimeRemaining={bookingTimer.remainingSeconds}
                onTimerExpired={handleTimerExpired}
                onExtendTimer={handleExtendTimer}
              />
            )}
          </div>

          {recommendations.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium mb-2">Recommended Seats</h3>
              <div className="flex space-x-2">
                {recommendations.map((seatId: string) => (
                  <Button
                    key={seatId}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSeatSelect(seatId)}
                  >
                    Select {seatId}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <ResponsiveSeatMap
            seats={seats}
            selectedSeats={[...selectedSeats, ...optimisticSeats]}
            onSeatSelect={handleSeatSelect}
            onSeatDeselect={handleSeatDeselect}
            maxSeats={8}
          />

          {selectedSeats.length > 0 && (
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-medium mb-2">Selected Seats ({selectedSeats.length})</h3>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Total: $150.00</p>
                <Button onClick={proceedToCheckout}>
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Checkout */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Checkout</h2>
          <div className="bg-white rounded-lg p-6">
            <h3 className="font-medium mb-4">Booking Summary</h3>
            <p>Event: {selectedEvent?.title}</p>
            <p>Show: {new Date(selectedShow?.showDateTime).toLocaleString()}</p>
            <p>Seats: {selectedSeats.join(', ')}</p>
            <p className="font-bold mt-4">Total: $150.00</p>
            
            <div className="mt-6">
              <Button onClick={handleCompleteBooking} className="w-full">
                Complete Booking
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {currentStep === 4 && (
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold text-green-600">Booking Confirmed!</h2>
          <div className="bg-white rounded-lg p-6">
            <p className="text-lg">Your booking has been successfully created.</p>
            <p className="text-gray-600 mt-2">You will receive a confirmation email shortly.</p>
            <Button className="mt-4" onClick={() => window.location.href = '/'}>
              Back to Home
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};