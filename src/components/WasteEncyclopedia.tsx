import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  Trash2,
  Recycle,
  Sparkles,
  Info,
  Clock,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import {
  BIN_COLOR_STANDARDS,
  WASTE_ENCYCLOPEDIA,
} from '../data/wasteGuide';
import { WasteCategory, WasteGuideEntry } from '../types/waste';

interface WasteEncyclopediaProps {
  onSelectItemForDetail?: (entry: WasteGuideEntry) => void;
}

export const WasteEncyclopedia: React.FC<WasteEncyclopediaProps> = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEntry, setSelectedEntry] = useState<WasteGuideEntry | null>(null);

  const categories = [
    { id: 'all', label: 'Semua Sampah' },
    { id: 'organik', label: 'Organik' },
    { id: 'plastik', label: 'Plastik' },
    { id: 'kertas', label: 'Kertas & Karton' },
    { id: 'logam', label: 'Logam' },
    { id: 'kaca', label: 'Kaca' },
    { id: 'b3', label: 'Limbah B3' },
    { id: 'residu', label: 'Residu' },
  ];

  const filteredEntries = WASTE_ENCYCLOPEDIA.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tips.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Official Bin Standards Section */}
      <section className="bg-white dark:bg-duriat-green-900 rounded-2xl p-6 border border-gray-200 dark:border-duriat-green-800 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Trash2 className="w-5 h-5 text-duriat-green-600" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Standar Warna Tempat Sampah Nasional di Indonesia
          </h2>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
          Berdasarkan pedoman Kementerian Lingkungan Hidup dan Kehutanan (KLHK) serta SNI 19-3983-1995:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {BIN_COLOR_STANDARDS.map((bin) => (
            <div
              key={bin.color}
              className={`p-4 rounded-xl border ${bin.accentBorder} ${bin.badgeBg} flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold ${bin.badgeText}`}>
                    {bin.color}
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-current opacity-80" />
                </div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-1">
                  {bin.title}
                </h3>
                <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  {bin.targetItems}
                </p>
              </div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 border-t border-black/5 dark:border-white/5 pt-2">
                {bin.standardCode}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Directory & Search Section */}
      <section className="bg-white dark:bg-duriat-green-900 rounded-2xl p-6 border border-gray-200 dark:border-duriat-green-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-duriat-green-600" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Kamus &amp; Panduan Pemilahan Sampah
              </h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Ketahui waktu urai dan langkah tepat menangani berbagai sampah rumah tangga sehari-hari.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari jenis sampah (misal: botol, kardus)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-duriat-green-800 border border-gray-200 dark:border-duriat-green-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-duriat-green-500"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-duriat-green-600 text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-duriat-green-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Info className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
            <p className="text-sm">Tidak ditemukan jenis sampah yang cocok dengan pencarian.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEntries.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedEntry(item)}
                className="p-4 rounded-xl border border-gray-200 dark:border-duriat-green-800 hover:border-duriat-green-500/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                    <span className="font-semibold text-duriat-green-700 dark:text-duriat-green-400">
                      {item.categoryLabel}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Wadah: {item.binColor}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 group-hover:text-duriat-green-600 transition-colors mb-1.5">
                    {item.name}
                  </h3>

                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                    {item.quickStep}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 dark:border-duriat-green-800/80 flex items-center justify-between text-[11px] text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-500" />
                    <span>{item.decompositionTime}</span>
                  </div>
                  <span className="text-duriat-green-600 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Detail <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal Detail when clicked */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-duriat-green-900 rounded-2xl max-w-lg w-full p-6 border border-gray-200 dark:border-duriat-green-800 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-duriat-green-600">
                  {selectedEntry.categoryLabel}
                </span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {selectedEntry.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-duriat-green-800 text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-600 dark:text-gray-300">
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-duriat-green-800/60 border border-gray-200 dark:border-duriat-green-700">
                <strong className="text-gray-800 dark:text-gray-200 block mb-1">
                  Wadah Tempat Sampah:
                </strong>
                <span>Tempat Sampah Warna {selectedEntry.binColor}</span>
              </div>

              <div className="p-3 rounded-lg bg-gray-50 dark:bg-duriat-green-800/60 border border-gray-200 dark:border-duriat-green-700">
                <strong className="text-gray-800 dark:text-gray-200 block mb-1">
                  Waktu Terurai di Alam:
                </strong>
                <span>{selectedEntry.decompositionTime}</span>
              </div>

              <div className="p-3 rounded-lg bg-gray-50 dark:bg-duriat-green-800/60 border border-gray-200 dark:border-duriat-green-700">
                <strong className="text-gray-800 dark:text-gray-200 block mb-1">
                  Langkah Penanganan Cepat:
                </strong>
                <span>{selectedEntry.quickStep}</span>
              </div>

              <div className="p-3 rounded-lg bg-duriat-green-50 dark:bg-duriat-green-950/20 border border-duriat-green-200 dark:border-duriat-green-900 text-duriat-green-900 dark:text-duriat-green-300">
                <strong className="block mb-1 font-bold">Tips Ramah Lingkungan:</strong>
                <span>{selectedEntry.tips}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold cursor-pointer"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
