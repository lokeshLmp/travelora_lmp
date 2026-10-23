import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Heart, User, LogOut, Menu, X, Search, ShieldCheck, Luggage } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../hooks/useWishlist';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/packages?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Explore', path: '/' },
    { name: 'Destinations', path: '/destinations' },
    { name: 'Packages', path: '/packages' },
    { name: 'Hotels', path: '/hotels' },
    { name: 'My Trips', path: '/my-trips' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 py-3'
            : 'bg-white border-b border-slate-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm group-hover:bg-primary-light transition-colors">
                <Compass className="w-5 h-5 text-secondary animate-[spin_12s_linear_infinite]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-primary flex items-center gap-1">
                  TRAVELORA
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold -mt-1">
                  Smart Travel
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-secondary bg-secondary-light font-semibold'
                        : 'text-slate-600 hover:text-primary hover:bg-slate-50'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Quick Search Trigger */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-xl transition-colors"
                title="Search destinations & packages"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Button */}
              <Link
                to="/wishlist"
                className="relative p-2 text-slate-600 hover:text-red-500 hover:bg-slate-100 rounded-xl transition-colors"
                title="Wishlist"
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-accent text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* User Account / Auth Section */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[100px]">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-slate-500 capitalize">{user.role || 'Member'}</p>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-card border border-slate-100 py-2 z-50 fade-in">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-800 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Profile & Preferences</span>
                      </Link>
                      <Link
                        to="/my-trips"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                      >
                        <Luggage className="w-4 h-4 text-slate-400" />
                        <span>My Booked Trips</span>
                      </Link>
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span className="flex items-center justify-between w-full">
                          Admin Dashboard
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-medium px-1.5 py-0.5 rounded">Demo</span>
                        </span>
                      </Link>
                      <div className="border-t border-slate-100 my-1"></div>
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="hidden sm:inline-flex px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-primary hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="btn-primary text-sm !py-2 !px-4"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar Drawer (Slide Down) */}
        {searchOpen && (
          <div className="border-t border-slate-100 bg-slate-50/90 backdrop-blur-md px-4 py-3 fade-in">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search destination, hotel, or package (e.g. Goa, Manali, Luxury)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary shadow-xs"
                  autoFocus
                />
              </div>
              <button type="submit" className="btn-secondary !py-2.5 !px-5 text-sm">
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 fade-in">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-xl text-base font-medium ${
                    isActive
                      ? 'bg-secondary-light text-secondary font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <NavLink
              to="/wishlist"
              className="flex items-center justify-between px-4 py-2.5 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Wishlist
              </span>
              {wishlist.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-accent text-white text-xs font-bold">
                  {wishlist.length}
                </span>
              )}
            </NavLink>
            <NavLink
              to="/admin"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Admin Portal
            </NavLink>
            {!user ? (
              <div className="pt-4 flex flex-col gap-2 border-t border-slate-100">
                <Link to="/login" className="btn-outline w-full text-center">
                  Log In
                </Link>
                <Link to="/signup" className="btn-primary w-full text-center">
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <Link to="/profile" className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-50 font-medium">
                  My Profile ({user.email})
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl font-medium"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}
