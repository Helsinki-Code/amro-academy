#!/bin/bash
set -e

PROJECT_ID="cuckfessions-admin-lite"
REGION="us-central1"
SERVICE_NAME="amroacademy"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

echo "🚀 Starting deployment to Google Cloud Run..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first."
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "🔐 Authenticating with Google Cloud..."
    gcloud auth login
fi

# Set the project
echo "📦 Setting GCP project..."
gcloud config set project ${PROJECT_ID}

# Enable required APIs
echo "🔌 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build and push the Docker image
echo "🏗️  Building Docker image..."
gcloud builds submit --tag ${IMAGE_NAME}

# Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME} \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --set-env-vars "DATABASE_URL=postgresql://amroacademyuser:Amroacademypassword@100!@/amroacademy?host=/cloudsql/cuckfessions-admin-lite:us-central1:amroacademy" \
  --add-cloudsql-instances cuckfessions-admin-lite:us-central1:amroacademy \
  --memory 2Gi \
  --cpu 2 \
  --timeout 300 \
  --max-instances 10 \
  --set-env-vars "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}" \
  --set-env-vars "CLERK_SECRET_KEY=${CLERK_SECRET_KEY}" \
  --set-env-vars "NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in" \
  --set-env-vars "NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/" \
  --set-env-vars "NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/" \
  --set-env-vars "NEXT_PUBLIC_VAPI_WEB_TOKEN=${NEXT_PUBLIC_VAPI_WEB_TOKEN}" \
  --set-env-vars "SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}" \
  --set-env-vars "NODE_ENV=production"

echo "✅ Deployment completed successfully!"
echo "🌐 Getting service URL..."
gcloud run services describe ${SERVICE_NAME} --region ${REGION} --format "value(status.url)"

