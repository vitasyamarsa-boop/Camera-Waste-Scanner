import React, { useState } from 'react';
import { Leaf, Recycle, TriangleAlert, ChevronDown, ChevronUp } from 'lucide-react';

interface SubCategoryItem {
  name: string;
  image: string;
}

interface SubCategory {
  title: string;
  items: SubCategoryItem[];
}

interface CatalogSection {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  headerImage: string;
  subCategories?: SubCategory[];
  notes?: string[];
}

const CATALOG_SECTIONS: CatalogSection[] = [
  {
    id: 'organik',
    title: 'Sampah Organik',
    subtitle: 'Dapat diuraikan secara biologis',
    icon: Leaf,
    color: 'text-duriat-green-600',
    bgColor: 'bg-duriat-green-50 dark:bg-duriat-green-900/30',
    borderColor: 'border-duriat-green-200 dark:border-duriat-green-700',
    headerImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
    description:
      'Sampah organik merupakan jenis sampah yang berasal dari bahan alami dan sisa aktivitas sehari-hari yang dapat mengalami proses penguraian secara biologis. Jenis sampah organik yang dapat dikelola meliputi minyak jelantah, sisa makanan dapur yang belum dimasak, serta sisa makanan dapur yang sudah berbumbu. Minyak jelantah dapat dikumpulkan untuk disalurkan ke pengelola khusus agar dapat dimanfaatkan kembali, sedangkan sisa makanan dapat diolah melalui proses pengomposan atau metode pengolahan organik lainnya sesuai dengan karakteristik dan kondisinya.',
    subCategories: [
      {
        title: 'Jenis yang Dapat Dikelola',
        items: [
          { name: 'Minyak jelantah', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80' },
          { name: 'Sisa makanan dapur yang belum dimasak', image: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=400&q=80' },
          { name: 'Sisa makanan dapur yang sudah berbumbu', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80' },
        ],
      },
    ],
    notes: [
      'Minyak jelantah: kumpulkan terpisah dan salurkan ke pengelola khusus untuk dimanfaatkan kembali',
      'Sisa makanan: olah melalui pengomposan atau metode pengolahan organik sesuai karakteristiknya',
    ],
  },
  {
    id: 'daur-ulang',
    title: 'Sampah Daur Ulang',
    subtitle: 'Masih memiliki nilai guna',
    icon: Recycle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200 dark:border-blue-800',
    headerImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80',
    description:
      'Sampah daur ulang merupakan sampah yang masih memiliki nilai guna dan dapat diproses kembali menjadi bahan baku atau produk baru. Sampah-sampah tersebut dapat dipilah berdasarkan jenis materialnya untuk mempermudah proses pengumpulan, pengolahan, dan penyaluran kepada mitra daur ulang.',
    subCategories: [
      {
        title: 'Plastik',
        items: [
          { name: 'Botol PET bening', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80' },
          { name: 'Botol PET berwarna', image: 'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?w=400&q=80' },
          { name: 'Gelas plastik PP', image: 'https://images.unsplash.com/photo-1516992654410-9309d4587e94?w=400&q=80' },
          { name: 'Plastik HDPE', image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400&q=80' },
          { name: 'Plastik PS', image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400&q=80' },
          { name: 'Galon air mineral', image: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?w=400&q=80' },
          { name: 'Plastik lembaran', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80' },
        ],
      },
      {
        title: 'Kertas',
        items: [
          { name: 'Koran', image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80' },
          { name: 'Kertas HVS', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80' },
          { name: 'Kertas dupleks', image: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?w=400&q=80' },
          { name: 'Kertas buram', image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&q=80' },
          { name: 'Karton bekas minuman', image: 'https://images.unsplash.com/photo-1603484477859-abe6a73f9366?w=400&q=80' },
          { name: 'Kardus', image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&q=80' },
          { name: 'Tray bekas telur', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80' },
        ],
      },
      {
        title: 'Botol Beling (Kaca)',
        items: [
          { name: 'Botol kaca utuh transparan', image: 'https://images.unsplash.com/photo-1558642891-54be180ea339?w=400&q=80' },
          { name: 'Botol kaca utuh berwarna', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80' },
        ],
      },
    ],
    notes: [
      'Pilah berdasarkan jenis materialnya',
      'Bersihkan dari sisa isi sebelum disetor',
      'Pisahkan tutup dan label jika memungkinkan',
    ],
  },
  {
    id: 'b3',
    title: 'Sampah B3 (Bahan Berbahaya dan Beracun)',
    subtitle: 'Memerlukan penanganan khusus',
    icon: TriangleAlert,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50 dark:bg-rose-950/30',
    borderColor: 'border-rose-200 dark:border-rose-800',
    headerImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
    description:
      'Sampah B3 merupakan jenis sampah yang mengandung bahan berbahaya dan beracun sehingga memerlukan penanganan khusus untuk mencegah pencemaran lingkungan serta risiko terhadap kesehatan manusia. Oleh karena itu, sampah B3 harus dipisahkan dari sampah rumah tangga lainnya dan diserahkan kepada fasilitas atau pengelola yang memiliki prosedur penanganan sesuai ketentuan yang berlaku.',
    subCategories: [
      {
        title: 'Jenis Sampah B3',
        items: [
          { name: 'Baterai bekas', image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80' },
          { name: 'Lampu neon', image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&q=80' },
          { name: 'Kaleng aerosol', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80' },
          { name: 'Obat-obatan kedaluwarsa', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80' },
        ],
      },
    ],
    notes: [
      'Baterai bekas: berpotensi mengandung logam dan bahan kimia berbahaya',
      'Lampu neon: dapat mengandung merkuri',
      'Kaleng aerosol: dapat menyisakan bahan bertekanan atau zat kimia',
      'Obat-obatan kedaluwarsa: jangan dibuang sembarangan, hindari disalahgunakan',
      'Wajib dipisahkan dari sampah rumah tangga dan diserahkan ke pengelola bersertifikat',
    ],
  },
];

export const WasteCatalog: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>('organik');

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2">
          Katalog Sampah DURIAT
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Panduan pemilahan sampah berdasarkan kategori dan jenisnya
        </p>
      </div>

      {/* Catalog Sections */}
      <div className="space-y-4">
        {CATALOG_SECTIONS.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSection === section.id;

          return (
            <div
              key={section.id}
              className={`bg-white dark:bg-duriat-green-900 rounded-2xl border ${section.borderColor} shadow-sm overflow-hidden transition-all`}
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full relative overflow-hidden hover:opacity-95 transition-opacity"
              >
                <div className="relative h-32 sm:h-40">
                  <img
                    src={section.headerImage}
                    alt={section.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
                  <div className="absolute inset-0 p-4 sm:p-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 text-left">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/95 flex items-center justify-center shrink-0 shadow-lg`}>
                        <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${section.color}`} />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-white drop-shadow-lg">
                          {section.title}
                        </h3>
                        <p className="text-xs sm:text-sm font-semibold text-white/90 drop-shadow">
                          {section.subtitle}
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-6 h-6 text-white drop-shadow-lg shrink-0" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-white drop-shadow-lg shrink-0" />
                    )}
                  </div>
                </div>
              </button>

              {/* Section Content */}
              {isExpanded && (
                <div className="p-4 sm:p-6 space-y-6">
                  {/* Description */}
                  <div>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                      {section.description}
                    </p>
                  </div>

                  {/* Sub Categories */}
                  {section.subCategories && section.subCategories.length > 0 && (
                    <div className="space-y-4">
                      {section.subCategories.map((subCat, idx) => (
                        <div key={idx}>
                          <h4 className="text-base font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${section.color.replace('text-', 'bg-')}`}></span>
                            {subCat.title}
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {subCat.items.map((item, itemIdx) => (
                              <div
                                key={itemIdx}
                                className="group rounded-xl overflow-hidden bg-white dark:bg-duriat-green-800 border border-gray-200 dark:border-duriat-green-700 shadow-sm hover:shadow-md transition-all"
                              >
                                <div className="aspect-square w-full overflow-hidden bg-gray-100 dark:bg-duriat-green-900">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                </div>
                                <div className="p-2.5">
                                  <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 text-center line-clamp-2">
                                    {item.name}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Notes */}
                  {section.notes && section.notes.length > 0 && (
                    <div className={`p-4 rounded-xl ${section.bgColor} border ${section.borderColor}`}>
                      <h4 className="text-sm font-black text-gray-900 dark:text-white mb-2">
                        Catatan Penting
                      </h4>
                      <ul className="space-y-1.5">
                        {section.notes.map((note, idx) => (
                          <li key={idx} className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                            <span className={`${section.color} mt-1`}>•</span>
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="text-center p-4 bg-gray-50 dark:bg-duriat-green-900/50 rounded-xl border border-gray-200 dark:border-duriat-green-800">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Untuk informasi lebih lanjut mengenai lokasi penyerahan sampah khusus, hubungi Bank Sampah terdekat atau petugas DURIAT
        </p>
      </div>
    </div>
  );
};

export default WasteCatalog;
