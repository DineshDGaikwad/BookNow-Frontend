import React from 'react';
import { CompleteBookingFlow } from '../../components/customer/CompleteBookingFlow';

const CompleteBookingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Complete Booking Flow</h1>
          <p className="text-gray-600">Full end-to-end booking experience</p>
        </div>
      </header>
      <main className="py-8">
        <CompleteBookingFlow />
      </main>
    </div>
  );
};

export default CompleteBookingPage;