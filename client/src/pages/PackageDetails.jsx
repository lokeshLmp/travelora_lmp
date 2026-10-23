import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { packagesData } from '../data/packages';
import { formatCurrency } from '../utils/formatters';
import { useWishlist } from '../hooks/useWishlist';
import {
  Star,
  Clock,
  MapPin,
  Check,
  X,
  Hotel,
  Utensils,
  Car,
  ShieldCheck,
  ArrowLeft,
  Heart,
  Calendar,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function PackageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const pkg = packagesData.find((p) => p.id === id) || packagesData[0];
  const isWishlisted = isInWishlist(pkg.id);

  return (
    <div className="pb-20 space-y-12">
      {/* Hero Visual Header */}
      <div className="relative h-[440px] sm:h-[500px] w-full overflow-hidden bg-primary">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="w-full h-full object-cover object-center brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent"></div>

        {/* Back and Wishlist buttons */}
        <div className="absolute top-6 left-4 sm:left-8 right-4 sm:right-8 flex items-center justify-between z-10">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md text-white text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            onClick={() => toggleWishlist({ ...pkg, type: 'package' })}
            className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-red-500 transition-colors shadow-sm"
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        {/* Floating Details */}
        <div className="absolute bottom-8 left-4 sm:left-8 right-4 sm:right-8 max-w-7xl mx-auto z-10 text-white space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {pkg.badge && (
              <span className="px-3 py-1 rounded-full bg-accent text-white text-xs font-bold shadow-xs">
                {pkg.badge}
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold">
              {pkg.travelType}
            </span>
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{pkg.rating} ({pkg.reviewCount} reviews)</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {pkg.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-200 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-secondary" />
            <span>{pkg.destination}, {pkg.country}</span>
            <span className="text-slate-400">·</span>
            <Clock className="w-4 h-4 text-secondary" />
            <span>{pkg.duration}</span>
          </p>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left 2 Columns: Itinerary & Inclusions */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Specs Highlight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="card-premium p-4 flex items-center gap-3.5 bg-white">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-secondary flex items-center justify-center shrink-0">
                  <Hotel className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Stay</span>
                  <p className="text-xs font-bold text-slate-800 line-clamp-1">{pkg.accommodation}</p>
                </div>
              </div>

              <div className="card-premium p-4 flex items-center gap-3.5 bg-white">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Meals</span>
                  <p className="text-xs font-bold text-slate-800 line-clamp-1">{pkg.meals}</p>
                </div>
              </div>

              <div className="card-premium p-4 flex items-center gap-3.5 bg-white">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Transport</span>
                  <p className="text-xs font-bold text-slate-800 line-clamp-1">{pkg.transport}</p>
                </div>
              </div>
            </div>

            {/* Overview */}
            <section className="card-premium p-6 sm:p-8 bg-white space-y-3">
              <h2 className="text-xl font-bold text-slate-900">Trip Overview</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Enjoy a meticulously planned holiday in {pkg.destination}. This package blends leisure, cultural exploration, and breathtaking viewpoints with vetted 4★/5★ hospitality and private chauffeured transfers.
              </p>
            </section>

            {/* Day by Day Itinerary */}
            <section className="card-premium p-6 sm:p-8 bg-white space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-secondary" />
                  Day-by-Day Itinerary
                </h2>
                <span className="text-xs font-semibold text-slate-500">
                  {pkg.itinerary.length} Days Plan
                </span>
              </div>

              <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                {pkg.itinerary.map((dayItem) => (
                  <div key={dayItem.day} className="relative pl-9 space-y-2">
                    {/* Step marker dot */}
                    <div className="absolute left-0 top-0.5 w-7 h-7 rounded-full bg-secondary text-white font-bold text-xs flex items-center justify-center ring-4 ring-white shadow-xs">
                      {dayItem.day}
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block">
                        DAY {dayItem.day}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">
                        {dayItem.title}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {dayItem.description}
                    </p>

                    {dayItem.activities && (
                      <div className="pt-1.5 flex flex-wrap gap-1.5">
                        {dayItem.activities.map((act, actIdx) => (
                          <span
                            key={actIdx}
                            className="inline-flex items-center gap-1 text-[11px] bg-slate-50 border border-slate-200/60 text-slate-700 px-2.5 py-1 rounded-lg font-medium"
                          >
                            <Check className="w-3 h-3 text-emerald-500" />
                            {act}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Inclusions */}
              <div className="card-premium p-6 bg-white space-y-4">
                <h3 className="text-base font-bold text-emerald-800 flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-500" />
                  What's Included
                </h3>
                <ul className="space-y-2 text-xs text-slate-600">
                  {pkg.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="card-premium p-6 bg-white space-y-4">
                <h3 className="text-base font-bold text-rose-800 flex items-center gap-2">
                  <X className="w-5 h-5 text-rose-500" />
                  What's Excluded
                </h3>
                <ul className="space-y-2 text-xs text-slate-600">
                  {pkg.exclusions.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">✕</span>
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="lg:col-span-1 sticky top-24 space-y-4">
            <div className="card-premium p-6 bg-white space-y-6 shadow-card">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Starting per person</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-primary">
                    {formatCurrency(pkg.price)}
                  </span>
                  {pkg.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      {formatCurrency(pkg.originalPrice)}
                    </span>
                  )}
                </div>
                <span className="text-xs text-emerald-600 font-semibold mt-1 block">
                  Save {formatCurrency((pkg.originalPrice || pkg.price * 1.25) - pkg.price)} today
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-bold text-slate-800">{pkg.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Destination:</span>
                  <span className="font-bold text-slate-800">{pkg.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cancellation:</span>
                  <span className="font-bold text-emerald-600">Free up to 48 hrs</span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/booking?packageId=${pkg.id}`)}
                className="btn-accent w-full !py-3.5 text-base font-bold shadow-md flex items-center justify-center gap-2"
              >
                <span>Book This Package</span>
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-secondary" />
                <span>Instant Confirmation & Flexible Dates</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
