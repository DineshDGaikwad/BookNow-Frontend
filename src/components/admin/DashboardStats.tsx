import React, { useEffect, useState } from 'react';

interface StatCard {
  title: string;
  value: number;
  icon: string;
  color: string;
  change?: string;
}

const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState<StatCard[]>([
    { title: 'Pending Approvals', value: 0, icon: '⏳', color: 'bg-yellow-500' },
    { title: 'Total Users', value: 0, icon: '👥', color: 'bg-blue-500' },
    { title: 'Active Events', value: 0, icon: '🎭', color: 'bg-green-500' },
    { title: 'Total Revenue', value: 0, icon: '💰', color: 'bg-purple-500' },
  ]);

  // TODO: Fetch actual stats from API
  useEffect(() => {
    // Mock data for now
    setStats([
      { title: 'Pending Approvals', value: 12, icon: '⏳', color: 'bg-yellow-500', change: '+3 today' },
      { title: 'Total Users', value: 1247, icon: '👥', color: 'bg-blue-500', change: '+24 this week' },
      { title: 'Active Events', value: 89, icon: '🎭', color: 'bg-green-500', change: '+7 this month' },
      { title: 'Total Revenue', value: 125000, icon: '💰', color: 'bg-purple-500', change: '+15% this month' },
    ]);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stat.title === 'Total Revenue' ? `₹${stat.value.toLocaleString()}` : stat.value.toLocaleString()}
              </p>
              {stat.change && (
                <p className="text-xs text-green-600 mt-1">{stat.change}</p>
              )}
            </div>
            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white text-xl`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;