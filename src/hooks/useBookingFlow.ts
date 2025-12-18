import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface BookingFlowState {
  currentStep: number;
  selectedEvent: any;
  selectedShow: any;
  selectedSeats: string[];
  bookingTimer: any;
  isLoading: boolean;
  error: string | null;
}

export const useBookingFlow = () => {
  const [state, setState] = useState<BookingFlowState>({
    currentStep: 0,
    selectedEvent: null,
    selectedShow: null,
    selectedSeats: [],
    bookingTimer: null,
    isLoading: false,
    error: null
  });

  const setCurrentStep = (step: number) => {
    setState(prev => ({ ...prev, currentStep: step }));
  };

  const selectEvent = (event: any) => {
    setState(prev => ({ ...prev, selectedEvent: event, currentStep: 1 }));
  };

  const selectShow = (show: any) => {
    setState(prev => ({ ...prev, selectedShow: show, currentStep: 2 }));
  };

  const selectSeats = async (seatIds: string[]) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Lock seats
      await apiService.lockSeats(state.selectedShow.id, seatIds);
      
      // Start booking timer
      const timer = await apiService.startBookingTimer(state.selectedShow.id, seatIds);
      
      setState(prev => ({
        ...prev,
        selectedSeats: seatIds,
        bookingTimer: timer,
        currentStep: 3,
        isLoading: false
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false
      }));
    }
  };

  const proceedToCheckout = () => {
    setState(prev => ({ ...prev, currentStep: 4 }));
  };

  const completeBooking = async (bookingData: any) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const booking = await apiService.createBooking({
        ...bookingData,
        showId: state.selectedShow.id,
        seatIds: state.selectedSeats
      });
      
      setState(prev => ({
        ...prev,
        currentStep: 5,
        isLoading: false
      }));
      
      return booking;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false
      }));
      throw error;
    }
  };

  const resetFlow = () => {
    setState({
      currentStep: 0,
      selectedEvent: null,
      selectedShow: null,
      selectedSeats: [],
      bookingTimer: null,
      isLoading: false,
      error: null
    });
  };

  const extendTimer = async () => {
    if (state.selectedShow) {
      try {
        await apiService.extendBookingTimer(state.selectedShow.id);
        // Refresh timer data
        const timer = await apiService.getBookingTimer(state.selectedShow.id);
        setState(prev => ({ ...prev, bookingTimer: timer }));
      } catch (error: any) {
        setState(prev => ({ ...prev, error: error.message }));
      }
    }
  };

  return {
    ...state,
    setCurrentStep,
    selectEvent,
    selectShow,
    selectSeats,
    proceedToCheckout,
    completeBooking,
    resetFlow,
    extendTimer
  };
};