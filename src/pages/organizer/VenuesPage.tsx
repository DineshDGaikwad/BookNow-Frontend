import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Eye, Edit, ToggleLeft, ToggleRight, Building2, Users, MapPin } from 'lucide-react';
import { RootState } from '../../store';
import Header from '../../components/common/Header';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { venueAPI, VenueResponse } from '../../services/venueAPI';

const VenuesPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [myVenues, setMyVenues] = useState<VenueResponse[]>([]);
  const [allVenues, setAllVenues] = useState<VenueResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [loadingRef, setLoadingRef] = useState(false);

  useEffect(() => {
    if (user?.userId && !loadingRef) {
      loadVenues();
    }
  }, [user?.userId]);

  const loadVenues = async () => {
    if (loadingRef || !user?.userId) return;
    
    // Try cache first
    const cacheKey = `venues-${user.userId}`;
    const cached = localStorage.getItem(cacheKey);
    const cacheTime = localStorage.getItem(`${cacheKey}-time`);
    
    if (cached && cacheTime && Date.now() - parseInt(cacheTime) < 120000) {
      const cachedData = JSON.parse(cached);
      setMyVenues(cachedData.myVenues);
      setAllVenues(cachedData.allVenues);
      setLoading(false);
      return;
    }
    
    setLoadingRef(true);
    setLoading(true);
    
    try {
      const myVenuesData = await venueAPI.getVenues(user.userId).catch(() => []);
      const allVenuesData = await venueAPI.getApprovedVenues().catch(() => []);
      
      const myVenues = Array.isArray(myVenuesData) ? myVenuesData : [];
      const allVenues = Array.isArray(allVenuesData) ? allVenuesData : [];
      
      const filteredMyVenues = myVenues.filter((v: any) => v.organizerId === user.userId);
      const filteredAllVenues = allVenues.filter((v: any) => v.organizerId !== user.userId).map((v: any) => ({
        ...v,
        organizerId: 'HIDDEN'
      }));
      
      setMyVenues(filteredMyVenues);
      setAllVenues(filteredAllVenues);
      
      // Cache for instant loading
      localStorage.setItem(cacheKey, JSON.stringify({
        myVenues: filteredMyVenues,
        allVenues: filteredAllVenues
      }));
      localStorage.setItem(`${cacheKey}-time`, Date.now().toString());
    } catch (error: any) {
      setMyVenues([]);
      setAllVenues([]);
    } finally {
      setLoading(false);
      setLoadingRef(false);
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 1: return 'Approved';
      case 0: return 'Pending';
      case 2: return 'Rejected';
      default: return 'Unknown';
    }
  };

  const handleDeleteVenue = async (venueId: string, venueName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${venueName}"? This action cannot be undone.`)) {
      return;
    }

    if (!user?.userId) return;

    setDeleting(venueId);
    try {
      await venueAPI.deleteVenue(venueId, user.userId);
      // Update local state instead of reloading all venues
      setMyVenues(prev => prev.filter(v => v.venueId !== venueId));
    } catch (error: any) {
      console.error('Failed to delete venue:', error);
      alert('Failed to delete venue. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleStatus = async (venueId: string) => {
    if (!user?.userId) return;

    setToggling(venueId);
    try {
      await venueAPI.toggleVenueStatus(venueId, user.userId);
      // Update local state instead of reloading all venues
      setMyVenues(prev => prev.map(v => 
        v.venueId === venueId ? { ...v, isActive: !v.isActive } : v
      ));
    } catch (error: any) {
      console.error('Failed to toggle venue status:', error);
      alert('Failed to update venue status. Please try again.');
    } finally {
      setToggling(null);
    }
  };

  const filteredVenues = myVenues.filter(venue => {
    if (filter === 'active') return venue.isActive;
    if (filter === 'inactive') return !venue.isActive;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-700 rounded w-1/3"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Venue Management</h1>
            <p className="text-gray-400 mt-2">Manage your venue listings and configurations</p>
          </div>
          <div className="flex gap-2">
            <Button asChild className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white">
              <Link to="/organizer/create-venue">
                <Plus className="h-4 w-4" />
                Simple Venue
              </Link>
            </Button>
            <Button asChild className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Link to="/organizer/create-venue-with-seats">
                <Plus className="h-4 w-4" />
                Venue with Seats
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-900/50 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Venues</p>
                  <p className="text-2xl font-bold text-white">{myVenues.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-900/50 rounded-lg">
                  <Users className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Active Venues</p>
                  <p className="text-2xl font-bold text-white">
                    {myVenues.filter(v => v.isActive).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-900/50 rounded-lg">
                  <MapPin className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Capacity</p>
                  <p className="text-2xl font-bold text-white">
                    {myVenues.reduce((sum, v) => sum + v.venueCapacity, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-900/50 rounded-lg">
                  <Building2 className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Approved</p>
                  <p className="text-2xl font-bold text-white">
                    {myVenues.filter(v => v.venueStatus === 1).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
            className={filter === 'all' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
          >
            All ({myVenues.length})
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            onClick={() => setFilter('active')}
            size="sm"
            className={filter === 'active' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
          >
            Active ({myVenues.filter(v => v.isActive).length})
          </Button>
          <Button
            variant={filter === 'inactive' ? 'default' : 'outline'}
            onClick={() => setFilter('inactive')}
            size="sm"
            className={filter === 'inactive' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
          >
            Inactive ({myVenues.filter(v => !v.isActive).length})
          </Button>
        </div>

        {/* My Venues Section */}
        {filteredVenues.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              {filter === 'all' ? 'No Venues Yet' : `No ${filter} venues`}
            </h3>
            <p className="text-gray-400 mb-4">
              {filter === 'all' 
                ? 'Add your first venue to start hosting events!' 
                : `You don't have any ${filter} venues at the moment.`}
            </p>
            {filter === 'all' && (
              <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
                <Link to="/organizer/create-venue">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Venue
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredVenues.map((venue) => (
              <Card key={venue.venueId} className="bg-gray-800 border-gray-700 hover:shadow-xl hover:shadow-purple-500/10 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg truncate text-white">{venue.venueName}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={venue.isActive ? 'default' : 'secondary'} 
                             className={venue.isActive ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'}>
                        {venue.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant={venue.venueStatus === 1 ? 'default' : venue.venueStatus === 0 ? 'secondary' : 'destructive'}
                             className={venue.venueStatus === 1 ? 'bg-green-600 text-white' : venue.venueStatus === 0 ? 'bg-yellow-600 text-white' : 'bg-red-600 text-white'}>
                        {getStatusText(venue.venueStatus)}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    <p className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {venue.venueAddress}, {venue.venueCity}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>Capacity: {venue.venueCapacity}</span>
                      <span>{new Date(venue.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700" asChild>
                        <Link to={`/organizer/venues/${venue.venueId}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700" asChild>
                        <Link to={`/organizer/venues/${venue.venueId}/edit`}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-gray-600 hover:bg-gray-700"
                        onClick={() => handleToggleStatus(venue.venueId)}
                        disabled={toggling === venue.venueId}
                        title={venue.isActive ? 'Deactivate venue' : 'Activate venue'}
                      >
                        {toggling === venue.venueId ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                        ) : venue.isActive ? (
                          <ToggleRight className="h-4 w-4 text-green-400" />
                        ) : (
                          <ToggleLeft className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => handleDeleteVenue(venue.venueId, venue.venueName)}
                        disabled={deleting === venue.venueId}
                      >
                        {deleting === venue.venueId ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* All Other Venues Section */}
        {allVenues.length > 0 && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Browse Other Venues</h2>
              <p className="text-gray-400">Explore venues from other organizers</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allVenues.map((venue) => (
                <Card key={venue.venueId} className="bg-gray-800 border-gray-700 hover:shadow-xl hover:shadow-blue-500/10 transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg truncate text-white">{venue.venueName}</CardTitle>
                      <Badge variant="outline" className="border-gray-600 text-gray-300">Other Organizer</Badge>
                    </div>
                    <div className="text-sm text-gray-400">
                      <p className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {venue.venueAddress}, {venue.venueCity}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-400">
                        <span>Capacity: {venue.venueCapacity}</span>
                      </div>
                      
                      <Button size="sm" variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700" asChild>
                        <Link to={`/organizer/venues/${venue.venueId}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VenuesPage;