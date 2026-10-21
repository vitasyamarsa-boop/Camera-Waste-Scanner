import { ScannedItem } from '../types/waste';

export interface SampleItem {
  id: string;
  name: string;
  categoryName: string;
  tag: string;
  icon: string;
  data: ScannedItem;
  // A clean SVG data URI representation of the object for instant preview
  imageSvg: string;
}

export const SAMPLE_WASTE_ITEMS: SampleItem[] = [
  {
    id: 'sample-botol-plastik',
    name: 'Botol Plastik PET Mineral',
    categoryName: 'Anorganik - Plastik',
    tag: 'Daur Ulang',
    icon: 'Bottle',
    imageSvg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300" fill="none"><rect width="300" height="300" rx="16" fill="%23ecfeff"/><path d="M135 40h30v25h-30z" fill="%230284c7"/><path d="M125 65h50v20h-50z" fill="%2338bdf8"/><path d="M115 85h70v160c0 10-8 18-18 18h-34c-10 0-18-8-18-18V85z" fill="%23bae6fd" stroke="%230284c7" stroke-width="4"/><path d="M115 125h70v50h-70z" fill="%230284c7"/><text x="150" y="155" fill="white" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">AQUA PET</text></svg>',
    data: {
      id: 'sample-1',
      timestamp: Date.now() - 1000 * 60 * 15,
      itemName: 'Botol Plastik PET (Kemasan Air Mineral)',
      category: 'plastik',
      categoryLabel: 'Anorganik - Plastik Daur Ulang',
      binColor: 'Kuning',
      binLabel: 'Tempat Sampah Kuning (Plastik Daur Ulang)',
      material: 'Polyethylene Terephthalate (PET / Kode Daur Ulang 1)',
      confidence: 97,
      decompositionTime: '450 - 500 tahun',
      recyclable: true,
      disposalSteps: [
        'Kosongkan cairan hingga tidak tersisa setetes pun.',
        'Bilas bagian dalam dengan sedikit air agar tidak menimbulkan bau atau semut.',
        'Lepaskan tutup botol dan label plastik (karena memiliki jenis polimer berbeda: HDPE & PP).',
        'Injak atau remas botol hingga pipih untuk menghemat 70% volume tempat sampah.',
        'Kumpulkan dalam karung anorganik atau serahkan ke Bank Sampah terdekat.',
      ],
      upcyclingIdeas: [
        'Pot gantung vertikal untuk tanaman bumbu atau hidroponik rumahan',
        'Penyiram tanaman otomatis dengan sistem kapiler sumbu kain flanel',
        'Bahan baku ecobrick untuk kursi, meja, atau peredam suara ramah lingkungan',
      ],
      environmentalImpact:
        'Butuh 450 tahun untuk terurai. Bila dibuang sembarangan ke selokan, dapat menyumbat aliran air, hanyut ke laut, dan hancur menjadi mikroplastik yang meracuni ikan dan air tanah.',
      bankSampahValue: 'Rp 3.500 - Rp 5.500 / kg (dalam kondisi bersih dan pipih)',
      ecoTips:
        'Bawalah botol minum tumbler isi ulang saat beraktivitas untuk mengurangi limbah plastik sekali pakai secara drastis.',
    },
  },
  {
    id: 'sample-kulit-pisang',
    name: 'Kulit Buah Pisang & Sisa Sayur',
    categoryName: 'Organik',
    tag: 'Kompos Organik',
    icon: 'Banana',
    imageSvg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300" fill="none"><rect width="300" height="300" rx="16" fill="%23f0fdf4"/><path d="M90 190c30 40 90 40 120 0 20-30 20-80 0-110-15-20-40-20-60 0-20-20-45-20-60 0-20 30-20 80 0 110z" fill="%23facc15" stroke="%23ca8a04" stroke-width="4"/><circle cx="150" cy="140" r="10" fill="%23854d0e"/><circle cx="120" cy="170" r="8" fill="%23854d0e"/><circle cx="170" cy="165" r="9" fill="%23854d0e"/></svg>',
    data: {
      id: 'sample-2',
      timestamp: Date.now() - 1000 * 60 * 45,
      itemName: 'Kulit Buah Pisang & Sisa Bahan Makanan',
      category: 'organik',
      categoryLabel: 'Organik Mudah Terurai',
      binColor: 'Hijau',
      binLabel: 'Tempat Sampah Hijau (Sampah Organik)',
      material: 'Biomassa Organik Selulosa Alami (Kaya Kalium & Fosfor)',
      confidence: 96,
      decompositionTime: '2 - 4 minggu (sangat cepat)',
      recyclable: true,
      disposalSteps: [
        'Pisahkan dari kemasan plastik, karet gelang, atau staples yang mungkin menempel.',
        'Potong atau cacah menjadi ukuran lebih kecil agar proses pembusukan aerobik lebih efisien.',
        'Masukkan ke komposter rumah, lubang biopori, atau wadah ember tumpuk.',
        'Campurkan dengan bahan cokelat (daun kering, serbuk gergaji) untuk mencegah bau busuk.',
      ],
      upcyclingIdeas: [
        'Pupuk organik cair (POC) kaya kalium untuk merangsang bunga dan buah tanaman',
        'Pakan alternatif untuk budidaya maggot BSF (Black Soldier Fly)',
        'Bahan kompos padat subur untuk media tanam sayuran pekarangan',
      ],
      environmentalImpact:
        'Jika dibuang ke TPA campur plastik, sampah organik membusuk secara anaerob dan menghasilkan gas metana (CH4) yang berpotensi memicu ledakan TPA dan pemanasan global 25x lebih kuat dari CO2.',
      bankSampahValue: 'Dapat diolah sendiri jadi pupuk bernilai hemat ratusan ribu rupiah / bulan',
      ecoTips:
        'Buatlah lubang resapan biopori di halaman rumah untuk menyerap air hujan sekaligus mengolah sampah dapur secara mandiri.',
    },
  },
  {
    id: 'sample-kaleng-minuman',
    name: 'Kaleng Minuman Bersoda Aluminium',
    categoryName: 'Anorganik - Logam',
    tag: 'Nilai Tinggi',
    icon: 'Package',
    imageSvg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300" fill="none"><rect width="300" height="300" rx="16" fill="%23f8fafc"/><path d="M110 70h80v160c0 10-8 18-18 18h-44c-10 0-18-8-18-18V70z" fill="%23e2e8f0" stroke="%2364748b" stroke-width="4"/><ellipse cx="150" cy="70" rx="40" ry="15" fill="%23cbd5e1" stroke="%2364748b" stroke-width="3"/><path d="M142 66h16v6h-16z" fill="%23475569"/><rect x="110" y="110" width="80" height="80" fill="%23ef4444"/><text x="150" y="155" fill="white" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle">SODA</text></svg>',
    data: {
      id: 'sample-3',
      timestamp: Date.now() - 1000 * 60 * 120,
      itemName: 'Kaleng Minuman Aluminium Bersoda',
      category: 'logam',
      categoryLabel: 'Anorganik - Logam & Aluminium',
      binColor: 'Kuning',
      binLabel: 'Tempat Sampah Kuning (Logam & Kaleng Daur Ulang)',
      material: 'Aluminium Paduan Daur Ulang Tinggi (Alloy 3004)',
      confidence: 98,
      decompositionTime: '80 - 200 tahun',
      recyclable: true,
      disposalSteps: [
        'Bilas kaleng dengan air mengalir untuk menghilangkan sisa sirup atau soda manis.',
        'Biarkan tiris dan kering agar tidak mengundang semut.',
        'Pipihkan atau injak kaleng dengan kaki agar volumenya berkurang hingga 80%.',
        'Jangan buang cincin penarik kaleng (tab can) secara terpisah; biarkan terpasang atau kumpulkan bersama.',
        'Kumpulkan di tempat sampah anorganik logam atau tabung di Bank Sampah.',
      ],
      upcyclingIdeas: [
        'Wadah pensil atau tempat sendok estetik dengan balutan tali rami',
        'Lilin darurat aromaterapi',
        'Hiasan lonceng angin (wind chime) luar ruangan',
      ],
      environmentalImpact:
        'Aluminium dapat didaur ulang tanpa batas tanpa kehilangan kualitas. Mendaur ulang 1 kaleng aluminium menghemat 95% energi dibanding menambang bijih bauksit baru!',
      bankSampahValue: 'Rp 12.000 - Rp 16.000 / kg (salah satu sampah paling bernilai tinggi)',
      ecoTips:
        'Pilihlah minuman dalam kaleng dibanding botol plastik sekali pakai jika memungkinkan, karena rasio daur ulang aluminium di Indonesia mencapai lebih dari 90%.',
    },
  },
  {
    id: 'sample-kardus-paket',
    name: 'Kardus Karton Paket Belanja',
    categoryName: 'Anorganik - Kertas',
    tag: 'Daur Ulang',
    icon: 'Box',
    imageSvg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300" fill="none"><rect width="300" height="300" rx="16" fill="%23eff6ff"/><path d="M80 110l70-35 70 35v110l-70 35-70-35V110z" fill="%23d97706" stroke="%2392400e" stroke-width="4"/><path d="M150 75v180" stroke="%2392400e" stroke-width="3"/><path d="M80 110l70 35 70-35" stroke="%2392400e" stroke-width="3"/><path d="M120 180h60v25h-60z" fill="%23fef3c7"/><text x="150" y="197" fill="%2392400e" font-size="10" font-family="sans-serif" font-weight="bold" text-anchor="middle">CORRUGATED</text></svg>',
    data: {
      id: 'sample-4',
      timestamp: Date.now() - 1000 * 60 * 200,
      itemName: 'Kardus Karton Bergelombang (Corrugated Cardboard)',
      category: 'kertas',
      categoryLabel: 'Anorganik - Kertas & Karton',
      binColor: 'Biru',
      binLabel: 'Tempat Sampah Biru (Kertas & Karton)',
      material: 'Serat Selulosa Kertas Daur Ulang Kraft',
      confidence: 99,
      decompositionTime: '2 - 5 bulan (jika kering dan tidak terlaminasi)',
      recyclable: true,
      disposalSteps: [
        'Kupas seluruh lakban plastik, stiker pengiriman, dan bubble wrap yang menempel.',
        'Pastikan kardus dalam kondisi bersih dan bebas dari tumpahan minyak makanan.',
        'Buka lipatan kardus dan ratakan hingga benar-benar pipih.',
        'Ikat dengan tali atau susun rapi di tempat yang kering dan terlindung dari air hujan.',
        'Masukkan ke tempat sampah biru atau setor ke Bank Sampah.',
      ],
      upcyclingIdeas: [
        'Wadah organizer laci dan sekat penyimpanan lemari',
        'Alas mulsa penahan gulma di kebun tanaman pekarangan',
        'Rumah bermain kucing atau kerajinan tangan edukasi anak',
      ],
      environmentalImpact:
        'Kardus basah yang terkena minyak tidak bisa didaur ulang dan akan membusuk di TPA. Menjaga kardus tetap kering menyelamatkan pohon dan menghemat ribuan liter air dalam proses pembuatan kertas baru.',
      bankSampahValue: 'Rp 1.500 - Rp 2.500 / kg di Bank Sampah',
      ecoTips:
        'Simpan beberapa kardus yang masih kokoh untuk keperluan pindahan atau kirim paket kembali sebelum memutuskan untuk dibuang.',
    },
  },
  {
    id: 'sample-baterai-bekas',
    name: 'Baterai Bekas AA / Gadget (B3)',
    categoryName: 'B3 - Berbahaya',
    tag: 'Khusus / Bahaya',
    icon: 'Battery',
    imageSvg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300" fill="none"><rect width="300" height="300" rx="16" fill="%23fef2f2"/><rect x="110" y="80" width="80" height="150" rx="8" fill="%231e293b" stroke="%23dc2626" stroke-width="4"/><rect x="135" y="60" width="30" height="20" rx="4" fill="%2394a3b8"/><path d="M150 110v40M130 130h40" stroke="%23f87171" stroke-width="4" stroke-linecap="round"/><circle cx="150" cy="190" r="14" fill="%23dc2626"/><text x="150" y="195" fill="white" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">!</text></svg>',
    data: {
      id: 'sample-5',
      timestamp: Date.now() - 1000 * 60 * 300,
      itemName: 'Baterai Kering Bekas (Limbah B3 Rumah Tangga)',
      category: 'b3',
      categoryLabel: 'Limbah B3 (Bahan Berbahaya & Beracun)',
      binColor: 'Merah',
      binLabel: 'Tempat Sampah Merah (Limbah B3)',
      material: 'Logam Berat (Kadmium, Seng, Karbon, Mangan Dioksida)',
      confidence: 98,
      decompositionTime: '100 tahun (logam beratnya tidak pernah hilang)',
      recyclable: false,
      disposalSteps: [
        'JANGAN PERNAH membakar atau membongkar fisik baterai bekas.',
        'Tutup kedua kutub positif dan negatif baterai dengan selotip/lakban bening untuk mencegah korsleting dan percikan api.',
        'Simpan sementara di wadah kering tertutup (misal toples kaca/plastik) jauh dari jangkauan anak-anak.',
        'JANGAN buang ke tempat sampah umum atau saluran air.',
        'Antarkan ke drop-box E-Waste Dinas Lingkungan Hidup, halte TransJakarta berstasiun e-waste, atau toko elektronik besar.',
      ],
      upcyclingIdeas: [
        'Tidak untuk di-upcycle mandiri di rumah karena mengandung zat korosif dan beracun!',
        'Hanya boleh diolah oleh fasilitas pengolah limbah B3 berizin resmi',
      ],
      environmentalImpact:
        'Satu baterai kecil mengandung merkuri dan timbal yang mampu mencemari hingga 600.000 liter air tanah. Merusak sistem saraf manusia, ginjal, dan memicu kanker bila mencemari sumber sumur minum.',
      bankSampahValue: 'Gratis setor di titik E-waste resmi DLH (tidak untuk dijual ke pemulung tradisional)',
      ecoTips:
        'Beralihlah menggunakan baterai isi ulang (rechargeable battery) yang dapat digunakan kembali hingga 1.000 kali pengisian daya.',
    },
  },
];
