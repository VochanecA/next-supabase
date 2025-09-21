"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { memo } from "react";
import type { FC } from "react";

// Hero stats data (static, no re-creation)
const STATS_DATA = [
  { value: "99.9%", label: "Uptime Reliability" },
  { value: "10ms", label: "Average Response" },
  { value: "24/7", label: "AI Monitoring" },
] as const;

// Memoized stat item with display name
const HeroStat = memo<{ value: string; label: string; index: number }>(({ value, label, index }) => (
  <div
    className="flex flex-col items-center opacity-0 animate-fade-in-up"
    style={{
      animationDelay: `${0.6 + index * 0.1}s`,
      animationFillMode: "forwards",
    }}
  >
    <div className="text-3xl font-extrabold text-indigo-600">{value}</div>
    <div className="mt-2 text-sm text-gray-600">{label}</div>
  </div>
));
HeroStat.displayName = "HeroStat";

// Hero component
export const Hero: FC = memo(() => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-24 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white opacity-0 animate-fade-in-up">
          AI-Powered Notifications
          <span className="block mt-2 bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
            That Work For You
          </span>
        </h1>
        <p
          className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
        >
          Transform how you receive information with intelligent, context-aware notifications.
        </p>
        <div
          className="mt-10 flex flex-col sm:flex-row justify-center gap-4 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-6 py-3 text-white bg-indigo-600 rounded-lg text-lg font-medium transition-transform hover:scale-105"
            prefetch={false}
          >
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/features"
            className="inline-flex items-center justify-center px-6 py-3 text-indigo-600 border border-indigo-600 rounded-lg text-lg font-medium transition-transform hover:scale-105"
            prefetch={false}
          >
            View Features
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {STATS_DATA.map((stat, idx) => (
            <HeroStat key={stat.label} value={stat.value} label={stat.label} index={idx} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
});
Hero.displayName = "Hero";
