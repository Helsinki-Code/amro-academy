# Custom Domain Setup Guide for Google Cloud Run + Clerk

This guide will help you connect your custom domain to your Cloud Run deployment and configure it with Clerk.

## Prerequisites
- A custom domain (e.g., `yourdomain.com`)
- Access to your domain's DNS settings
- Google Cloud Run service deployed
- Clerk account

## Step 1: Configure Custom Domain in Google Cloud Run

### Option A: Using Google Cloud Console

1. **Go to Cloud Run in Google Cloud Console:**
   - Navigate to: https://console.cloud.google.com/run
   - Select your project: `cuckfessions-admin-lite`
   - Click on your service: `amroacademy`

2. **Add Custom Domain Mapping:**
   - Click on the "MANAGE CUSTOM DOMAINS" tab
   - Click "ADD MAPPING"
   - Enter your custom domain (e.g., `app.yourdomain.com` or `yourdomain.com`)
   - Click "CONTINUE"
   - Cloud Run will provide DNS records to add to your domain

3. **Add DNS Records:**
   - Go to your domain registrar's DNS settings
   - Add the CNAME or A record as provided by Cloud Run
   - Wait for DNS propagation (usually 5-60 minutes)

### Option B: Using gcloud CLI

```bash
# Map your custom domain to Cloud Run service
gcloud run domain-mappings create \
  --service=amroacademy \
  --domain=yourdomain.com \
  --region=us-central1

# Get the DNS records you need to add
gcloud run domain-mappings describe \
  --domain=yourdomain.com \
  --region=us-central1
```

## Step 2: Configure Domain in Clerk

Once your custom domain is working with Cloud Run:

1. **Get your Cloud Run service URL:**
   - Current URL: `https://amroacademy-yrdipb62iq-uc.a.run.app`
   - After domain mapping, your custom domain will work

2. **Add Domain in Clerk Dashboard:**
   - Go to: https://dashboard.clerk.com
   - Navigate to: **Configure → Domains**
   - Click "Add Domain"
   - Enter your custom domain: `yourdomain.com`
   - Click "Save"

3. **Configure Proxy URL:**
   - After adding the domain, Clerk will show configuration options
   - Set the **Proxy URL** to: `https://yourdomain.com/__clerk/`
   - Click "Save"

4. **Get Domain-Specific Keys:**
   - After configuring the proxy, Clerk will generate domain-specific keys
   - Copy the new **Publishable Key** (starts with `pk_live_...`)
   - This key will be different from your default keys

## Step 3: Update Environment Variables

Update your `.env` file with the new domain-specific keys:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_[domain-specific-key-from-clerk]
CLERK_SECRET_KEY=sk_live_[your-secret-key-from-clerk]
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
```

## Step 4: Update Middleware for Proxy

Since you're using a custom domain with Clerk proxy, you'll need to restore the proxy middleware:

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import { clerkMiddleware } from '@clerk/nextjs/server'

function proxyMiddleware(req) {
  if (req.nextUrl.pathname.startsWith('/__clerk')) {
    const proxyHeaders = new Headers(req.headers)
    proxyHeaders.set('Clerk-Proxy-Url', process.env.NEXT_PUBLIC_CLERK_PROXY_URL || '')
    proxyHeaders.set('Clerk-Secret-Key', process.env.CLERK_SECRET_KEY || '')
    
    if (req.ip) {
      proxyHeaders.set('X-Forwarded-For', req.ip)
    } else {
      proxyHeaders.set('X-Forwarded-For', req.headers.get('X-Forwarded-For') || '')
    }

    const proxyUrl = new URL(req.url)
    proxyUrl.host = 'frontend-api.clerk.dev'
    proxyUrl.port = '443'
    proxyUrl.protocol = 'https'
    proxyUrl.pathname = proxyUrl.pathname.replace('/__clerk', '')

    return NextResponse.rewrite(proxyUrl, {
      request: {
        headers: proxyHeaders,
      },
    })
  }

  return null
}

const clerkHandler = clerkMiddleware()

export default function middleware(req) {
  // First check if it's a proxy request
  const proxyResponse = proxyMiddleware(req)
  if (proxyResponse) {
    return proxyResponse
  }

  // Otherwise, use Clerk's middleware
  return clerkHandler(req)
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc|__clerk)(.*)",
  ],
}
```

## Step 5: Update Cloud Run Environment Variables

Add the proxy URL to your Cloud Run service:

```bash
gcloud run services update amroacademy \
  --region=us-central1 \
  --update-env-vars="NEXT_PUBLIC_CLERK_PROXY_URL=https://yourdomain.com/__clerk/"
```

Or update it in the deployment script to include this environment variable.

## Step 6: Redeploy

```bash
npm run deploy
```

## Verification

1. Visit your custom domain: `https://yourdomain.com`
2. Test authentication (sign in/sign up)
3. Check that Clerk proxy endpoints work: `https://yourdomain.com/__clerk/v1/proxy-health`

## Troubleshooting

- **DNS not working?** Wait longer for propagation, or check DNS records are correct
- **Clerk proxy errors?** Verify the proxy URL is exactly: `https://yourdomain.com/__clerk/`
- **SSL certificate issues?** Cloud Run automatically provisions SSL for custom domains
- **Keys not working?** Make sure you're using the domain-specific keys from Clerk, not the default keys

