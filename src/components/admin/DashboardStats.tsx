import React, { useState, useEffect } from 'react';
import { DashboardStats as DashboardStatsType } from '../../types/admin.types';
import adminService from '../../services/adminService';

interface DashboardStatsProps {
  onNavigate?: (tab: string) => void;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ onNavigate }) => {


  const [stats, setStats] = useState<DashboardStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-gray-400 text-4xl mb-4">📊</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load dashboard stats</h3>
        <p className="text-gray-500">Please try refreshing the page</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {/* Total Users */}
      <div 
        className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-4 md:p-6 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
        onClick={() => onNavigate?.('users')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onNavigate?.('users')}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-700">Total Users</p>
            <p className="text-3xl font-bold text-blue-900">{stats.totalUsers.toLocaleString()}</p>
            <p className="text-sm text-blue-600 mt-1">
              {stats.organizerUsers} organizers • {stats.customerUsers} customers
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Organizers */}
      <div 
        className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl shadow-sm border border-indigo-200 p-4 md:p-6 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
        onClick={() => onNavigate?.('users')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onNavigate?.('users')}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-700">Organizers</p>
            <p className="text-3xl font-bold text-indigo-900">{stats.organizerUsers}</p>
            <p className="text-sm text-indigo-600 mt-1">
              {((stats.organizerUsers / stats.totalUsers) * 100).toFixed(1)}% of users
            </p>
          </div>
          <div className="w-12 h-12 bg-indigo-200 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Customers */}
      <div 
        className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-4 md:p-6 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
        onClick={() => onNavigate?.('users')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onNavigate?.('users')}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-700">Customers</p>
            <p className="text-3xl font-bold text-green-900">{stats.customerUsers}</p>
            <p className="text-sm text-green-600 mt-1">
              {((stats.customerUsers / stats.totalUsers) * 100).toFixed(1)}% of users
            </p>
          </div>
          <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Active Events */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-purple-700">Active Events</p>
            <p className="text-3xl font-bold text-purple-900">{stats.activeEvents}</p>
            <p className="text-sm text-purple-600 mt-1">Currently running</p>
          </div>
          <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;