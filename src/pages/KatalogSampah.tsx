import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { WasteCatalog } from '../components/WasteCatalog';

const NAV_LINKS = [
  { href: '/#beranda', label: 'Beranda' },
  { href: '/katalog-sampah', label: 'Katalog Sampah', isActive: true },
  { href: '/#lokasi-penimbangan', label: 'Lokasi Penimbangan' },
  { href: '/#tabungan-sampah', label: 'Tabungan Sampah' },
  { href: '/#tentang-kami', label: 'Tentang Kami' },
];

export const KatalogSampah: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.title = 'Katalog Sampah - DURIAT';
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="font-inter antialiased text-gray-800 bg-white min-h-screen">
      <nav className="bg-white/90 backdrop-blur-sm fixed w-full z-50 py-4 px-4 md:px-8 flex justify-between items-center shadow-sm">
        <Link to="/">
          <img src="/duriat.png" alt="Logo DURIAT" className="h-10 md:h-12 object-contain" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-black font-bold text-xs hover:text-duriat-orange-500 transition-colors uppercase ${
                link.isActive ? 'text-duriat-orange-500' : ''
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex items-center">
          <Link
            to="/login"
            className="hidden md:inline-block bg-duriat-orange-500 hover:bg-duriat-orange-600 text-white font-bold py-2 px-6 rounded-full text-xs transition-transform transform hover:scale-105 shadow-md uppercase cursor-pointer"
          >
            Sign In/Sign Up
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Buka menu navigasi"
            aria-expanded={mobileMenuOpen}
            className="lg:hidden text-duriat-green-600 focus:outline-none ml-4 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white w-full fixed top-[70px] z-40 shadow-xl border-t border-gray-100">
          <div className="flex flex-col px-4 py-4 space-y-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className={`text-duriat-green-600 font-bold text-sm uppercase border-b border-gray-100 pb-2 ${
                  link.isActive ? 'text-duriat-orange-500' : ''
                }`}
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 mt-4">
              <Link
                to="/scanner"
                onClick={closeMobileMenu}
                className="bg-duriat-orange-500 text-white text-center font-bold py-3 px-6 rounded-full text-sm inline-block"
              >
                Tanya DURIAT AI
              </Link>
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="bg-duriat-green-600 text-white text-center font-bold py-3 px-6 rounded-full text-sm inline-block"
              >
                Sign In/Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <WasteCatalog />
        </div>
      </main>

      <footer className="bg-duriat-dark text-white py-8 border-t-8 border-duriat-orange-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-black text-duriat-green-300 mb-2">DURIAT</h2>
          <p className="text-sm text-gray-400 mb-4">
            Dina Runtah Aya Manfaat © 2026. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default KatalogSampah;
