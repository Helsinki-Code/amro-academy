import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://whatifwhynot.pro";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AMRO Academy | AI-Powered Learning Platform",
    template: "%s | AMRO Academy"
  },
  description: "Experience the future of education with personalized AI companions. Learn, grow, and excel with interactive voice conversations tailored to your needs. Create custom AI tutors, engage in real-time voice conversations, and master any subject.",
  keywords: [
    "AI learning",
    "education",
    "voice AI",
    "personalized learning",
    "AMRO Academy",
    "AI tutors",
    "online education",
    "interactive learning",
    "voice conversations",
    "AI companions",
    "educational technology",
    "e-learning",
    "adaptive learning"
  ],
  authors: [{ name: "AMRO Academy" }],
  creator: "AMRO Academy",
  publisher: "AMRO Academy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/images/amro-ai-academy/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "AMRO Academy",
    title: "AMRO Academy | AI-Powered Learning Platform",
    description: "Experience the future of education with personalized AI companions. Learn, grow, and excel with interactive voice conversations tailored to your needs.",
    images: [
      {
        url: `${siteUrl}/images/amro-ai-academy/amro-ai-academy-logo.png`,
        width: 1200,
        height: 400,
        alt: "AMRO Academy - AI-Powered Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AMRO Academy | AI-Powered Learning Platform",
    description: "Experience the future of education with personalized AI companions. Learn, grow, and excel with interactive voice conversations.",
    images: [`${siteUrl}/images/amro-ai-academy/amro-ai-academy-logo.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://whatifwhynot.pro";
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "AMRO Academy",
              "description": "AI-Powered Learning Platform with personalized AI companions for interactive voice conversations",
              "url": siteUrl,
              "logo": `${siteUrl}/images/amro-ai-academy/amro-ai-academy-logo.png`,
              "sameAs": [],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Service"
              }
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: '#00CED1',
              borderRadius: '12px',
            },
            elements: {
              formButtonPrimary: 'bg-gradient-to-r from-cyan-400 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/30',
              card: 'shadow-xl border border-border',
            }
          }}
        >
          <ThemeProvider>
            <div className="relative min-h-screen">
              {/* Floating Orbs Background */}
              <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-blue-400/5 to-cyan-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-6s' }} />
              </div>
              
              <Navbar />
              <div className="relative z-10 pt-20">
                {children}
              </div>
            </div>
          </ThemeProvider>
        </ClerkProvider>
        <Analytics />
      </body>
    </html>
  );
}