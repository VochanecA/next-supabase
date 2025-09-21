"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

// Lazy-load framer-motion to avoid SSR errors
const MotionDiv = dynamic(() => import("framer-motion").then(mod => mod.motion.div), { ssr: false });
const MotionH1 = dynamic(() => import("framer-motion").then(mod => mod.motion.h1), { ssr: false });
const MotionP = dynamic(() => import("framer-motion").then(mod => mod.motion.p), { ssr: false });

// Stats
const stats = [
  { value: "99.9%", label: "Uptime Reliability" },
  { value: "10ms", label: "Average Response" },
  { value: "24/7", label: "AI Monitoring" },
];

// Simple SVG grid pattern
function GridPattern({ dark = false }: { dark?: boolean }) {
  return (
    <svg className="absolute inset-0 w-full h-full" aria-hidden="true" role="presentation" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <defs>
        <pattern id={dark ? "grid-dark" : "grid-light"} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke={dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${dark ? "grid-dark" : "grid-light"})`} />
    </svg>
  );
}

export function Hero() {
  return (
    <section className={`relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-24 md:py-32 ${inter.className}`}>
      <div className="absolute inset-0 z-0 [mask-image:linear-gradient(180deg,white,transparent)]">
        <div className="hidden dark:block">
          <GridPattern dark />
        </div>
        <div className="block dark:hidden">
          <GridPattern />
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <MotionH1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl"
          >
            <span className="block">AI-Powered Notifications</span>
            <span className="block mt-2 bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              That Work For You
            </span>
          </MotionH1>

          <MotionP
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-300"
          >
            Transform how you receive information with intelligent, context-aware notifications that learn your preferences and deliver only what matters most.
          </MotionP>

          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/dashboard">Get Started<ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/features">View Features</Link>
            </Button>
          </MotionDiv>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {stats.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center">
                <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{value}</h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" aria-hidden="true" />
    </section>
  );
}