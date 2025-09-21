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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body className="bg-white dark:bg-gray-900 font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange storageKey="ai-notify-theme">
          {children}
          <Toaster position="top-right" reverseOrder={false} toastOptions={{ duration: 4000, style: { fontFamily: "var(--font-inter)" } }} />
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
