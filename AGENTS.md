# AGENTS.md

PilahSampah AI — Indonesian camera-based waste scanner ("kamera pintar" for Bank Sampah / SNI 19-3983-1995 bin colors).
Single package: React 19 + Vite 8 + Tailwind v4 frontend, Express 4 backend calling the Gemini API.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | `tsx server.ts` → Express **plus** Vite in middleware mode, SPA + API on one port (3000, override with `PORT`). |
| `npm run lint` | `tsc --noEmit`. **This is the only automated check in the repo** — there is no test runner, no ESLint, no CI. |
| `npm run build` | `vite build` → `dist/`. |
| `npm run build:server` | `esbuild server.ts` → `dist-server/server.js` (ESM, deps stay external). Used by the Docker image. |
| `NODE_ENV=production npm start` | Serves `dist/` (static + SPA fallback) **and** the API. Requires `npm run build` first. |
| `npm run preview` | `vite preview` only — static assets, **no `/api` routes**. Use the Express server to test the API. |
| `npm run clean` | `rm -rf dist server.js` — POSIX shell only; fails on Windows `cmd`. Delete `dist/` manually instead. |

- Port 3000 must be free. A stale server yields `EADDRINUSE` and the new process dies.
- `npm run dev` and `npm start` are the same command; only `NODE_ENV` differs.

## Deploy (Cloud Run)

- `Dockerfile` — 2 stages (`builder` → `runner`, `node:22-alpine`). The runner installs **production deps only**
  (`npm ci --omit=dev`; build tooling lives in `devDependencies`), serves `dist/` + `dist-server/server.js`,
  runs as `USER node` and starts with `node dist-server/server.js` (PID 1 → SIGTERM from Cloud Run works).
- `server.ts` resolves the frontend `dist/` by looking for `index.html` in `<parent>/dist` then `<sibling>/dist`,
  because `__dirname` differs between `dist-server/server.js` (container) and `tsx server.ts` (local).
- `deploy/cloudrun-deploy.sh` — service `camera-waste-scanner`, region `asia-southeast2`. Flow: enable APIs →
  read `GEMINI_API_KEY` from env or `.env` (robust: handles `export `, quotes, CRLF) → write env vars to a temp
  YAML (`--env-vars-file`, so the key stays out of the command line) → `gcloud run deploy --source .` →
  verify `/api/health` (`hasApiKey` / `geminiConnected` / `modelAvailable`) and exit non-zero if the key isn't read.
  **Tidak memakai Secret Manager** — key disuntik sebagai environment variable biasa.
- `.gcloudignore` — context upload untuk `gcloud run deploy --source .` (gcloud memakai `.gcloudignore`, bukan
  `.dockerignore`; **Dockerfile tidak boleh di-exclude**). `.env` tidak pernah ter-upload ke image.
- `GEMINI_API_KEY` hanya ada di `.env` (gitignored) dan di config service Cloud Run — catatan: sebagai env var
  biasa, key tersimpan plaintext di spec service dan terbaca oleh siapa pun yang punya `run.services.get`.
  Kalau butuh Isolasi, ganti `--env-vars-file` dengan `--set-secrets GEMINI_API_KEY=gemini-api-key:latest`.
- Cloud Run serves HTTPS by default → `getUserMedia` (camera capture) works. Request body limit is 25MB < Cloud Run's 32MB.



## Wiring (don't split it)

`server.ts` is the only server and owns **both** the API and the frontend:

- dev → Vite `createViteDevServer({ middlewareMode: true, appType: 'spa' })` mounted as Express middleware
- `NODE_ENV=production` → `express.static(dist)` + `app.get('*')` → `dist/index.html`

The client calls `/api/classify-waste` with a **relative** URL, so there is no CORS config and no separate API host.
Frontend entry: `index.html` → `src/main.tsx` → `src/App.tsx` (router shell).

## Routes

