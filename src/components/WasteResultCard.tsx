import React, { useState } from 'react';
import {
  Trash2,
  Recycle,
  Clock,
  CheckCircle,
  Sparkles,
  Volume2,
  VolumeX,
  AlertTriangle,
  Coins,
  ArrowRight,
  BookmarkCheck,
  Check,
  RotateCcw,
  ShieldAlert,
  Leaf,
} from 'lucide-react';
import { BinColor, WasteClassification } from '../types/waste';

interface WasteResultCardProps {
  result: WasteClassification;
  imageUrl?: string;
  onScanAgain: () => void;
  onSaveToHistory?: () => void;
  isSaved?: boolean;
}

export const WasteResultCard: React.FC<WasteResultCardProps> = ({
  result,
  imageUrl,
  onScanAgain,
  onSaveToHistory,
  isSaved = false,
}) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Toggle step completion in checklist
  const toggleStep = (index: number) => {
    if (completedSteps.includes(index)) {
      setCompletedSteps(completedSteps.filter((i) => i !== index));
    } else {
      setCompletedSteps([...completedSteps, index]);
    }
  };

  // Text to speech voice readout
  const speakGuide = () => {
    if (!('speechSynthesis' in window)) {
      alert('Browser Anda belum mendukung fitur pembacaan suara otomatis.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `Sampah terdeteksi: ${result.itemName}. Kategori: ${result.categoryLabel}. Masukkan ke ${result.binLabel}. Waktu terurai di alam: ${result.decompositionTime}. Langkah penanganan: ${result.disposalSteps.join('. ')}. Nilai di Bank Sampah: ${result.bankSampahValue}.`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'id-ID';
    utterance.rate = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Bin Color Visual Palette
  const getBinVisual = (color: BinColor) => {
    switch (color) {
      case 'Hijau':
        return {
          bg: 'bg-duriat-green-50 dark:bg-duriat-green-950/40',
          border: 'border-duriat-green-200 dark:border-duriat-green-800',
          badgeBg: 'bg-duriat-green-600',
          badgeText: 'text-white',
          textAccent: 'text-duriat-green-700 dark:text-duriat-green-300',
          iconColor: 'text-duriat-green-600',
          indicator: '#3b7141',
        };
      case 'Kuning':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/40',
          border: 'border-amber-200 dark:border-amber-800',
          badgeBg: 'bg-amber-500',
          badgeText: 'text-white',
          textAccent: 'text-amber-700 dark:text-amber-300',
          iconColor: 'text-amber-600',
          indicator: '#d97706',
        };
      case 'Biru':
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/40',
          border: 'border-blue-200 dark:border-blue-800',
          badgeBg: 'bg-blue-600',
          badgeText: 'text-white',
          textAccent: 'text-blue-700 dark:text-blue-300',
          iconColor: 'text-blue-600',
          indicator: '#2563eb',
        };
      case 'Merah':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/40',
          border: 'border-rose-200 dark:border-rose-800',
          badgeBg: 'bg-rose-600',
          badgeText: 'text-white',
          textAccent: 'text-rose-700 dark:text-rose-300',
          iconColor: 'text-rose-600',
          indicator: '#e11d48',
        };
      case 'Abu-abu':
      default:
        return {
          bg: 'bg-gray-100 dark:bg-duriat-green-800/60',
          border: 'border-gray-300 dark:border-duriat-green-700',
          badgeBg: 'bg-gray-600',
          badgeText: 'text-white',
          textAccent: 'text-gray-700 dark:text-gray-300',
          iconColor: 'text-gray-600',
          indicator: '#4b5563',
        };
    }
  };

  const binStyle = getBinVisual(result.binColor);

  return (
    <div className="space-y-6">
      {/* Main Analysis Card */}
      <div className="bg-white dark:bg-duriat-green-900 rounded-2xl border border-gray-200 dark:border-duriat-green-800 shadow-sm overflow-hidden">
        {/* Top Header with Image Thumbnail & Detection Details */}
        <div className="p-6 border-b border-gray-100 dark:border-duriat-green-800 flex flex-col md:flex-row gap-6 items-start">
          {imageUrl && (
            <div className="relative w-full md:w-36 h-36 rounded-xl overflow-hidden bg-gray-100 dark:bg-duriat-green-800 border border-gray-200 dark:border-duriat-green-700 shrink-0 flex items-center justify-center">
              <img
                src={imageUrl}
                alt={result.itemName}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs">
                {result.confidence}% Yakin
              </span>
            </div>
          )}

          <div className="flex-1 w-full">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                <span>Hasil Deteksi Kamera</span>
                <span aria-hidden="true">·</span>
                <span className="text-duriat-green-700 dark:text-duriat-green-400 font-semibold">
                  {result.categoryLabel}
                </span>
              </div>

              {/* Speech Readout Button */}
              <button
                type="button"
                onClick={speakGuide}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-duriat-green-700 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                    <span>Hentikan Suara</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-duriat-green-600" />
                    <span>Bacakan Panduan</span>
                  </>
                )}
              </button>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {result.itemName}
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              <strong className="text-gray-700 dark:text-gray-200">Material: </strong>
              {result.material}
            </p>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-duriat-green-800/50 border border-gray-200/80 dark:border-duriat-green-700/80">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Waktu Terurai</span>
                </div>
                <div className="font-semibold text-xs sm:text-sm text-gray-800 dark:text-gray-200">
                  {result.decompositionTime}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-duriat-green-800/50 border border-gray-200/80 dark:border-duriat-green-700/80">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                  <Recycle className="w-3.5 h-3.5 text-duriat-green-500" />
                  <span>Daur Ulang</span>
                </div>
                <div className="font-semibold text-xs sm:text-sm text-gray-800 dark:text-gray-200">
                  {result.recyclable ? 'Bisa Didaur Ulang' : 'Tidak Didaur Ulang'}
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 p-2.5 rounded-lg bg-gray-50 dark:bg-duriat-green-800/50 border border-gray-200/80 dark:border-duriat-green-700/80">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                  <Coins className="w-3.5 h-3.5 text-amber-600" />
                  <span>Nilai Bank Sampah</span>
                </div>
                <div className="font-semibold text-xs text-gray-800 dark:text-gray-200 truncate">
                  {result.bankSampahValue}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Official Bin Recommendation Banner */}
        <div className={`p-4 md:p-5 ${binStyle.bg} border-b ${binStyle.border} flex items-center justify-between gap-4`}>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
              style={{ backgroundColor: binStyle.indicator }}
            >
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Rekomendasi Tempat Sampah
              </div>
              <div className={`text-base md:text-lg font-bold ${binStyle.textAccent}`}>
                {result.binLabel}
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400">
            <span>Standar Nasional RI</span>
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: binStyle.indicator }}
            />
          </div>
        </div>

        {/* Step-by-Step Interactive Preparation Checklist */}
        <div className="p-6 border-b border-gray-100 dark:border-duriat-green-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">
                Langkah Pemilahan &amp; Pengelolaan
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Centang setiap langkah setelah Anda melakukannya sebelum membuang atau menyetor:
              </p>
            </div>
            <div className="text-xs font-semibold text-duriat-green-600 dark:text-duriat-green-400">
              {completedSteps.length} dari {result.disposalSteps.length} Selesai
            </div>
          </div>

          <div className="space-y-2.5">
            {result.disposalSteps.map((step, idx) => {
              const isChecked = completedSteps.includes(idx);
              return (
                <div
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isChecked
                      ? 'bg-duriat-green-50/60 dark:bg-duriat-green-950/20 border-duriat-green-300 dark:border-duriat-green-800 text-gray-500 line-through'
                      : 'bg-white dark:bg-duriat-green-800/40 border-gray-200 dark:border-duriat-green-700 hover:border-duriat-green-400'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isChecked
                        ? 'bg-duriat-green-600 text-white'
                        : 'border border-gray-300 dark:border-duriat-green-600 text-transparent'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div className="text-sm font-medium leading-relaxed">
                    <span className="font-bold text-gray-400 mr-1.5">{idx + 1}.</span>
                    <span className={isChecked ? 'text-gray-500' : 'text-gray-800 dark:text-gray-200'}>
                      {step}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcycling & Reuse Ideas */}
        {result.upcyclingIdeas && result.upcyclingIdeas.length > 0 && (
          <div className="p-6 border-b border-gray-100 dark:border-duriat-green-800 bg-gray-50/50 dark:bg-duriat-green-800/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-duriat-green-600" />
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                Ide Upcycling &amp; Pemanfaatan Kembali (Reuse)
              </h3>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300">
              {result.upcyclingIdeas.map((idea, i) => (
                <li
                  key={i}
                  className="p-2.5 rounded-lg bg-white dark:bg-duriat-green-800 border border-gray-200/80 dark:border-duriat-green-700/80 flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-duriat-green-500 mt-1.5 shrink-0" />
                  <span>{idea}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Environmental Warning & Eco Tips */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-800 dark:text-rose-400 mb-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Dampak Bila Dibuang Sembarangan</span>
            </div>
            <p className="text-xs text-rose-900/90 dark:text-rose-300/90 leading-relaxed">
              {result.environmentalImpact}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-duriat-green-50 dark:bg-duriat-green-950/20 border border-duriat-green-200 dark:border-duriat-green-900/50">
            <div className="flex items-center gap-2 text-xs font-bold text-duriat-green-800 dark:text-duriat-green-400 mb-1.5">
              <Leaf className="w-4 h-4 text-duriat-green-600" />
              <span>Tips Zero-Waste &amp; Pencegahan</span>
            </div>
            <p className="text-xs text-duriat-green-900/90 dark:text-duriat-green-300/90 leading-relaxed">
              {result.ecoTips}
            </p>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="p-4 bg-gray-50 dark:bg-duriat-green-800/60 border-t border-gray-200 dark:border-duriat-green-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onScanAgain}
            className="px-5 py-2.5 rounded-xl bg-duriat-orange-500 hover:bg-duriat-orange-600 text-white font-medium text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Pindai Sampah Lain</span>
          </button>

          {onSaveToHistory && (
            <button
              type="button"
              onClick={onSaveToHistory}
              disabled={isSaved}
              className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                isSaved
                  ? 'bg-gray-100 text-gray-400 border-gray-200 dark:bg-duriat-green-800 dark:border-duriat-green-700'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-300 dark:bg-duriat-green-800 dark:text-gray-200 dark:border-duriat-green-700'
              }`}
            >
              <BookmarkCheck className={`w-4 h-4 ${isSaved ? 'text-duriat-green-600' : ''}`} />
              <span>{isSaved ? 'Tersimpan di Riwayat' : 'Simpan Hasil'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
