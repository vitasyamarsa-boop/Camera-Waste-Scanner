import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  BookOpen,
  Coins,
  History,
  HelpCircle,
  Home as HomeIcon,
  Recycle,
  Sparkles,
  CircleAlert,
  CircleCheck,
  FileText,
} from 'lucide-react';
import { CameraScanner } from '../components/CameraScanner';
import { WasteResultCard } from '../components/WasteResultCard';
import { WasteEncyclopedia } from '../components/WasteEncyclopedia';
import { WasteCatalog } from '../components/WasteCatalog';
import { BankSampahGuide } from '../components/BankSampahGuide';
import { ScanHistory } from '../components/ScanHistory';
import { QuizSection } from '../components/QuizSection';
import { SAMPLE_WASTE_ITEMS } from '../data/sampleItems';
import { ScannedItem, WasteClassification } from '../types/waste';

type ActiveTab = 'scanner' | 'guide' | 'catalog' | 'bank' | 'quiz' | 'history';

const LOCAL_STORAGE_KEY = 'pilah_sampah_scan_history_v1';

interface GeminiStatus {
  connected: boolean;
  error: string | null;
  model: string;
}

export const Scanner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('scanner');
  const [currentResult, setCurrentResult] = useState<WasteClassification | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [history, setHistory] = useState<ScannedItem[]>([]);
  const [geminiStatus, setGeminiStatus] = useState<GeminiStatus | null>(null);

  useEffect(() => {
    document.title = 'PilahSampah AI - Deteksi & Pengelolaan Sampah Pintar';
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'catalog') {
      setActiveTab('catalog');
    } else if (tab === 'guide') {
      setActiveTab('guide');
    } else if (tab === 'bank') {
      setActiveTab('bank');
    } else if (tab === 'quiz') {
      setActiveTab('quiz');
    } else if (tab === 'history') {
      setActiveTab('history');
    }
  }, []);

  // Periksa koneksi Gemini API (API key valid?) lalu tampilkan statusnya di header
  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        const res = await fetch('/api/health');
        const data = await res.json();
        if (cancelled) return;
        setGeminiStatus({
          connected: !!data.geminiConnected,
          error: data.geminiError ?? null,
          model: data.model ?? '-',
        });
      } catch {
        if (!cancelled) {
          setGeminiStatus({
            connected: false,
            error: 'Server pemindaian tidak dapat dihubungi.',
            model: '-',
          });
        }
      }
    };
    check();
    return () => {
      cancelled = true;
    };
  }, []);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      } else {
        // Preload with 2 initial educational samples so history tab is informative immediately
        const initialSamples: ScannedItem[] = [
          SAMPLE_WASTE_ITEMS[0].data,
          SAMPLE_WASTE_ITEMS[1].data,
        ];
        setHistory(initialSamples);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialSamples));
      }
    } catch (e) {
      console.warn('Could not read history from localStorage:', e);
    }
  }, []);

  // Save scan result to history
  const handleSaveToHistory = (itemToSave?: WasteClassification, imgUrl?: string) => {
    const classification = itemToSave || currentResult;
    if (!classification) return;

    const newItem: ScannedItem = {
      ...classification,
      id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      imageUrl: imgUrl || capturedImage,
    };

    const updated = [newItem, ...history];
    setHistory(updated);
    setIsSaved(true);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  };

  const handleClassificationComplete = (
    result: WasteClassification,
    capturedImageUrl: string
  ) => {
    setCurrentResult(result);
    setCapturedImage(capturedImageUrl);
    setIsSaved(false);
    // Automatically save scan to history
    handleSaveToHistory(result, capturedImageUrl);
  };

  const handleResetScanner = () => {
    setCurrentResult(null);
    setCapturedImage(undefined);
    setIsSaved(false);
  };

  const handleSelectHistoryItem = (item: ScannedItem) => {
    setCurrentResult(item);
    setCapturedImage(item.imageUrl);
    setIsSaved(true);
    setActiveTab('scanner');
  };

  const handleClearHistory = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus semua riwayat pemindaian sampah?')) {
      setHistory([]);
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch (e) {
        console.warn('Could not clear localStorage:', e);
      }
    }
  };

  return (
    <div className="min-h-screen bg-duriat-green-50 dark:bg-duriat-green-950 text-gray-900 dark:text-gray-100 flex flex-col font-inter">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-duriat-green-950/95 backdrop-blur-md border-b border-gray-200 dark:border-duriat-green-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-[72px] flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div
            onClick={() => {
              setActiveTab('scanner');
              handleResetScanner();
            }}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <img
              src="/duriat.png"
              alt="Logo DURIAT"
              className="h-9 md:h-10 w-auto object-contain"
            />
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Status koneksi Gemini API (API key valid?) */}
            {geminiStatus && (
              <span
                title={
                  geminiStatus.connected
                    ? `Gemini API tersambung — model ${geminiStatus.model}`
                    : geminiStatus.error || 'Gemini API tidak tersambung'
                }
                className={`hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border whitespace-nowrap ${
                  geminiStatus.connected
                    ? 'bg-duriat-green-50 dark:bg-duriat-green-900/60 text-duriat-green-700 dark:text-duriat-green-300 border-duriat-green-200 dark:border-duriat-green-800'
                    : 'bg-duriat-orange-50 dark:bg-duriat-orange-950/40 text-duriat-orange-700 dark:text-duriat-orange-300 border-duriat-orange-300 dark:border-duriat-orange-800'
                }`}
              >
                {geminiStatus.connected ? (
                  <CircleCheck className="w-3 h-3" />
                ) : (
                  <CircleAlert className="w-3 h-3" />
                )}
                {geminiStatus.connected ? 'AI aktif' : 'AI offline'}
              </span>
            )}

            {/* Back to the DURIAT landing page */}
            <Link
              to="/"
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 hover:text-duriat-orange-500 transition-colors"
            >
              <HomeIcon className="w-3.5 h-3.5" />
              Beranda DURIAT
            </Link>

            {/* Navigation Segmented Controls */}
            <nav className="flex items-center gap-0.5 p-1 bg-gray-100/80 dark:bg-duriat-green-900/80 rounded-full border border-gray-200/70 dark:border-duriat-green-800">
              <button
                type="button"
                onClick={() => setActiveTab('scanner')}
                className={`px-3 md:px-4 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'scanner'
                    ? 'bg-duriat-green-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Pemindai</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('guide')}
                className={`hidden sm:flex px-3 md:px-4 py-1.5 text-xs font-semibold rounded-full transition-all items-center gap-1.5 cursor-pointer ${
                  activeTab === 'guide'
                    ? 'bg-duriat-green-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Kamus Sampah</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('catalog')}
                className={`hidden md:flex px-3 md:px-4 py-1.5 text-xs font-semibold rounded-full transition-all items-center gap-1.5 cursor-pointer ${
                  activeTab === 'catalog'
                    ? 'bg-duriat-green-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Katalog Sampah</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('bank')}
                className={`hidden md:flex px-3 md:px-4 py-1.5 text-xs font-semibold rounded-full transition-all items-center gap-1.5 cursor-pointer ${
                  activeTab === 'bank'
                    ? 'bg-duriat-green-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                <span>Bank Sampah</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('quiz')}
                className={`hidden lg:flex px-3 md:px-4 py-1.5 text-xs font-semibold rounded-full transition-all items-center gap-1.5 cursor-pointer ${
                  activeTab === 'quiz'
                    ? 'bg-duriat-green-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Kuis</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`px-3 md:px-4 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-duriat-green-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Riwayat</span>
                {history.length > 0 && (
                  <span
                    className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                      activeTab === 'history' ? 'bg-white text-duriat-green-600' : 'bg-duriat-green-600 text-white'
                    }`}
                  >
                    {history.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>

        {/* Mobile secondary bar for extra tabs */}
        <div className="flex sm:hidden border-t border-gray-100 dark:border-duriat-green-800 px-4 py-2 gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('bank')}
            className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap cursor-pointer ${
              activeTab === 'bank'
                ? 'bg-duriat-green-600 text-white'
                : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-duriat-green-800'
            }`}
          >
            Bank Sampah
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-duriat-green-600 text-white'
                : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-duriat-green-800'
            }`}
          >
            Kuis Edukasi
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        {activeTab === 'scanner' && (
          <div className="space-y-6">
            {/* Header intro if no active result */}
            {!currentResult && (
              <div className="text-center max-w-xl mx-auto mb-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-duriat-green-950/40 text-duriat-green-700 dark:text-duriat-green-300 text-xs font-semibold mb-2 border border-duriat-green-200 dark:border-duriat-green-800">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Kamera Cerdas Berbasis AI</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-duriat-orange-500 dark:text-duriat-orange-400 tracking-tight mb-2">
                  Pindai &amp; Kenali Sampah Anda
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Arahkan kamera ke sampah Anda untuk mengetahui jenis material, warna tempat sampah yang benar, langkah pembersihan, hingga nilai jual di Bank Sampah.
                </p>
              </div>
            )}

            {/* Display either Camera Scanner or Classification Result Card */}
            {currentResult ? (
              <WasteResultCard
                result={currentResult}
                imageUrl={capturedImage}
                onScanAgain={handleResetScanner}
                onSaveToHistory={() => handleSaveToHistory()}
                isSaved={isSaved}
              />
            ) : (
              <CameraScanner
                onClassificationComplete={handleClassificationComplete}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            )}
          </div>
        )}

        {activeTab === 'guide' && <WasteEncyclopedia />}
        {activeTab === 'catalog' && <WasteCatalog />}
        {activeTab === 'bank' && <BankSampahGuide />}

        {activeTab === 'quiz' && <QuizSection />}

        {activeTab === 'history' && (
          <ScanHistory
            history={history}
            onSelectItem={handleSelectHistoryItem}
            onClearHistory={handleClearHistory}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-duriat-dark dark:bg-duriat-green-950 border-t border-duriat-green-800 py-6 mt-12 text-center text-xs text-gray-300 dark:text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium">
            <Recycle className="w-4 h-4 text-duriat-orange-500" />
            <span>PilahSampah AI · Pedoman Standar KLHK &amp; SNI 19-3983-1995</span>
          </div>
          <div>
            Mari jaga bumi dengan memilah sampah dari rumah tangga kita setiap hari.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Scanner;
