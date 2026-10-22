import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  ArrowLeft,
  Lock,
  Bell,
  Shield,
  LogOut,
  Edit3,
} from 'lucide-react';

export const ProfileSettings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Profile data
  const [fullName, setFullName] = useState('Pengguna DURIAT');
  const [email, setEmail] = useState('pengguna@duriat.id');
  const [phone, setPhone] = useState('081234567890');
  const [address, setAddress] = useState('Bandung, Jawa Barat');
  const [bio, setBio] = useState('Warga peduli lingkungan yang aktif memilah sampah.');

  // Security data
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Notifications
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);

  useEffect(() => {
    document.title = 'Pengaturan Profil - PilahSampah AI | DURIAT';
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert('Kata sandi baru dan konfirmasi tidak sama');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-duriat-green-50 dark:bg-duriat-green-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-duriat-green-950/95 backdrop-blur-md border-b border-gray-200 dark:border-duriat-green-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-[72px] flex items-center justify-between gap-4">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <img
              src="/duriat.png"
              alt="Logo DURIAT"
              className="h-9 md:h-10 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-2 md:gap-3">
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-duriat-green-600 hover:bg-duriat-green-50 dark:hover:bg-duriat-green-900 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kembali ke Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-2">
            Pengaturan Profil
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Kelola informasi akun dan preferensi kamu
          </p>
        </div>

        {/* Success Alert */}
        {showSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-duriat-green-50 dark:bg-duriat-green-900/30 border border-duriat-green-200 dark:border-duriat-green-700 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-duriat-green-600 flex items-center justify-center shrink-0">
              <Save className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm font-semibold text-duriat-green-700 dark:text-duriat-green-300">
              Perubahan berhasil disimpan!
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-duriat-green-900 rounded-2xl border border-gray-200 dark:border-duriat-green-800 shadow-sm overflow-hidden">
              <nav className="p-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === 'profile'
                      ? 'bg-duriat-green-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-duriat-green-800'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Profil</span>
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === 'security'
                      ? 'bg-duriat-green-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-duriat-green-800'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Keamanan</span>
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === 'notifications'
                      ? 'bg-duriat-green-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-duriat-green-800'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  <span>Notifikasi</span>
                </button>
                <div className="my-2 border-t border-gray-200 dark:border-duriat-green-800"></div>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-duriat-orange-600 hover:bg-duriat-orange-50 dark:hover:bg-duriat-orange-950/30 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="bg-white dark:bg-duriat-green-900 rounded-2xl border border-gray-200 dark:border-duriat-green-800 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-duriat-green-800">
                    <h2 className="text-lg font-black text-gray-900 dark:text-white">
                      Informasi Pribadi
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Perbarui foto dan informasi pribadi kamu
                    </p>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-duriat-green-600 flex items-center justify-center shrink-0">
                        <User className="w-10 h-10 text-white" />
                      </div>
                      <div className="flex-1">
                        <button
                          type="button"
                          className="px-4 py-2 rounded-xl bg-duriat-green-50 dark:bg-duriat-green-800 text-duriat-green-700 dark:text-duriat-green-300 text-sm font-semibold hover:bg-duriat-green-100 dark:hover:bg-duriat-green-700 transition-colors flex items-center gap-2"
                        >
                          <Camera className="w-4 h-4" />
                          Ganti Foto
                        </button>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          JPG, PNG atau GIF. Maksimal 2MB
                        </p>
                      </div>
                    </div>

                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Nama Lengkap
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-duriat-green-700 bg-white dark:bg-duriat-green-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-duriat-green-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-duriat-green-700 bg-white dark:bg-duriat-green-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-duriat-green-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Nomor Telepon
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-duriat-green-700 bg-white dark:bg-duriat-green-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-duriat-green-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Alamat
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-duriat-green-700 bg-white dark:bg-duriat-green-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-duriat-green-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Bio
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-duriat-green-700 bg-white dark:bg-duriat-green-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-duriat-green-500 focus:border-transparent transition-all resize-none"
                        placeholder="Ceritakan sedikit tentang dirimu..."
                      />
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-gray-50 dark:bg-duriat-green-800/50 border-t border-gray-200 dark:border-duriat-green-800 flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2.5 rounded-xl bg-duriat-orange-500 hover:bg-duriat-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all flex items-center gap-2 shadow-lg shadow-duriat-orange-500/25"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Simpan Perubahan</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="bg-white dark:bg-duriat-green-900 rounded-2xl border border-gray-200 dark:border-duriat-green-800 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-duriat-green-800">
                    <h2 className="text-lg font-black text-gray-900 dark:text-white">
                      Ubah Kata Sandi
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Pastikan kata sandi kamu kuat dan unik
                    </p>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Kata Sandi Saat Ini
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-duriat-green-700 bg-white dark:bg-duriat-green-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-duriat-green-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Kata Sandi Baru
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          placeholder="Minimal 6 karakter"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-duriat-green-700 bg-white dark:bg-duriat-green-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-duriat-green-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Konfirmasi Kata Sandi Baru
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          required
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-duriat-green-700 bg-white dark:bg-duriat-green-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-duriat-green-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-gray-50 dark:bg-duriat-green-800/50 border-t border-gray-200 dark:border-duriat-green-800 flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2.5 rounded-xl bg-duriat-orange-500 hover:bg-duriat-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all flex items-center gap-2 shadow-lg shadow-duriat-orange-500/25"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Memproses...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Ubah Kata Sandi</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-white dark:bg-duriat-green-900 rounded-2xl border border-gray-200 dark:border-duriat-green-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-duriat-green-800">
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">
                    Pengaturan Notifikasi
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Atur bagaimana kamu ingin menerima pemberitahuan
                  </p>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-duriat-green-800/50">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        Notifikasi Email
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Terima pemberitahuan via email
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emailNotif}
                        onChange={(e) => setEmailNotif(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-duriat-green-500 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-duriat-green-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-duriat-green-800/50">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        Push Notification
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Terima pemberitahuan di perangkat kamu
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pushNotif}
                        onChange={(e) => setPushNotif(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-duriat-green-500 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-duriat-green-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-duriat-green-800/50">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        Laporan Mingguan
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Dapatkan ringkasan kontribusi kamu setiap minggu
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={weeklyReport}
                        onChange={(e) => setWeeklyReport(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-duriat-green-500 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-duriat-green-600"></div>
                    </label>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 dark:bg-duriat-green-800/50 border-t border-gray-200 dark:border-duriat-green-800 flex justify-end">
                  <button
                    onClick={() => {
                      setShowSuccess(true);
                      setTimeout(() => setShowSuccess(false), 3000);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-duriat-orange-500 hover:bg-duriat-orange-600 text-white font-semibold text-sm transition-all flex items-center gap-2 shadow-lg shadow-duriat-orange-500/25"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Pengaturan</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-duriat-dark dark:bg-duriat-green-950 border-t border-duriat-green-800 py-6 mt-12 text-center text-xs text-gray-300 dark:text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p>PilahSampah AI · Pedoman Standar KLHK & SNI 19-3983-1995</p>
        </div>
      </footer>
    </div>
  );
};

export default ProfileSettings;
