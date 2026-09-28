#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# CafeFlow Automated Google Cloud Run Deployment Script
# Target Project: supple-cubist-509809-h4
# Verification Challenge Label: dev-tutorial=cloud-run-ai-challenge
# ==============================================================================

PROJECT_ID="supple-cubist-509809-h4"
REGION="${REGION:-us-central1}"
SERVICE_NAME="cafeflow"

echo "=== 1. Setting active Google Cloud Project to: ${PROJECT_ID} ==="
gcloud config set project "${PROJECT_ID}"

echo "=== 2. Enabling Required Cloud Services ==="
gcloud services enable \
  run.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com

echo "=== 3. Checking Secret Manager (GEMINI_API_KEY) ==="
if ! gcloud secrets describe GEMINI_API_KEY --project="${PROJECT_ID}" &>/dev/null; then
  echo "Secret GEMINI_API_KEY does not exist yet."
  read -rsp "Please enter your Gemini API Key: " USER_KEY
  echo ""
  gcloud secrets create GEMINI_API_KEY \
    --project="${PROJECT_ID}" \
    --replication-policy="automatic"
  echo -n "${USER_KEY}" | gcloud secrets versions add GEMINI_API_KEY \
    --project="${PROJECT_ID}" \
    --data-file=-
  echo "Created secret GEMINI_API_KEY successfully."
else
  echo "Secret GEMINI_API_KEY already exists in project ${PROJECT_ID}."
fi

echo "=== 4. Granting Secret Accessor to Default Cloud Run Service Account ==="
PROJECT_NUMBER=$(gcloud projects describe "${PROJECT_ID}" --format="value(projectNumber)")
SERVICE_ACCOUNT="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --project="${PROJECT_ID}" \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/secretmanager.secretAccessor"

echo "=== 5. Deploying Container to Google Cloud Run ==="
gcloud run deploy "${SERVICE_NAME}" \
  --project="${PROJECT_ID}" \
  --region="${REGION}" \
  --source="." \
  --allow-unauthenticated \
  --port=3000 \
  --memory=512Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=5 \
  --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest" \
  --update-labels=dev-tutorial=cloud-run-ai-challenge

echo "=== 6. Deployment Complete! ==="
gcloud run services describe "${SERVICE_NAME}" \
  --project="${PROJECT_ID}" \
  --region="${REGION}" \
  --format="value(status.url)"
