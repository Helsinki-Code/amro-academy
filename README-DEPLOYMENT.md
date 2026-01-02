# AMRO Academy - Google Cloud Deployment Guide

## Prerequisites

1. **Google Cloud SDK (gcloud CLI)** installed and configured
2. **Docker** installed (for local testing)
3. **Node.js** and npm installed
4. **Google Cloud Project** with billing enabled

## Quick Start

### 1. Run SQL Schema

First, run the SQL schema in Google Cloud SQL Editor:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **SQL** → Select your instance (`amroacademy`)
3. Click **Databases** → Select `amroacademy` database
4. Click **SQL Editor**
5. Copy and paste the contents of `cloud-sql-schema.sql`
6. Click **Run**

### 2. Deploy Application

Simply run:

```bash
npm run deploy
```

This single command will:
- ✅ Authenticate with Google Cloud (if needed)
- ✅ Enable required APIs
- ✅ Build Docker image
- ✅ Push to Container Registry
- ✅ Deploy to Cloud Run
- ✅ Configure environment variables
- ✅ Connect to Cloud SQL

## Manual Deployment Steps

If you prefer manual deployment:

### Step 1: Authenticate

```bash
gcloud auth login
gcloud config set project cuckfessions-admin-lite
```

### Step 2: Enable APIs

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### Step 3: Build and Deploy

```bash
# Build Docker image
gcloud builds submit --tag gcr.io/cuckfessions-admin-lite/amroacademy

# Deploy to Cloud Run
gcloud run deploy amroacademy \
  --image gcr.io/cuckfessions-admin-lite/amroacademy \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --add-cloudsql-instances cuckfessions-admin-lite:us-central1:amroacademy \
  --memory 2Gi \
  --cpu 2 \
  --timeout 300 \
  --max-instances 10
```

## Environment Variables

The deployment script automatically reads from your `.env` file and sets them in Cloud Run. Make sure your `.env` file contains:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_token
SENTRY_AUTH_TOKEN=your_token
```

**Note:** Database connection is automatically configured for Cloud SQL.

## Database Connection

The application automatically uses Cloud SQL connection via Unix socket when deployed:

- **Local Development**: Uses TCP connection
- **Cloud Run**: Uses Unix socket (`/cloudsql/...`)

## Troubleshooting

### Connection Issues

If you encounter database connection issues:

1. Verify Cloud SQL instance is running
2. Check Cloud Run service has Cloud SQL connection configured
3. Verify database credentials in Cloud SQL

### Build Failures

If Docker build fails:

1. Check `Dockerfile` syntax
2. Verify all dependencies in `package.json`
3. Check build logs: `gcloud builds list`

### Deployment Issues

If deployment fails:

1. Check service logs: `gcloud run services logs read amroacademy --region us-central1`
2. Verify environment variables are set correctly
3. Check Cloud Run service status in console

## Post-Deployment

After successful deployment:

1. Get service URL: `gcloud run services describe amroacademy --region us-central1 --format "value(status.url)"`
2. Test the application
3. Monitor logs for any errors

## Updating the Application

To update the application:

```bash
npm run deploy
```

This will rebuild and redeploy the latest version.

