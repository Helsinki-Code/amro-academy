#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PROJECT_ID = 'cuckfessions-admin-lite';
const REGION = 'us-central1';
const SERVICE_NAME = 'amroacademy';
const IMAGE_NAME = `gcr.io/${PROJECT_ID}/${SERVICE_NAME}`;

function exec(command, options = {}) {
  console.log(`Executing: ${command}`);
  try {
    return execSync(command, { stdio: 'inherit', ...options });
  } catch (error) {
    console.error(`Error executing: ${command}`);
    throw error;
  }
}

function checkGcloud() {
  try {
    execSync('gcloud --version', { stdio: 'ignore' });
  } catch {
    console.error('❌ gcloud CLI is not installed. Please install it first.');
    process.exit(1);
  }
}

function checkAuth() {
  try {
    const output = execSync('gcloud auth list --filter=status:ACTIVE --format="value(account)"', { encoding: 'utf8' });
    if (!output.trim()) {
      console.log('🔐 Authenticating with Google Cloud...');
      exec('gcloud auth login');
    }
  } catch {
    console.log('🔐 Authenticating with Google Cloud...');
    exec('gcloud auth login');
  }
}

function readEnvVars() {
  const envFile = path.join(process.cwd(), '.env');
  const envVars = [];
  const requiredVars = [
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
    'NEXT_PUBLIC_VAPI_WEB_TOKEN'
  ];
  const foundVars = new Set();
  
  if (fs.existsSync(envFile)) {
    const content = fs.readFileSync(envFile, 'utf8');
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const match = trimmed.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim();
          // Exclude database variables (set explicitly for production) and SUPABASE
          const excludedVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'DB_PORT', 'DATABASE_URL'];
          if (key && value && !key.includes('SUPABASE') && !excludedVars.includes(key)) {
            envVars.push('--set-env-vars', `${key}=${value}`);
            if (requiredVars.includes(key)) {
              foundVars.add(key);
            }
          }
        }
      }
    }
    
    // Warn if required vars are missing
    const missingVars = requiredVars.filter(v => !foundVars.has(v));
    if (missingVars.length > 0) {
      console.warn(`⚠️  Warning: Missing recommended environment variables in .env: ${missingVars.join(', ')}`);
    }
  } else {
    console.warn('⚠️  Warning: .env file not found. Make sure to set required environment variables.');
  }
  
  return envVars;
}

