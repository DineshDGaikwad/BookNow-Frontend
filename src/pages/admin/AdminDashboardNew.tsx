import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Navbar } from '../../components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Users, Calendar, Building2, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { adminService } from '../../services/realAdminService';

const AdminDashboardNew: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [venues, setVenues] = useState<any[]>([]);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, usersData, eventsData, venuesData, approvalsData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAllUsers(1, 10),
        adminService.getAllEvents(),
        adminService.getAllVenues(),
        adminService.getPendingApprovals()
      ]);
      
      setStats(statsData);
      setUsers(usersData.users || usersData || []);
      setEvents(eventsData.events || eventsData || []);
      setVenues(venuesData.venues || venuesData || []);
      setApprovals(approvalsData.approvals || approvalsData || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (approvalId: string, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') {
        await adminService.approveRequest(approvalId, { adminId: user?.userId || '' });
      } else {
        await adminService.rejectRequest(approvalId, { adminId: user?.userId || '', remarks: 'Rejected by admin' });
      }
      loadDashboardData();
    } catch (error) {
      console.error(`Failed to ${action} request:`, error);
    }
  };

  const handleUserStatusUpdate = async (userId: string, status: string) => {
    try {
      await adminService.updateUserStatus(userId, status, user?.userId || '');
      loadDashboardData();
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome, {user?.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || users.length}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalEvents || events.length}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +8% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Venues</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalVenues || venues.length}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +5% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvals.length}</div>
              <p className="text-xs text-muted-foreground">
                Requires attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="venues">Venues</TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.slice(0, 10).map((user: any) => (
                    <div key={user.userId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{user.fullName || user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <Badge variant={user.role === 'Admin' ? 'destructive' : user.role === 'Organizer' ? 'secondary' : 'default'}>
                          {user.role}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant={user.status === 'Active' ? 'success' : 'muted'}>
                          {user.status}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleUserStatusUpdate(user.userId, user.status === 'Active' ? 'Inactive' : 'Active')}
                        >
                          {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Event Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.slice(0, 10).map((event: any) => (
                    <div key={event.eventId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{event.eventTitle}</h3>
                        <p className="text-sm text-muted-foreground">{event.eventCategory}</p>
                        <p className="text-sm text-muted-foreground">{event.venueName}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant={event.status === 'Active' ? 'success' : 'muted'}>
                          {event.status || 'Active'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="venues">
            <Card>
              <CardHeader>
                <CardTitle>Venue Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {venues.slice(0, 10).map((venue: any) => (
                    <div key={venue.venueId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{venue.venueName}</h3>
                        <p className="text-sm text-muted-foreground">{venue.venueAddress}</p>
                        <p className="text-sm text-muted-foreground">Capacity: {venue.capacity}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant={venue.status === 'Approved' ? 'success' : venue.status === 'Pending' ? 'warning' : 'destructive'}>
                          {venue.status || 'Pending'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approvals">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {approvals.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No pending approvals</p>
                  ) : (
                    approvals.map((approval: any) => (
                      <div key={approval.approvalRequestId} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{approval.entityType} Approval</h3>
                          <p className="text-sm text-muted-foreground">{approval.requestDetails}</p>
                          <p className="text-sm text-muted-foreground">Requested: {new Date(approval.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="default"
                            onClick={() => handleApproval(approval.approvalRequestId, 'approve')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleApproval(approval.approvalRequestId, 'reject')}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboardNew;