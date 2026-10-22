#!/usr/bin/env bash
# Deploy PilahSampah AI ke Google Cloud Run.
#
# Pakai:
#   bash deploy/cloudrun-deploy.sh
#
# Perintah deploy intinya sama dengan:
#   gcloud run deploy camera-waste-scanner --source . --region asia-southeast2 --allow-unauthenticated \
#     --set-secrets GEMINI_API_KEY=gemini-api-key:latest \
#     --set-env-vars GEMINI_MODEL=gemini-3.8-flash,NODE_ENV=production
#
# Env var yang dihormati (opsional):
#   PROJECT_ID    - default: project gcloud aktif
#   REGION        - default: asia-southeast2
#   SERVICE       - default: camera-waste-scanner
#   SECRET_NAME   - default: gemini-api-key
#   GEMINI_MODEL  - default: gemini-3.8-flash
#   GEMINI_API_KEY- default: dibaca dari file .env di root repo kalau ada
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-$(gcloud config get-value project 2>/dev/null || true)}"
REGION="${REGION:-asia-southeast2}"
SERVICE="${SERVICE:-camera-waste-scanner}"
SECRET_NAME="${SECRET_NAME:-gemini-api-key}"
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
  secretmanager.googleapis.com \
  iam.googleapis.com \
  --project="${PROJECT_ID}" >/dev/null

# ---------------------------------------------------------------------------
# 1. Ambil API key (env var, atau file .env di root repo)
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
echo "==> API key ditemukan (${#GEMINI_API_KEY} karakter)"

# ---------------------------------------------------------------------------
# 2. Secret Manager: pastikan secret ada dan isinya key yang benar
# ---------------------------------------------------------------------------
echo "==> Menyiapkan Secret Manager '${SECRET_NAME}'"
if ! gcloud secrets describe "${SECRET_NAME}" --project="${PROJECT_ID}" >/dev/null 2>&1; then
  gcloud secrets create "${SECRET_NAME}" \
    --project="${PROJECT_ID}" \
    --replication-policy=automatic
fi

# Simpan key sebagai versi secret baru (tanpa newline di akhir).
printf '%s' "${GEMINI_API_KEY}" | gcloud secrets versions add "${SECRET_NAME}" \
  --project="${PROJECT_ID}" --data-file=-

# Verifikasi payload secret (cetak panjangnya saja, jangan nilai key-nya).
SECRET_LEN="$(gcloud secrets versions access latest --secret="${SECRET_NAME}" --project="${PROJECT_ID}" 2>/dev/null | tr -d '\r\n' | wc -c | tr -d ' ')"
echo "    panjang payload secret 'latest': ${SECRET_LEN} byte"
if [ "${SECRET_LEN}" -lt 10 ]; then
  echo "Secret '${SECRET_NAME}' kosong — periksa isi file .env." >&2
  exit 1
fi

# ---------------------------------------------------------------------------
# 3. Service account: runtime SA wajib punya roles/secretmanager.secretAccessor
#    (tanpa ini Cloud Run tidak bisa menyuntik key ke container)
# ---------------------------------------------------------------------------
echo "==> Menyiapkan service account runtime"
SERVICE_ACCOUNT="${SERVICE_ACCOUNT:-${PROJECT_ID}-compute@developer.gstatic.com}"
if gcloud iam service-accounts describe "${SERVICE_ACCOUNT}" --project="${PROJECT_ID}" >/dev/null 2>&1; then
  if gcloud iam service-accounts add-iam-policy-binding "${SERVICE_ACCOUNT}" \
      --project="${PROJECT_ID}" \
      --role roles/secretmanager.secretAccessor \
      --member "serviceAccount:${SERVICE_ACCOUNT}" >/dev/null 2>&1; then
    echo "    ${SERVICE_ACCOUNT} -> roles/secretmanager.secretAccessor"
  else
    echo "    WARNING: gagal memberi role secretAccessor (deployer mungkin kurang izin IAM)." >&2
    echo "    gcloud biasanya otomatis memberi akses saat --set-secrets dipakai." >&2
  fi
else
  echo "    service account ${SERVICE_ACCOUNT} tidak ada, memakai default Cloud Run." >&2
  SERVICE_ACCOUNT=""
fi

# ---------------------------------------------------------------------------
# 4. Deploy (Cloud Build + Cloud Run, satu perintah)
# ---------------------------------------------------------------------------
echo "==> Deploy ke Cloud Run (source: .)"
DEPLOY_ARGS=(
  --source .
  --region "${REGION}"
  --platform managed
  --allow-unauthenticated
  --port 8080
  --cpu 1
  --memory 1Gi
  --concurrency 40
  --timeout 120
  --min-instances 0
  --max-instances 10
  --set-secrets "GEMINI_API_KEY=${SECRET_NAME}:latest"
  --set-env-vars "GEMINI_MODEL=${GEMINI_MODEL},NODE_ENV=production"
  --startup-probe "httpGet.path=/,httpGet.port=8080,periodSeconds=5,timeoutSeconds=3,failureThreshold=12"
)
if [ -n "${SERVICE_ACCOUNT}" ]; then
  DEPLOY_ARGS+=(--service-account "${SERVICE_ACCOUNT}")
fi

echo "    gcloud run deploy ${SERVICE} ${DEPLOY_ARGS[*]}"
gcloud run deploy "${SERVICE}" "${DEPLOY_ARGS[@]}"

# ---------------------------------------------------------------------------
# 5. Verifikasi: key benar-benar terbaca di dalam container
# ---------------------------------------------------------------------------
URL="$(gcloud run services describe "${SERVICE}" --region "${REGION}" --format='value(status.url)')"
echo "==> URL    : ${URL}"
echo "==> Health : ${URL}/api/health"

echo "==> Env var pada revision aktif"
gcloud run services describe "${SERVICE}" --region="${REGION}" \
  --format='value(spec.template.spec.containers[0].env)'
echo "    revision: $(gcloud run services describe "${SERVICE}" --region="${REGION}" --format='value(status.latestReadyRevisionName)')"

sleep 5
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
  echo "  cek: 1) env var ter-attach di revision? 2) SA punya roles/secretmanager.secretAccessor?" >&2
  echo "        3) payload secret berisi key yang benar (tanpa tanda kutip)?" >&2
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
