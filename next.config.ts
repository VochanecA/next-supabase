// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
  
// };

// export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // ✅ Enable React strict mode

  // Prefer modern ES modules for dependencies to reduce bundle size
  experimental: {
    esmExternals: true, 
  },

  // Production builds automatically minified with SWC
  output: "standalone", // ✅ Optional: standalone build for smaller container images
  compiler: {
    styledComponents: true, // ✅ if using styled-components
  },

  // Modern JS: Next.js automatically serves ES modules to modern browsers
  // No need for `modern: true` — it's removed in v13+ and TypeScript will complain
};

export default nextConfig;

// Notes / Optimizations

// No modern: true or swcMinify → Next.js 14+ automatically ships modern JS in production.

// esmExternals: true → Uses ESM versions of dependencies like lucide-react or react-hot-toast, reducing legacy bundle bloat.

// output: "standalone" → Creates a minimal server output if deploying in containers.

// React strict mode → Catches potential issues early.

// Optional compiler.styledComponents → Adds className debugging + minification if using styled-components.
