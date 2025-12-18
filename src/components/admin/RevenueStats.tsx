import React from 'react';
import { DashboardStats } from '../../types/admin.types';

interface RevenueStatsProps {
  stats: DashboardStats;
}

const RevenueStats: React.FC<RevenueStatsProps> = ({ stats }) => {
  const formatRevenue = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  };

  const avgRevenuePerBooking = stats.totalBookings > 0 ? stats.totalRevenue / stats.totalBookings : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Revenue */}
      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl shadow-sm border border-emerald-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">Total Revenue</p>
            <p className="text-3xl font-bold text-emerald-900">{formatRevenue(stats.totalRevenue)}</p>
            <p className="text-sm text-emerald-600 mt-1">All time earnings</p>
          </div>
          <div className="w-12 h-12 bg-emerald-200 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
      </div>

      {/* Total Bookings */}
      <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl shadow-sm border border-cyan-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-cyan-700">Total Bookings</p>
            <p className="text-3xl font-bold text-cyan-900">{stats.totalBookings.toLocaleString()}</p>
            <p className="text-sm text-cyan-600 mt-1">Tickets sold</p>
          </div>
          <div className="w-12 h-12 bg-cyan-200 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-cyan-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a1 1 0 001 1h1a1 1 0 001-1V7a2 2 0 00-2-2H5zM5 21a2 2 0 01-2-2v-3a1 1 0 011-1h1a1 1 0 011 1v3a2 2 0 01-2 2H5zM19 5a2 2 0 012 2v3a1 1 0 01-1 1h-1a1 1 0 01-1-1V7a2 2 0 012-2h1zM19 21a2 2 0 002-2v-3a1 1 0 00-1-1h-1a1 1 0 00-1 1v3a2 2 0 002 2h1z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Average Revenue per Booking */}
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-sm border border-amber-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-amber-700">Avg. Revenue</p>
            <p className="text-3xl font-bold text-amber-900">{formatRevenue(avgRevenuePerBooking)}</p>
            <p className="text-sm text-amber-600 mt-1">Per booking</p>
          </div>
          <div className="w-12 h-12 bg-amber-200 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueStats;