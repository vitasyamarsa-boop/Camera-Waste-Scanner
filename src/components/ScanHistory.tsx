import React from 'react';
import {
  History,
  Trash,
  Clock,
  Recycle,
  Trash2,
  ChevronRight,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { ScannedItem } from '../types/waste';

interface ScanHistoryProps {
  history: ScannedItem[];
  onSelectItem: (item: ScannedItem) => void;
  onClearHistory: () => void;
}

export const ScanHistory: React.FC<ScanHistoryProps> = ({
  history,
  onSelectItem,
  onClearHistory,
}) => {
  // Compute summary stats
  const totalScans = history.length;
  const recyclableCount = history.filter((i) => i.recyclable).length;
  const organicCount = history.filter((i) => i.category === 'organik').length;
  const plasticCount = history.filter((i) => i.category === 'plastik').length;

  return (
    <div className="space-y-6">
      {/* Eco Impact Summary Card */}
      <div className="bg-white dark:bg-duriat-green-900 rounded-2xl p-6 border border-gray-200 dark:border-duriat-green-800 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-duriat-green-600" />
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
            Dampak Pemilahan Anda
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-duriat-green-800/40 border border-gray-200/80 dark:border-duriat-green-700/80">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Total Dipindai
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {totalScans} <span className="text-xs font-normal text-gray-400">barang</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-duriat-green-50 dark:bg-duriat-green-950/20 border border-duriat-green-200 dark:border-duriat-green-900/50">
            <div className="text-xs text-duriat-green-700 dark:text-duriat-green-400 mb-1">
              Bisa Didaur Ulang
            </div>
            <div className="text-xl font-bold text-duriat-green-700 dark:text-duriat-green-400">
              {recyclableCount} <span className="text-xs font-normal opacity-80">item</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50">
            <div className="text-xs text-amber-700 dark:text-amber-400 mb-1">
              Sampah Plastik
            </div>
            <div className="text-xl font-bold text-amber-700 dark:text-amber-400">
              {plasticCount} <span className="text-xs font-normal opacity-80">item</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/50">
            <div className="text-xs text-teal-700 dark:text-teal-400 mb-1">
              Sampah Kompos
            </div>
            <div className="text-xl font-bold text-teal-700 dark:text-teal-400">
              {organicCount} <span className="text-xs font-normal opacity-80">item</span>
            </div>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="bg-white dark:bg-duriat-green-900 rounded-2xl p-6 border border-gray-200 dark:border-duriat-green-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-duriat-green-600" />
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
              Riwayat Pindai Sebelumnya
            </h3>
          </div>

          {history.length > 0 && (
            <button
              type="button"
              onClick={onClearHistory}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium transition-colors cursor-pointer flex items-center gap-1"
            >
              <Trash className="w-3.5 h-3.5" />
              <span>Hapus Semua</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <History className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
            <p className="text-sm">Belum ada riwayat pemindaian sampah.</p>
            <p className="text-xs text-gray-400 mt-1">
              Arahkan kamera ke sampah untuk mulai mengenali dan menyimpannya di sini.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-duriat-green-800">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="py-3.5 flex items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/40 px-2 rounded-xl transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.itemName}
                      className="w-12 h-12 rounded-lg object-cover bg-gray-100 dark:bg-duriat-green-800 shrink-0 border border-gray-200 dark:border-duriat-green-700"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-duriat-green-100 text-duriat-green-700 flex items-center justify-center shrink-0">
                      <Trash2 className="w-6 h-6" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 group-hover:text-duriat-green-600 truncate transition-colors">
                      {item.itemName}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <span className="font-medium text-duriat-green-700 dark:text-duriat-green-400">
                        {item.categoryLabel}
                      </span>
                      <span>·</span>
                      <span>Wadah {item.binColor}</span>
                      <span>·</span>
                      <span>{new Date(item.timestamp).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-medium text-duriat-green-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Buka Panduan <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
