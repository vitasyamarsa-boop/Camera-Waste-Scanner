#!/usr/bin/env bash
# Deploy PilahSampah AI ke Google Cloud Run.
#
# Pakai:
#   bash deploy/cloudrun-deploy.sh
#
# Perintah deploy intinya sama dengan:
#   gcloud run deploy camera-waste-scanner --source . --region asia-southeast2 --allow-unauthenticated \
#     --env-vars-file=<file env sementara>
#
# GEMINI_API_KEY diambil dari file .env di root repo (atau env var) lalu dikirim
# sebagai environment variable ke service Cloud Run. TIDAK memakai Secret Manager.
#
# Env var yang dihormati (opsional):
#   PROJECT_ID    - default: project gcloud aktif
#   REGION        - default: asia-southeast2
#   SERVICE       - default: camera-waste-scanner
#   GEMINI_MODEL  - default: gemini-3.8-flash
#   GEMINI_API_KEY- default: dibaca dari file .env di root repo kalau ada
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-$(gcloud config get-value project 2>/dev/null || true)}"
REGION="${REGION:-asia-southeast2}"
SERVICE="${SERVICE:-camera-waste-scanner}"
GEMINI_MODEL="${GEMINI_MODEL:-gemini-3.8-flash}"

if [ -z "${PROJECT_ID}" ] || [ "${PROJECT_ID}" = "(unset)" ]; then
  echo "PROJECT_ID belum diset. Jalankan: gcloud config set project <PROJECT_ID>" >&2
  exit 1
fi

# ---------------------------------------------------------------------------
# 0. API yang dibutuhkan
# ---------------------------------------------------------------------------
echo "==> Mengaktifkan API Google Cloud"
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  iam.googleapis.com \
  --project="${PROJECT_ID}" >/dev/null

# ---------------------------------------------------------------------------
# 1. Ambil API key dari .env (atau env var)
# ---------------------------------------------------------------------------
# Buang: prefix "export ", tanda kutip, spasi, dan CR (file .env dari Windows
# sering pakai CRLF dan sisa \r membuat key ditolak Gemini).
read_gemini_key_from_dotenv() {
  [ -f .env ] || return 1
  grep -E '^[[:space:]]*(export[[:space:]]+)?GEMINI_API_KEY[[:space:]]*=' .env \
    | head -n1 \
    | sed -E 's/^[[:space:]]*(export[[:space:]]+)?GEMINI_API_KEY[[:space:]]*=[[:space:]]*//' \
    | tr -d '\r\n"'"'"'[:space:]'
}

if [ -z "${GEMINI_API_KEY:-}" ]; then
  GEMINI_API_KEY="$(read_gemini_key_from_dotenv || true)"
fi

if [ -z "${GEMINI_API_KEY:-}" ]; then
  echo "GEMINI_API_KEY belum tersedia." >&2
  echo "  isi file .env di root repo (GEMINI_API_KEY=\"...\") atau set env var GEMINI_API_KEY." >&2
  exit 1
fi
if [ "${#GEMINI_API_KEY}" -lt 20 ]; then
  echo "GEMINI_API_KEY terlalu pendek (${#GEMINI_API_KEY} karakter) — periksa file .env." >&2
  exit 1
fi
echo "==> API key dari .env: ${#GEMINI_API_KEY} karakter (nilai tidak ditampilkan)"

# ---------------------------------------------------------------------------
# 2. Tulis env var service ke file sementara (key tidak muncul di command line)
# ---------------------------------------------------------------------------
ENV_FILE="$(mktemp -t gcloud-env-XXXXXX.yaml)"
cleanup() { rm -f "${ENV_FILE}"; }
trap cleanup EXIT
chmod 600 "${ENV_FILE}" 2>/dev/null || true

# YAML single-quoted: hanya perlu melingkar kutip ' di dalam nilai.
yaml_escape() { printf '%s' "$1" | sed "s/'/''/g"; }
{
  printf "GEMINI_API_KEY: '%s'\n" "$(yaml_escape "${GEMINI_API_KEY}")"
  printf "GEMINI_MODEL: '%s'\n" "$(yaml_escape "${GEMINI_MODEL}")"
  printf "NODE_ENV: 'production'\n"
} > "${ENV_FILE}"

echo "==> Env var untuk service:"
sed -E "s/(GEMINI_API_KEY: ').*(')/\1***\2/" "${ENV_FILE}" | sed 's/^/    /'

# ---------------------------------------------------------------------------
# 3. Deploy (Cloud Build + Cloud Run, satu perintah)
# ---------------------------------------------------------------------------
echo "==> Deploy ke Cloud Run (source: .)"
gcloud run deploy "${SERVICE}" \
  --source . \
  --region "${REGION}" \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --cpu 1 \
  --memory 1Gi \
  --concurrency 40 \
  --timeout 120 \
  --min-instances 0 \
  --max-instances 10 \
  --env-vars-file="${ENV_FILE}" \
  --startup-probe "httpGet.path=/,httpGet.port=8080,periodSeconds=5,timeoutSeconds=3,failureThreshold=12"

# ---------------------------------------------------------------------------
# 4. Verifikasi: key benar-benar terbaca di dalam container
# ---------------------------------------------------------------------------
URL="$(gcloud run services describe "${SERVICE}" --region="${REGION}" --format='value(status.url)')"
echo "==> URL    : ${URL}"
echo "==> Health : ${URL}/api/health"

echo "==> Env var pada revision aktif"
gcloud run services describe "${SERVICE}" --region="${REGION}" \
  --format='value(spec.template.spec.containers[0].env)' \
  | sed -E "s/(GEMINI_API_KEY[^A-Za-z0-9_]*)[^ ]*/\1***/g" \
  | sed 's/^/    /'
echo "    revision: $(gcloud run services describe "${SERVICE}" --region="${REGION}" --format='value(status.latestReadyRevisionName)')"

HEALTH=""
for _ in $(seq 1 12); do
  HEALTH="$(curl -sS --max-time 20 "${URL}/api/health" 2>/dev/null || true)"
  if echo "${HEALTH}" | grep -q '"hasApiKey":true'; then
    break
  fi
  echo "    menunggu container siap..."
  sleep 5
done
echo "==> ${HEALTH}"

if ! echo "${HEALTH}" | grep -q '"hasApiKey":true'; then
  echo "GAGAL: GEMINI_API_KEY tidak terbaca oleh server." >&2
  echo "  cek: 1) env var ter-attach di revision? (gcloud run services describe --format='value(spec.template.spec.containers[0].env)')" >&2
  echo "        2) isi file .env benar? (harus tanpa tanda kutip di dalam file)" >&2
  exit 1
fi
if ! echo "${HEALTH}" | grep -q '"geminiConnected":true'; then
  echo "GAGAL: key terbaca tapi Gemini menolak (lihat geminiError di atas)." >&2
  echo "  penyebab umum: key dari project tanpa 'Generative Language API' aktif, atau key tidak valid." >&2
  exit 1
fi
if ! echo "${HEALTH}" | grep -q '"modelAvailable":true'; then
  echo "WARNING: model '${GEMINI_MODEL}' tidak ada di daftar model key ini." >&2
  echo "         lihat availableModels di /api/health, lalu set GEMINI_MODEL accordingly." >&2
  exit 1
fi

echo "OK: key terbaca dan Gemini terhubung. Buka ${URL} di browser (kamera butuh HTTPS)."
