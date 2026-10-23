import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { storageService } from '../services/storageService';
import { User, Mail, Phone, Sliders, Heart, Shield, Save, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || 'Aarav Sharma');
  const [email, setEmail] = useState(user?.email || 'aarav.sharma@example.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');

  const [preferences, setPreferences] = useState(storageService.getPreferences());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({ name, email, phone });
    storageService.setPreferences(preferences);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="bg-primary text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-secondary text-white font-extrabold text-2xl flex items-center justify-center shadow-sm">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-white">{name}</h1>
            <p className="text-xs sm:text-sm text-slate-300">{email} · Verified Member</p>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Your profile information and travel preferences have been successfully updated!</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSaveProfile} className="space-y-8">
        
        {/* Personal Details */}
        <div className="card-premium p-6 sm:p-8 bg-white space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-secondary" />
              Personal Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Phone / WhatsApp</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>
        </div>

        {/* Travel Preferences */}
        <div className="card-premium p-6 sm:p-8 bg-white space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-secondary" />
              Travel Preferences & Personalization
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              We use these settings to tailor holiday package recommendations on your homepage.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Preferred Budget Range</label>
              <select
                value={preferences.budget}
                onChange={(e) => setPreferences({ ...preferences, budget: e.target.value })}
                className="input-field"
              >
                <option value="Under ₹20,000">Under ₹20,000 (Budget Friendly)</option>
                <option value="₹20,000 - ₹50,000">₹20,000 - ₹50,000 (Standard)</option>
                <option value="₹50,000+">₹50,000+ (Luxury / Premium)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Preferred Destination Type</label>
              <select
                value={preferences.destinationType}
                onChange={(e) => setPreferences({ ...preferences, destinationType: e.target.value })}
                className="input-field"
              >
                <option value="Beach & Nature">Beach & Nature</option>
                <option value="Snow & Mountains">Snow & Mountains</option>
                <option value="Heritage & Palaces">Heritage & Palaces</option>
                <option value="International City">International City</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Travel Style</label>
              <select
                value={preferences.travelStyle}
                onChange={(e) => setPreferences({ ...preferences, travelStyle: e.target.value })}
                className="input-field"
              >
                <option value="Comfort & Luxury">Comfort & Luxury</option>
                <option value="Adventure & Backpacking">Adventure & Backpacking</option>
                <option value="Family Friendly">Family Friendly</option>
                <option value="Romantic Getaways">Romantic Getaways</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between">
          <Link to="/wishlist" className="btn-outline text-xs gap-1.5 font-semibold">
            <Heart className="w-3.5 h-3.5 text-red-500" />
            <span>View Saved Wishlist</span>
          </Link>
          <button type="submit" className="btn-primary text-xs font-bold gap-2 px-6">
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
