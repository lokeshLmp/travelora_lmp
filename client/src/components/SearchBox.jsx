import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, DollarSign, Search, Plane, Hotel, Compass, ArrowRight } from 'lucide-react';

export default function SearchBox({ initialTab = 'packages', compact = false }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const navigate = useNavigate();

  // Package Form State
  const [pkgDestination, setPkgDestination] = useState('');
  const [pkgDate, setPkgDate] = useState('');
  const [pkgTravellers, setPkgTravellers] = useState('2');
  const [pkgBudget, setPkgBudget] = useState('50000');

  // Hotel Form State
  const [hotelLocation, setHotelLocation] = useState('');
  const [hotelCheckIn, setHotelCheckIn] = useState('');
  const [hotelGuests, setHotelGuests] = useState('2');

  // Flight Simulation Form State
  const [flightFrom, setFlightFrom] = useState('New Delhi');
  const [flightTo, setFlightTo] = useState('Goa');
  const [flightDate, setFlightDate] = useState('');

  const handlePackageSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (pkgDestination) params.append('destination', pkgDestination);
    if (pkgBudget) params.append('maxPrice', pkgBudget);
    navigate(`/packages?${params.toString()}`);
  };

  const handleHotelSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (hotelLocation) params.append('destination', hotelLocation);
    navigate(`/hotels?${params.toString()}`);
  };

  const handleFlightSearch = (e) => {
    e.preventDefault();
    // Redirect to packages with destination matching flightTo
    navigate(`/packages?destination=${encodeURIComponent(flightTo)}`);
  };

  return (
    <div className={`w-full bg-white rounded-3xl shadow-card border border-slate-100/90 overflow-hidden ${compact ? 'p-4' : 'p-4 sm:p-6'}`}>
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
        <button
          type="button"
          onClick={() => setActiveTab('packages')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'packages'
              ? 'bg-primary text-white shadow-xs'
              : 'text-slate-600 hover:text-primary hover:bg-slate-50'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Packages</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('hotels')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'hotels'
              ? 'bg-primary text-white shadow-xs'
              : 'text-slate-600 hover:text-primary hover:bg-slate-50'
          }`}
        >
          <Hotel className="w-4 h-4" />
          <span>Hotels</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('flights')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'flights'
              ? 'bg-primary text-white shadow-xs'
              : 'text-slate-600 hover:text-primary hover:bg-slate-50'
          }`}
        >
          <Plane className="w-4 h-4" />
          <span>Flights & Combos</span>
        </button>
      </div>

      {/* Package Search Form */}
      {activeTab === 'packages' && (
        <form onSubmit={handlePackageSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Destination */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Destination
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
              <select
                value={pkgDestination}
                onChange={(e) => setPkgDestination(e.target.value)}
                className="input-field pl-9 text-xs sm:text-sm font-medium"
              >
                <option value="">Where do you want to go?</option>
                <option value="Goa">Goa, India</option>
                <option value="Kashmir">Kashmir Valley, India</option>
                <option value="Kerala">Kerala Backwaters, India</option>
                <option value="Manali">Manali Mountains, India</option>
                <option value="Rajasthan">Rajasthan Heritage, India</option>
                <option value="Dubai">Dubai, UAE</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Travel Dates
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
              <input
                type="date"
                value={pkgDate}
                onChange={(e) => setPkgDate(e.target.value)}
                className="input-field pl-9 text-xs sm:text-sm font-medium"
              />
            </div>
          </div>

          {/* Travellers */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Travellers
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
              <select
                value={pkgTravellers}
                onChange={(e) => setPkgTravellers(e.target.value)}
                className="input-field pl-9 text-xs sm:text-sm font-medium"
              >
                <option value="1">1 Solo Explorer</option>
                <option value="2">2 Travellers (Couple / Friends)</option>
                <option value="3">3 Travellers</option>
                <option value="4">4 Travellers (Family / Group)</option>
                <option value="5">5+ Travellers Group</option>
              </select>
            </div>
          </div>

          {/* Budget & Submit */}
          <div className="space-y-1 sm:col-span-2 lg:col-span-1 flex flex-col justify-end">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Budget Range
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                <select
                  value={pkgBudget}
                  onChange={(e) => setPkgBudget(e.target.value)}
                  className="input-field pl-8 text-xs sm:text-sm font-medium"
                >
                  <option value="20000">Up to ₹20,000</option>
                  <option value="35000">Up to ₹35,000</option>
                  <option value="50000">Up to ₹50,000</option>
                  <option value="100000">Luxury (₹1 Lakh+)</option>
                </select>
              </div>
              <button
                type="submit"
                className="btn-accent !px-5 text-sm font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Search className="w-4 h-4" />
                <span>Search Trips</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Hotel Search Form */}
      {activeTab === 'hotels' && (
        <form onSubmit={handleHotelSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Destination / City
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
              <select
                value={hotelLocation}
                onChange={(e) => setHotelLocation(e.target.value)}
                className="input-field pl-9 text-xs sm:text-sm font-medium"
              >
                <option value="">Select City / Region</option>
                <option value="Goa">Goa (Beaches & Resorts)</option>
                <option value="Kashmir">Kashmir (Gulmarg / Srinagar)</option>
                <option value="Kerala">Kerala (Kumarakom / Alleppey)</option>
                <option value="Manali">Manali (Riverside Chalets)</option>
                <option value="Rajasthan">Rajasthan (Udaipur / Jaipur)</option>
                <option value="Dubai">Dubai (Marina & Palm)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Check-in Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
              <input
                type="date"
                value={hotelCheckIn}
                onChange={(e) => setHotelCheckIn(e.target.value)}
                className="input-field pl-9 text-xs sm:text-sm font-medium"
              />
            </div>
          </div>

          <div className="space-y-1 flex flex-col justify-end">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Guests & Rooms
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                <select
                  value={hotelGuests}
                  onChange={(e) => setHotelGuests(e.target.value)}
                  className="input-field pl-9 text-xs sm:text-sm font-medium"
                >
                  <option value="1">1 Guest · 1 Room</option>
                  <option value="2">2 Guests · 1 Room</option>
                  <option value="4">4 Guests · 2 Rooms</option>
                </select>
              </div>
              <button
                type="submit"
                className="btn-secondary !px-5 text-sm font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Search className="w-4 h-4" />
                <span>Find Hotels</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Flight Search Form */}
      {activeTab === 'flights' && (
        <form onSubmit={handleFlightSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Origin City
            </label>
            <input
              type="text"
              value={flightFrom}
              onChange={(e) => setFlightFrom(e.target.value)}
              className="input-field text-xs sm:text-sm font-medium"
              placeholder="e.g. New Delhi, Mumbai"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Flying To
            </label>
            <select
              value={flightTo}
              onChange={(e) => setFlightTo(e.target.value)}
              className="input-field text-xs sm:text-sm font-medium"
            >
              <option value="Goa">Goa (GOI / GOX)</option>
              <option value="Kashmir">Srinagar, Kashmir (SXR)</option>
              <option value="Kerala">Kochi, Kerala (COK)</option>
              <option value="Dubai">Dubai, UAE (DXB)</option>
              <option value="Rajasthan">Jaipur / Udaipur (JAI/UDR)</option>
            </select>
          </div>

          <div className="space-y-1 flex flex-col justify-end">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Departure
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={flightDate}
                onChange={(e) => setFlightDate(e.target.value)}
                className="input-field text-xs sm:text-sm font-medium"
              />
              <button
                type="submit"
                className="btn-primary !px-5 text-sm font-bold flex items-center gap-1.5 shadow-sm shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Search Trips</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
