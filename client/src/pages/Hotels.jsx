import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import HotelCard from '../components/HotelCard';
import EmptyState from '../components/EmptyState';
import { hotelsData } from '../data/hotels';
import { formatCurrency } from '../utils/formatters';
import { Search, Filter, RefreshCw, Star, Check } from 'lucide-react';

export default function Hotels() {
  const [searchParams, setSearchParams] = useSearchParams();
  const destParam = searchParams.get('destination') || '';

  const [searchQuery, setSearchQuery] = useState(destParam);
  const [selectedDestination, setSelectedDestination] = useState(destParam || 'All');
  const [maxPrice, setMaxPrice] = useState(40000);
  const [minRating, setMinRating] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const destinationsList = ['All', 'Goa', 'Kashmir', 'Kerala', 'Manali', 'Rajasthan', 'Dubai'];
  const allAmenities = ['Free WiFi', 'Infinity Pool', 'Ayurvedic Spa', 'Beachfront', 'Mountain View', 'Fine Dining'];

  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const filteredHotels = useMemo(() => {
    return hotelsData.filter((hotel) => {
      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          hotel.name.toLowerCase().includes(q) ||
          hotel.location.toLowerCase().includes(q) ||
          hotel.destination.toLowerCase().includes(q);
        if (!matches) return false;
      }
      // Destination filter
      if (selectedDestination !== 'All' && hotel.destination.toLowerCase() !== selectedDestination.toLowerCase()) {
        return false;
      }
      // Price filter
      if (hotel.pricePerNight > maxPrice) {
        return false;
      }
      // Rating
      if (minRating > 0 && hotel.rating < minRating) {
        return false;
      }
      // Amenities filter
      if (selectedAmenities.length > 0) {
        const hasAllAmenities = selectedAmenities.every((a) =>
          hotel.amenities.some((ha) => ha.toLowerCase().includes(a.toLowerCase()))
        );
        if (!hasAllAmenities) return false;
      }
      return true;
    });
  }, [searchQuery, selectedDestination, maxPrice, minRating, selectedAmenities]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedDestination('All');
    setMaxPrice(40000);
    setMinRating(0);
    setSelectedAmenities([]);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="bg-primary text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Handpicked Stays & Resorts
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Luxury Hotels & Vacation Stays
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            From palace suites in Udaipur to snow chalets in Gulmarg and beach resorts in Goa.
          </p>
        </div>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search hotel name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-secondary" />
                <h3 className="text-sm font-bold text-slate-800">Filter Hotels</h3>
              </div>
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-slate-500 hover:text-secondary flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Destination Selection */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Destination
              </label>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="input-field !py-2 text-xs font-semibold"
              >
                {destinationsList.map((d) => (
                  <option key={d} value={d}>
                    {d === 'All' ? 'All Locations' : d}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Slider */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider">Max Per Night</span>
                <span className="font-bold text-primary">{formatCurrency(maxPrice)}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="40000"
                step="1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-secondary"
              />
            </div>

            {/* Rating Filter */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Rating
              </label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="input-field !py-2 text-xs font-semibold"
              >
                <option value="0">All Ratings</option>
                <option value="4.8">4.8★ & Above</option>
                <option value="4.9">4.9★ & Above</option>
              </select>
            </div>

            {/* Amenities Checkboxes */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Popular Amenities
              </label>
              <div className="space-y-1.5">
                {allAmenities.map((amenity) => {
                  const checked = selectedAmenities.includes(amenity);
                  return (
                    <label
                      key={amenity}
                      className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAmenity(amenity)}
                        className="rounded text-secondary focus:ring-secondary w-3.5 h-3.5"
                      />
                      <span>{amenity}</span>
                    </label>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Hotel List */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-800">{filteredHotels.length}</span> luxury properties
            </p>
          </div>

          {filteredHotels.length > 0 ? (
            <div className="space-y-5">
              {filteredHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Hotels Found"
              description="No hotels match your filters. Try clearing amenities or expanding your price limit."
              actionText="Reset Filters"
              onAction={handleReset}
            />
          )}
        </div>

      </div>
    </div>
  );
}
