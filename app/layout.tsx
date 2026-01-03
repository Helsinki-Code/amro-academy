import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
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

export const metadata: Metadata = {
  title: "AMRO Academy | AI-Powered Learning Platform",
  description: "Experience the future of education with personalized AI companions. Learn, grow, and excel with interactive voice conversations tailored to your needs.",
  keywords: ["AI learning", "education", "voice AI", "personalized learning", "AMRO Academy"],
  icons: {
    icon: "/favicon.ico",
    apple: "/images/amro-ai-academy/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Use the proxy URL from environment if configured and valid
  // The proxy URL must end with __clerk/ and use https
  const clerkProxyUrl = process.env.NEXT_PUBLIC_CLERK_PROXY_URL;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
        <ClerkProvider
          proxyUrl={clerkProxyUrl}
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
      </body>
    </html>
  );
}