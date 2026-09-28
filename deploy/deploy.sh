#!/usr/bin/env bash
set -e

PROJECT_ID="${1:-$PROJECT_ID}"
REGION="${2:-us-central1}"

if [ -z "$PROJECT_ID" ]; then
  echo "Usage: ./deploy/deploy.sh <PROJECT_ID> [REGION]"
  exit 1
fi

echo "==> Deploying CafeFlow Full-Stack to Google Cloud Run (Project: $PROJECT_ID, Region: $REGION)..."

# Build & Deploy Full-Stack Node Service
gcloud run deploy cafeflow \
  --source=. \
  --project="$PROJECT_ID" \
  --region="$REGION" \
  --allow-unauthenticated \
  --min-instances=0 \
  --max-instances=5 \
  --memory=512Mi \
  --cpu=1 \
  --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest" \
  --update-labels=dev-tutorial=cloud-run-ai-challenge

echo "==> Deployment Complete! Service labeled for cloud-run-ai-challenge verification."
