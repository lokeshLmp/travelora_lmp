// Local Storage Helper

const STORAGE_KEYS = {
  USER: 'travelora_user',
  TOKEN: 'travelora_token',
  BOOKINGS: 'travelora_bookings',
  WISHLIST: 'travelora_wishlist',
  CUSTOM_PACKAGES: 'travelora_custom_packages',
  PREFERENCES: 'travelora_preferences',
};

export const storageService = {
  getUser: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  },
  removeUser: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  getToken: () => localStorage.getItem(STORAGE_KEYS.TOKEN),
  setToken: (token) => localStorage.setItem(STORAGE_KEYS.TOKEN, token),

  getBookings: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveBooking: (newBooking) => {
    try {
      const bookings = storageService.getBookings();
      const updated = [newBooking, ...bookings.filter(b => b.id !== newBooking.id)];
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  cancelBooking: (bookingId) => {
    try {
      const bookings = storageService.getBookings();
      const updated = bookings.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' } : b);
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  getWishlist: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  setWishlist: (list) => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(list));
  },

  getPreferences: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return data ? JSON.parse(data) : {
        budget: '₹20,000 - ₹50,000',
        destinationType: 'Beach & Nature',
        travelStyle: 'Comfort & Luxury',
      };
    } catch {
      return {
        budget: '₹20,000 - ₹50,000',
        destinationType: 'Beach & Nature',
        travelStyle: 'Comfort & Luxury',
      };
    }
  },
  setPreferences: (pref) => {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(pref));
  }
};
