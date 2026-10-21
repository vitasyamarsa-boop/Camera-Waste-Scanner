import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Scanner from './pages/Scanner';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page (DURIAT) */}
        <Route path="/" element={<Home />} />
        {/* Waste scanner app (PilahSampah AI) */}
        <Route path="/scanner" element={<Scanner />} />
        {/* Unknown path -> landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
