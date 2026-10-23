import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin, ShieldCheck, Globe } from 'lucide-react';
import DemoBadge from './DemoBadge';

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-12 border-t border-primary-light/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-700/60">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-white shadow-sm">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">TRAVELORA</span>
            </Link>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              "Plan less. Travel more."
            </p>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              A centralized smart travel platform designed to simplify destination discovery, curated package bookings, luxury hotels, and seamless reservation management.
            </p>
            <div className="pt-2">
              <DemoBadge />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-secondary transition-all cursor-pointer">
                <Globe className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Explore</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/destinations" className="hover:text-white transition-colors">Popular Destinations</Link></li>
              <li><Link to="/packages" className="hover:text-white transition-colors">Featured Packages</Link></li>
              <li><Link to="/hotels" className="hover:text-white transition-colors">Luxury Resorts & Hotels</Link></li>
              <li><Link to="/my-trips" className="hover:text-white transition-colors">My Bookings</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">Saved Wishlist</Link></li>
            </ul>
          </div>

          {/* Popular Destinations */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Top Locations</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/destinations/dest-1" className="hover:text-white transition-colors">Goa Beaches</Link></li>
              <li><Link to="/destinations/dest-2" className="hover:text-white transition-colors">Kashmir Valley</Link></li>
              <li><Link to="/destinations/dest-3" className="hover:text-white transition-colors">Kerala Backwaters</Link></li>
              <li><Link to="/destinations/dest-4" className="hover:text-white transition-colors">Manali Mountains</Link></li>
              <li><Link to="/destinations/dest-5" className="hover:text-white transition-colors">Royal Rajasthan</Link></li>
              <li><Link to="/destinations/dest-6" className="hover:text-white transition-colors">Dubai Grandeur</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Support & Admin</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-secondary" />
                <span>support@travelora.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-secondary" />
                <span>+91 1800-425-TRV</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-secondary" />
                <span>New Delhi, India</span>
              </li>
              <li className="pt-2">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-400 transition-colors border border-slate-700"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Console
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} TRAVELORA Technologies Ltd. Academic Travel Project.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Security</span>
          </div>
        </div>
      </div>
    <p className="text-center text-sm">lokesh_LMP</p>
    </footer>
  );
}
