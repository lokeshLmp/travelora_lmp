import React, { useState } from 'react';
import { packagesData } from '../data/packages';
import { formatCurrency } from '../utils/formatters';
import { storageService } from '../services/storageService';
import Modal from '../components/Modal';
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Luggage,
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  MapPin,
  Sparkles,
  BarChart3
} from 'lucide-react';

export default function Admin() {
  const [packages, setPackages] = useState(packagesData);
  const [bookings, setBookings] = useState(() => storageService.getBookings());

  // Package Modal Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPkgId, setEditingPkgId] = useState(null);
  const [pkgTitle, setPkgTitle] = useState('');
  const [pkgDestination, setPkgDestination] = useState('Goa');
  const [pkgDuration, setPkgDuration] = useState('4 Days / 3 Nights');
  const [pkgPrice, setPkgPrice] = useState(14999);
  const [pkgCategory, setPkgCategory] = useState('Beach');
  const [pkgImage, setPkgImage] = useState('https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80');

  // KPI Metrics Calculation
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.pricing?.total || 14999), 184500);
  const totalBookingsCount = bookings.length + 12; // aggregate with demo history
  const totalUsersCount = 148;
  const totalPackagesCount = packages.length;

  const handleOpenAddModal = () => {
    setEditingPkgId(null);
    setPkgTitle('');
    setPkgDestination('Goa');
    setPkgDuration('4 Days / 3 Nights');
    setPkgPrice(15000);
    setPkgCategory('Beach');
    setPkgImage('https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (pkg) => {
    setEditingPkgId(pkg.id);
    setPkgTitle(pkg.title);
    setPkgDestination(pkg.destination);
    setPkgDuration(pkg.duration);
    setPkgPrice(pkg.price);
    setPkgCategory(pkg.category);
    setPkgImage(pkg.image);
    setIsModalOpen(true);
  };

  const handleSavePackage = (e) => {
    e.preventDefault();
    if (editingPkgId) {
      // Edit
      const updated = packages.map((p) =>
        p.id === editingPkgId
          ? {
              ...p,
              title: pkgTitle,
              destination: pkgDestination,
              duration: pkgDuration,
              price: Number(pkgPrice),
              category: pkgCategory,
              image: pkgImage,
            }
          : p
      );
      setPackages(updated);
    } else {
      // Add
      const newPkg = {
        id: `pkg-${Date.now()}`,
        title: pkgTitle,
        subtitle: `Curated ${pkgDestination} holiday tour`,
        destination: pkgDestination,
        country: 'India',
        duration: pkgDuration,
        daysCount: 4,
        nightsCount: 3,
        price: Number(pkgPrice),
        rating: 4.8,
        reviewCount: 1,
        category: pkgCategory,
        travelType: `${pkgCategory} Holiday`,
        image: pkgImage,
        featured: false,
        badge: 'New Package',
        includes: ['Hotel', 'Breakfast', 'Cab', 'Sightseeing'],
        inclusions: ['Accommodation', 'Breakfast', 'Private Cab', 'Sightseeing'],
        exclusions: ['Airfare', 'Personal expenses'],
        accommodation: '4-Star Resort',
        meals: 'Daily Breakfast',
        transport: 'Private AC Cab',
        itinerary: [
          { day: 1, title: 'Arrival & Welcome', description: 'Arrive and check in.', activities: ['Check-in', 'Welcome drink'] },
          { day: 2, title: 'Sightseeing Tour', description: 'Explore local sights.', activities: ['Guided tour'] }
        ]
      };
      setPackages([newPkg, ...packages]);
    }
    setIsModalOpen(false);
  };

  const handleDeletePackage = (id) => {
    if (window.confirm('Are you sure you want to remove this package?')) {
      setPackages(packages.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="bg-primary text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Control Panel (Demo Mode)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Travelora Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time booking revenue metrics, package inventory CRUD, and reservation monitoring.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="btn-accent text-xs font-bold gap-2 self-start sm:self-auto shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Package</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="card-premium p-6 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-primary">
            {formatCurrency(totalRevenue)}
          </h3>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% from last month
          </p>
        </div>

        <div className="card-premium p-6 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Bookings</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-secondary flex items-center justify-center">
              <Luggage className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-primary">
            {totalBookingsCount}
          </h3>
          <p className="text-[11px] text-slate-500 font-semibold">
            {bookings.length} new in active session
          </p>
        </div>

        <div className="card-premium p-6 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Registered Users</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-primary">
            {totalUsersCount}
          </h3>
          <p className="text-[11px] text-purple-600 font-semibold">
            Active travelers community
          </p>
        </div>

        <div className="card-premium p-6 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Packages</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-primary">
            {totalPackagesCount}
          </h3>
          <p className="text-[11px] text-slate-500 font-semibold">
            Across 6 major destinations
          </p>
        </div>
      </div>

      {/* Visual Analytics Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Simple Visual Bar Chart */}
        <div className="lg:col-span-2 card-premium p-6 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-secondary" />
              <h2 className="text-base font-bold text-slate-900">Monthly Booking Volume Trend</h2>
            </div>
            <span className="text-xs font-semibold text-slate-400">2026 Academic Year</span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
            {[
              { month: 'Apr', val: 40 },
              { month: 'May', val: 65 },
              { month: 'Jun', val: 85 },
              { month: 'Jul', val: 55 },
              { month: 'Aug', val: 95 },
              { month: 'Sep', val: 70 },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-slate-500">{bar.val}</span>
                <div
                  className="w-full bg-secondary hover:bg-primary transition-colors rounded-t-lg"
                  style={{ height: `${bar.val * 1.4}px` }}
                ></div>
                <span className="text-xs font-bold text-slate-600">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Destinations breakdown */}
        <div className="card-premium p-6 bg-white space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Popular Destinations Breakdown
          </h2>
          <div className="space-y-3 text-xs">
            {[
              { name: 'Goa Beaches', percent: '34%', color: 'bg-secondary' },
              { name: 'Kashmir Valley', percent: '26%', color: 'bg-emerald-500' },
              { name: 'Kerala Backwaters', percent: '20%', color: 'bg-accent' },
              { name: 'Dubai & Rajasthan', percent: '20%', color: 'bg-purple-500' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-700">{item.name}</span>
                  <span className="text-slate-500">{item.percent}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: item.percent }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Package Management Table (CRUD) */}
      <div className="card-premium p-6 bg-white space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Package Inventory Management</h2>
            <p className="text-xs text-slate-500">Add, edit, or remove packages available on the platform.</p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="btn-secondary !py-2 !px-3.5 text-xs font-semibold gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Package</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-y border-slate-100">
              <tr>
                <th className="py-3 px-4">Package</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <img src={pkg.image} alt={pkg.title} className="w-8 h-8 rounded-lg object-cover" />
                    <span>{pkg.title}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{pkg.destination}</td>
                  <td className="py-3.5 px-4 text-slate-600">{pkg.duration}</td>
                  <td className="py-3.5 px-4 font-bold text-primary">{formatCurrency(pkg.price)}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-secondary font-semibold text-[11px]">
                      {pkg.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(pkg)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Edit package"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeletePackage(pkg.id)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                      title="Delete package"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Package Edit/Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPkgId ? 'Edit Package' : 'Create New Holiday Package'}
      >
        <form onSubmit={handleSavePackage} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Package Title</label>
            <input
              type="text"
              value={pkgTitle}
              onChange={(e) => setPkgTitle(e.target.value)}
              placeholder="e.g. Goa Luxury Getaway"
              className="input-field text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Destination</label>
              <input
                type="text"
                value={pkgDestination}
                onChange={(e) => setPkgDestination(e.target.value)}
                className="input-field text-xs"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Duration</label>
              <input
                type="text"
                value={pkgDuration}
                onChange={(e) => setPkgDuration(e.target.value)}
                placeholder="4 Days / 3 Nights"
                className="input-field text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Price per Person (₹)</label>
              <input
                type="number"
                value={pkgPrice}
                onChange={(e) => setPkgPrice(e.target.value)}
                className="input-field text-xs"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Category</label>
              <select
                value={pkgCategory}
                onChange={(e) => setPkgCategory(e.target.value)}
                className="input-field text-xs"
              >
                <option value="Beach">Beach</option>
                <option value="Mountains">Mountains</option>
                <option value="Nature">Nature</option>
                <option value="Heritage">Heritage</option>
                <option value="Adventure">Adventure</option>
                <option value="City">City</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Image URL</label>
            <input
              type="url"
              value={pkgImage}
              onChange={(e) => setPkgImage(e.target.value)}
              className="input-field text-xs"
              required
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-outline text-xs"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary text-xs font-bold">
              {editingPkgId ? 'Update Package' : 'Publish Package'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
