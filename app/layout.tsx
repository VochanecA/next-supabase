import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
// import { Analytics } from "@vercel/analytics/react";
// import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const defaultUrl = process.env.NEXT_PUBLIC_APP_URL
  ? `https://${process.env.NEXT_PUBLIC_APP_URL}`
  : "http://localhost:3000";

const appName = "AI Notify";
const appDescription = "AI-powered notification platform with intelligent, personalized alerts. Get context-aware notifications that reduce noise and boost productivity.";
const appKeywords = "AI notifications, smart alerts, productivity, real-time notifications, machine learning, workflow automation";

// Optimized fonts with variable fonts for better performance
const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  display: "swap",
  subsets: ["latin"],
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
  colorScheme: "light dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: `${appName} - AI-Powered Smart Notifications`,
    template: `%s | ${appName}`
  },
  description: appDescription,
  keywords: appKeywords,
  applicationName: appName,
  authors: [{ name: "AI Notify Team" }],
  creator: "AI Notify",
  publisher: "AI Notify",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: defaultUrl,
    siteName: appName,
    title: `${appName} - AI-Powered Smart Notifications`,
    description: appDescription,
    images: [
      {
        url: `/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "AI Notify - Smart AI-Powered Notifications",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${appName} - AI-Powered Smart Notifications`,
    description: appDescription,
    creator: "@ainotify",
    images: [`/og-image.jpg`],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#ff6b35",
      },
    ],
  },
  manifest: "/manifest.json",
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: defaultUrl,
    types: {
      "application/rss+xml": `${defaultUrl}/rss.xml`,
    },
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        {/* Preconnect to important domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        
        {/* Preload critical resources */}
        <link rel="preload" as="image" href="/og-image.jpg" />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": appName,
              "description": appDescription,
              "applicationCategory": "ProductivityApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "EUR"
              }
            })
          }}
        />
      </head>
      <body className={`font-sans antialiased bg-white dark:bg-gray-900 transition-colors duration-200`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="ai-notify-theme"
        >
          {children}
        </ThemeProvider>
        
        {/* Performance & Analytics */}
        {/* <Analytics />
        <SpeedInsights /> */}
        
        {/* Schema.org markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": appName,
              "url": defaultUrl,
              "logo": `${defaultUrl}/logo.png`,
              "sameAs": [
                "https://twitter.com/ainotify",
                "https://github.com/ainotify"
              ]
            })
          }}
        />
      </body>
    </html>
  );
}