import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  X,
  MapPin,
  Clock,
  Phone,
  Navigation,
  Recycle,
  Leaf,
  Package,
  TriangleAlert,
  ChevronRight,
} from 'lucide-react';

const NAV_LINKS = [
  { href: '/#beranda', label: 'Beranda' },
  { href: '/katalog-sampah', label: 'Katalog Sampah' },
  { href: '/lokasi-penimbangan', label: 'Lokasi Penimbangan', isActive: true },
  { href: '/#tabungan-sampah', label: 'Tabungan Sampah' },
  { href: '/#tentang-kami', label: 'Tentang Kami' },
];

interface Location {
  id: number;
  name: string;
  address: string;
  district: string;
  city: string;
  openHours: string;
  openDays: string;
  phone: string;
  image: string;
  mapsUrl: string;
  acceptedWaste: {
    icon: React.ElementType;
    label: string;
    color: string;
  }[];
  description: string;
}

const LOCATIONS: Location[] = [
  {
    id: 1,
    name: 'Bank Sampah Pusat DURIAT',
    address: 'Jl. Runtah Berkah No. 31',
    district: 'Coblong',
    city: 'Bandung, Jawa Barat',
    openHours: '08:00 - 22:00 WIB',
    openDays: 'Setiap Hari',
    phone: '+62 812-3456-7890',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80',
    mapsUrl: 'https://maps.google.com',
    acceptedWaste: [
      { icon: Leaf, label: 'Organik', color: 'text-duriat-green-600' },
      { icon: Package, label: 'Plastik & Kertas', color: 'text-blue-600' },
      { icon: Recycle, label: 'Logam & Kaca', color: 'text-amber-600' },
    ],
    description: 'Pusat pengumpulan dan penimbangan sampah utama DURIAT. Melayani setor sampah untuk seluruh jenis anorganik yang bisa didaur ulang.',
  },
  {
    id: 2,
    name: 'Bank Sampah RW 05 Sukajadi',
    address: 'Jl. Sukajadi No. 156 RT 05/RW 12',
    district: 'Sukajadi',
    city: 'Bandung, Jawa Barat',
    openHours: '09:00 - 17:00 WIB',
    openDays: 'Senin - Sabtu',
    phone: '+62 813-4567-8901',
    image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800&q=80',
    mapsUrl: 'https://maps.google.com',
    acceptedWaste: [
      { icon: Leaf, label: 'Organik', color: 'text-duriat-green-600' },
      { icon: Package, label: 'Plastik & Kertas', color: 'text-blue-600' },
    ],
    description: 'Bank sampah kelurahan yang fokus pada pengelolaan sampah rumah tangga. Sangat ramah untuk warga pemula.',
  },
  {
    id: 3,
    name: 'Drop Point Daur Ulang Pasteur',
    address: 'Jl. Dr. Djunjunan No. 162',
    district: 'Sukajadi',
    city: 'Bandung, Jawa Barat',
    openHours: '10:00 - 18:00 WIB',
    openDays: 'Senin - Minggu',
    phone: '+62 814-5678-9012',
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80',
    mapsUrl: 'https://maps.google.com',
    acceptedWaste: [
      { icon: Package, label: 'Plastik', color: 'text-blue-600' },
      { icon: Recycle, label: 'Kertas & Kardus', color: 'text-amber-600' },
      { icon: Recycle, label: 'Logam', color: 'text-gray-600' },
    ],
    description: 'Drop point khusus untuk sampah anorganik daur ulang dengan sistem penimbangan digital dan pencatatan saldo otomatis.',
  },
  {
    id: 4,
    name: 'TPS 3R Cihampelas',
    address: 'Jl. Cihampelas No. 78',
    district: 'Coblong',
    city: 'Bandung, Jawa Barat',
    openHours: '07:00 - 16:00 WIB',
    openDays: 'Senin - Sabtu',
    phone: '+62 815-6789-0123',
    image: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=800&q=80',
    mapsUrl: 'https://maps.google.com',
    acceptedWaste: [
      { icon: Leaf, label: 'Organik (Kompos)', color: 'text-duriat-green-600' },
      { icon: Package, label: 'Plastik & Kertas', color: 'text-blue-600' },
      { icon: Recycle, label: 'Kaca & Logam', color: 'text-amber-600' },
    ],
    description: 'Tempat Pengolahan Sampah Reduce, Reuse, Recycle (TPS 3R) dengan fasilitas pengomposan dan bank sampah terintegrasi.',
  },
  {
    id: 5,
    name: 'Bank Sampah Dago Pojok',
    address: 'Jl. Ir. H. Juanda No. 234',
    district: 'Coblong',
    city: 'Bandung, Jawa Barat',
    openHours: '09:00 - 19:00 WIB',
    openDays: 'Setiap Hari',
    phone: '+62 816-7890-1234',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
    mapsUrl: 'https://maps.google.com',
    acceptedWaste: [
      { icon: Leaf, label: 'Organik', color: 'text-duriat-green-600' },
      { icon: Package, label: 'Plastik & Kertas', color: 'text-blue-600' },
      { icon: TriangleAlert, label: 'B3 (Terbatas)', color: 'text-rose-600' },
    ],
    description: 'Bank sampah percontohan dengan layanan lengkap termasuk penerimaan sampah B3 terbatas seperti baterai bekas dan lampu neon.',
  },
  {
    id: 6,
    name: 'Drop Point Gegerkalong',
    address: 'Jl. Gegerkalong Hilir No. 45',
    district: 'Sukasari',
    city: 'Bandung, Jawa Barat',
    openHours: '08:00 - 17:00 WIB',
    openDays: 'Senin - Jumat',
    phone: '+62 817-8901-2345',
    image: 'https://images.unsplash.com/photo-1615497001839-b0a0eac3274c?w=800&q=80',
    mapsUrl: 'https://maps.google.com',
    acceptedWaste: [
      { icon: Package, label: 'Plastik', color: 'text-blue-600' },
      { icon: Recycle, label: 'Kardus & Kertas', color: 'text-amber-600' },
    ],
    description: 'Drop point strategis untuk warga sekitar dengan jam operasional pagi-siang, cocok untuk setor saat berangkat kerja.',
  },
];

