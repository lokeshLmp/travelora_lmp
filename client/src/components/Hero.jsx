import React from 'react';
import SearchBox from './SearchBox';
import { Shield, Sparkles, Award } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden bg-primary">
      {/* Background Image with High Quality Travel Visual */}
      <img
        src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80"
        alt="Travelora Panoramic Journey"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-45 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out"
      />

      {/* Layered Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/40"></div>
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-primary/40 to-primary"></div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center flex flex-col items-center">
        
        {/* Floating Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>Smart Centralized Travel Booking Platform</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight sm:leading-none max-w-4xl drop-shadow-md">
          Your journey, <span className="text-secondary bg-clip-text">planned in one place.</span>
        </h1>

        {/* Supporting Subtitle */}
        <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-slate-200 max-w-2xl font-normal leading-relaxed drop-shadow-sm">
          Discover destinations, compare travel options, and book your next adventure without the hassle.
        </p>

        {/* Search Panel Tabs & Form */}
        <div className="mt-8 sm:mt-10 w-full max-w-5xl">
          <SearchBox />
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Guaranteed Best Prices</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-secondary" />
            <span>Verified 4★ & 5★ Hotels</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Instant Booking Vouchers</span>
          </div>
        </div>

      </div>
    </div>
  );
}
