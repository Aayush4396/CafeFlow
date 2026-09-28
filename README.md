# CafeFlow: Load-Aware Cafe Experience Stack & BPMN Queue Simulator

CafeFlow is a smart cafe operating system engineered for Google Cloud Run and Google AI Studio. It balances live order traffic across preparation stations using dynamic queue-penalized recommendations, real-time Kitchen Display Systems (KDS), and discrete-event queue simulation based on BPMN business process modeling.

---

## 1. Architecture & Threat Model

CafeFlow implements strict security and operational resilience principles:
- **Zero Insecure Defaults & Zero Hardcoding**: API keys are injected at runtime via Google Cloud Secret Manager or environment variables (`GEMINI_API_KEY`).
- **Resilient AI Fallback Ladder**: The Gemini Flow Advisor uses a 4-tier fallback cascade (`gemini-3.6-flash` → `gemini-3.1-flash-lite` → `gemini-flash-latest` → `gemini-3.7-flash`) with graceful heuristic degradation.
- **Top-Level Deserialization & Payload Hygiene**: Express middleware decodes JSON payloads safely before all routes; all database/state payloads are sanitized against undefined values.

### Load-Aware Recommendation Formula
$$\text{Score}(i) = \text{BasePopularity}(i) - (\text{StationWaitSeconds}(S_i) \times 0.1) + (\text{MarginWeight}(i) \times 20) + \text{ContextualBoost}(i)$$

When the Espresso bar backlog exceeds 180 seconds, customers browsing the mobile app are automatically nudged toward Nitro Cold Brew, Ethiopian Batch Filter, and grab-and-go pastries with a **"⚡ Ready in < 2 mins"** badge.

---

## 2. Google Cloud Run Deployment Guide

### Deployment for Project: `supple-cubist-509809-h4`

You can deploy CafeFlow to Google Cloud Run in your project **`supple-cubist-509809-h4`** either using the automated script or following the manual 4-step sequence below.

#### Option A: Quick 1-Click Script
```bash
./deploy.sh
```

#### Option B: Step-by-Step gcloud CLI Deployment

##### 1. Set Project and Enable Google Cloud APIs
```bash
gcloud auth login
gcloud config set project supple-cubist-509809-h4

gcloud services enable \
  run.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com
```

##### 2. Provision Secret Manager for `GEMINI_API_KEY`
```bash
# Create the secret (if not already existing)
gcloud secrets create GEMINI_API_KEY \
  --project="supple-cubist-509809-h4" \
  --replication-policy="automatic"

# Add your Gemini API Key version
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets versions add GEMINI_API_KEY \
  --project="supple-cubist-509809-h4" \
  --data-file=-

# Grant the Cloud Run default service account permission to read the secret
PROJECT_NUMBER=$(gcloud projects describe supple-cubist-509809-h4 --format="value(projectNumber)")

gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --project="supple-cubist-509809-h4" \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

##### 3. Deploy the Container to Google Cloud Run
```bash
gcloud run deploy cafeflow \
  --project="supple-cubist-509809-h4" \
  --region="us-central1" \
  --source="." \
  --allow-unauthenticated \
  --port=3000 \
  --min-instances=0 \
  --max-instances=5 \
  --memory=512Mi \
  --cpu=1 \
  --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest" \
  --update-labels=dev-tutorial=cloud-run-ai-challenge
```

##### 4. Verify Challenge Label & Service URL
```bash
gcloud run services describe cafeflow \
  --project="supple-cubist-509809-h4" \
  --region="us-central1" \
  --format="value(status.url)"
```

---

## 3. Local Development

Run the unified full-stack server locally:

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev
```

Visit `http://localhost:3000` to interact with:
1. **Mobile Tray View**: Customer ordering with real-time station wait badges and quick-pickup carousel.
2. **Kitchen KDS View**: 3-station ticket board (Espresso, Batch Brew, Bakery) with live age timers and status progression (`Start Prep` → `Mark Ready` → `Hand Off`).
3. **BPMN Simulation Dashboard**: Discrete-event queue visualizer comparing FIFO vs Load-Aware routing with Gemini flow advice.
