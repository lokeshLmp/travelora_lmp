import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { formatCurrency, formatDate } from '../utils/formatters';
import EmptyState from '../components/EmptyState';
import {
  Luggage,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Trash2,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function MyTrips() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // all, upcoming, completed, cancelled
  const [selectedBookingForModal, setSelectedBookingForModal] = useState(null);

  useEffect(() => {
    // Initial sample seed if no bookings exist yet
    let existing = storageService.getBookings();
    if (!existing || existing.length === 0) {
      const sampleBookings = [
        {
          id: 'TRV-2026-94812',
          bookingId: 'TRV-2026-94812',
          destination: 'Goa',
          packageName: 'Goa Escape',
          travelDate: '2026-09-15',
          duration: '4 Days / 3 Nights',
          travellersCount: 2,
          roomTierName: 'Standard Deluxe Room',
          contact: { name: 'Aarav Sharma', email: 'aarav@example.com', phone: '+91 98765 43210' },
          pricing: { total: 34148, basePrice: 14999, travellerCount: 2 },
          status: 'UPCOMING',
          createdAt: '2026-08-10'
        },
        {
          id: 'TRV-2026-81234',
          bookingId: 'TRV-2026-81234',
          destination: 'Kerala',
          packageName: 'Kerala Backwaters & Tea Trails',
          travelDate: '2026-05-20',
          duration: '5 Days / 4 Nights',
          travellersCount: 2,
          roomTierName: 'Premium Sea/Mountain View Room',
          contact: { name: 'Aarav Sharma', email: 'aarav@example.com', phone: '+91 98765 43210' },
          pricing: { total: 45298, basePrice: 19999, travellerCount: 2 },
          status: 'COMPLETED',
          createdAt: '2026-04-12'
        }
      ];
      sampleBookings.forEach((b) => storageService.saveBooking(b));
      existing = sampleBookings;
    }
    setBookings(existing);
  }, []);

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking? Free refund policy will apply.')) {
      const updated = storageService.cancelBooking(bookingId);
      setBookings(updated);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return b.status === 'UPCOMING' || b.status === 'CONFIRMED';
    if (activeTab === 'completed') return b.status === 'COMPLETED';
    if (activeTab === 'cancelled') return b.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="bg-primary text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary">
            Reservation Management
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            My Travel Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            View upcoming itineraries, download confirmation receipts, and manage trip schedules.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'all', label: 'All Trips' },
          { id: 'upcoming', label: 'Upcoming' },
          { id: 'completed', label: 'Completed' },
          { id: 'cancelled', label: 'Cancelled' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-xs'
                : 'text-slate-600 hover:text-primary hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((trip) => {
            const isCancelled = trip.status === 'CANCELLED';
            const isCompleted = trip.status === 'COMPLETED';

            return (
              <div
                key={trip.id}
                className="card-premium p-6 bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-slate-200/80"
              >
                {/* Left Specs */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-extrabold text-secondary bg-secondary-light px-2.5 py-1 rounded-lg">
                      {trip.bookingId || trip.id}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        isCancelled
                          ? 'bg-rose-50 text-rose-600'
                          : isCompleted
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {trip.status || 'CONFIRMED'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{trip.packageName}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-secondary" />
                      <span>{trip.destination}</span>
                      <span>·</span>
                      <Calendar className="w-3.5 h-3.5 text-secondary" />
                      <span>Travel Date: {formatDate(trip.travelDate)}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                    <div>
                      <span className="text-slate-400">Guests: </span>
                      <span className="font-semibold">{trip.travellersCount || 2} Persons</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Stay: </span>
                      <span className="font-semibold">{trip.roomTierName || 'Deluxe Room'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Lead Booker: </span>
                      <span className="font-semibold">{trip.contact?.name || 'Guest'}</span>
                    </div>
                  </div>
                </div>

                {/* Right Actions & Amount */}
                <div className="flex flex-col sm:flex-row lg:flex-col sm:items-center lg:items-end justify-between gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                  <div className="text-left lg:text-right">
                    <span className="text-[11px] text-slate-400 block font-medium">Total Paid</span>
                    <span className="text-xl font-extrabold text-primary">
                      {formatCurrency(trip.pricing?.total || 14999)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="btn-outline !py-2 text-xs font-semibold gap-1.5"
                      title="Download Voucher"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Voucher</span>
                    </button>

                    {!isCancelled && !isCompleted && (
                      <button
                        onClick={() => handleCancelBooking(trip.id)}
                        className="btn-outline !py-2 !text-rose-600 hover:!bg-rose-50 !border-rose-200 text-xs font-semibold gap-1.5"
                        title="Cancel reservation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No Bookings in this Category"
          description="You don't have any trips listed under this tab. Explore our top holiday packages and plan your adventure today!"
          actionText="Browse Packages"
          onAction={() => navigate('/packages')}
        />
      )}
    </div>
  );
}
