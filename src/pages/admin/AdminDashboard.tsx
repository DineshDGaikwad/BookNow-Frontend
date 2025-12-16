import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import AdminSidebar from '../../components/admin/AdminSidebar';
import DashboardStats from '../../components/admin/DashboardStats';
import PendingApprovals from '../../components/admin/PendingApprovals';
import RecentActions from '../../components/admin/RecentActions';
import ApprovalsContent from '../../components/admin/ApprovalsContent';
import UserManagement from '../../components/admin/UserManagement';

const AdminDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <DashboardStats />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PendingApprovals />
                <RecentActions />
              </div>
            </div>
          )}
          
          {activeTab === 'approvals' && (
            <ApprovalsContent />
          )}
          
          {activeTab === 'users' && (
            <UserManagement />
          )}
          
          {activeTab === 'venues' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Venue Management</h2>
              <p className="text-gray-600">Venue management functionality coming soon...</p>
            </div>
          )}
          
          {activeTab === 'audit' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Audit Logs</h2>
              <p className="text-gray-600">Audit logs functionality coming soon...</p>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">System Settings</h2>
              <p className="text-gray-600">System settings functionality coming soon...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;