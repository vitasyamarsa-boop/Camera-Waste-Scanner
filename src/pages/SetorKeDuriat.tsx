import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  X,
  MapPin,
  Scale,
  CheckCircle2,
  ArrowRight,
  Wallet,
  FileText,
  Calculator,
  Info,
  ChevronRight,
  Recycle,
  Package,
  Leaf,
} from 'lucide-react';

const NAV_LINKS = [
  { href: '/#beranda', label: 'Beranda' },
  { href: '/katalog-sampah', label: 'Katalog Sampah' },
  { href: '/lokasi-penimbangan', label: 'Lokasi Penimbangan' },
  { href: '/tabungan-sampah', label: 'Tabungan Sampah', isActive: true },
  { href: '/#tentang-kami', label: 'Tentang Kami' },
];

const DEPOSIT_STEPS = [
  {
    id: 1,
    title: 'Cek Lokasi',
    description: 'Pilih lokasi Bank Sampah atau Drop Point DURIAT terdekat yang sesuai dengan jenis sampahmu.',
    icon: MapPin,
    color: 'bg-duriat-green-500',
  },
  {
    id: 2,
    title: 'Bawa Sampah Pilahan',
    description: 'Bawa sampah yang sudah dipilah, dibersihkan, dan dikeringkan ke lokasi penimbangan.',
    icon: Recycle,
    color: 'bg-duriat-orange-500',
  },
  {
    id: 3,
    title: 'Ditimbang & Diverifikasi',
    description: 'Petugas akan menimbang sampah berdasarkan jenis dan berat, lalu mencocokkan dengan ketentuan.',
    icon: Scale,
    color: 'bg-blue-500',
  },
  {
    id: 4,
    title: 'Saldo Masuk',
    description: 'Nilai setor akan langsung masuk ke saldo Tabungan Sampah DURIAT kamu.',
    icon: Wallet,
    color: 'bg-emerald-500',
  },
];

const WASTE_PRICES = [
  { type: 'Botol PET Bening', price: 4500, unit: 'kg' },
  { type: 'Botol PET Berwarna', price: 3000, unit: 'kg' },
  { type: 'Gelas Plastik PP', price: 4000, unit: 'kg' },
  { type: 'Plastik HDPE', price: 5000, unit: 'kg' },
  { type: 'Kertas HVS/Koran', price: 2000, unit: 'kg' },
  { type: 'Kardus', price: 1500, unit: 'kg' },
  { type: 'Aluminium/Logam', price: 12000, unit: 'kg' },
  { type: 'Botol Kaca Utuh', price: 500, unit: 'kg' },
];

const LOCATIONS = [
  { value: 'pusat', label: 'Bank Sampah Pusat DURIAT - Coblong' },
  { value: 'rw05', label: 'Bank Sampah RW 05 Sukajadi - Sukajadi' },
  { value: 'pasteur', label: 'Drop Point Daur Ulang Pasteur - Sukajadi' },
  { value: 'cihampelas', label: 'TPS 3R Cihampelas - Coblong' },
];

const WASTE_TYPES = [
  { value: 'pet-bening', label: 'Botol PET Bening' },
  { value: 'pet-warna', label: 'Botol PET Berwarna' },
  { value: 'pp', label: 'Gelas Plastik PP' },
  { value: 'hdpe', label: 'Plastik HDPE' },
  { value: 'kertas', label: 'Kertas HVS/Koran' },
  { value: 'kardus', label: 'Kardus' },
  { value: 'aluminium', label: 'Aluminium/Logam' },
  { value: 'kaca', label: 'Botol Kaca Utuh' },
];

const PRICE_MAP: Record<string, number> = {
  'pet-bening': 4500,
  'pet-warna': 3000,
  pp: 4000,
  hdpe: 5000,
  kertas: 2000,
  kardus: 1500,
  aluminium: 12000,
  kaca: 500,
};

