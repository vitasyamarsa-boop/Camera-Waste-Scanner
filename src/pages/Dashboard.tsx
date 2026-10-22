import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  BookOpen,
  Coins,
  History,
  HelpCircle,
  Recycle,
  User,
  LogOut,
  TrendingUp,
  Award,
  Leaf,
  BarChart3,
  Calendar,
  Bell,
  Wallet,
  Plus,
  ArrowUpRight,
} from 'lucide-react';
import { SAMPLE_WASTE_ITEMS } from '../data/sampleItems';
import { ScannedItem } from '../types/waste';

const LOCAL_STORAGE_KEY = 'pilah_sampah_scan_history_v1';

export const Dashboard: React.FC = () => {
  const [history, setHistory] = useState<ScannedItem[]>([]);
  const userName = 'Pengguna DURIAT';
  const bankSampahBalance = 125000; // Saldo dalam Rupiah

  useEffect(() => {
    document.title = 'Dashboard - PilahSampah AI | DURIAT';
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      } else {
        const initialSamples: ScannedItem[] = [
          SAMPLE_WASTE_ITEMS[0].data,
          SAMPLE_WASTE_ITEMS[1].data,
        ];
        setHistory(initialSamples);
      }
    } catch (e) {
      console.warn('Could not read history from localStorage:', e);
    }
  }, []);

  const totalScans = history.length;
  const recyclableCount = history.filter((item) => item.recyclable).length;
  const organicCount = history.filter((item) => item.category === 'organik').length;
  const plasticCount = history.filter((item) => item.category === 'plastik').length;

  const recentScans = history.slice(0, 4);

  return (
    <div className="min-h-screen bg-duriat-green-50 dark:bg-duriat-green-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-duriat-green-950/95 backdrop-blur-md border-b border-gray-200 dark:border-duriat-green-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-[72px] flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="/duriat.png"
              alt="Logo DURIAT"
              className="h-9 md:h-10 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-2 md:gap-3">
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-duriat-green-900 transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-duriat-orange-500 rounded-full"></span>
            </button>
            <Link
              to="/profile"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-duriat-green-50 dark:bg-duriat-green-900 hover:bg-duriat-green-100 dark:hover:bg-duriat-green-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-duriat-green-600 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{userName}</span>
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-duriat-orange-500 hover:bg-duriat-orange-50 dark:hover:bg-duriat-orange-950/30 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-2">
            Selamat Datang, <span className="text-duriat-green-600">{userName}</span>!
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Pantau kontribusi pilah sampahmu dan mulai deteksi sampah dengan AI
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
          {/* Saldo Bank Sampah Card */}
          <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-duriat-green-600 to-duriat-green-700 rounded-2xl p-4 sm:p-5 text-white shadow-lg shadow-duriat-green-600/25 hover:shadow-xl transition-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 opacity-70" />
              </div>
              <p className="text-xs opacity-90 mb-1">Saldo Bank Sampah</p>
              <p className="text-xl sm:text-2xl font-black mb-1">
                Rp {bankSampahBalance.toLocaleString('id-ID')}
              </p>
              <p className="text-[10px] opacity-80">Dapat ditarik ke rekening</p>
            </div>
          </div>

          <div className="bg-white dark:bg-duriat-green-900 rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-duriat-green-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-duriat-green-100 dark:bg-duriat-green-800 flex items-center justify-center">
                <Camera className="w-5 h-5 text-duriat-green-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-duriat-green-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-1">{totalScans}</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Pemindaian</p>
          </div>

          <div className="bg-white dark:bg-duriat-green-900 rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-duriat-green-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-duriat-green-100 dark:bg-duriat-green-800 flex items-center justify-center">
                <Recycle className="w-5 h-5 text-duriat-green-600" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-1">{recyclableCount}</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Bisa Didaur Ulang</p>
          </div>

          <div className="bg-white dark:bg-duriat-green-900 rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-duriat-green-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-1">{organicCount}</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Sampah Organik</p>
          </div>

          <div className="bg-white dark:bg-duriat-green-900 rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-duriat-green-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-duriat-orange-100 dark:bg-duriat-orange-950/30 flex items-center justify-center">
                <Award className="w-5 h-5 text-duriat-orange-600" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-1">{plasticCount}</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Sampah Plastik</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-4">
                Aksi Cepat
              </h2>
              <div className="grid sm:grid-cols-3 gap-3 sm:gap-4">
                <Link
                  to="/scanner"
                  className="group bg-gradient-to-br from-duriat-orange-500 to-duriat-orange-600 rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-duriat-orange-500/25 hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <Camera className="w-6 h-6" />
                    </div>
                    <BarChart3 className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black mb-1">Mulai Pindai Sampah</h3>
                  <p className="text-sm opacity-90">Deteksi jenis sampah dengan kamera AI</p>
                </Link>

                <Link
                  to="/scanner"
                  className="group bg-white dark:bg-duriat-green-900 rounded-2xl p-5 sm:p-6 border border-gray-200 dark:border-duriat-green-800 shadow-sm hover:shadow-md hover:border-duriat-green-500 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-duriat-green-100 dark:bg-duriat-green-800 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-duriat-green-600" />
                    </div>
                    <BarChart3 className="w-5 h-5 text-gray-400 group-hover:translate-x-1 group-hover:text-duriat-green-600 transition-all" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-1">Katalog Sampah</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pelajari katalog & panduan pemilahan sampah</p>
                </Link>

                <Link
                  to="/scanner"
                  className="group bg-white dark:bg-duriat-green-900 rounded-2xl p-5 sm:p-6 border border-gray-200 dark:border-duriat-green-800 shadow-sm hover:shadow-md hover:border-duriat-green-500 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-duriat-green-100 dark:bg-duriat-green-800 flex items-center justify-center">
                      <Coins className="w-6 h-6 text-duriat-green-600" />
                    </div>
                    <BarChart3 className="w-5 h-5 text-gray-400 group-hover:translate-x-1 group-hover:text-duriat-green-600 transition-all" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-1">Bank Sampah</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Temukan lokasi bank sampah terdekat</p>
                </Link>
              </div>
            </div>

            {/* Recent Scans */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                  Riwayat Terbaru
                </h2>
                <Link
                  to="/scanner"
                  className="text-sm font-semibold text-duriat-green-600 hover:text-duriat-orange-500 transition-colors"
                >
                  Lihat Semua
                </Link>
              </div>
              <div className="bg-white dark:bg-duriat-green-900 rounded-2xl border border-gray-200 dark:border-duriat-green-800 shadow-sm overflow-hidden">
                {recentScans.length > 0 ? (
                  <div className="divide-y divide-gray-100 dark:divide-duriat-green-800">
                    {recentScans.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-duriat-green-800/40 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-duriat-green-800 overflow-hidden shrink-0">
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              alt={item.itemName}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {item.itemName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.binColor} • {item.categoryLabel}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(item.timestamp).toLocaleDateString('id-ID')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Belum ada riwayat pemindaian
                    </p>
                    <Link
                      to="/scanner"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-duriat-orange-500 hover:bg-duriat-orange-600 text-white text-sm font-semibold transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                      Mulai Pindai
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 h-full flex flex-col">
            {/* Achievement Card */}
            <div className="bg-gradient-to-br from-duriat-green-600 to-duriat-green-700 rounded-2xl p-5 sm:p-6 text-white shadow-lg flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <Award className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-black">Pencapaian Kamu</h3>
                  </div>
                </div>
                <p className="text-sm opacity-90 mb-4">
                  Teruskan kontribusimu untuk lingkungan yang lebih bersih!
                </p>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                <span className="text-sm font-semibold">Level Aktif</span>
                <span className="text-lg font-black">Pemilah Pemula</span>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-white dark:bg-duriat-green-900 rounded-2xl p-5 border border-gray-200 dark:border-duriat-green-800 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Leaf className="w-5 h-5 text-duriat-green-600" />
                <h3 className="text-base font-black text-gray-900 dark:text-white">
                  Tips Hari Ini
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Pisahkan tutup botol plastik dari botolnya! Tutup biasanya terbuat dari jenis plastik yang berbeda dan perlu dipilah terpisah untuk proses daur ulang yang optimal.
              </p>
            </div>

            {/* History Shortcut */}
            <Link
              to="/scanner"
              className="block bg-white dark:bg-duriat-green-900 rounded-2xl p-5 border border-gray-200 dark:border-duriat-green-800 shadow-sm hover:shadow-md hover:border-duriat-green-500 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-duriat-green-100 dark:bg-duriat-green-800 flex items-center justify-center">
                  <History className="w-5 h-5 text-duriat-green-600" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900 dark:text-white">
                    Lihat Semua Riwayat
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {totalScans} pemindaian tersimpan
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-duriat-dark dark:bg-duriat-green-950 border-t border-duriat-green-800 py-6 mt-12 text-center text-xs text-gray-300 dark:text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p>PilahSampah AI · Pedoman Standar KLHK &amp; SNI 19-3983-1995</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
