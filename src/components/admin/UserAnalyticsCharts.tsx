import React, { useState, useEffect } from 'react';
import { UserAnalytics } from '../../types/admin.types';
import adminService from '../../services/adminService';

const UserAnalyticsCharts: React.FC = () => {
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await adminService.getUserAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load user analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-gray-400 text-4xl mb-4">📊</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load analytics</h3>
        <p className="text-gray-500">Please try refreshing the page</p>
      </div>
    );
  }

  const totalUsers = analytics.usersByType.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* User Distribution Pie Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">User Distribution</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-64 h-64">
            <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 100 100">
              {analytics.usersByType.map((item, index) => {
                const percentage = (item.count / totalUsers) * 100;
                const strokeDasharray = `${percentage * 2.51} 251.2`;
                const strokeDashoffset = index === 0 ? 0 : 
                  -analytics.usersByType.slice(0, index).reduce((sum, prev) => sum + (prev.count / totalUsers) * 251.2, 0);
                
                const getColor = (type: string) => {
                  if (type === 'Organizer') return '#3B82F6';
                  if (type === 'Admin') return '#F59E0B';
                  return '#10B981';
                };
                
                return (
                  <circle
                    key={item.type}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={getColor(item.type)}
                    strokeWidth="8"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{totalUsers}</div>
                <div className="text-sm text-gray-500">Total Users</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          {analytics.usersByType.map((item) => {
            const getBgColor = (type: string) => {
              if (type === 'Organizer') return 'bg-blue-500';
              if (type === 'Admin') return 'bg-yellow-500';
              return 'bg-green-500';
            };
            
            return (
              <div key={item.type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${getBgColor(item.type)}`}></div>
                  <span className="text-sm font-medium text-gray-700">{item.type}s</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">{item.count}</div>
                  <div className="text-xs text-gray-500">
                    {((item.count / totalUsers) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Venue Status Pie Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Venue Status Distribution</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-64 h-64">
            <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 100 100">
              {analytics.monthlyRegistrations.map((item, index) => {
                const totalVenues = analytics.monthlyRegistrations.reduce((sum, venue) => sum + venue.count, 0);
                const percentage = totalVenues > 0 ? (item.count / totalVenues) * 100 : 0;
                const strokeDasharray = `${percentage * 2.51} 251.2`;
                const strokeDashoffset = index === 0 ? 0 : 
                  -analytics.monthlyRegistrations.slice(0, index).reduce((sum, prev) => sum + (prev.count / totalVenues) * 251.2, 0);
                
                const colors = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
                
                return (
                  <circle
                    key={item.month}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={colors[index % colors.length]}
                    strokeWidth="8"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {analytics.monthlyRegistrations.reduce((sum, item) => sum + item.count, 0)}
                </div>
                <div className="text-sm text-gray-500">Total Venues</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          {analytics.monthlyRegistrations.map((item, index) => {
            const totalVenues = analytics.monthlyRegistrations.reduce((sum, venue) => sum + venue.count, 0);
            const colors = ['bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500', 'bg-cyan-500'];
            
            return (
              <div key={item.month} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${colors[index % colors.length]}`}></div>
                  <span className="text-sm font-medium text-gray-700">{item.month}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">{item.count}</div>
                  <div className="text-xs text-gray-500">
                    {totalVenues > 0 ? ((item.count / totalVenues) * 100).toFixed(1) : 0}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserAnalyticsCharts;