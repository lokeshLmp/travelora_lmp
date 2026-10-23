import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = storageService.getUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.user) {
      setUser(res.user);
      storageService.setUser(res.user);
      if (res.token) storageService.setToken(res.token);
      return { success: true, user: res.user };
    }
    return { success: false, message: res.message || 'Login failed' };
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res.user) {
      setUser(res.user);
      storageService.setUser(res.user);
      if (res.token) storageService.setToken(res.token);
      return { success: true, user: res.user };
    }
    return { success: false, message: res.message || 'Registration failed' };
  };

  const logout = () => {
    storageService.removeUser();
    setUser(null);
  };

  const updateProfile = (updatedData) => {
    const updated = { ...user, ...updatedData };
    setUser(updated);
    storageService.setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
