// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
  
// };

// export default nextConfig;
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // ✅ React strict mode

  // Experimental & performance
  experimental: {
    esmExternals: true,   // ✅ Prefer ESM builds for dependencies
    optimizeCss: true,    // ✅ Inline critical CSS, lazy-load the rest
  },

  output: "standalone",    // ✅ Standalone build for smaller Docker/container images

  compiler: {
    styledComponents: true, // ✅ Support styled-components
  },

  compress: true,          // ✅ Enable gzip/BR compression

  productionBrowserSourceMaps: true, // ✅ Enable browser source maps in production

  // Optional image optimization domains
  images: {
    domains: ["cdn.jsdelivr.net", "next-supabase-beta-nine.vercel.app"], // OG/CDN domains
  },

  // Optional security & SEO headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },

  // Modern JS is automatically served to browsers by Next.js 14+ App Router
};

export default nextConfig;




// Notes / Optimizations

// No modern: true or swcMinify → Next.js 14+ automatically ships modern JS in production.

// esmExternals: true → Uses ESM versions of dependencies like lucide-react or react-hot-toast, reducing legacy bundle bloat.

// output: "standalone" → Creates a minimal server output if deploying in containers.

// React strict mode → Catches potential issues early.

// Optional compiler.styledComponents → Adds className debugging + minification if using styled-components.
