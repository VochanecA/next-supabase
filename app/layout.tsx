// app/layout.tsx
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap", weight: "400", preload: true });

const criticalCSS = `
  *, *::before, *::after { box-sizing: border-box; }

  html {
    font-family: var(--font-inter), system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  body {
    margin: 0;
    background-color: #ffffff;
    color: #111827;
    line-height: 1.5;
  }

  @media (prefers-color-scheme: dark) {
    body { background-color: #111827; color: #f9fafb; }
  }

  *:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

export const metadata = {
  title: "AI Notify – Smart AI-Powered Notifications",
  description: "AI Notify delivers context-aware notifications that reduce noise and improve productivity.",
  keywords: "AI notifications, smart alerts, productivity, machine learning, workflow automation",
  robots: "index, follow",
  canonical: process.env.NEXT_PUBLIC_APP_URL
    ? `https://${process.env.NEXT_PUBLIC_APP_URL}`
    : "http://localhost:3000",
  openGraph: {
    title: "AI Notify – Smart AI-Powered Notifications",
    description: "AI Notify delivers context-aware notifications that reduce noise and improve productivity.",
    url: process.env.NEXT_PUBLIC_APP_URL
      ? `https://${process.env.NEXT_PUBLIC_APP_URL}`
      : "http://localhost:3000",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "AI Notify" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Notify – Smart AI-Powered Notifications",
    description: "AI Notify delivers context-aware notifications that reduce noise and improve productivity.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <head>
        {/* Inline critical CSS for FOUC prevention */}
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />

        {/* Preload font to reduce LCP */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />

        {/* SEO & performance meta tags */}
        <link rel="canonical" href={metadata.canonical} />
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="robots" content={metadata.robots} />

        {/* Open Graph */}
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:image" content={metadata.openGraph.images[0].url} />
        <meta property="og:image:width" content={metadata.openGraph.images[0].width.toString()} />
        <meta property="og:image:height" content={metadata.openGraph.images[0].height.toString()} />
        <meta property="og:image:alt" content={metadata.openGraph.images[0].alt} />

        {/* Twitter Card */}
        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta name="twitter:description" content={metadata.twitter.description} />
        <meta name="twitter:image" content={metadata.twitter.images[0]} />
      </head>

      <body className="bg-white dark:bg-gray-900 font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="ai-notify-theme"
        >
          {children}

          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{ duration: 4000, style: { fontFamily: "var(--font-inter)" } }}
          />
        </ThemeProvider>

        {/* Service Worker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
                window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(console.error));
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
