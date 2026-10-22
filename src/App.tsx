import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Scanner from './pages/Scanner';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProfileSettings from './pages/ProfileSettings';
import KatalogSampah from './pages/KatalogSampah';
import LokasiPenimbangan from './pages/LokasiPenimbangan';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page (DURIAT) */}
        <Route path="/" element={<Home />} />
        {/* Katalog Sampah */}
        <Route path="/katalog-sampah" element={<KatalogSampah />} />
        {/* Lokasi Penimbangan */}
        <Route path="/lokasi-penimbangan" element={<LokasiPenimbangan />} />
        {/* Login page */}
        <Route path="/login" element={<Login />} />
        {/* Register page */}
        <Route path="/register" element={<Register />} />
        {/* Dashboard page */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Profile Settings page */}
        <Route path="/profile" element={<ProfileSettings />} />
        {/* Waste scanner app (PilahSampah AI) */}
        <Route path="/scanner" element={<Scanner />} />
        {/* Unknown path -> landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
