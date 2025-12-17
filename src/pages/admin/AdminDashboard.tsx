import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import AdminSidebar from '../../components/admin/AdminSidebar';
import DashboardContent from '../../components/admin/DashboardContent';
import ApprovalsContent from '../../components/admin/ApprovalsContent';
import UserManagement from '../../components/admin/UserManagement';
import VenueManagement from '../../components/admin/VenueManagement';
import EventOverview from '../../components/admin/EventOverview';
import AuditLogs from '../../components/admin/AuditLogs';
import SystemSettings from '../../components/admin/SystemSettings';

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
            <DashboardContent onNavigate={setActiveTab} />
          )}
          
          {activeTab === 'approvals' && (
            <ApprovalsContent />
          )}
          
          {activeTab === 'users' && (
            <UserManagement />
          )}
          
          {activeTab === 'venues' && (
            <VenueManagement />
          )}
          
          {activeTab === 'eventoverview' && (
            <EventOverview />
          )}
          
          {activeTab === 'audit' && (
            <AuditLogs />
          )}
          
          {activeTab === 'settings' && (
            <SystemSettings />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;