`react-router-dom` v7 (`BrowserRouter`) lives in `src/App.tsx`; the pages are in `src/pages/`.

| Route | Component | Notes |
| --- | --- | --- |
| `/` | `src/pages/Home.tsx` | DURIAT landing page (brand: green `#3b7141` / orange `#f16622`). CTAs to `/scanner`. |
| `/scanner` | `src/pages/Scanner.tsx` | The PilahSampah AI app — tab state + localStorage history live here. |
| `*` | — | Redirects to `/`. |

- Each page sets its own `document.title` in a `useEffect`.
- Deep links work in both modes (Vite SPA fallback in dev, `app.get('*')` in production).
- The scanner page's other sections (Kamus/Bank Sampah/Kuis/Riwayat) are **tabs inside `/scanner`**, not routes.
- Add a new page → create it in `src/pages/`, register the `<Route>` in `src/App.tsx`.

## Gemini contract — three files must change together

`POST /api/classify-waste` body: `{ imageBase64, mimeType }`. The server strips a `data:image/...;base64,` prefix.
Model `gemini-3.8-flash`, `responseMimeType: 'application/json'` + a `responseSchema` with `Type` enums.
`express.json` limit is **25mb** (browser sends `canvas.toDataURL('image/jpeg', 0.88)` at up to 1280×720).

When changing the payload shape, edit all three:
1. `server.ts` → `responseSchema` (field names + `enum` lists)
2. `src/types/waste.ts` → `WasteClassification`
3. the consumers in `src/components/*`

Fixed vocabularies (Indonesian, do not translate): `category` = `organik|plastik|kertas|logam|kaca|b3|residu`;
`binColor` = `Hijau|Kuning|Biru|Merah|Abu-abu`.

## The silent-fallback trap (most important gotcha)

- No `GEMINI_API_KEY`, or the Gemini call throws → the server does **not** error. It returns one of 3 hardcoded results
  picked by `cleanBase64.length % 3`, i.e. **unrelated to the uploaded image**.
- The client also falls back to `SAMPLE_WASTE_ITEMS[0]` on any non-2xx or network error.
- Consequence: "the scan returned data" proves nothing. Verify with `GET /api/health` → `hasApiKey`, and look for
  `Gemini API temporary spike/unavailable` in the server log.
- `.env` is gitignored: copy `.env.example` → `.env` and set a real `GEMINI_API_KEY`.
  `APP_URL` is listed in `.env.example` but is **not referenced anywhere in the code**.

## Content & language

- All user-facing copy is Indonesian. Write new UI strings in Indonesian and keep the domain terms
  (Tempat Sampah Hijau/Kuning/Biru/Merah/Abu-abu, Bank Sampah, kompos, daur ulang, B3).
- Content lives in `src/data/` (`wasteGuide.ts` → `BIN_COLOR_STANDARDS` + `WASTE_ENCYCLOPEDIA`,
  `sampleItems.ts` → `SAMPLE_WASTE_ITEMS`, `quizData.ts` → `QUIZ_QUESTIONS`) plus inline arrays in
  `src/components/BankSampahGuide.tsx`.
- Sample thumbnails are **inline SVG data URIs** (`imageSvg` field in `sampleItems.ts`), not image files.

## Frontend conventions

- Tailwind v4, CSS-first: **no `tailwind.config.js`**; the entry is `@import "tailwindcss"` in `src/index.css`.
  Brand tokens are declared in the `@theme` block there (`--color-duriat-green-50…950`,
  `--color-duriat-orange-50…950`, the flat aliases `--color-duriat-light|dark`, `--font-inter`) —
  don't reintroduce a JS config file.
  The whole site uses **Inter** (`font-inter`); Plus Jakarta Sans was removed.
