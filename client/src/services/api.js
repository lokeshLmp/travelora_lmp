import { destinationsData } from '../data/destinations';
import { packagesData } from '../data/packages';
import { hotelsData } from '../data/hotels';
import { reviewsData } from '../data/reviews';
import { storageService } from './storageService';
import { generateBookingId } from '../utils/formatters';

// Empty by default: the React app calls the same server it was loaded from (Vite proxy in
// development, the Node server in production). Set VITE_API_BASE_URL only if the API lives elsewhere.
const API_BASE = `${(import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')}/api`;

// Helper to check if server is reachable
export const checkServerHealth = async () => {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(1500) });
    return res.ok;
  } catch {
    return false;
  }
};

export const api = {
  // Destinations
  getDestinations: async (category = '') => {
    try {
      const url = category ? `${API_BASE}/destinations?category=${encodeURIComponent(category)}` : `${API_BASE}/destinations`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      return data.data || data;
    } catch {
      // Demo Fallback
      if (category && category !== 'All') {
        return destinationsData.filter(d => d.category.toLowerCase() === category.toLowerCase());
      }
      return destinationsData;
    }
  },

  getDestinationById: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/destinations/${id}`);
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      return data.data || data;
    } catch {
      return destinationsData.find(d => d.id === id) || null;
    }
  },

  // Packages
  getPackages: async (filters = {}) => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`${API_BASE}/packages${query ? `?${query}` : ''}`);
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      return data.data || data;
    } catch {
      let filtered = [...packagesData];
      if (filters.destination) {
        filtered = filtered.filter(p => p.destination.toLowerCase().includes(filters.destination.toLowerCase()));
      }
      if (filters.category && filters.category !== 'All') {
        filtered = filtered.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
      }
      if (filters.maxPrice) {
        filtered = filtered.filter(p => p.price <= Number(filters.maxPrice));
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        filtered = filtered.filter(p => 
          p.title.toLowerCase().includes(q) || 
          p.destination.toLowerCase().includes(q) ||
          p.travelType.toLowerCase().includes(q)
        );
      }
      return filtered;
    }
  },

  getPackageById: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/packages/${id}`);
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      return data.data || data;
    } catch {
      return packagesData.find(p => p.id === id) || null;
    }
  },

  // Hotels
  getHotels: async (filters = {}) => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`${API_BASE}/hotels${query ? `?${query}` : ''}`);
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      return data.data || data;
    } catch {
      let filtered = [...hotelsData];
      if (filters.destination) {
        filtered = filtered.filter(h => h.destination.toLowerCase().includes(filters.destination.toLowerCase()));
      }
      if (filters.maxPrice) {
        filtered = filtered.filter(h => h.pricePerNight <= Number(filters.maxPrice));
      }
      if (filters.rating) {
        filtered = filtered.filter(h => h.rating >= Number(filters.rating));
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        filtered = filtered.filter(h => 
          h.name.toLowerCase().includes(q) || 
          h.location.toLowerCase().includes(q) ||
          h.destination.toLowerCase().includes(q)
        );
      }
      return filtered;
    }
  },

  getHotelById: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/hotels/${id}`);
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      return data.data || data;
    } catch {
      return hotelsData.find(h => h.id === id) || null;
    }
  },

  // Bookings
  createBooking: async (bookingPayload) => {
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storageService.getToken() || ''}`
        },
        body: JSON.stringify(bookingPayload)
      });
      if (!res.ok) throw new Error('Server booking error');
      const data = await res.json();
      storageService.saveBooking(data.booking || data);
      return data;
    } catch {
      // Local Demo Fallback
      const bookingId = generateBookingId();
      const bookingRecord = {
        id: bookingId,
        bookingId: bookingId,
        createdAt: new Date().toISOString(),
        status: 'CONFIRMED',
        ...bookingPayload
      };
      storageService.saveBooking(bookingRecord);
      return {
        success: true,
        bookingId: bookingId,
        status: 'CONFIRMED',
        booking: bookingRecord
      };
    }
  },

  // ---- Java Spring Boot booking service (via the Node server: /api/java/...) ----
  // These never fall back to a fake success: if the booking was not saved, they throw.
  createJavaBooking: async (bookingPayload) => {
    let res;
    try {
      res = await fetch(`${API_BASE}/java/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
        signal: AbortSignal.timeout(90000) // the service may need time to wake up on Render
      });
    } catch (err) {
      throw new Error(
        err && err.name === 'TimeoutError'
          ? 'The booking service is taking too long to respond (it may be waking up). Please try again in a minute.'
          : 'Could not reach the booking service. Please check your connection and try again.'
      );
    }

    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok) {
      const details = Array.isArray(data?.details) && data.details.length ? ` (${data.details.join('; ')})` : '';
      throw new Error(`${data?.message || `Booking failed (HTTP ${res.status}).`}${details}`);
    }
    if (!data || !data.bookingId) {
      throw new Error('The booking service returned an unexpected response. Your booking was not confirmed.');
    }
    return data;
  },

  getJavaBooking: async (bookingId) => {
    const res = await fetch(`${API_BASE}/java/bookings/${encodeURIComponent(bookingId)}`);
    if (!res.ok) throw new Error(res.status === 404 ? 'Booking not found.' : 'Could not load the booking.');
    return res.json();
  },

  getJavaUserBookings: async (userId) => {
    const res = await fetch(`${API_BASE}/java/bookings/user/${encodeURIComponent(userId)}`);
    if (!res.ok) throw new Error('Could not load bookings.');
    return res.json();
  },

  getUserBookings: async (userId) => {
    try {
      const res = await fetch(`${API_BASE}/bookings/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${storageService.getToken() || ''}` }
      });
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      return data.data || data;
    } catch {
      return storageService.getBookings();
    }
  },

  // Auth
  login: async (credentials) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      return data;
    } catch (err) {
      // Demo Fallback
      if (credentials.email === 'admin@travelora.com' && credentials.password === 'admin123') {
        return {
          success: true,
          user: { id: 'usr-admin', name: 'Travelora Admin', email: credentials.email, role: 'admin', phone: '+91 98765 43210' },
          token: 'demo-jwt-admin-token'
        };
      }
      // Return standard demo user
      const name = credentials.email.split('@')[0];
      return {
        success: true,
        user: {
          id: 'usr-' + Math.floor(Math.random() * 1000),
          name: name.charAt(0).toUpperCase() + name.slice(1),
          email: credentials.email,
          role: 'user',
          phone: '+91 98765 01234'
        },
        token: 'demo-jwt-user-token'
      };
    }
  },

  register: async (userData) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      return data;
    } catch {
      return {
        success: true,
        user: {
          id: 'usr-' + Math.floor(Math.random() * 1000),
          name: userData.name,
          email: userData.email,
          phone: userData.phone || '+91 98765 00000',
          role: 'user'
        },
        token: 'demo-jwt-new-user'
      };
    }
  },

  // Reviews
  getReviews: async () => {
    try {
      const res = await fetch(`${API_BASE}/reviews`);
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      return data.data || data;
    } catch {
      return reviewsData;
    }
  }
};
