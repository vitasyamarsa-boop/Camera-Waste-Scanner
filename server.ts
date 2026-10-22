import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

// Body parser with 25MB limit for high-res captured frames
app.use(express.json({ limit: '25mb' }));

// Gemini SDK Client instance
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
    // Opsional: arahkan ke proxy / endpoint lain (default: endpoint resmi Google).
    ...(process.env.GEMINI_BASE_URL ? { baseUrl: process.env.GEMINI_BASE_URL } : {}),
  },
});

// Model yang dipakai untuk klasifikasi. Bisa dioverride lewat env GEMINI_MODEL.
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

// Terjemahkan error dari Gemini menjadi pesan yang bisa ditindaklanjuti (Bahasa Indonesia).
function describeGeminiError(err: any): string {
  const raw = String(err?.message || err?.status || err || 'Kesalahan tidak diketahui');
  const status = Number(err?.status ?? err?.code ?? err?.error?.code ?? 0);
  const lower = raw.toLowerCase();

  if (status === 401 || lower.includes('api key not valid') || lower.includes('api_key_invalid') || lower.includes('unauthenticated')) {
    return 'API key ditolak oleh Google (401). Nilai GEMINI_API_KEY di file .env tidak valid atau key belum diaktifkan.';
  }
  if (status === 403) {
    return 'Akses ditolak (403). API key mungkin valid, tetapi project-nya belum punya akses ke Gemini API.';
  }
  if (status === 404 || lower.includes('is not found for api version')) {
    return `Model "${GEMINI_MODEL}" tidak tersedia untuk API ini.`;
  }
  if (status === 429 || lower.includes('quota') || lower.includes('resource_exhausted')) {
    return 'Kuota API habis (429). Coba lagi nanti atau periksa kuota project.';
  }
  if (status === 500 || status === 503 || lower.includes('overloaded') || lower.includes('unavailable')) {
    return 'Layanan Gemini sedang sibuk/tidak tersedia (503). Coba lagi sebentar lagi.';
  }
  return raw.slice(0, 300);
}

interface GeminiConnection {
  connected: boolean;
  error: string | null;
  modelAvailable: boolean;
  availableModels: string[];
}

// Cache hasil probe supaya /api/health tidak memanggil Google terlalu sering.
let connectionCache: { checkedAt: number; result: GeminiConnection } | null = null;
const CONNECTION_TTL_MS = 60_000;

async function probeGemini(force = false): Promise<GeminiConnection> {
  if (!force && connectionCache && Date.now() - connectionCache.checkedAt < CONNECTION_TTL_MS) {
    return connectionCache.result;
  }

  let result: GeminiConnection;
  if (!process.env.GEMINI_API_KEY) {
    result = {
      connected: false,
      error: 'GEMINI_API_KEY belum diatur di server (file .env).',
      modelAvailable: false,
      availableModels: [],
    };
  } else {
    try {
      const pager = await ai.models.list();
      const names: string[] = [];
      for await (const model of pager) {
        const name = model.name?.replace(/^models\//, '') ?? '';
        if (name) names.push(name);
      }
      const flashModels = names.filter((n) => n.includes('flash'));
      result = {
        connected: true,
        error: null,
        modelAvailable: names.includes(GEMINI_MODEL),
        availableModels: flashModels.length ? flashModels : names.slice(0, 20),
      };
    } catch (err: any) {
      result = {
        connected: false,
        error: describeGeminiError(err),
        modelAvailable: false,
        availableModels: [],
      };
    }
  }

  connectionCache = { checkedAt: Date.now(), result };
  return result;
}

// Health check endpoint — memverifikasi key HANYA bila ada (bukan sekadar "ada/tidak").
app.get('/api/health', async (_req, res) => {
  const connection = await probeGemini();
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    geminiConnected: connection.connected,
    geminiError: connection.error,
    model: GEMINI_MODEL,
    modelAvailable: connection.modelAvailable,
    availableModels: connection.availableModels,
    timestamp: new Date().toISOString(),
  });
});