- **Theme rule (the whole site shares one palette — the DURIAT landing page):**
  - `duriat-green-*` = brand identity: logo badge, icons, headings, active/selected states, surfaces.
    `duriat-green-600` (#3b7141) is the base, `duriat-green-950` (#0e1f11) the darkest shade.
  - `duriat-orange-*` = **primary actions only**: shutter button, "Coba Kamera Lagi", "Mulai Kuis",
    "Coba Lagi", "Pindai Sampah Lain", and the landing page's hero CTAs. `duriat-orange-500` (#f16622) is the base.
  - `gray-*` = neutral text/borders/inputs. Stock `emerald-*`/`slate-*` are **gone** — never reintroduce them.
  - Dark mode: **surfaces and borders** use the `duriat-green` scale (canvas `950`, cards `900`,
    nested surfaces `800`), **text stays neutral** `gray-*`. Header/footer are dark-green bands.
  - Page canvas: `bg-duriat-green-50` (light) / `dark:bg-duriat-green-950`; cards are `bg-white` /
    `dark:bg-duriat-green-900`; nested panels `bg-gray-50` / `dark:bg-duriat-green-800`.
  - Semantic bin colors stay stock palettes (amber = Kuning, blue = Biru, rose = Merah, gray = Abu-abu).
- Bin-color → Tailwind class mapping uses **literal class strings** (`getBinVisual` in `WasteResultCard.tsx`,
  `badgeBg`/`accentBorder` fields in `wasteGuide.ts`). Never assemble class names at runtime — Tailwind won't see them.
- `dark:` variants are present throughout; Tailwind v4's default dark strategy is `prefers-color-scheme`.
  Note: the landing page is light-only by design.
- Icons come from `lucide-react`. `motion` (framer-motion) and `autoprefixer` are installed but **unused** — don't
  assume they work; import from `motion/react` explicitly if you add them.
- Static assets served at the root path live in `public/` (e.g. `public/duriat.png` → `/duriat.png`).
  The landing page's `hero-bg`/`card-gradient` classes are custom CSS in `src/index.css` (`@layer components`).
- Alias `@` → repo **root** (not `src/`) in `vite.config.ts` and `tsconfig.json` paths: `@/src/App.tsx`.
  Existing code uses relative imports — stay consistent rather than mixing.
- `allowImportingTsExtensions: true` + `noEmit: true`, so imports may keep the `.tsx` extension (see `src/main.tsx`).
  `isolatedModules: true` → re-export types with `export type`.
- Scan history persists in `localStorage` under `pilah_sampah_scan_history_v1`, pre-seeded with 2 sample entries on
  first load. Clear that key to test the empty state.
- `vite.config.ts` honours `DISABLE_HMR=true` (AI Studio): HMR and file watching are turned off. Don't remove it.

## Not part of the app (don't "fix" or build these)

- `chatAI.html` is a standalone static prototype of the older "DURIAT" brand (Tailwind CDN, plain JS).
  It is not imported by Vite, not built into `dist/`, and not served by `server.ts`.
  It references a missing `image_bf235b.png` (it has an `onerror` placeholder).
- Root images `organik.png`, `Mask group.png`, `Rectangle 29.png`, `Rectangle 9.png` are unreferenced leftovers.
- `metadata.json` is a Google AI Studio app manifest (camera permission, server-side Gemini capability).
  It is not consumed by the build.

## Benign startup noise (do not "fix")

`npm run dev` prints: a dotenv v17 banner, `API key should be set when using the Gemini API.` **twice**
(the SDK logs it twice per constructor — it is not a double server start), and a Vite warning that
`__dirname` in `vite.config.ts` is unsupported by the native config loader.

## Other constraints

- Express **4**: `app.get('*')` is correct here; don't use Express 5 `'/*splat'` patterns without upgrading.
- Camera capture (`getUserMedia`) needs a secure context — `localhost` or HTTPS.
- `package.json` is still named `react-example`. There is no README, Dockerfile, or deploy config in the repo;
  `.env.example` implies the AI Studio / Cloud Run flow where `GEMINI_API_KEY` and `APP_URL` are injected at runtime.
