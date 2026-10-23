import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Compass, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate('/profile');
    } else {
      setError(res.message || 'Invalid email or password.');
    }
  };

  const handleQuickFillUser = () => {
    setEmail('user@travelora.com');
    setPassword('travelora123');
  };

  const handleQuickFillAdmin = () => {
    setEmail('admin@travelora.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="card-premium p-8 sm:p-10 w-full max-w-md bg-white space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white mx-auto shadow-sm">
            <Compass className="w-6 h-6 text-secondary" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome to Travelora</h1>
          <p className="text-xs text-slate-500">Sign in to access your booked trips & saved wishlist</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="input-field pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700">Password</label>
              <span className="text-slate-400 hover:text-secondary cursor-pointer">Forgot?</span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field pl-10"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full !py-2.5 text-sm font-bold gap-2 mt-2"
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Mode Quick Access Helper for Academic Evaluation */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
          <span className="font-bold text-slate-600 block text-[11px] uppercase tracking-wider">
            Demo Credentials (1-Click Fill)
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleQuickFillUser}
              className="flex-1 py-1.5 px-2 bg-white rounded-lg border border-slate-200 text-slate-700 font-semibold text-[11px] hover:bg-slate-100"
            >
              Demo Traveler
            </button>
            <button
              type="button"
              onClick={handleQuickFillAdmin}
              className="flex-1 py-1.5 px-2 bg-slate-800 rounded-lg text-emerald-400 font-semibold text-[11px] hover:bg-slate-700"
            >
              Demo Admin
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Don't have an account?{' '}
          <Link to="/signup" className="text-secondary font-bold hover:underline">
            Create an account
          </Link>
        </div>

      </div>
    </div>
  );
}
