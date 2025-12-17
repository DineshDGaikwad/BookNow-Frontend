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
                
                return (
                  <circle
                    key={item.type}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={item.type === 'Organizer' ? '#3B82F6' : '#10B981'}
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
          {analytics.usersByType.map((item) => (
            <div key={item.type} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className={`w-4 h-4 rounded-full ${
                    item.type === 'Organizer' ? 'bg-blue-500' : 'bg-green-500'
                  }`}
                ></div>
                <span className="text-sm font-medium text-gray-700">{item.type}s</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">{item.count}</div>
                <div className="text-xs text-gray-500">
                  {((item.count / totalUsers) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Registrations Bar Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Registrations</h3>
        <div className="h-64">
          {analytics.monthlyRegistrations.length > 0 ? (
            <div className="flex items-end justify-between h-full space-x-2">
              {analytics.monthlyRegistrations.map((item) => {
                const maxCount = Math.max(...analytics.monthlyRegistrations.map(r => r.count));
                const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center">
                    <div className="flex-1 flex items-end">
                      <div 
                        className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md transition-all duration-300 hover:from-blue-600 hover:to-blue-500 min-h-[4px]"
                        style={{ height: `${height}%` }}
                        title={`${item.count} registrations`}
                      ></div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600 text-center">
                      <div className="font-medium">{item.count}</div>
                      <div className="text-gray-400">
                        {new Date(item.month + '-01').toLocaleDateString('en-US', { 
                          month: 'short', 
                          year: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">📈</div>
                <div>No registration data available</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAnalyticsCharts;