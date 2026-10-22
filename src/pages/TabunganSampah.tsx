import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  X,
  Wallet,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Scale,
  Coins,
  Recycle,
  Leaf,
  Package,
} from 'lucide-react';

const NAV_LINKS = [
  { href: '/#beranda', label: 'Beranda' },
  { href: '/katalog-sampah', label: 'Katalog Sampah' },
  { href: '/lokasi-penimbangan', label: 'Lokasi Penimbangan' },
  { href: '/tabungan-sampah', label: 'Tabungan Sampah', isActive: true },
  { href: '/#tentang-kami', label: 'Tentang Kami' },
];

const STEPS = [
  {
    id: 1,
    title: 'Pilah & Kumpulkan',
    description: 'Pisahkan sampah anorganik yang masih layak daur ulang seperti plastik, kertas, logam, dan kaca. Bersihkan dari sisa isi dan keringkan.',
    icon: Recycle,
    color: 'bg-duriat-green-500',
  },
  {
    id: 2,
    title: 'Setor ke DURIAT',
    description: 'Bawa sampah yang sudah dipilah ke lokasi penimbangan atau Bank Sampah DURIAT terdekat untuk ditimbang oleh petugas.',
    icon: MapPin,
    color: 'bg-duriat-orange-500',
  },
  {
    id: 3,
    title: 'Terima Saldo',
    description: 'Nilai sampah Anda akan dihitung berdasarkan jenis dan berat, lalu masuk ke saldo Tabungan Sampah DURIAT.',
    icon: Wallet,
    color: 'bg-blue-500',
  },
];

const ACCEPTED_ITEMS = [
  { icon: Package, label: 'Plastik (PET, PP, HDPE)' },
  { icon: Package, label: 'Kertas & Kardus' },
  { icon: Scale, label: 'Logam & Aluminium' },
  { icon: Package, label: 'Botol Kaca' },
  { icon: Leaf, label: 'Kompos (di lokasi tertentu)' },
];

export const TabunganSampah: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.title = 'Tabungan Sampah - DURIAT';
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

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-duriat-green-600 to-duriat-green-700">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 mb-6">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
            Tabungan Sampah DURIAT
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-medium max-w-2xl mx-auto">
            Ubah sampah pilahanmu jadi saldo tabungan. Setor ke Bank Sampah DURIAT terdekat dan nikmati manfaatnya.
          </p>
        </div>
      </section>

      {/* Cara Kerja */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-duriat-green-700 mb-3">
              Cara Kerja Setor ke DURIAT
            </h2>
            <p className="text-gray-600 text-base md:text-lg">
              Hanya 3 langkah mudah untuk mulai menabung dari sampah
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isSetorStep = step.id === 2;
              const Wrapper: React.ElementType = isSetorStep ? Link : 'div';
              const wrapperProps = isSetorStep ? { to: '/setor-ke-duriat' } : {};

              return (
                <Wrapper
                  key={step.id}
                  {...wrapperProps}
                  className={`relative bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-lg transition-all group ${
                    isSetorStep
                      ? 'hover:shadow-xl hover:border-duriat-orange-300 cursor-pointer'
                      : 'hover:shadow-xl hover:border-duriat-green-200'
                  }`}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                    <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center text-white font-black text-xl shadow-lg`}>
                      {step.id}
                    </div>
                  </div>
                  <div className="pt-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8 text-duriat-green-600" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    {isSetorStep && (
                      <div className="mt-5 inline-flex items-center gap-1.5 bg-duriat-orange-500 text-white font-bold text-xs uppercase tracking-wide px-4 py-2 rounded-full group-hover:bg-duriat-orange-600 transition-colors">
                        <span>Mulai Setor</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                </Wrapper>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sampah yang Diterima */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-duriat-green-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-duriat-green-700 mb-3">
              Sampah yang Diterima
            </h2>
            <p className="text-gray-600 text-base md:text-lg">
              Untuk saat ini, kami fokus menerima sampah anorganik yang bisa didaur ulang
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {ACCEPTED_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-duriat-green-50 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-duriat-green-600" />
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              *Pastikan sampah dalam kondisi bersih dan kering untuk mendapatkan nilai maksimal
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-duriat-green-600 to-duriat-green-700 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
            <div className="relative z-10">
              <Coins className="w-16 h-16 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Mulai Menabung dari Sampah
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Temukan lokasi penimbangan terdekat, pilah sampahmu, dan mulai kumpulkan saldomu hari ini
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/lokasi-penimbangan"
                  className="inline-flex items-center justify-center gap-2 bg-white text-duriat-green-700 font-bold py-4 px-8 rounded-full hover:bg-gray-100 transition-all shadow-lg"
                >
                  <MapPin className="w-5 h-5" />
                  Cari Lokasi Terdekat
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 bg-duriat-orange-500 text-white font-bold py-4 px-8 rounded-full hover:bg-duriat-orange-600 transition-all shadow-lg"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Daftar Sekarang
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

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

export default TabunganSampah;
