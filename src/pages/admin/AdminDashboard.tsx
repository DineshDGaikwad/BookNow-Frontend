import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../store';
import AdminSidebar from '../../components/admin/AdminSidebar';
import DashboardContent from '../../components/admin/DashboardContent';
import ApprovalsContent from '../../components/admin/ApprovalsContent';
import UserManagement from '../../components/admin/UserManagement';
import VenueManagement from '../../components/admin/VenueManagement';
import EventOverview from '../../components/admin/EventOverview';
import BookingOverview from '../../components/admin/BookingOverview';
import AuditLogs from '../../components/admin/AuditLogs';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Users, Building2, Calendar, Settings, 
  BarChart3, FileText, CheckCircle, XCircle,
  Clock, AlertTriangle, TrendingUp, Eye
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalVenues: number;
  totalEvents: number;
  pendingApprovals: number;
  activeBookings: number;
  revenue: number;
}

interface PendingApproval {
  id: string;
  type: 'venue' | 'event';
  title: string;
  organizer: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const AdminDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalVenues: 0,
    totalEvents: 0,
    pendingApprovals: 0,
    activeBookings: 0,
    revenue: 0
  });
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      loadDashboardData();
    }
  }, [activeTab]);

  const loadDashboardData = async () => {
    try {
      setStats({
        totalUsers: 1247,
        totalVenues: 89,
        totalEvents: 156,
        pendingApprovals: 12,
        activeBookings: 234,
        revenue: 125000
      });
      
      setPendingApprovals([
        {
          id: '1',
          type: 'venue',
          title: 'Madison Square Garden',
          organizer: 'John Doe',
          submittedAt: '2024-01-15T10:30:00Z',
          status: 'pending'
        },
        {
          id: '2',
          type: 'event',
          title: 'Taylor Swift Concert',
          organizer: 'Jane Smith',
          submittedAt: '2024-01-14T15:45:00Z',
          status: 'pending'
        }
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id: string, action: 'approve' | 'reject') => {
    try {
      console.log(`${action} approval ${id}`);
      setPendingApprovals(prev => 
        prev.map(approval => 
          approval.id === id 
            ? { ...approval, status: action === 'approve' ? 'approved' : 'rejected' }
            : approval
        )
      );
    } catch (error) {
      console.error(`Failed to ${action} approval:`, error);
    }
  };

  const renderDashboardContent = () => {
    if (loading) {
      return (
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Venues</p>
                  <p className="text-2xl font-bold">{stats.totalVenues}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Events</p>
                  <p className="text-2xl font-bold">{stats.totalEvents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Approvals</p>
                  <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingApprovals.filter(a => a.status === 'pending').length === 0 ? (
                <p className="text-gray-500 text-center py-4">No pending approvals</p>
              ) : (
                pendingApprovals
                  .filter(approval => approval.status === 'pending')
                  .map(approval => (
                    <div key={approval.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={approval.type === 'venue' ? 'secondary' : 'default'}>
                            {approval.type}
                          </Badge>
                          <h4 className="font-medium">{approval.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600">by {approval.organizer}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(approval.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setActiveTab(approval.type === 'venue' ? 'venues' : 'eventoverview')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleApproval(approval.id, 'approve')}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleApproval(approval.id, 'reject')}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button onClick={() => setActiveTab('users')} className="h-20 flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  <span>Manage Users</span>
                </Button>
                
                <Button onClick={() => setActiveTab('venues')} className="h-20 flex-col">
                  <Building2 className="h-6 w-6 mb-2" />
                  <span>Manage Venues</span>
                </Button>
                
                <Button onClick={() => setActiveTab('eventoverview')} className="h-20 flex-col">
                  <Calendar className="h-6 w-6 mb-2" />
                  <span>Manage Events</span>
                </Button>
                
                <Button onClick={() => setActiveTab('approvals')} className="h-20 flex-col">
                  <AlertTriangle className="h-6 w-6 mb-2" />
                  <span>Approvals</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue and Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold">₹{stats.revenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Bookings</p>
                  <p className="text-2xl font-bold">{stats.activeBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">System Health</p>
                  <p className="text-2xl font-bold text-green-600">Good</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

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
          {activeTab === 'dashboard' && renderDashboardContent()}
          {activeTab === 'approvals' && <ApprovalsContent />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'venues' && <VenueManagement />}
          {activeTab === 'eventoverview' && <EventOverview />}
          {activeTab === 'bookingoverview' && <BookingOverview />}
          {activeTab === 'audit' && <AuditLogs />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;