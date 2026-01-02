import { NextResponse } from 'next/server'
import { clerkMiddleware } from '@clerk/nextjs/server'
import type { NextRequest } from 'next/server'

function proxyMiddleware(req: NextRequest) {
  if (req.nextUrl.pathname.match('__clerk')) {
    const proxyUrlEnv = process.env.NEXT_PUBLIC_CLERK_PROXY_URL;
    
    // Only use proxy if it's properly configured
    // Check if proxy URL is valid and matches the current domain to avoid CORS issues
    const isValidProxyUrl = proxyUrlEnv && 
      proxyUrlEnv.endsWith('/__clerk/') && 
      !proxyUrlEnv.includes('//npm') && // Avoid double slashes
      proxyUrlEnv.startsWith('https://');
    
    // If proxy URL is misconfigured, don't use it (return null to skip proxy)
    if (!isValidProxyUrl) {
      return null;
    }
    
    const proxyHeaders = new Headers(req.headers)
    proxyHeaders.set('Clerk-Proxy-Url', proxyUrlEnv)
    proxyHeaders.set('Clerk-Secret-Key', process.env.CLERK_SECRET_KEY || '')
    proxyHeaders.set('X-Forwarded-For', req.headers.get('X-Forwarded-For') || req.headers.get('x-forwarded-for') || '')

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

export default function middleware(req: NextRequest) {
  // First check if it's a proxy request
  const proxyResponse = proxyMiddleware(req)
  if (proxyResponse) {
    return proxyResponse
  }

  // Otherwise, use Clerk's middleware
  // @ts-ignore - clerkMiddleware() returns a function that accepts NextRequest
  return clerkHandler(req)
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes AND anything passed through the proxy
    "/(api|trpc|__clerk)(.*)",
  ],
}




