import React from 'react';
import {
  Coins,
  MapPin,
  CheckCircle,
  HelpCircle,
  Scale,
  Sparkles,
  ArrowRight,
  Building2,
  ExternalLink,
} from 'lucide-react';

export const BankSampahGuide: React.FC = () => {
  const marketPrices = [
    {
      item: 'Kaleng Minuman Aluminium',
      price: 'Rp 12.000 - Rp 16.000 / kg',
      note: 'Injak pipih, bilas sisa manis, nilai tertinggi',
      category: 'Logam',
    },
    {
      item: 'Botol Plastik PET Bening (Air Mineral)',
      price: 'Rp 3.500 - Rp 5.500 / kg',
      note: 'Lepas label & tutup, remas pipih, kondisi bersih',
      category: 'Plastik',
    },
    {
      item: 'Kardus Boks Karton Bekas',
      price: 'Rp 1.500 - Rp 2.500 / kg',
      note: 'Bongkar pipih, harus kering total, tidak berminyak',
      category: 'Kertas',
    },
    {
      item: 'Kertas Putih HVS / Dokumen Bekas',
      price: 'Rp 2.000 - Rp 3.200 / kg',
      note: 'Lepas staples kawat dan plastik jilid',
      category: 'Kertas',
    },
    {
      item: 'Gelas Plastik Minuman (PP)',
      price: 'Rp 2.500 - Rp 4.000 / kg',
      note: 'Lepas segel lid atas, tumpuk rapi setelah dicuci',
      category: 'Plastik',
    },
    {
      item: 'Besi Padat & Logam Seng Bekas',
      price: 'Rp 3.000 - Rp 5.000 / kg',
      note: 'Bebas kotoran tanah tebal',
      category: 'Logam',
    },
    {
      item: 'Minyak Jelantah (Migor Bekas)',
      price: 'Rp 6.000 - Rp 8.000 / liter',
      note: 'Saring sisa remah makanan, tampung dalam jerigen',
      category: 'Organik/Oli',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Pilah dari Sumber (Rumah Tangga)',
      desc: 'Pisahkan sampah kering bernilai ekonomis (plastik, kertas, kaleng) dari sampah basah dapur dan residu.',
    },
    {
      num: '02',
      title: 'Bersihkan & Pipihkan (3K: Kering, Kosong, Kempes)',
      desc: 'Bilas sisa minuman/makanan, keringkan agar tidak berbau dan mengundang lalat, lalu remas hingga hemat ruang.',
    },
    {
      num: '03',
      title: 'Bawa ke Bank Sampah atau TPS3R',
      desc: 'Bawa tabungan sampah ke unit Bank Sampah RW/Kelurahan, TPS3R, atau gunakan aplikasi jemput sampah.',
    },
    {
      num: '04',
      title: 'Timbang & Catat di Buku Rekening',
      desc: 'Petugas menimbang sesuai jenis material. Hasil rupiah masuk ke buku rekening tabungan sampah atau dikonversi emas.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Introduction Hero */}
      <section className="bg-gradient-to-br from-duriat-green-800 to-duriat-green-950 rounded-2xl p-6 sm:p-8 text-white shadow-sm">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-duriat-green-500/20 text-duriat-green-300 text-xs font-semibold mb-3 border border-duriat-green-400/20">
            <Coins className="w-3.5 h-3.5" />
            <span>Ekonomi Sirkular di Indonesia</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Ubah Sampah Jadi Cuan Lewat Bank Sampah
          </h2>
          <p className="text-duriat-green-100/90 text-sm leading-relaxed mb-6">
            Di Indonesia, sampah anorganik yang terpilah dengan bersih memiliki nilai ekonomi nyata.
            Melalui ribuan unit Bank Sampah binaan Kementerian Lingkungan Hidup, Anda dapat
            menyetorkan sampah terpilah untuk ditabung menjadi saldo rupiah atau tabungan emas.
          </p>

          <a
            href="https://www.google.com/maps/search/bank+sampah+terdekat"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-duriat-green-900 font-semibold text-sm hover:bg-duriat-green-50 transition-colors shadow-lg cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-duriat-green-700" />
            <span>Cari Bank Sampah Terdekat di Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 text-duriat-green-700" />
          </a>
        </div>
      </section>

      {/* 4 Steps Flow */}
      <section className="bg-white dark:bg-duriat-green-900 rounded-2xl p-6 border border-gray-200 dark:border-duriat-green-800 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
          Alur 4 Langkah Menabung di Bank Sampah
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
          Sangat mudah dan bisa dipraktikkan langsung oleh setiap keluarga di rumah:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((st) => (
            <div
              key={st.num}
              className="p-4 rounded-xl bg-gray-50 dark:bg-duriat-green-800/40 border border-gray-200 dark:border-duriat-green-700/80 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-duriat-green-600 dark:text-duriat-green-400 block mb-2">
                  {st.num}.
                </span>
                <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-2">
                  {st.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Market Prices Table */}
      <section className="bg-white dark:bg-duriat-green-900 rounded-2xl p-6 border border-gray-200 dark:border-duriat-green-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-duriat-green-600" />
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                Estimasi Pasaran Harga Sampah Daur Ulang per Kilogram
              </h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              *Harga dapat bervariasi bergantung lokasi, kebersihan, dan fluktuasi pabrik daur ulang.
            </p>
          </div>
          <span className="text-[11px] text-gray-400">Diperbarui 2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 dark:border-duriat-green-800 text-gray-500 dark:text-gray-400">
                <th className="py-3 px-3 font-semibold">Jenis Sampah</th>
                <th className="py-3 px-3 font-semibold">Kategori</th>
                <th className="py-3 px-3 font-semibold text-duriat-green-600 dark:text-duriat-green-400">
                  Estimasi Nilai / kg
                </th>
                <th className="py-3 px-3 font-semibold">Syarat &amp; Kualitas Terbaik</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-duriat-green-800/60">
              {marketPrices.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                >
                  <td className="py-3 px-3 font-medium text-gray-900 dark:text-gray-100">
                    {row.item}
                  </td>
                  <td className="py-3 px-3 text-gray-500 dark:text-gray-400">
                    {row.category}
                  </td>
                  <td className="py-3 px-3 font-bold text-duriat-green-700 dark:text-duriat-green-400">
                    {row.price}
                  </td>
                  <td className="py-3 px-3 text-gray-600 dark:text-gray-300">
                    {row.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Drop-box E-Waste & B3 Warning */}
      <section className="bg-amber-50 dark:bg-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-900/50">
        <h4 className="font-bold text-sm text-amber-900 dark:text-amber-300 mb-1">
          Catatan Khusus Sampah Berbahaya (Limbah B3 &amp; Elektronik)
        </h4>
        <p className="text-xs text-amber-800/90 dark:text-amber-300/80 leading-relaxed">
          Sampah baterai bekas, lampu neon, kabel, dan charger rusak (E-Waste) <strong>tidak dijual ke Bank Sampah biasa</strong>.
          Serahkan limbah ini ke drop-box E-Waste resmi yang disediakan oleh Dinas Lingkungan Hidup
          (biasanya tersedia di kantor kecamatan, halte transportasi umum, atau mal besar) agar diolah secara aman tanpa mencemari tanah.
        </p>
      </section>
    </div>
  );
};
