import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import DestinationCard from '../components/DestinationCard';
import PackageCard from '../components/PackageCard';
import ReviewCard from '../components/ReviewCard';
import { destinationsData } from '../data/destinations';
import { packagesData } from '../data/packages';
import { reviewsData } from '../data/reviews';
import { inspirationsData } from '../data/inspirations';
import {
  Compass,
  Hotel,
  Luggage,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Sliders,
  Calendar,
  Layers,
  HeartHandshake,
  BookOpen
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  // Quick Action cards data
  const quickActions = [
    {
      title: 'Explore Destinations',
      desc: 'Browse scenic beaches, snow peaks, and heritage cities.',
      icon: Compass,
      color: 'bg-blue-500/10 text-secondary',
      link: '/destinations',
    },
    {
      title: 'Find Hotels',
      desc: 'Discover vetted 4★ & 5★ luxury stays and boutique retreats.',
      icon: Hotel,
      color: 'bg-emerald-500/10 text-emerald-600',
      link: '/hotels',
    },
    {
      title: 'Travel Packages',
      desc: 'All-inclusive multi-day curated itineraries with cabs & meals.',
      icon: Luggage,
      color: 'bg-amber-500/10 text-accent',
      link: '/packages',
    },
    {
      title: 'Plan My Trip',
      desc: 'Customize budget, dates, and preferences with instant quotes.',
      icon: Sparkles,
      color: 'bg-purple-500/10 text-purple-600',
      link: '/packages?category=Adventure',
    },
  ];

  // Why Travelora benefits
  const benefits = [
    {
      title: 'One Platform',
      desc: 'Search destinations, hotels, transfers, and packages together without tab hopping.',
      icon: Layers,
    },
    {
      title: 'Transparent Pricing',
      desc: 'See a crystal-clear price breakdown with all taxes & fees before making any payment.',
      icon: CreditCard,
    },
    {
      title: 'Easy Step Booking',
      desc: 'Simple 7-step reservation flow with instant booking ID and download vouchers.',
      icon: CheckCircle2,
    },
    {
      title: 'Personalized Travel',
      desc: 'Smart recommendations curated specifically to your budget and travel style.',
      icon: HeartHandshake,
    },
  ];

  // How it works timeline
  const steps = [
    {
      step: '01',
      title: 'Search',
      desc: 'Filter by budget, dates, travel style, and dream locations across India & abroad.',
    },
    {
      step: '02',
      title: 'Compare',
      desc: 'Review day-by-day itineraries, hotel amenities, inclusions, and transparent pricing.',
    },
    {
      step: '03',
      title: 'Book',
      desc: 'Reserve with simple guest details and a simulation payment gateway.',
    },
    {
      step: '04',
      title: 'Travel',
      desc: 'Receive instant confirmation vouchers, round-the-clock support, and relax.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* SECTION 1: HERO */}
      <Hero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        
        {/* SECTION 2: QUICK ACTIONS */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <Link
                  key={i}
                  to={action.link}
                  className="card-premium p-6 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 bg-white"
                >
                  <div className="space-y-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800 group-hover:text-secondary transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {action.desc}
                    </p>
                  </div>
                  <div className="pt-4 flex items-center text-xs font-bold text-secondary group-hover:translate-x-1 transition-transform">
                    <span>Explore now</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: POPULAR DESTINATIONS */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                Wanderlust Guaranteed
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mt-1">
                Popular Destinations
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Handcrafted getaways with stunning vistas and memorable local experiences.
              </p>
            </div>
            <Link to="/destinations" className="btn-outline text-xs gap-1.5 self-start sm:self-auto font-semibold">
              <span>View All Destinations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinationsData.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        </section>

        {/* SECTION 4: FEATURED TRAVEL PACKAGES */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent">
                Curated Itineraries
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mt-1">
                Featured Travel Packages
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Complete multi-day holiday packages with hotels, breakfast, cabs, and sightseeing.
              </p>
            </div>
            <Link to="/packages" className="btn-outline text-xs gap-1.5 self-start sm:self-auto font-semibold">
              <span>Explore All Packages</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packagesData.slice(0, 3).map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </section>

        {/* SECTION 5: WHY TRAVELORA */}
        <section className="bg-primary text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-3 mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary">
              The Travelora Advantage
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why Book With Travelora?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We eliminated the complexity of planning trips by unifying hotels, itineraries, and upfront costs into one clean experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">{b.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 6: HOW IT WORKS */}
        <section className="space-y-10 text-center">
          <div className="max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">
              Seamless Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
              How Travelora Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Four effortless steps between your daydream and your destination.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map((s, idx) => (
              <div key={idx} className="card-premium p-6 text-left relative overflow-hidden bg-white">
                <span className="text-4xl font-black text-slate-100 absolute top-3 right-4 select-none">
                  {s.step}
                </span>
                <div className="w-8 h-8 rounded-full bg-secondary text-white font-bold text-xs flex items-center justify-center mb-4">
                  {s.step}
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1.5">{s.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 7: RECOMMENDED FOR YOU */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-600 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Personalized Suggestions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                Trips You Might Love
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Matched according to trending preferences, budget friendliness, and top traveler ratings.
              </p>
            </div>
            <Link to="/packages" className="hidden sm:inline-flex btn-outline text-xs gap-1 font-semibold">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packagesData.slice(3, 6).map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </section>

        {/* SECTION 8: TRAVEL INSPIRATION */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                Stories & Insights
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mt-1">
                Travel Inspiration
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Curated guides, hidden attractions, and travel hacks from our editors.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {inspirationsData.map((art) => (
              <div key={art.id} className="card-premium group overflow-hidden flex flex-col bg-white">
                <div className="aspect-16/10 overflow-hidden relative">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white">
                    {art.tag}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-medium">{art.readTime}</span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-secondary transition-colors line-clamp-2">
                      {art.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {art.snippet}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-secondary inline-flex items-center gap-1 pt-2 group-hover:translate-x-0.5 transition-transform">
                    Read guide <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 9: REVIEWS */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">
              Real Experiences
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
              What Our Travelers Say
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Verified reviews from real travelers who booked with Travelora.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviewsData.map((rev) => (
              <ReviewCard key={rev.id} review={rev} />
            ))}
          </div>
        </section>

        {/* SECTION 10: FINAL CTA */}
        <section className="bg-gradient-to-r from-primary via-primary-light to-primary rounded-3xl p-8 sm:p-14 text-center text-white relative overflow-hidden shadow-card">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready for your next adventure?
            </h2>
            <p className="text-sm sm:text-base text-slate-200">
              Explore handpicked packages, enjoy transparent pricing, and receive instant confirmation for your dream getaway today.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link to="/packages" className="btn-accent !py-3 !px-8 text-base shadow-card">
                Start Planning Trips
              </Link>
              <Link to="/destinations" className="btn-outline !bg-transparent !text-white !border-white/30 hover:!bg-white/10 !py-3 !px-6 text-sm">
                Browse Destinations
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
