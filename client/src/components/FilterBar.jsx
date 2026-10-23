import React from 'react';
import { Filter, Star, DollarSign, RefreshCw } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function FilterBar({
  categories = [],
  selectedCategory = 'All',
  onSelectCategory,
  maxPrice = 60000,
  priceLimit = 60000,
  onPriceChange,
  minRating = 0,
  onRatingChange,
  sortBy = 'popular',
  onSortChange,
  onReset
}) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-subtle space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-secondary" />
          <h3 className="text-sm font-bold text-slate-800">Filter & Refine</h3>
        </div>
        {onReset && (
          <button
            onClick={onReset}
            className="text-xs font-semibold text-slate-500 hover:text-secondary flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Reset All
          </button>
        )}
      </div>

      {/* Category Pills */}
      {categories.length > 0 && (
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Category
          </label>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-secondary text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Slider Filter */}
      {onPriceChange && (
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-400 uppercase tracking-wider">Max Budget</span>
            <span className="font-bold text-primary">{formatCurrency(maxPrice)}</span>
          </div>
          <input
            type="range"
            min="10000"
            max={priceLimit}
            step="2000"
            value={maxPrice}
            onChange={(e) => onPriceChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-secondary"
          />
        </div>
      )}

      {/* Rating & Sorting */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
        {onRatingChange && (
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Min Rating
            </label>
            <select
              value={minRating}
              onChange={(e) => onRatingChange(Number(e.target.value))}
              className="input-field !py-2 text-xs font-semibold"
            >
              <option value="0">All Ratings</option>
              <option value="4.5">4.5★ & Above (Top Rated)</option>
              <option value="4.8">4.8★ & Above (Exceptional)</option>
            </select>
          </div>
        )}

        {onSortChange && (
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="input-field !py-2 text-xs font-semibold"
            >
              <option value="popular">Popularity & Rating</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
