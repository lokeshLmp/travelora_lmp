import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { destinationsData } from '../data/destinations';
import { packagesData } from '../data/packages';
import { hotelsData } from '../data/hotels';
import { reviewsData } from '../data/reviews';
import PackageCard from '../components/PackageCard';
import HotelCard from '../components/HotelCard';
import ReviewCard from '../components/ReviewCard';
import { formatCurrency } from '../utils/formatters';
import { useWishlist } from '../hooks/useWishlist';
import {
  Star,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Heart,
  Luggage,
  Compass
} from 'lucide-react';

export default function DestinationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const destination = destinationsData.find((d) => d.id === id) || destinationsData[0];
  const isWishlisted = isInWishlist(destination.id);

  // Recommended packages and hotels for this destination
  const recommendedPackages = packagesData.filter(
    (p) => p.destination.toLowerCase() === destination.name.toLowerCase()
  );
  const recommendedHotels = hotelsData.filter(
    (h) => h.destination.toLowerCase() === destination.name.toLowerCase()
  );

  return (
    <div className="pb-20 space-y-12">
      {/* Hero Visual Header */}
      <div className="relative h-[420px] sm:h-[480px] w-full overflow-hidden bg-primary">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover object-center brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent"></div>

        {/* Back Link & Wishlist floating bar */}
        <div className="absolute top-6 left-4 sm:left-8 right-4 sm:right-8 flex items-center justify-between z-10">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md text-white text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            onClick={() => toggleWishlist({ ...destination, type: 'destination' })}
            className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-red-500 transition-colors shadow-sm"
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        {/* Hero Title and Info */}
        <div className="absolute bottom-8 left-4 sm:left-8 right-4 sm:right-8 max-w-7xl mx-auto z-10 text-white space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-secondary text-white text-xs font-bold shadow-xs">
              {destination.category}
            </span>
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{destination.rating} ({destination.reviewCount} reviews)</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {destination.name}
          </h1>

          <p className="text-sm sm:text-base text-slate-200 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-secondary" />
            <span>{destination.country}</span>
            <span className="text-slate-400">·</span>
            <span className="italic">{destination.tagline}</span>
          </p>
        </div>
      </div>

      {/* Main Content Info Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Key Info Cards Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card-premium p-5 flex items-center gap-4 bg-white">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-secondary flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Best Time to Visit</span>
              <p className="text-xs sm:text-sm font-bold text-slate-800">{destination.bestTimeToVisit}</p>
            </div>
          </div>

          <div className="card-premium p-5 flex items-center gap-4 bg-white">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Budget</span>
              <p className="text-xs sm:text-sm font-bold text-slate-800">{destination.estimatedBudget}</p>
            </div>
          </div>

          <div className="card-premium p-5 flex items-center gap-4 bg-white">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Tour Starting Price</span>
              <p className="text-xs sm:text-sm font-bold text-primary">{formatCurrency(destination.startingPrice)} / person</p>
            </div>
          </div>
        </div>

        {/* Overview & Attractions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <section className="card-premium p-6 sm:p-8 bg-white space-y-4">
              <h2 className="text-xl font-bold text-slate-900">About {destination.name}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {destination.description}
              </p>
            </section>

            {/* Popular Attractions */}
            <section className="card-premium p-6 sm:p-8 bg-white space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-secondary" />
                Popular Attractions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {destination.popularAttractions.map((attr, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                    <span className="text-xs font-semibold text-slate-700">{attr}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Things To Do */}
            <section className="card-premium p-6 sm:p-8 bg-white space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Top Things to Do & Experiences</h2>
              <ul className="space-y-3">
                {destination.thingsToDo.map((todo, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-600">
                    <span className="w-5 h-5 rounded-full bg-secondary/10 text-secondary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{todo}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Sidebar CTA Card */}
          <div className="space-y-6">
            <div className="card-premium p-6 bg-gradient-to-br from-primary to-primary-light text-white space-y-5">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                  Ready to explore?
                </span>
                <h3 className="text-xl font-extrabold text-white">
                  Plan your {destination.name} holiday
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Book curated all-inclusive packages with guaranteed best prices and verified accommodations.
                </p>
              </div>

              <div className="pt-2 border-t border-white/10 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300">Packages available:</span>
                  <span className="font-bold text-white">{recommendedPackages.length} tours</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300">Resorts & Hotels:</span>
                  <span className="font-bold text-white">{recommendedHotels.length} luxury stays</span>
                </div>
              </div>

              <Link
                to={`/packages?destination=${encodeURIComponent(destination.name)}`}
                className="btn-accent w-full text-center text-xs font-bold shadow-md"
              >
                Find Trips to {destination.name}
              </Link>
            </div>
          </div>

        </div>

        {/* Recommended Packages Section */}
        {recommendedPackages.length > 0 && (
          <section className="space-y-6 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Recommended Packages in {destination.name}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Handcrafted holiday tours designed for unforgettable experiences.
                </p>
              </div>
              <Link
                to={`/packages?destination=${encodeURIComponent(destination.name)}`}
                className="btn-outline text-xs font-semibold"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </section>
        )}

        {/* Recommended Hotels Section */}
        {recommendedHotels.length > 0 && (
          <section className="space-y-6 pt-6 border-t border-slate-200">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Luxury Stays & Resorts in {destination.name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Top-rated properties with verified amenities.
              </p>
            </div>

            <div className="space-y-4">
              {recommendedHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          </section>
        )}

        {/* Reviews Section */}
        <section className="space-y-6 pt-6 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Traveler Feedback</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviewsData.map((rev) => (
              <ReviewCard key={rev.id} review={rev} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
