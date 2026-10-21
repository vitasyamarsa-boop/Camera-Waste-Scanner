import { QuizQuestion } from '../types/waste';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-1',
    question: 'Di Indonesia, tempat sampah warna apakah yang diperuntukkan bagi sampah anorganik seperti botol plastik dan kaleng?',
    options: ['Hijau', 'Kuning', 'Biru', 'Merah'],
    correctIndex: 1,
    explanation: 'Tempat sampah Kuning diperuntukkan bagi anorganik daur ulang (seperti botol plastik, kaleng aluminium). Tempat sampah Hijau untuk organik, Biru untuk kertas, dan Merah untuk limbah B3.',
    categoryHint: 'Warna Tempat Sampah Nasional',
  },
  {
    id: 'q-2',
    question: 'Sebelum menyetor botol plastik bekas air mineral ke Bank Sampah, langkah pembersihan apa yang paling tepat?',
    options: [
      'Langsung dimasukkan bersama sisa air minumnya',
      'Dibakar sedikit ujungnya agar steril',
      'Kosongkan, bilas dengan air, lepaskan tutup dan labelnya, lalu remas hingga pipih',
      'Dipotong-potong kecil menggunakan gunting dapur',
    ],
    correctIndex: 2,
    explanation: 'Mengosongkan cairan, membilas, memisahkan tutup (HDPE) dan label plastik, serta memipihkannya akan menghemat volume ruang hingga 70% dan meningkatkan nilai jual di Bank Sampah.',
    categoryHint: 'Penanganan Sampah Plastik',
  },
  {
    id: 'q-3',
    question: 'Baterai bekas remote atau gadget termasuk dalam kategori sampah apa?',
    options: [
      'Organik karena cepat terurai di tanah',
      'Anorganik biasa yang boleh dicampur plastik',
      'Limbah B3 (Bahan Berbahaya dan Beracun)',
      'Residu biasa yang boleh dibakar di pekarangan',
    ],
    correctIndex: 2,
    explanation: 'Baterai mengandung logam berat seperti merkuri, kadmium, dan seng. Baterai adalah limbah B3 yang tidak boleh dibakar atau dibuang ke sungai karena 1 baterai kecil dapat mencemari ribuan liter air tanah.',
    categoryHint: 'Limbah B3 & Bahaya Logam Berat',
  },
  {
    id: 'q-4',
    question: 'Mengapa menumpuknya sampah organik di Tempat Pemrosesan Akhir (TPA) bersama plastik sangat berbahaya bagi lingkungan?',
    options: [
      'Menghasilkan gas metana (CH4) yang mudah meledak dan memicu pemanasan global 25x lebih kuat dari CO2',
      'Membuat TPA terlalu cepat penuh oleh batu',
      'Mengurangi jumlah lalat dan mikroorganisme di tanah',
      'Menyebabkan air tanah menjadi terlalu asam untuk diminum ikan',
    ],
    correctIndex: 0,
    explanation: 'Sampah organik yang terjebak di bawah lapisan plastik mengalami pembusukan anaerobik tanpa oksigen, menghasilkan gas metana yang sangat mudah meledak dan berkontribusi besar pada efek rumah kaca.',
    categoryHint: 'Dampak Lingkungan',
  },
  {
    id: 'q-5',
    question: 'Berapa lama perkiraan waktu yang dibutuhkan oleh satu botol plastik sekali pakai untuk terurai di alam?',
    options: ['5 sampai 10 tahun', '50 tahun', '450 sampai 500 tahun', '1.000.000 tahun'],
    correctIndex: 2,
    explanation: 'Botol plastik berbahan Polyethylene Terephthalate (PET) membutuhkan waktu sekitar 450 - 500 tahun untuk terurai di alam, dan dalam prosesnya hanya terfragmentasi menjadi mikroplastik.',
    categoryHint: 'Waktu Terurai Sampah',
  },
  {
    id: 'q-6',
    question: 'Kardus boks pengiriman paket yang berminyak karena tumpahan kuah makanan harus dibuang ke tempat sampah mana?',
    options: [
      'Tempat Sampah Biru (Kertas Daur Ulang)',
      'Tempat Sampah Hijau (Kompos)',
      'Tempat Sampah Abu-abu (Residu)',
      'Tempat Sampah Merah (Limbah B3)',
    ],
    correctIndex: 2,
    explanation: 'Kertas atau kardus yang sudah terkena noda minyak pekat tidak dapat diproses lagi oleh mesin daur ulang bubur kertas (pulping) sehingga harus dimasukkan ke wadah Residu.',
    categoryHint: 'Pemilahan Kertas vs Residu',
  },
];