async function deploy() {
  console.log('🚀 Starting deployment to Google Cloud Run...\n');
  
  checkGcloud();
  checkAuth();
  
  console.log('📦 Setting GCP project...');
  exec(`gcloud config set project ${PROJECT_ID}`);
  
  // Set quota project to match active project (fixes ADC warning)
  try {
    exec(`gcloud auth application-default set-quota-project ${PROJECT_ID}`, { stdio: 'ignore' });
  } catch {
    // Ignore if this fails - not critical
  }
  
  console.log('🔌 Enabling required APIs...');
  exec('gcloud services enable cloudbuild.googleapis.com');
  exec('gcloud services enable run.googleapis.com');
  exec('gcloud services enable sqladmin.googleapis.com');
  exec('gcloud services enable containerregistry.googleapis.com');
  
  console.log('🏗️  Building Docker image...');
  
  // Read NEXT_PUBLIC_ variables from .env for build substitutions
  const envFile = path.join(process.cwd(), '.env');
  
  // Use cloudbuild.yaml with substitutions for build-time env vars
  // Prefix with _ for Cloud Build substitutions (must start with letter/underscore, no numbers)
  // Only include variables that are actually used in cloudbuild.yaml (exclude SUPABASE)
  const allowedBuildVars = [
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'NEXT_PUBLIC_VAPI_WEB_TOKEN',
    'NEXT_PUBLIC_CLERK_SIGN_IN_URL',
    'NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL',
    'NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL',
    'NEXT_PUBLIC_CLERK_PROXY_URL'
  ];
  
  const buildSubstitutions = [];
  
  if (fs.existsSync(envFile)) {
    const content = fs.readFileSync(envFile, 'utf8');
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const match = trimmed.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim();
          // Only include allowed variables (exclude SUPABASE and other unused vars)
          if (key && value && allowedBuildVars.includes(key)) {
            // Escape single quotes and wrap in single quotes for shell safety
            const escapedValue = value.replace(/'/g, "'\\''");
            buildSubstitutions.push(`_${key}='${escapedValue}'`);
            // Debug: Log the key (truncated for security)
            if (key === 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY') {
              console.log(`🔑 Found ${key}: ${value.substring(0, 20)}... (length: ${value.length})`);
            }
          }
        }
      }
    }
  }
  
  if (buildSubstitutions.length > 0) {
    console.log(`📝 Passing ${buildSubstitutions.length} build-time environment variables...`);
    const subsFlag = `--substitutions ${buildSubstitutions.join(',')}`;
    exec(`gcloud builds submit --config=cloudbuild.yaml ${subsFlag}`);
  } else {
    console.error('❌ Error: Required NEXT_PUBLIC_ variables not found in .env file!');
    console.error('Required variables: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, NEXT_PUBLIC_VAPI_WEB_TOKEN');
    process.exit(1);
  }
  
  const envVars = readEnvVars();
  
  // Required environment variables (should be in .env file):
  // - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  // - CLERK_SECRET_KEY
  // - NEXT_PUBLIC_CLERK_SIGN_IN_URL
  // - NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL
  // - NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL
  // - NEXT_PUBLIC_VAPI_WEB_TOKEN
  // - SENTRY_AUTH_TOKEN
  // These are automatically read from .env file and added to deployment
  
  console.log('🚀 Deploying to Cloud Run...');
  
  // Database connection (explicitly set for Cloud SQL)
  const dbPassword = 'Amroacademypassword@100!';
  const encodedPassword = encodeURIComponent(dbPassword);
  const dbUrl = `postgresql://amroacademyuser:${encodedPassword}@/amroacademy?host=/cloudsql/cuckfessions-admin-lite:us-central1:amroacademy`;
  
  // Build deploy command with proper escaping
  const baseDeployArgs = [
    'run', 'deploy', SERVICE_NAME,
    '--image', IMAGE_NAME,
    '--platform', 'managed',
    '--region', REGION,
    '--allow-unauthenticated',
    '--add-cloudsql-instances', 'cuckfessions-admin-lite:us-central1:amroacademy',
    '--memory', '2Gi',
    '--cpu', '2',
    '--timeout', '300',
    '--max-instances', '10',
    // Database environment variables (Cloud SQL)
    '--set-env-vars', `DATABASE_URL=${dbUrl}`,
    '--set-env-vars', 'DB_HOST=/cloudsql/cuckfessions-admin-lite:us-central1:amroacademy',
    '--set-env-vars', 'DB_USER=amroacademyuser',
    '--set-env-vars', `DB_PASSWORD=${dbPassword}`,
    '--set-env-vars', 'DB_NAME=amroacademy',
    '--set-env-vars', 'DB_PORT=5432',
    '--set-env-vars', 'NODE_ENV=production'
  ];
  
  // Add environment variables from .env file (Clerk, Vapi, Sentry, etc.)
  // All variables from .env are automatically included (except SUPABASE ones)
  const deployArgs = [...baseDeployArgs, ...envVars];
  
  exec(`gcloud ${deployArgs.join(' ')}`);
  
  console.log('✅ Deployment completed successfully!');
  console.log('🌐 Getting service URL...');
  const url = execSync(
    `gcloud run services describe ${SERVICE_NAME} --region ${REGION} --format "value(status.url)"`,
    { encoding: 'utf8' }
  ).trim();
  console.log(`\n🎉 Service deployed at: ${url}\n`);
}

deploy().catch(error => {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
});

