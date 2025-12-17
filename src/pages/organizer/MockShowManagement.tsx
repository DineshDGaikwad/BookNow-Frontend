import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/common/Header';
import { toast } from 'react-toastify';

interface MockShow {
  showId: string;
  venueName: string;
  showStartTime: string;
  showEndTime: string;
  showPriceMin: number;
  showPriceMax: number;
}

const MockShowManagement: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [shows, setShows] = useState<MockShow[]>([
    {
      showId: '1',
      venueName: 'Grand Theater',
      showStartTime: '2024-01-15T19:00',
      showEndTime: '2024-01-15T21:30',
      showPriceMin: 500,
      showPriceMax: 2000
    },
    {
      showId: '2',
      venueName: 'City Hall',
      showStartTime: '2024-01-16T18:00',
      showEndTime: '2024-01-16T20:00',
      showPriceMin: 300,
      showPriceMax: 1500
    },
    {
      showId: '3',
      venueName: 'Convention Center',
      showStartTime: '2024-01-17T20:00',
      showEndTime: '2024-01-17T22:30',
      showPriceMin: 800,
      showPriceMax: 3000
    }
  ]);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    venueName: '',
    showStartTime: '',
    showEndTime: '',
    showPriceMin: 0,
    showPriceMax: 0
  });

  const handleCreateShow = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newShow: MockShow = {
      showId: Date.now().toString(),
      venueName: formData.venueName,
      showStartTime: formData.showStartTime,
      showEndTime: formData.showEndTime,
      showPriceMin: formData.showPriceMin,
      showPriceMax: formData.showPriceMax
    };
    
    setShows([...shows, newShow]);
    setShowCreateForm(false);
    setFormData({
      venueName: '',
      showStartTime: '',
      showEndTime: '',
      showPriceMin: 0,
      showPriceMax: 0
    });
    toast.success('Show created successfully!');
  };

  const handleDeleteShow = (showId: string) => {
    if (window.confirm('Delete this show?')) {
      setShows(shows.filter(s => s.showId !== showId));
      toast.success('Show deleted successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-red-800">⚠️ Using Mock Data</h3>
          <p className="text-sm text-red-700">Backend API is too slow (30s+). This is temporary mock data for development.</p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <Link to="/organizer/events" className="text-blue-500 hover:underline mb-2 block">← Back</Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shows Management</h1>
            <p className="text-gray-600">Event ID: {eventId}</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Create Show
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Create New Show</h2>
            <form onSubmit={handleCreateShow} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Venue Name"
                  value={formData.venueName}
                  onChange={(e) => setFormData({...formData, venueName: e.target.value})}
                  required
                  className="px-3 py-2 border rounded-lg"
                />
                
                <input
                  type="datetime-local"
                  value={formData.showStartTime}
                  onChange={(e) => setFormData({...formData, showStartTime: e.target.value})}
                  required
                  className="px-3 py-2 border rounded-lg"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="datetime-local"
                  value={formData.showEndTime}
                  onChange={(e) => setFormData({...formData, showEndTime: e.target.value})}
                  required
                  className="px-3 py-2 border rounded-lg"
                />
                
                <input
                  type="number"
                  placeholder="Min Price"
                  value={formData.showPriceMin}
                  onChange={(e) => setFormData({...formData, showPriceMin: Number(e.target.value)})}
                  className="px-3 py-2 border rounded-lg"
                />

                <input
                  type="number"
                  placeholder="Max Price"
                  value={formData.showPriceMax}
                  onChange={(e) => setFormData({...formData, showPriceMax: Number(e.target.value)})}
                  className="px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Shows ({shows.length})</h2>
          <div className="space-y-4">
            {shows.map(show => (
              <div key={show.showId} className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{show.venueName}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(show.showStartTime).toLocaleString()} - {new Date(show.showEndTime).toLocaleString()}
                  </p>
                  <p className="text-sm">₹{show.showPriceMin} - ₹{show.showPriceMax}</p>
                </div>
                <button
                  onClick={() => handleDeleteShow(show.showId)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockShowManagement;