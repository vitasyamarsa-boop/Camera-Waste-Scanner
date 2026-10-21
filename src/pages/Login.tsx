import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = 'Masuk - PilahSampah AI | DURIAT';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulasi proses login
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-duriat-green-50 dark:bg-duriat-green-950 flex flex-col">
      {/* Header */}
      <header className="bg-white/95 dark:bg-duriat-green-950/95 backdrop-blur-md border-b border-gray-200 dark:border-duriat-green-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-[72px] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="/duriat.png"
              alt="Logo DURIAT"
              className="h-9 md:h-10 w-auto object-contain"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base md:text-lg tracking-tight text-duriat-green-600">
                  PilahSampah
                </span>
                <span className="text-[10px] md:text-xs font-bold px-1.5 py-0.5 rounded bg-duriat-orange-100 text-duriat-orange-600">
                  AI
                </span>
              </div>
              <p className="text-[9px] md:text-[10px] text-gray-500 dark:text-gray-400 hidden sm:block">
                Dina Runtah Aya Manfaat
              </p>
            </div>
          </Link>
          
          <Link
            to="/"
            className="text-xs sm:text-sm font-semibold text-duriat-green-600 hover:text-duriat-orange-500 transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white dark:bg-duriat-green-900 rounded-2xl shadow-xl border border-gray-200 dark:border-duriat-green-800 overflow-hidden">
            {/* Card Header */}
            <div className="px-6 sm:px-8 pt-8 pb-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-duriat-green-600 mb-4 shadow-lg shadow-duriat-green-600/20">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2">
                Masuk ke Akun
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Akses fitur PilahSampah AI untuk mulai memilah sampah
              </p>
            </div>

            {/* Card Body */}
            <form onSubmit={handleSubmit} className="px-6 sm:px-8 pb-8 space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="nama@email.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-duriat-green-700 bg-white dark:bg-duriat-green-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-duriat-green-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Kata Sandi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Masukkan kata sandi"
                    className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-gray-300 dark:border-duriat-green-700 bg-white dark:bg-duriat-green-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-duriat-green-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-duriat-green-600 focus:ring-duriat-green-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Ingat saya</span>
                </label>
                <button
                  type="button"
                  className="text-sm font-semibold text-duriat-green-600 hover:text-duriat-orange-500 transition-colors"
                >
                  Lupa kata sandi?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-duriat-orange-500 hover:bg-duriat-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-duriat-orange-500/25 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Masuk</span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-duriat-green-700" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white dark:bg-duriat-green-900 text-gray-500 dark:text-gray-400">
                    atau
                  </span>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Belum punya akun?{' '}
                  <Link
                    to="/register"
                    className="font-semibold text-duriat-green-600 hover:text-duriat-orange-500 transition-colors"
                  >
                    Daftar sekarang
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Footer Text */}
          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
            Dengan masuk, Anda menyetujui{' '}
            <button className="text-duriat-green-600 hover:underline">Syarat & Ketentuan</button>
            {' '}dan{' '}
            <button className="text-duriat-green-600 hover:underline">Kebijakan Privasi</button>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-duriat-dark dark:bg-duriat-green-950 border-t border-duriat-green-800 py-6 text-center text-xs text-gray-300 dark:text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p>PilahSampah AI · Pedoman Standar KLHK & SNI 19-3983-1995</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
