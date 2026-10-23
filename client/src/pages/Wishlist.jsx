import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useWishlist } from '../hooks/useWishlist';
import DestinationCard from '../components/DestinationCard';
import PackageCard from '../components/PackageCard';
import HotelCard from '../components/HotelCard';
import EmptyState from '../components/EmptyState';
import { Heart, Trash2, ArrowRight } from 'lucide-react';

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="bg-primary text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-accent">
            Saved Collections
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>My Saved Wishlist</span>
            <span className="text-sm bg-accent/20 border border-accent/40 text-accent font-bold px-3 py-0.5 rounded-full">
              {wishlist.length} Items
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Keep track of dream locations, luxury hotels, and holiday packages you want to book later.
          </p>
        </div>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => {
            if (item.type === 'package') {
              return <PackageCard key={item.id} pkg={item} />;
            }
            if (item.type === 'hotel') {
              return (
                <div key={item.id} className="sm:col-span-2 lg:col-span-3">
                  <HotelCard hotel={item} />
                </div>
              );
            }
            // default destination
            return <DestinationCard key={item.id} destination={item} />;
          })}
        </div>
      ) : (
        <EmptyState
          title="Your Wishlist is Empty"
          description="Click the heart icon on any destination, hotel, or travel package to save it here for future planning."
          actionText="Explore Destinations"
          onAction={() => navigate('/destinations')}
        />
      )}
    </div>
  );
}
