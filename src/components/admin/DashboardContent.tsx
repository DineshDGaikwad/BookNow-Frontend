import React, { useState, useEffect } from 'react';
import { DashboardStats as DashboardStatsType } from '../../types/admin.types';
import adminService from '../../services/adminService';
import DashboardStats from './DashboardStats';
import UserAnalyticsCharts from './UserAnalyticsCharts';
import RevenueStats from './RevenueStats';
import PendingApprovals from './PendingApprovals';
import RecentActions from './RecentActions';

interface DashboardContentProps {
  onNavigate?: (tab: string) => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ onNavigate }) => {
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
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardStats onNavigate={onNavigate} />
      <UserAnalyticsCharts />
      {stats && <RevenueStats stats={stats} />}
      
      {/* Pending Approvals Alert */}
      {stats && stats.pendingApprovals > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {stats.pendingApprovals} Pending Approval{stats.pendingApprovals > 1 ? 's' : ''}
              </h3>
              <p className="text-gray-600">
                You have {stats.pendingApprovals} item{stats.pendingApprovals > 1 ? 's' : ''} waiting for your review and approval.
              </p>
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Review Now
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PendingApprovals />
        <RecentActions />
      </div>
    </div>
  );
};

export default DashboardContent;