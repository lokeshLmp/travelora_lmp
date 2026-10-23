import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Check, Heart, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { useWishlist } from '../hooks/useWishlist';

export default function PackageCard({ pkg }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(pkg.id);
  const navigate = useNavigate();

  return (
    <div className="card-premium group overflow-hidden flex flex-col h-full bg-white">
      {/* Image Container */}
      <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Badge (Bestseller, Top Rated, etc.) */}
        {pkg.badge && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-accent text-white text-xs font-bold shadow-xs">
            {pkg.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist({ ...pkg, type: 'package' });
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-600 hover:text-red-500 transition-colors shadow-xs"
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-label="Wishlist toggle"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Destination & Duration Tag */}
        <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
          <span className="text-xs font-semibold bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg">
            {pkg.destination}, {pkg.country}
          </span>
          <span className="text-xs font-semibold flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-secondary" />
            {pkg.duration}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-secondary transition-colors line-clamp-1">
              {pkg.title}
            </h3>
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-xs font-bold text-amber-800 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{pkg.rating}</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 line-clamp-1">{pkg.subtitle}</p>

          {/* Includes checklist */}
          {pkg.includes && (
            <div className="mt-3.5 grid grid-cols-2 gap-1.5 py-2 border-y border-slate-100">
              {pkg.includes.slice(0, 4).map((inc, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate">{inc}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price & Booking Actions */}
        <div className="pt-2">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Starting per person</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-primary">
                  {formatCurrency(pkg.price)}
                </span>
                {pkg.originalPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatCurrency(pkg.originalPrice)}
                  </span>
                )}
              </div>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
              Taxes calculated at checkout
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/packages/${pkg.id}`}
              className="btn-outline !py-2 text-xs font-semibold text-center"
            >
              View Details
            </Link>
            <button
              onClick={() => navigate(`/booking?packageId=${pkg.id}`)}
              className="btn-accent !py-2 text-xs font-semibold"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