export const LokasiPenimbangan: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.title = 'Lokasi Penimbangan - DURIAT';
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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
            Lokasi Penimbangan
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-medium max-w-2xl mx-auto">
            Temukan Bank Sampah, Drop Point, dan TPS 3R terdekat untuk setor sampah pilahanmu
          </p>
        </div>
      </section>

      {/* Locations Grid */}
      <main className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-duriat-green-700 mb-2">
              Daftar Lokasi Penimbangan
            </h2>
            <p className="text-gray-600">
              Total {LOCATIONS.length} lokasi tersedia di Kota Bandung
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {LOCATIONS.map((location) => (
              <div
                key={location.id}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={location.image}
                    alt={location.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-duriat-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                      {location.city}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-3 group-hover:text-duriat-green-600 transition-colors">
                    {location.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    {location.description}
                  </p>

                  {/* Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-duriat-green-50 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-duriat-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Alamat</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {location.address}, {location.district}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-duriat-orange-50 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-duriat-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Jam Operasional</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {location.openHours} • {location.openDays}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Kontak</p>
                        <p className="text-sm font-semibold text-gray-900">{location.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Accepted Waste */}
                  <div className="mb-6">
                    <p className="text-sm font-bold text-gray-900 mb-3">Sampah yang Diterima</p>
                    <div className="flex flex-wrap gap-2">
                      {location.acceptedWaste.map((waste, idx) => {
                        const WasteIcon = waste.icon;
                        return (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-200"
                          >
                            <WasteIcon className={`w-3.5 h-3.5 ${waste.color}`} />
                            <span className="text-xs font-semibold text-gray-700">{waste.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Button */}
                  <a
                    href={location.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-duriat-green-600 hover:bg-duriat-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-duriat-green-600/25"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Petunjuk Arah</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Info Banner */}
          <div className="mt-12 bg-gradient-to-r from-duriat-orange-500 to-duriat-orange-600 rounded-3xl p-8 md:p-10 text-white shadow-xl">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-2xl md:text-3xl font-black mb-3">Tips Setor Sampah</h3>
              <p className="text-white/90 mb-6 leading-relaxed">
                Pastikan sampah sudah dipilah sesuai jenisnya, dibersihkan dari sisa isi, dan dikeringkan.
                Pisahkan tutup botol, remas botol plastik untuk menghemat ruang, dan simpan di wadah terpisah.
              </p>
              <Link
                to="/katalog-sampah"
                className="inline-flex items-center gap-2 bg-white text-duriat-orange-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-all"
              >
                Lihat Katalog Sampah
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
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

export default LokasiPenimbangan;
