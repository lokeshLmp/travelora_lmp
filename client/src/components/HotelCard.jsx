import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Check, Heart, Wifi, Coffee, Sparkles } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { useWishlist } from '../hooks/useWishlist';

export default function HotelCard({ hotel }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(hotel.id);

  return (
    <div className="card-premium group overflow-hidden flex flex-col md:flex-row bg-white">
      {/* Image Section */}
      <div className="relative md:w-2/5 aspect-16/10 md:aspect-auto overflow-hidden bg-slate-100 shrink-0">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 min-h-[220px]"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
          }}
        />
        {hotel.featured && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary text-white text-[11px] font-bold shadow-xs">
            Luxury Pick
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist({ ...hotel, type: 'hotel' });
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-600 hover:text-red-500 transition-colors shadow-xs"
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-label="Wishlist toggle"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* Details Section */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-secondary transition-colors">
                {hotel.name}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
                {hotel.location}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-800 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{hotel.rating}</span>
              <span className="text-[10px] text-amber-600 font-normal">({hotel.reviewCount})</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {hotel.description}
          </p>

          {/* Amenities Chips */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {hotel.amenities.slice(0, 4).map((amenity, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-50 text-[11px] text-slate-600 border border-slate-100 font-medium">
                <Check className="w-3 h-3 text-secondary" />
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Price per night</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-primary">
                {formatCurrency(hotel.pricePerNight)}
              </span>
              {hotel.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {formatCurrency(hotel.originalPrice)}
                </span>
              )}
            </div>
          </div>
          <Link
            to={`/hotels/${hotel.id}`}
            className="btn-secondary !py-2 !px-4 text-xs font-semibold"
          >
            View Hotel
          </Link>
        </div>
      </div>
    </div>
  );
}
