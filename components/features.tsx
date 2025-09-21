"use client";

import type { FC, ReactElement } from "react";
import { Star, Globe, Zap } from "lucide-react";
import { memo } from "react";

const FEATURES: readonly { icon: ReactElement; title: string; description: string }[] = [
  { icon: <Star className="h-8 w-8 text-indigo-600" />, title: "Amazing Feature One", description: "This feature does amazing things for your workflow." },
  { icon: <Globe className="h-8 w-8 text-indigo-600" />, title: "Global Access", description: "Access your data and notifications from anywhere securely." },
  { icon: <Zap className="h-8 w-8 text-indigo-600" />, title: "Lightning Fast", description: "Experience sub-second response times for all dashboards." },
];

const FeatureCard = memo<{ icon: ReactElement; title: string; description: string }>(({ icon, title, description }) => (
  <div
    className="group relative rounded-xl border border-gray-200 p-6 shadow-sm hover:border-indigo-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-indigo-700 transition-all animate-fade-in-up"
    style={{ animationDelay: "0.1s", willChange: "transform, opacity" }}
  >
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0 bg-indigo-50 p-3 rounded-lg dark:bg-indigo-900/20">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
    </div>
    <p className="mt-3 text-gray-600 dark:text-gray-300">{description}</p>
  </div>
));
FeatureCard.displayName = "FeatureCard";

export const Features: FC = memo(() => (
  <section className="py-24 bg-white dark:bg-gray-800">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white animate-fade-in-up">
          Key Features
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          Explore some of the amazing capabilities that improve your workflow.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {FEATURES.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </div>

    <style jsx>{`
      @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in-up {
        opacity: 0;
        animation: fade-in-up 0.6s ease-out forwards;
      }
    `}</style>
  </section>
));
Features.displayName = "Features";
