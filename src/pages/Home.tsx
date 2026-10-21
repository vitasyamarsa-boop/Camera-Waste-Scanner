import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Menu, Package, RefreshCw, TriangleAlert, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '#beranda', label: 'Beranda' },
  { href: '#katalog-sampah', label: 'Katalog Sampah' },
  { href: '#lokasi-penimbangan', label: 'Lokasi Penimbangan' },
  { href: '#tabungan-sampah', label: 'Tabungan Sampah' },
  { href: '#tentang-kami', label: 'Tentang Kami' },
];

const CATEGORY_CARDS = [
  {
    title: 'Organik',
    description: 'Sampah alami yang mudah terurai',
    image:
      'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=500&q=80',
    alt: 'Organik',
    iconClass: 'text-duriat-green-600',
    Icon: RefreshCw,
  },
  {
    title: 'Daur Ulang',
    description: 'Sampah yang dapat diolah kembali',
    image:
      'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=500&q=80',
    alt: 'Daur Ulang',
    iconClass: 'text-blue-500',
    Icon: Package,
  },
  {
    title: 'Bahan Berbahaya Beracun',
    description: 'Sampah berbahaya yang memerlukan penanganan khusus',
    image:
      'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=500&q=80',
    alt: 'B3',
    iconClass: 'text-yellow-500',
    Icon: TriangleAlert,
  },
];

const SAVING_STEPS = [
  {
    title: 'Pilah & Kumpulkan',
    description:
      'Pisahkan sampah organik dan anorganik dari rumah Anda. Bersihkan dan kelompokkan sesuai jenisnya (plastik, kertas, logam).',
  },
  {
    title: 'Setor ke DURIAT',
    description:
      'Bawa sampah yang sudah dipilah ke lokasi penimbangan atau Bank Sampah terdekat untuk ditimbang oleh petugas kami.',
  },
  {
    title: 'Terima Saldo',
    description:
      'Nilai sampah Anda otomatis masuk ke akun Tabungan Sampah. Pantau dan tarik saldo Anda kapan saja melalui aplikasi web.',
  },
];

