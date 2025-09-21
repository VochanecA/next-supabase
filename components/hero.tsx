"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { FC } from "react";

export const Hero: FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-24 md:py-32">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 z-0"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,transparent)] dark:bg-[url('/grid-dark.svg')]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl"
          >
            <span className="block">AI-Powered Notifications</span>
            <span className="block mt-2 bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              That Work For You
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-300"
          >
            Transform how you receive information with intelligent, context-aware
            notifications that learn your preferences and deliver only what matters most.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              asChild
            >
              <Link href="/features">View Features</Link>
            </Button>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.15 },
              },
            }}
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3"
          >
            {[
              { value: "99.9%", label: "Uptime Reliability" },
              { value: "10ms", label: "Average Response" },
              { value: "24/7", label: "AI Monitoring" },
            ].map(({ value, label }) => (
              <motion.div
                key={label}
                variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                className="flex flex-col items-center"
              >
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {value}
                </div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Decorative Bottom Fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"
        aria-hidden="true"
      />
    </section>
  );
};