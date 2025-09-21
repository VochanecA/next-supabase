// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
  
// };

// export default nextConfig;
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // ✅ React strict mode

  // Experimental features
  experimental: {
    esmExternals: true,  // ✅ Prefer ESM builds of dependencies
    optimizeCss: true,   // ✅ Enable Critters (inline critical CSS, lazy-load the rest)
  },

  // Output & compiler
  output: "standalone", // ✅ Standalone build for smaller Docker/container images
  compiler: {
    styledComponents: true, // ✅ If using styled-components
  },

  // Enable browser source maps for debugging in production
  productionBrowserSourceMaps: true, // ✅ Fix missing source maps warning

  // Enable asset compression
  compress: true, // ✅ gzip/BR compression for JS/CSS assets

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

  // Optional image optimization domains
  images: {
    domains: ["cdn.jsdelivr.net", "next-suoabase-beta-nine.vercel.app"], // replace with your OG/CDN domains
  },
};

export default nextConfig;

// Notes / Optimizations

// No modern: true or swcMinify → Next.js 14+ automatically ships modern JS in production.

// esmExternals: true → Uses ESM versions of dependencies like lucide-react or react-hot-toast, reducing legacy bundle bloat.

// output: "standalone" → Creates a minimal server output if deploying in containers.

// React strict mode → Catches potential issues early.

// Optional compiler.styledComponents → Adds className debugging + minification if using styled-components.
