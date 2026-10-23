import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    setWishlist(storageService.getWishlist());
  }, []);

  const toggleWishlist = (item) => {
    let updated;
    const exists = wishlist.some(i => i.id === item.id);
    if (exists) {
      updated = wishlist.filter(i => i.id !== item.id);
    } else {
      updated = [...wishlist, item];
    }
    setWishlist(updated);
    storageService.setWishlist(updated);
  };

  const isInWishlist = (id) => {
    return wishlist.some(i => i.id === id);
  };

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter(i => i.id !== id);
    setWishlist(updated);
    storageService.setWishlist(updated);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
