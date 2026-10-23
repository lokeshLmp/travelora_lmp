import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, ArrowRight, Heart } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { useWishlist } from '../hooks/useWishlist';

export default function DestinationCard({ destination }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(destination.id);

  return (
    <div className="card-premium group overflow-hidden flex flex-col h-full">
      {/* Image Container with Badge */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Category Tag */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold text-slate-800 shadow-xs">
          {destination.category}
        </span>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist({ ...destination, type: 'destination' });
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-600 hover:text-red-500 transition-colors shadow-xs"
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-label="Wishlist toggle"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Floating Location Overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight text-white drop-shadow-sm">
              {destination.name}
            </h3>
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-md text-xs font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{destination.rating}</span>
            </div>
          </div>
          <p className="text-xs text-slate-200 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-secondary" />
            {destination.country}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {destination.description}
        </p>

        {/* Best Time & Top Attractions snippet */}
        {destination.popularAttractions && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {destination.popularAttractions.slice(0, 2).map((attr, i) => (
              <span key={i} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                {attr}
              </span>
            ))}
            {destination.popularAttractions.length > 2 && (
              <span className="text-[11px] text-slate-400 font-medium px-1">
                +{destination.popularAttractions.length - 2} more
              </span>
            )}
          </div>
        )}

        {/* Price & Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Starting from</span>
            <span className="text-base font-bold text-primary">
              {formatCurrency(destination.startingPrice)}
            </span>
          </div>
          <Link
            to={`/destinations/${destination.id}`}
            className="btn-secondary !py-2 !px-3.5 text-xs gap-1 group-hover:bg-primary transition-colors"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
