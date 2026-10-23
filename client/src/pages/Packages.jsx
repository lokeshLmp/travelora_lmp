import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import PackageCard from '../components/PackageCard';
import FilterBar from '../components/FilterBar';
import EmptyState from '../components/EmptyState';
import { packagesData } from '../data/packages';
import { Search } from 'lucide-react';

export default function Packages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const destParam = searchParams.get('destination') || '';
  const catParam = searchParams.get('category') || 'All';
  const searchParam = searchParams.get('search') || '';
  const priceParam = searchParams.get('maxPrice') || '60000';

  const [searchQuery, setSearchQuery] = useState(searchParam || destParam);
  const [selectedCategory, setSelectedCategory] = useState(catParam);
  const [maxPrice, setMaxPrice] = useState(Number(priceParam) || 60000);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('popular');

  const categories = ['All', 'Beach', 'Mountains', 'Nature', 'Heritage', 'Adventure', 'City'];

  const filteredPackages = useMemo(() => {
    return packagesData.filter((pkg) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          pkg.title.toLowerCase().includes(q) ||
          pkg.destination.toLowerCase().includes(q) ||
          pkg.country.toLowerCase().includes(q) ||
          pkg.travelType.toLowerCase().includes(q) ||
          pkg.category.toLowerCase().includes(q);
        if (!matches) return false;
      }
      // Category
      if (selectedCategory !== 'All' && pkg.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // Price
      if (pkg.price > maxPrice) {
        return false;
      }
      // Rating
      if (minRating > 0 && pkg.rating < minRating) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return b.rating - a.rating;
    });
  }, [searchQuery, selectedCategory, maxPrice, minRating, sortBy]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setMaxPrice(60000);
    setMinRating(0);
    setSortBy('popular');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="bg-primary text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-accent">
            Curated Holiday Itineraries
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Explore All Travel Packages
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Compare all-inclusive packages with transparent price breakdowns, vetted hotels, and verified local drivers.
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search packages..."
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

        {/* Packages Grid */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-800">{filteredPackages.length}</span> verified holiday packages
            </p>
          </div>

          {filteredPackages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Packages Found"
              description="No holiday packages match your specified filters. Try widening your budget or clearing filters."
              actionText="Reset Filters"
              onAction={handleReset}
            />
          )}
        </div>

      </div>
    </div>
  );
}
