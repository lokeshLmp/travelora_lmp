import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import DestinationDetails from './pages/DestinationDetails';
import Packages from './pages/Packages';
import PackageDetails from './pages/PackageDetails';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails';
import Booking from './pages/Booking';
import MyTrips from './pages/MyTrips';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Admin from './pages/Admin';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="destinations" element={<Destinations />} />
        <Route path="destinations/:id" element={<DestinationDetails />} />
        <Route path="packages" element={<Packages />} />
        <Route path="packages/:id" element={<PackageDetails />} />
        <Route path="hotels" element={<Hotels />} />
        <Route path="hotels/:id" element={<HotelDetails />} />
        <Route path="booking" element={<Booking />} />
        <Route path="my-trips" element={<MyTrips />} />
        <Route path="profile" element={<Profile />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
