// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast"; // <-- import react-hot-toast
// import { Analytics } from "@vercel/analytics/react";
// import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const defaultUrl = process.env.NEXT_PUBLIC_APP_URL
  ? `https://${process.env.NEXT_PUBLIC_APP_URL}`
  : "http://localhost:3000";

const appName = "AI Notify";
const appDescription =
  "AI-powered notification platform with intelligent, personalized alerts. Get context-aware notifications that reduce noise and boost productivity.";
const appKeywords =
  "AI notifications, smart alerts, productivity, real-time notifications, machine learning, workflow automation";

// Optimized fonts with variable fonts
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

// Metadata object remains the same
export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: `${appName} - AI-Powered Smart Notifications`,
    template: `%s | ${appName}`,
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
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: defaultUrl,
    siteName: appName,
    title: `${appName} - AI-Powered Smart Notifications`,
    description: appDescription,
    images: [{ url: `/og-image.jpg`, width: 1200, height: 630, alt: "AI Notify" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${appName} - AI-Powered Smart Notifications`,
    description: appDescription,
    creator: "@ainotify",
    images: [`/og-image.jpg`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="preload" as="image" href="/og-image.jpg" />
      </head>
      <body className="font-sans antialiased bg-white dark:bg-gray-900 transition-colors duration-200">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="ai-notify-theme"
        >
          {children}
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              duration: 4000,
              style: {
                fontFamily: "var(--font-geist-sans)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
