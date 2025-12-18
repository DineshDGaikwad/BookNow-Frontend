import { customerAPI } from '../services/customerAPI';

export const testAPIConnection = async () => {
  try {
    console.log('Testing API connection...');
    
    // Test events endpoint
    const events = await customerAPI.getEvents({ limit: 5 });
    console.log('✅ Events API working:', events.length, 'events found');
    
    if (events.length > 0) {
      // Test event details
      const eventDetails = await customerAPI.getEventDetails(events[0].eventId);
      console.log('✅ Event details API working:', eventDetails.eventTitle);
      
      // Test shows if available
      if (eventDetails.shows && eventDetails.shows.length > 0) {
        const showDetails = await customerAPI.getShowDetails(eventDetails.shows[0].showId);
        console.log('✅ Show details API working:', showDetails.eventTitle);
        
        // Test seat map
        const seatMap = await customerAPI.getShowSeats(eventDetails.shows[0].showId);
        console.log('✅ Seat map API working:', seatMap.seats.length, 'seats found');
      }
    }
    
    return { success: true, message: 'All APIs working correctly' };
  } catch (error) {
    console.error('❌ API test failed:', error);
    return { success: false, error };
  }
};

// Auto-run test disabled - uncomment to test API connection
// if (process.env.NODE_ENV === 'development') {
//   setTimeout(() => {
//     testAPIConnection();
//   }, 2000);
// }