// Waste classification endpoint
app.post('/api/classify-waste', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Gambar tidak ditemukan dalam request (imageBase64 diperlukan).' });
    }

    // Clean base64 string if it contains data URI prefix
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');

    // Klasifikasi memakai Gemini API. Bila gagal, kembalikan error yang jelas —
    // JANGAN diam-diam mengembalikan hasil hardcode yang tidak berkaitan dengan gambar.
    if (!process.env.GEMINI_API_KEY) {
      console.error('[classify-waste] GEMINI_API_KEY is not configured.');
      return res.status(503).json({
        error:
          'GEMINI_API_KEY belum diatur di server sehingga AI tidak dapat menganalisis gambar. Salin .env.example menjadi .env, isi GEMINI_API_KEY, lalu jalankan ulang server.',
      });
    }

    try {
        const promptText = `
Anda adalah pakar lingkungan hidup dan kurasi pengelolaan sampah pintar di Indonesia.
Analisis objek sampah atau limbah pada gambar ini secara akurat.
Identifikasi:
1. Nama barang/sampah spesifik (itemName, dalam Bahasa Indonesia, misal: "Botol Plastik Bekas Air Mineral", "Kulit Buah Pisang", "Kaleng Minuman Bersoda", "Kardus Paket Belanja", "Baterai AA Bekas", dsb).
2. Kategori sampah (category) - PILIH SATU dari daftar berikut:
   - "organik" (sisa makanan, dedaunan, kulit buah/sayur, ranting)
   - "plastik" (botol, kantong kresek, wadah makanan plastik)
   - "kertas" (kertas HVS, kardus karton, buku, koran)
   - "logam" (kaleng, tutup botol logam, kawat, besi)
   - "kaca" (botol sirup kaca, toples kaca, cermin pecah)
   - "b3" (baterai, lampu neon, botol kimia/obat, limbah elektronik berbahaya)
   - "residu" (popok, pembalut, puntung rokok, styrofoam kotor berminyak, sachet multilayer)
3. categoryLabel: Label kategori yang jelas dan ramah pembaca (misal: "Organik Mudah Terurai", "Anorganik Plastik Daur Ulang", "Anorganik Kertas/Karton", "Bahan Berbahaya & Beracun (B3)", "Residu TPA").
4. binColor: Warna tempat sampah standar nasional di Indonesia:
   - "Hijau" untuk Organik
   - "Kuning" untuk Plastik / Kaleng Anorganik Daur Ulang
   - "Biru" untuk Kertas / Karton
   - "Merah" untuk B3 (Bahan Berbahaya & Beracun)
   - "Abu-abu" untuk Residu
5. binLabel: Nama label wadah (contoh: "Tempat Sampah Hijau (Organik)", "Tempat Sampah Kuning (Plastik Daur Ulang)").
6. material: Rincian material benda (contoh: "Plastik PET (Polyethylene Terephthalate) #1", "Serat Selulosa Tumbuhan", "Aluminium Murni", "Lithium Ion").
7. confidence: Tingkat keyakinan deteksi (bilangan bulat antara 75 hingga 99).
8. decompositionTime: Estimasi waktu terurai di alam secara ilmiah (contoh: "2 - 4 minggu", "450 tahun", "200 - 500 tahun", "Tidak dapat terurai secara alami").
9. recyclable: Boolean apakah sampah ini dapat didaur ulang secara umum.
10. disposalSteps: Daftar langkah konkret penanganan sebelum dibuang (minimal 4 langkah berurutan, misal: 1. Kosongkan sisa cairan, 2. Bilas hingga bersih, 3. Lepaskan label dan tutup terpisah, 4. Remas untuk menghemat ruang, 5. Masukkan ke wadah pilah).
11. upcyclingIdeas: Ide kreasi daur ulang / upcycling kreatif (minimal 3 ide praktis).
12. environmentalImpact: Penjelasan bahaya atau dampak jika sampah ini dibuang sembarangan ke tanah, selokan, atau dibakar.
13. bankSampahValue: Estimasi nilai jual atau potensi di Bank Sampah Indonesia (misal: "Rp 3.000 - Rp 5.000 per kg", "Dapat disetor menjadi kompos", "Wajib diserahkan ke drop-point e-waste").
14. ecoTips: Tips gaya hidup minim sampah (zero-waste) terkait barang ini.
`;

        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: cleanBase64,
                },
              },
              {
                text: promptText,
              },
            ],
          },
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                itemName: { type: Type.STRING },
                category: {
                  type: Type.STRING,
                  enum: ['organik', 'plastik', 'kertas', 'logam', 'kaca', 'b3', 'residu'],
                },
                categoryLabel: { type: Type.STRING },
                binColor: {
                  type: Type.STRING,
                  enum: ['Hijau', 'Kuning', 'Biru', 'Merah', 'Abu-abu'],
                },
                binLabel: { type: Type.STRING },
                material: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
                decompositionTime: { type: Type.STRING },
                recyclable: { type: Type.BOOLEAN },
                disposalSteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                upcyclingIdeas: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                environmentalImpact: { type: Type.STRING },
                bankSampahValue: { type: Type.STRING },
                ecoTips: { type: Type.STRING },
              },
              required: [
                'itemName',
                'category',
                'categoryLabel',
                'binColor',
                'binLabel',
                'material',
                'confidence',
                'decompositionTime',
                'recyclable',
                'disposalSteps',
                'upcyclingIdeas',
                'environmentalImpact',
                'bankSampahValue',
                'ecoTips',
              ],
            },
          },
        });

        const responseText = response.text;
        if (!responseText) {
          throw new Error('Gemini mengembalikan respons kosong.');
        }
        return res.json(JSON.parse(responseText.trim()));
    } catch (geminiError: any) {
      const reason = describeGeminiError(geminiError);
      console.error(`[classify-waste] Gemini API gagal (${GEMINI_MODEL}): ${reason}`);
      return res.status(502).json({
        error: `Analisis AI gagal: ${reason}`,
        reason,
        model: GEMINI_MODEL,
      });
    }
  } catch (error: any) {
    console.error('[classify-waste] Unhandled exception:', error?.message);
    return res.status(500).json({
      error: `Kesalahan tak terduga saat memproses gambar: ${describeGeminiError(error)}`,
    });
  }
});

// Setup Vite middleware in development or serve static in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteDevServer } = await import('vite');
    const vite = await createViteDevServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    // Lokasi build frontend ('dist/') berbeda tergantung cara server dijalankan:
    //   - bundle di dist-server/server.js -> <parent>/dist  (Docker / Cloud Run)
    //   - tsx server.ts di root repo       -> <sibling>/dist (lokal)
    // Cari folder yang benar-benar berisi index.html supaya produksi tidak 404.
    const distCandidates = [
      path.resolve(__dirname, '..', 'dist'),
      path.resolve(__dirname, 'dist'),
    ];
    const distPath =
      distCandidates.find((dir) => fs.existsSync(path.join(dir, 'index.html'))) ?? distCandidates[0];

    console.log(`Serving frontend statis dari: ${distPath}`);
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PilahSampah AI Server berjalan di port ${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
