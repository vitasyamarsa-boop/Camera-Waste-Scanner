import React, { useEffect, useRef, useState } from 'react';
import {
  Camera,
  RefreshCw,
  Upload,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon,
  HelpCircle,
  SwitchCamera,
} from 'lucide-react';
import { SAMPLE_WASTE_ITEMS, SampleItem } from '../data/sampleItems';
import { WasteClassification } from '../types/waste';

interface CameraScannerProps {
  onClassificationComplete: (result: WasteClassification, capturedImageUrl: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  onClassificationComplete,
  isLoading,
  setIsLoading,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<string>('Menyiapkan pemindaian...');
  const [flashEffect, setFlashEffect] = useState<boolean>(false);
  // Error dari server (mis. API key tidak valid). Tidak ada lagi fallback ke hasil contoh,
  // karena hasil palsu lebih harmful daripada pesan error yang jujur.
  const [apiError, setApiError] = useState<string | null>(null);
  const lastAnalyzedImage = useRef<string | null>(null);

  // Initialize camera stream
  const startCamera = async (mode: 'environment' | 'user' = facingMode) => {
    try {
      setCameraError(null);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Kamera tidak didukung oleh browser Anda. Gunakan opsi unggah foto.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((e) => {
          console.warn('Video play interrupted:', e);
        });
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access error:', err);
      let message = 'Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        message = 'Akses kamera ditolak oleh browser. Anda dapat mengizinkan kamera atau mengunggah foto.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        message = 'Kamera tidak ditemukan pada perangkat Anda. Silakan unggah foto dari galeri.';
      }
      setCameraError(message);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const toggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Send image to backend API for AI Classification
  const analyzeImage = async (base64Image: string) => {
    setIsLoading(true);
    setAnalysisStatus('Mengunggah gambar sampah...');
    setApiError(null);
    lastAnalyzedImage.current = base64Image;

    try {
      setAnalysisStatus('Mendeteksi objek sampah menggunakan AI Gemini...');

      const response = await fetch('/api/classify-waste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Image,
          mimeType: 'image/jpeg',
        }),
      });

      if (response.ok) {
        setAnalysisStatus('Menyusun panduan pemilahan & daur ulang...');
        const data: WasteClassification = await response.json();
        onClassificationComplete(data, base64Image);
        return;
      }

      // Server menolak / gagal: tampilkan alasannya, jangan karang hasil palsu.
      const payload = await response.json().catch(() => null);
      const message =
        payload?.error ||
        `Permintaan ditolak server (HTTP ${response.status}). Silakan coba lagi.`;
      console.error('[analyzeImage] server error:', response.status, message);
      setApiError(message);
    } catch (err: any) {
      console.error('[analyzeImage] network error:', err);
      setApiError(
        'Tidak dapat menghubungi server pemindaian. Pastikan server sedang berjalan dan koneksi internet tersedia.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Ulangi analisis dengan gambar terakhir
  const retryAnalysis = () => {
    if (lastAnalyzedImage.current) {
      analyzeImage(lastAnalyzedImage.current);
    }
  };

  // Capture frame from active video stream
  const captureSnapshot = () => {
    if (!videoRef.current) return;

    // Trigger visual flash
    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 200);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // If front camera, mirror image for natural feeling
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64Data = canvas.toDataURL('image/jpeg', 0.88);
    setCapturedPreview(base64Data);
    analyzeImage(base64Data);
  };

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setCapturedPreview(result);
      analyzeImage(result);
    };
    reader.readAsDataURL(file);
    // Reset file input
    e.target.value = '';
  };

  // Select sample item for immediate test
  const handleSelectSample = (sample: SampleItem) => {
    setCapturedPreview(sample.imageSvg);
    onClassificationComplete(sample.data, sample.imageSvg);
  };

  return (
    <div className="space-y-6">
      {/* Error analisis AI — tampil jujur, bukan hasil contoh yang menyesatkan */}
      {apiError && (
        <div className="rounded-2xl border border-duriat-orange-300 bg-duriat-orange-50 dark:bg-duriat-orange-950/30 dark:border-duriat-orange-800 p-4 sm:p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-duriat-orange-600 dark:text-duriat-orange-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-duriat-orange-800 dark:text-duriat-orange-300 mb-1">
              Analisis AI gagal dijalankan
            </p>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed break-words">
              {apiError}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                type="button"
                onClick={retryAnalysis}
                className="px-4 py-2 rounded-xl bg-duriat-orange-500 hover:bg-duriat-orange-600 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Coba Lagi
              </button>
              <button
                type="button"
                onClick={() => setApiError(null)}
                className="px-4 py-2 rounded-xl bg-white dark:bg-duriat-green-900 text-gray-700 dark:text-gray-200 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border border-gray-300 dark:border-duriat-green-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scanner Viewport Container */}
      <div className="relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 shadow-xl">
        {/* Flash animation */}
        {flashEffect && (
          <div className="absolute inset-0 bg-white z-40 opacity-80 pointer-events-none transition-opacity duration-150" />
        )}

        {/* Video or Fallback Area */}
        <div className="relative aspect-4/3 sm:aspect-16/10 w-full flex items-center justify-center bg-gray-950">
          {cameraActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 max-w-md">
              <div className="w-16 h-16 rounded-2xl bg-duriat-green-500/10 border border-duriat-green-500/20 flex items-center justify-center text-duriat-green-400 mb-4">
                <Camera className="w-8 h-8" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Arahkan Kamera ke Sampah</h3>
              <p className="text-gray-400 text-sm mb-6">
                {cameraError ||
                  'Aktifkan kamera untuk memindai sampah secara langsung atau unggah foto dari perangkat Anda.'}
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => startCamera()}
                  className="px-4 py-2.5 rounded-xl bg-duriat-orange-500 hover:bg-duriat-orange-600 text-white font-medium text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-duriat-orange-500/25"
                >
                  <RefreshCw className="w-4 h-4" />
                  Coba Kamera Lagi
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium text-sm transition-colors flex items-center gap-2 cursor-pointer border border-gray-700"
                >
                  <Upload className="w-4 h-4" />
                  Pilih dari Galeri
                </button>
              </div>
            </div>
          )}

          {/* Viewfinder HUD Overlay when Camera is Active */}
          {cameraActive && !isLoading && (
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
              {/* Top Viewfinder Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900/70 backdrop-blur-md border border-white/10 text-white text-xs">
                  <span className="w-2 h-2 rounded-full bg-duriat-green-400 animate-pulse" />
                  Kamera Siap
                </div>
                <div className="text-white/80 text-xs px-3 py-1.5 rounded-full bg-gray-900/70 backdrop-blur-md border border-white/10">
                  Posisikan sampah di tengah
                </div>
              </div>

              {/* Center Framing Target Grid */}
              <div className="relative mx-auto w-64 h-64 sm:w-72 sm:h-72 border border-white/20 rounded-2xl flex items-center justify-center">
                {/* Corner Accents */}
                <span className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-duriat-green-400 rounded-tl-lg" />
                <span className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-duriat-green-400 rounded-tr-lg" />
                <span className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-duriat-green-400 rounded-bl-lg" />
                <span className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-duriat-green-400 rounded-br-lg" />

                {/* Animated Horizontal Scan Beam */}
                <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-duriat-orange-400 to-transparent animate-pulse" />

                <div className="text-center text-white/50 text-xs px-4">
                  Fokuskan objek sampah pada area ini
                </div>
              </div>

              {/* Bottom Camera Controls Bar */}
              <div className="flex items-center justify-between pointer-events-auto">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Unggah Foto dari Galeri"
                  className="w-12 h-12 rounded-full bg-gray-900/80 hover:bg-gray-800 text-white flex items-center justify-center border border-white/10 backdrop-blur-md transition-all cursor-pointer"
                >
                  <Upload className="w-5 h-5 text-gray-300" />
                </button>

                {/* Primary Shutter Button */}
                <button
                  type="button"
                  onClick={captureSnapshot}
                  className="group relative flex items-center justify-center w-20 h-20 rounded-full border-4 border-white/90 bg-duriat-orange-500 hover:bg-duriat-orange-600 active:scale-95 transition-all shadow-xl shadow-duriat-orange-500/30 cursor-pointer"
                >
                  <span className="w-14 h-14 rounded-full bg-white group-hover:scale-90 transition-transform" />
                </button>

                {/* Switch Camera */}
                <button
                  type="button"
                  onClick={toggleFacingMode}
                  title="Ganti Kamera Depan / Belakang"
                  className="w-12 h-12 rounded-full bg-gray-900/80 hover:bg-gray-800 text-white flex items-center justify-center border border-white/10 backdrop-blur-md transition-all cursor-pointer"
                >
                  <SwitchCamera className="w-5 h-5 text-gray-300" />
                </button>
              </div>
            </div>
          )}

          {/* Loading State Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-gray-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
              <div className="relative mb-5">
                <div className="w-16 h-16 rounded-full border-3 border-duriat-green-500/20 border-t-duriat-green-500 animate-spin" />
                <Sparkles className="w-7 h-7 text-duriat-green-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <h4 className="text-white font-semibold text-lg mb-1">Menganalisis Sampah</h4>
              <p className="text-gray-300 text-sm max-w-sm">{analysisStatus}</p>
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      {/* Quick Test Samples Bar */}
      <div className="bg-white dark:bg-duriat-green-900 rounded-xl p-4 border border-gray-200 dark:border-duriat-green-800 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
            <Sparkles className="w-4 h-4 text-duriat-green-600" />
            <span>Atau Uji Langsung dengan Contoh Sampah Nyata (1 Klik):</span>
          </div>
          <span className="text-xs text-gray-400">Pilih salah satu</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {SAMPLE_WASTE_ITEMS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className="text-left p-2.5 rounded-lg border border-gray-200 dark:border-duriat-green-800 hover:border-duriat-green-500 dark:hover:border-duriat-green-500 hover:bg-duriat-green-50/40 dark:hover:bg-duriat-green-950/20 transition-all flex flex-col cursor-pointer group"
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-[11px] font-medium text-duriat-green-700 dark:text-duriat-green-400 truncate">
                  {sample.categoryName}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-duriat-green-500 group-hover:scale-125 transition-transform" />
              </div>
              <div className="font-semibold text-xs text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-duriat-green-600 dark:group-hover:text-duriat-green-400">
                {sample.name}
              </div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                {sample.tag}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
