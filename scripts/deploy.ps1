# PowerShell deployment script for Windows
$ErrorActionPreference = "Stop"

$PROJECT_ID = "cuckfessions-admin-lite"
$REGION = "us-central1"
$SERVICE_NAME = "amroacademy"
$IMAGE_NAME = "gcr.io/$PROJECT_ID/$SERVICE_NAME"

Write-Host "🚀 Starting deployment to Google Cloud Run..." -ForegroundColor Cyan

# Check if gcloud is installed
try {
    gcloud version | Out-Null
} catch {
    Write-Host "❌ gcloud CLI is not installed. Please install it first." -ForegroundColor Red
    exit 1
}

# Check if user is authenticated
$activeAccount = gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>$null
if (-not $activeAccount) {
    Write-Host "🔐 Authenticating with Google Cloud..." -ForegroundColor Yellow
    gcloud auth login
}

# Set the project
Write-Host "📦 Setting GCP project..." -ForegroundColor Cyan
gcloud config set project $PROJECT_ID

# Enable required APIs
Write-Host "🔌 Enabling required APIs..." -ForegroundColor Cyan
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build and push the Docker image
Write-Host "🏗️  Building Docker image..." -ForegroundColor Cyan
gcloud builds submit --tag $IMAGE_NAME

# Read environment variables from .env file if it exists
$envVars = @()
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$' -and $_ -notmatch '^\s*#') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            if ($key -and $value) {
                $envVars += "--set-env-vars"
                $envVars += "$key=$value"
            }
        }
    }
}

# Deploy to Cloud Run
Write-Host "🚀 Deploying to Cloud Run..." -ForegroundColor Cyan
$deployArgs = @(
    "run", "deploy", $SERVICE_NAME,
    "--image", $IMAGE_NAME,
    "--platform", "managed",
    "--region", $REGION,
    "--allow-unauthenticated",
    "--add-cloudsql-instances", "cuckfessions-admin-lite:us-central1:amroacademy",
    "--memory", "2Gi",
    "--cpu", "2",
    "--timeout", "300",
    "--max-instances", "10",
    "--set-env-vars", "DATABASE_URL=postgresql://amroacademyuser:Amroacademypassword@100!@/amroacademy?host=/cloudsql/cuckfessions-admin-lite:us-central1:amroacademy",
    "--set-env-vars", "DB_HOST=/cloudsql/cuckfessions-admin-lite:us-central1:amroacademy",
    "--set-env-vars", "DB_USER=amroacademyuser",
    "--set-env-vars", "DB_PASSWORD=Amroacademypassword@100!",
    "--set-env-vars", "DB_NAME=amroacademy",
    "--set-env-vars", "NODE_ENV=production"
) + $envVars

& gcloud @deployArgs

Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host "🌐 Getting service URL..." -ForegroundColor Cyan
$url = gcloud run services describe $SERVICE_NAME --region $REGION --format "value(status.url)"
Write-Host "Service URL: $url" -ForegroundColor Green

