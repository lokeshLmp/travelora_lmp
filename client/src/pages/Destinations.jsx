import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import DestinationCard from '../components/DestinationCard';
import FilterBar from '../components/FilterBar';
import EmptyState from '../components/EmptyState';
import { destinationsData } from '../data/destinations';
import { Search, MapPin } from 'lucide-react';

export default function Destinations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('popular');

  const categories = ['All', 'Beach', 'Mountains', 'Nature', 'Heritage', 'Adventure', 'City'];

  const filteredDestinations = useMemo(() => {
    return destinationsData.filter((dest) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          dest.name.toLowerCase().includes(q) ||
          dest.country.toLowerCase().includes(q) ||
          dest.category.toLowerCase().includes(q) ||
          dest.description.toLowerCase().includes(q);
        if (!matches) return false;
      }
      // Category
      if (selectedCategory !== 'All' && dest.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // Budget
      if (dest.startingPrice > maxPrice) {
        return false;
      }
      // Rating
      if (minRating > 0 && dest.rating < minRating) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.startingPrice - b.startingPrice;
      if (sortBy === 'price-high') return b.startingPrice - a.startingPrice;
      return b.rating - a.rating; // default popular
    });
  }, [searchQuery, selectedCategory, maxPrice, minRating, sortBy]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setMaxPrice(50000);
    setMinRating(0);
    setSortBy('popular');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="bg-primary text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary">
            Curated World Destinations
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Explore Handpicked Destinations
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            From tropical coastlines to tranquil Himalayan valleys, discover your next unforgettable journey.
          </p>
        </div>
      </div>

      {/* Main Grid: Filters on Left, Destinations on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <FilterBar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            maxPrice={maxPrice}
            priceLimit={60000}
            onPriceChange={setMaxPrice}
            minRating={minRating}
            onRatingChange={setMinRating}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onReset={handleReset}
          />
        </div>

        {/* Destination Cards Listing */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-800">{filteredDestinations.length}</span> destinations
            </p>
          </div>

          {filteredDestinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredDestinations.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Destinations Found"
              description="No destinations match your active filters. Try clearing your search keyword or increasing your budget range."
              actionText="Reset Filters"
              onAction={handleReset}
            />
          )}
        </div>

      </div>
    </div>
  );
}
