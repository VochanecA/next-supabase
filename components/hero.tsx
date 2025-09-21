'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { FC, ReactElement } from 'react';

// Dynamically import Framer Motion for non-critical animation
const MotionDiv = dynamic(() => import('framer-motion').then((mod) => mod.motion.div), { ssr: false });
const MotionH1 = dynamic(() => import('framer-motion').then((mod) => mod.motion.h1), { ssr: false });
const MotionP = dynamic(() => import('framer-motion').then((mod) => mod.motion.p), { ssr: false });

export const Hero: FC = (): ReactElement => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-24 md:py-32">
      
      {/* Background Pattern with Next.js Image */}
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <Image
          src="/grid.svg"
          alt=""
          fill
          className="object-cover bg-center [mask-image:linear-gradient(180deg,white,transparent)] dark:hidden"
          priority
        />
        <Image
          src="/grid-dark.svg"
          alt=""
          fill
          className="object-cover bg-center [mask-image:linear-gradient(180deg,white,transparent)] hidden dark:block"
          priority
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          
          {/* Main Heading */}
          <MotionH1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl"
          >
            <span className="block">AI-Powered Notifications</span>
            <span className="block mt-2 bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              That Work For You
            </span>
          </MotionH1>

          {/* Subheading */}
          <MotionP
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-300"
          >
            Transform how you receive information with intelligent, context-aware
            notifications that learn your preferences and deliver only what matters most.
          </MotionP>

          {/* CTA Buttons */}
          <MotionDiv
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
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/features">View Features</Link>
            </Button>
          </MotionDiv>

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