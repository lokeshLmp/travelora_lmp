import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { hotelsData } from '../data/hotels';
import { formatCurrency } from '../utils/formatters';
import { useWishlist } from '../hooks/useWishlist';
import {
  Star,
  MapPin,
  Check,
  Heart,
  ArrowLeft,
  ShieldCheck,
  Wifi,
  Coffee,
  Sparkles,
  Users,
  Calendar
} from 'lucide-react';

export default function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const hotel = hotelsData.find((h) => h.id === id) || hotelsData[0];
  const isWishlisted = isInWishlist(hotel.id);

  const [selectedRoom, setSelectedRoom] = useState(hotel.roomTypes?.[0] || { name: 'Standard Deluxe', price: hotel.pricePerNight });
  const [nights, setNights] = useState(2);
  const [guests, setGuests] = useState(2);

  const totalStayCost = selectedRoom.price * nights;

  return (
    <div className="pb-20 space-y-12">
      {/* Hero Header */}
      <div className="relative h-[420px] sm:h-[480px] w-full overflow-hidden bg-primary">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover object-center brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent"></div>

        <div className="absolute top-6 left-4 sm:left-8 right-4 sm:right-8 flex items-center justify-between z-10">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md text-white text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            onClick={() => toggleWishlist({ ...hotel, type: 'hotel' })}
            className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-red-500 transition-colors shadow-sm"
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        <div className="absolute bottom-8 left-4 sm:left-8 right-4 sm:right-8 max-w-7xl mx-auto z-10 text-white space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-xs">
              Verified 5★ Luxury
            </span>
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{hotel.rating} ({hotel.reviewCount} reviews)</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {hotel.name}
          </h1>

          <p className="text-sm sm:text-base text-slate-200 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-secondary" />
            <span>{hotel.location}</span>
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <section className="card-premium p-6 sm:p-8 bg-white space-y-4">
              <h2 className="text-xl font-bold text-slate-900">About the Property</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {hotel.description}
              </p>
            </section>

            {/* Amenities Grid */}
            <section className="card-premium p-6 sm:p-8 bg-white space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-secondary" />
                Featured Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {hotel.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <Check className="w-4 h-4 text-secondary shrink-0" />
                    <span className="text-xs font-semibold text-slate-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Room Options */}
            {hotel.roomTypes && (
              <section className="card-premium p-6 sm:p-8 bg-white space-y-4">
                <h2 className="text-xl font-bold text-slate-900">Select Room Category</h2>
                <div className="space-y-3">
                  {hotel.roomTypes.map((room, idx) => {
                    const isSelected = selectedRoom.name === room.name;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedRoom(room)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-secondary bg-secondary-light/30'
                            : 'border-slate-100 hover:border-slate-200 bg-white'
                        }`}
                      >
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-slate-800">{room.name}</h4>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            {room.capacity}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-extrabold text-primary block">
                            {formatCurrency(room.price)}
                          </span>
                          <span className="text-[10px] text-slate-400">per night</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Booking Summary Widget */}
          <div className="lg:col-span-1 sticky top-24 space-y-4">
            <div className="card-premium p-6 bg-white space-y-5 shadow-card">
              <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Selected Room</span>
                  <span className="text-lg font-extrabold text-primary">
                    {formatCurrency(selectedRoom.price)}
                  </span>
                  <span className="text-[11px] text-slate-500"> / night</span>
                </div>
                <span className="text-xs font-semibold text-secondary bg-secondary-light px-2 py-0.5 rounded">
                  Best Rate
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 block">Length of Stay (Nights)</label>
                  <select
                    value={nights}
                    onChange={(e) => setNights(Number(e.target.value))}
                    className="input-field !py-2"
                  >
                    <option value="1">1 Night</option>
                    <option value="2">2 Nights</option>
                    <option value="3">3 Nights</option>
                    <option value="4">4 Nights</option>
                    <option value="5">5 Nights</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500 block">Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="input-field !py-2"
                  >
                    <option value="1">1 Adult</option>
                    <option value="2">2 Adults</option>
                    <option value="3">3 Adults</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Room rate ({nights} nights)</span>
                  <span className="font-bold text-slate-800">{formatCurrency(totalStayCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (12% GST)</span>
                  <span className="font-bold text-slate-800">{formatCurrency(Math.round(totalStayCost * 0.12))}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-100 text-sm">
                  <span>Total Payable</span>
                  <span className="text-primary font-extrabold">{formatCurrency(Math.round(totalStayCost * 1.12))}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  navigate(`/packages?destination=${encodeURIComponent(hotel.destination)}`);
                }}
                className="btn-accent w-full !py-3 text-sm font-bold shadow-md"
              >
                Find Holiday Packages
              </button>

              <p className="text-[11px] text-center text-slate-400">
                ⚡ Instant confirmation with zero booking fee
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