export const SetorKeDuriat: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [wasteType, setWasteType] = useState('');
  const [weight, setWeight] = useState('');

  useEffect(() => {
    document.title = 'Setor ke DURIAT - Tabungan Sampah | DURIAT';
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const estimatedPrice = wasteType && weight ? (PRICE_MAP[wasteType] || 0) * parseFloat(weight || '0') : 0;

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
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
              <MapPin className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-semibold">Setor Langsung ke Lokasi DURIAT</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
              Setor ke DURIAT
            </h1>
            <p className="text-lg md:text-xl text-white/90 font-medium">
              Bawa sampah pilahanmu ke Bank Sampah DURIAT terdekat, timbang, dan dapatkan saldo tabungan langsung.
            </p>
          </div>
        </div>
      </section>

      {/* Proses Setor */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-duriat-green-700 mb-3">
              Alur Setor ke DURIAT
            </h2>
            <p className="text-gray-600 text-base md:text-lg">
              Proses yang simpel, transparan, dan langsung dapat saldo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DEPOSIT_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="relative bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all">
                  <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-black text-gray-600">
                    {step.id}
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Estimasi Setor & Harga */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-duriat-green-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Estimasi */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="p-6 md:p-8 bg-gradient-to-r from-duriat-green-600 to-duriat-green-700">
                <div className="flex items-center gap-3 mb-2">
                  <Calculator className="w-8 h-8 text-white" />
                  <h2 className="text-2xl md:text-3xl font-black text-white">Estimasi Setor</h2>
                </div>
                <p className="text-white/90">Hitung perkiraan saldo dari sampah pilahanmu</p>
              </div>
              <div className="p-6 md:p-8 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Pilih Lokasi Penimbangan</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-duriat-green-500 focus:border-transparent"
                  >
                    <option value="">-- Pilih Lokasi --</option>
                    {LOCATIONS.map((loc) => (
                      <option key={loc.value} value={loc.value}>
                        {loc.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Jenis Sampah</label>
                  <select
                    value={wasteType}
                    onChange={(e) => setWasteType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-duriat-green-500 focus:border-transparent"
                  >
                    <option value="">-- Pilih Jenis Sampah --</option>
                    {WASTE_TYPES.map((waste) => (
                      <option key={waste.value} value={waste.value}>
                        {waste.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Berat Sampah (kg)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Contoh: 2.5"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-duriat-green-500 focus:border-transparent"
                  />
                </div>

                <div className="p-6 bg-duriat-green-50 rounded-2xl border-2 border-duriat-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-semibold">Estimasi Saldo</span>
                    <Wallet className="w-5 h-5 text-duriat-green-600" />
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-duriat-green-700">
                    Rp {estimatedPrice.toLocaleString('id-ID')}
                  </div>
                  <p className="text-xs text-gray-600 mt-2">*Harga dapat berubah sesuai kondisi di lokasi</p>
                </div>

                <div className="flex items-start gap-2 p-4 bg-blue-50 rounded-xl">
                  <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800 leading-relaxed">
                    Pastikan sampah sudah bersih, kering, dan dipilah sesuai jenisnya untuk mendapatkan harga terbaik
                  </p>
                </div>

                <Link
                  to="/lokasi-penimbangan"
                  className="w-full flex items-center justify-center gap-2 bg-duriat-orange-500 hover:bg-duriat-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg"
                >
                  <MapPin className="w-5 h-5" />
                  Cari Lokasi untuk Setor
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Daftar Harga */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="p-6 md:p-8 bg-gradient-to-r from-duriat-orange-500 to-duriat-orange-600">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-8 h-8 text-white" />
                  <h2 className="text-2xl md:text-3xl font-black text-white">Daftar Harga Sampah</h2>
                </div>
                <p className="text-white/90">Harga acuan per kilogram di Bank Sampah DURIAT</p>
              </div>
              <div className="p-6 md:p-8">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-2 text-sm font-black text-gray-900">Jenis Sampah</th>
                        <th className="text-right py-3 px-2 text-sm font-black text-gray-900">Harga/kg</th>
                      </tr>
                    </thead>
                    <tbody>
                      {WASTE_PRICES.map((item, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-2 text-sm text-gray-800">{item.type}</td>
                          <td className="py-3 px-2 text-sm font-bold text-duriat-green-600 text-right">
                            Rp {item.price.toLocaleString('id-ID')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-800 leading-relaxed">
                      <p className="font-bold mb-1">Catatan:</p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Harga dapat berubah sewaktu-waktu</li>
                        <li>Minimal setor disesuaikan kebijakan lokasi</li>
                        <li>Harga final ditentukan saat penimbangan di lokasi</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Setor */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-duriat-green-700 mb-3">
              Tips Agar Dapat Harga Maksimal
            </h2>
            <p className="text-gray-600 text-base md:text-lg">
              Ikuti tips ini biar nilai sampahmu lebih optimal
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Bersihkan sisa makanan/minuman dari kemasan',
              'Keringkan sampah sebelum dibawa ke lokasi',
              'Pilah berdasarkan jenis material, jangan campur',
              'Lepaskan tutup botol dan pisahkan jika beda jenis plastik',
              'Remas botol plastik untuk menghemat tempat',
              'Pastikan botol kaca dalam keadaan utuh saat disetor',
            ].map((tip, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-duriat-green-600 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-800">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-duriat-green-600 to-duriat-green-700 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Siap Menabung dari Sampah?</h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Daftar sekarang untuk punya akun Tabungan Sampah DURIAT dan mulai setor ke lokasi terdekat
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/lokasi-penimbangan"
                className="inline-flex items-center justify-center gap-2 bg-white text-duriat-green-700 font-bold py-4 px-8 rounded-full hover:bg-gray-100 transition-all shadow-lg"
              >
                <MapPin className="w-5 h-5" />
                Lihat Lokasi Penimbangan
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-duriat-orange-500 text-white font-bold py-4 px-8 rounded-full hover:bg-duriat-orange-600 transition-all shadow-lg"
              >
                Daftar Sekarang
                <ArrowRight className="w-4 h-4" />
              </Link>
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

export default SetorKeDuriat;