export const Home: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.title = 'DURIAT - Ubah Runtah Jadi Berkah';
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="font-inter antialiased text-gray-800 bg-white min-h-screen">
      <nav className="bg-white/90 backdrop-blur-sm fixed w-full z-50 py-4 px-4 md:px-8 flex justify-between items-center shadow-sm">
        <a href="#beranda">
          <img src="/duriat.png" alt="Logo DURIAT" className="h-10 md:h-12 object-contain" />
        </a>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-black font-bold text-xs hover:text-duriat-orange-500 transition-colors uppercase"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex items-center">
          <button
            type="button"
            className="hidden md:inline-block bg-duriat-orange-500 hover:bg-duriat-orange-600 text-white font-bold py-2 px-6 rounded-full text-xs transition-transform transform hover:scale-105 shadow-md uppercase cursor-pointer"
          >
            Sign In/Sign Up
          </button>

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
                className="text-duriat-green-600 font-bold text-sm uppercase border-b border-gray-100 pb-2"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/scanner"
              onClick={closeMobileMenu}
              className="bg-duriat-orange-500 text-white text-center font-bold py-3 px-6 rounded-full text-sm mt-4 inline-block"
            >
              Tanya DURIAT AI
            </Link>
          </div>
        </div>
      )}

      <section
        id="beranda"
        className="hero-bg w-full h-[80vh] min-h-[500px] relative flex items-center pt-16"
      >
        <div className="container mx-auto px-4 md:px-8 relative z-10 flex justify-end">
          <div className="w-full md:w-1/2 text-right">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 drop-shadow-lg leading-tight">
              Ubah Runtah
              <br />
              Jadi Berkah
            </h1>
            <p className="text-white font-medium text-sm md:text-base mb-8 max-w-[480px] ml-auto leading-relaxed drop-shadow-md text-right">
              Temukan cara mengelola sampah yang tepat, cari bank sampah terdekat, dan mulai
              berkontribusi untuk lingkungan bersama <strong className="font-black">DURIAT</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8">
              <a
                href="#lokasi-penimbangan"
                className="bg-duriat-orange-500 hover:bg-duriat-orange-600 text-white font-bold py-3 px-8 rounded-full text-sm transition-transform transform hover:-translate-y-1 shadow-xl text-center uppercase tracking-wide border-2 border-duriat-orange-500"
              >
                Cari Bank Sampah
              </a>
              <Link
                to="/scanner"
                className="bg-white hover:bg-gray-100 text-duriat-green-600 font-bold py-3 px-8 rounded-full text-sm transition-transform transform hover:-translate-y-1 shadow-xl text-center uppercase tracking-wide border-2 border-white inline-block"
              >
                Tanya DURIAT AI
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="katalog-sampah" className="py-20 bg-white scroll-mt-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-duriat-orange-500 mb-3">
            Mulai dari sampahmu
          </h2>
          <p className="text-duriat-green-600 font-medium text-sm md:text-base">
            Pilih kategori untuk menemukan panduan yang sesuai
          </p>
        </div>
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CATEGORY_CARDS.map((card) => (
              <div
                key={card.title}
                className="relative rounded-[2rem] overflow-hidden h-[400px] group cursor-pointer shadow-lg"
              >
                {/* Base Image */}
                <img
                  src={card.image}
                  alt={card.alt}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 card-gradient"></div>
                {/* Content */}
                <div className="absolute inset-0 p-8 pb-8 flex flex-col justify-end text-center items-center">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-md shrink-0">
                    <card.Icon className={`w-12 h-12 ${card.iconClass}`} />
                  </div>
                  {/* Teks dibungkus dengan tinggi tetap (h-28) agar semua ikon sejajar */}
                  <div className="h-28 flex flex-col justify-start items-center">
                    <h3 className="font-black text-2xl text-white mb-2 uppercase tracking-wider">
                      {card.title}
                    </h3>
                    <p className="text-white/90 font-medium text-sm px-4">{card.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="lokasi-penimbangan" className="py-20 bg-duriat-green-600 scroll-mt-16">
        <div className="container mx-auto px-4 md:px-12">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Text & Card Info */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-8">Lokasi Penimbangan</h2>

              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl mb-8 max-w-md transform transition-transform hover:-translate-y-1">
                <h3 className="font-black text-xl text-black mb-2">Bank Sampah pusat DURIAT</h3>
                <p className="text-gray-600 font-medium mb-4 text-sm">
                  Jl. Runtah Berkah 31, Bandung
                </p>
                <div className="flex items-center gap-2 text-duriat-orange-500 font-bold text-sm">
                  <MapPin className="w-4 h-4" />
                  Buka: 08:00-22:00
                </div>
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-2 bg-white text-duriat-orange-500 font-bold py-3 px-6 rounded-full text-sm transition-colors hover:bg-gray-100 shadow-md cursor-pointer"
              >
                Lihat semua lokasi
                <ArrowRight className="w-4 h-4 text-white rounded-full" />
              </button>
            </div>

            {/* Map Image */}
            <div className="w-full lg:w-1/2">
              <div className="bg-gray-200 rounded-3xl overflow-hidden shadow-2xl h-[400px] w-full border-4 border-white/20">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80"
                  alt="Peta Lokasi"
                  loading="lazy"
                  className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="tabungan-sampah" className="py-20 bg-white scroll-mt-16">
        <div className="container mx-auto px-4 md:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-duriat-orange-500 mb-16">
            Cara Kerja Tabungan Sampah
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SAVING_STEPS.map((step, index) => (
              <div
                key={step.title}
                className="bg-duriat-orange-500 rounded-[2.5rem] p-10 text-white shadow-xl transform transition-transform hover:-translate-y-2 flex flex-col items-center"
              >
                <div className="w-24 h-24 bg-white text-duriat-orange-500 rounded-full flex items-center justify-center text-5xl font-black mb-8 shadow-inner">
                  {index + 1}
                </div>
                <h3 className="text-2xl font-black mb-4">{step.title}</h3>
                <p className="font-medium text-white/90 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <button
              type="button"
              className="inline-block bg-duriat-green-600 hover:bg-duriat-green-800 text-white font-bold py-4 px-10 rounded-full text-sm transition-transform transform hover:-translate-y-1 shadow-lg uppercase tracking-wider cursor-pointer"
            >
              Buat Akun Sekarang
            </button>
          </div>
        </div>
      </section>

      <section id="tentang-kami" className="py-20 bg-white border-t border-gray-100 scroll-mt-16">
        <div className="container mx-auto px-4 md:px-12">
          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            {/* Left Image */}
            <div className="w-full lg:w-5/12">
              <div className="h-full min-h-[400px] rounded-[3rem] overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1516992654410-9309d4587e94?w=800&q=80"
                  alt="Tempat Sampah"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Content */}
            <div className="w-full lg:w-7/12 bg-duriat-green-600 rounded-[3rem] p-10 md:p-14 text-white shadow-xl flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-black mb-2 text-center">Tentang DURIAT</h2>
              <h3 className="text-lg md:text-xl font-bold mb-8 text-center text-white/80">
                Dina Runtah Aya Manfaat
              </h3>

              <div className="space-y-6 text-sm md:text-base font-medium leading-relaxed text-white/90 text-justify">
                <p>
                  <span className="font-bold text-white">DURIAT</span> hadir sebagai solusi pengelolaan
                  sampah berbasis masyarakat. Kami percaya bahwa sampah bukanlah akhir dari
                  segalanya, melainkan sumber daya yang bisa dimanfaatkan kembali.
                </p>
                <p>
                  Melalui platform digital dan jaringan bank sampah kami, kami mempermudah masyarakat
                  untuk mendaur ulang, menabung, dan berkontribusi langsung terhadap kelestarian
                  lingkungan sekaligus meningkatkan kesejahteraan ekonomi lokal.
                </p>
                <p>
                  Bergabunglah bersama ribuan warga lainnya yang telah membuktikan bahwa dari sampah
                  bisa membawa berkah.
                </p>
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

export default Home;
