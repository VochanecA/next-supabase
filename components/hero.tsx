// components/hero.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export function Hero() {
  return (
    <section className={`relative overflow-hidden py-24 md:py-32 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${inter.className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
          AI-Powered Notifications
          <span className="block mt-2 bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
            That Work For You
          </span>
        </h1>
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Transform how you receive information with intelligent, context-aware notifications.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/dashboard" className="inline-flex items-center justify-center px-6 py-3 text-white bg-indigo-600 rounded-lg text-lg font-medium">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link href="/features" className="inline-flex items-center justify-center px-6 py-3 text-indigo-600 border border-indigo-600 rounded-lg text-lg font-medium">
            View Features
          </Link>
        </div>
      </div>
    </section>
  );
}