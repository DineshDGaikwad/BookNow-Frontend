import React, { useState, useEffect } from 'react';
import { Menu, X, Search, Filter, Calendar, MapPin } from 'lucide-react';
import { Button } from '../ui/button';

interface MobileNavProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onToggle, onClose }) => {
  const navItems = [
    { label: 'Events', href: '/events', icon: Calendar },
    { label: 'My Bookings', href: '/bookings', icon: MapPin },
    { label: 'Profile', href: '/profile', icon: Menu }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={onToggle}
        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
          <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-xl">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">BookNow</h2>
                <button onClick={onClose}>
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <nav className="p-4">
              <ul className="space-y-2">
                {navItems.map(item => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100"
                      onClick={onClose}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export const MobileSearchBar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="md:hidden">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <Search className="w-6 h-6" />
        </button>
      ) : (
        <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b p-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const MobileFilters: React.FC<{ onApplyFilters: (filters: any) => void }> = ({ onApplyFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    date: '',
    location: ''
  });

  const categories = ['Concert', 'Theater', 'Sports', 'Comedy', 'Festival'];
  const priceRanges = ['Under $25', '$25-$50', '$50-$100', 'Over $100'];

  const handleApply = () => {
    onApplyFilters(filters);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100"
      >
        <Filter className="w-4 h-4" />
        <span className="text-sm">Filters</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-lg max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button onClick={() => setIsOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Price Range</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Any Price</option>
                  {priceRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  placeholder="Enter city or venue"
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="p-4 border-t bg-gray-50">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters({ category: '', priceRange: '', date: '', location: '' });
                    onApplyFilters({});
                  }}
                  className="flex-1"
                >
                  Clear All
                </Button>
                <Button onClick={handleApply} className="flex-1">
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return { isMobile, isTablet, isDesktop: !isMobile && !isTablet };
};