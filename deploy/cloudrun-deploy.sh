#!/usr/bin/env bash
# Deploy PilahSampah AI ke Google Cloud Run.
#
# Pakai:
#   bash deploy/cloudrun-deploy.sh
#
# Env var yang respected (opsional):
#   PROJECT_ID   - default: project gcloud aktif
#   REGION       - default: asia-southeast2
#   SERVICE      - default: pilahsampah
#   REPO         - default: pilahsampah (Artifact Registry)
#   SECRET_NAME  - default: gemini-api-key
#   GEMINI_MODEL - default: gemini-3.8-flash
#   GEMINI_API_KEY - default: dibaca dari file .env kalau ada
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-$(gcloud config get-value project 2>/dev/null || true)}"
REGION="${REGION:-asia-southeast2}"
SERVICE="${SERVICE:-pilahsampah}"
REPO="${REPO:-pilahsampah}"
SECRET_NAME="${SECRET_NAME:-gemini-api-key}"
GEMINI_MODEL="${GEMINI_MODEL:-gemini-3.8-flash}"
IMAGE="${IMAGE:-${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/${SERVICE}:$(date +%Y%m%d-%H%M%S)}"

if [ -z "${PROJECT_ID}" ] || [ "${PROJECT_ID}" = "(unset)" ]; then
  echo "PROJECT_ID belum diset. Jalankan: gcloud config set project <PROJECT_ID>" >&2
  exit 1
fi

# API key: env var, kalau kosong ambil dari .env di root repo.
if [ -z "${GEMINI_API_KEY:-}" ] && [ -f .env ]; then
  GEMINI_API_KEY="$(grep -E '^GEMINI_API_KEY=' .env | head -n1 | cut -d= -f2- | tr -d '"'"'"' ')"
fi
if [ -z "${GEMINI_API_KEY:-}" ]; then
  echo "GEMINI_API_KEY belum tersedia. Set env var-nya atau isi file .env di root repo." >&2
  exit 1
fi

echo "==> Project : ${PROJECT_ID}"
echo "==> Region  : ${REGION}"
echo "==> Service : ${SERVICE}"
echo "==> Image   : ${IMAGE}"

echo "==> Mengaktifkan API yang diperlukan"
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  iam.googleapis.com

echo "==> Menyiapkan Artifact Registry '${REPO}'"
if ! gcloud artifacts repositories describe "${REPO}" --location="${REGION}" >/dev/null 2>&1; then
  gcloud artifacts repositories create "${REPO}" \
    --repository-format=docker \
    --location="${REGION}" \
    --description="Image PilahSampah AI"
fi

echo "==> Menyimpan API key ke Secret Manager '${SECRET_NAME}'"
if ! gcloud secrets describe "${SECRET_NAME}" >/dev/null 2>&1; then
  gcloud secrets create "${SECRET_NAME}" --replication-policy=automatic
fi
printf '%s' "${GEMINI_API_KEY}" | gcloud secrets versions add "${SECRET_NAME}" --data-file=-

# Verifikasi isi secret benar-benar tersimpan (cetak panjangnya saja, jangan nilai key).
SECRET_LEN="$(gcloud secrets versions access latest --secret="${SECRET_NAME}" 2>/dev/null | wc -c | tr -d ' ')"
echo "    panjang payload secret: ${SECRET_LEN} byte"
if [ "${SECRET_LEN}" -lt 10 ]; then
  echo "Secret '${SECRET_NAME}' kosong/terlalu pendek. Periksa parsing file .env." >&2
  exit 1
fi

echo "==> Memberi service account akses ke secret"
SERVICE_ACCOUNT="${SERVICE_ACCOUNT:-${PROJECT_ID}-compute@developer.gstatic.com}"
if gcloud iam service-accounts describe "${SERVICE_ACCOUNT}" >/dev/null 2>&1; then
  gcloud iam service-accounts add-iam-policy-binding "${SERVICE_ACCOUNT}" \
    --role roles/secretmanager.secretAccessor \
    --member "serviceAccount:${SERVICE_ACCOUNT}" >/dev/null
else
  echo "    service account ${SERVICE_ACCOUNT} tidak ada, memakai default Cloud Run."
  SERVICE_ACCOUNT=""
fi

echo "==> Build image (Cloud Build)"
gcloud builds submit --tag "${IMAGE}" .

echo "==> Deploy ke Cloud Run"
DEPLOY_ARGS=(
  --image "${IMAGE}"
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
gcloud run deploy "${SERVICE}" "${DEPLOY_ARGS[@]}"

URL="$(gcloud run services describe "${SERVICE}" --region "${REGION}" --format='value(status.url)')"
echo "==> URL   : ${URL}"
echo "==> Health: ${URL}/api/health"

echo "==> Verifikasi env var di revision aktif"
gcloud run services describe "${SERVICE}" --region "${REGION}" \
  --format='value(spec.template.spec.containers[0].env)'
echo "    revision aktif: $(gcloud run services describe "${SERVICE}" --region "${REGION}" --format='value(status.latestReadyRevisionName)')"

# Smoke test: pastikan key terbaca di dalam container, bukan cuma tersimpan di secret.
sleep 5
HEALTH="$(curl -sS "${URL}/api/health")"
echo "${HEALTH}"
if ! echo "${HEALTH}" | grep -q '"hasApiKey":true'; then
  echo "GEMINI_API_KEY tidak terbaca oleh server." >&2
  echo "  cek: 1) env var ter-attach di revision? 2) SA punya roles/secretmanager.secretAccessor?" >&2
  echo "        3) payload secret berisi key yang benar (tanpa tanda kutip)?" >&2
  exit 1
fi
if ! echo "${HEALTH}" | grep -q '"geminiConnected":true'; then
  echo "WARNING: key terbaca tapi Gemini menolak (lihat geminiError di atas)." >&2
  echo "         Penyebab umum: key dari project tanpa 'Generative Language API' aktif, atau key tidak valid." >&2
  exit 1
fi
echo "Selesai. Buka ${URL} di browser ( kamera butuh HTTPS — Cloud Run sudah menyediakan)."
