// app/features/page.tsx
"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JSX } from "react";
import { Bell, Cpu, Database, Shield, Zap } from "lucide-react";

const features = [
  {
    title: "Real-Time Notifications",
    description:
      "Receive updates instantly with real-time notifications powered by Supabase. Never miss an important alert.",
    icon: <Bell className="w-8 h-8 text-orange-500" />,
  },
  {
    title: "AI-Powered Insights",
    description:
      "Analyze notifications with Deep Seek AI to get smart suggestions, summaries, and actionable insights.",
    icon: <Cpu className="w-8 h-8 text-purple-500" />,
  },
  {
    title: "Modern Tech Stack",
    description:
      "Built on Next.js 14, Supabase, and Tailwind CSS for fast, scalable, and maintainable web apps.",
    icon: <Database className="w-8 h-8 text-blue-500" />,
  },
  {
    title: "Secure Authentication",
    description:
      "Seamless sign-in and sign-up experience with Supabase authentication, supporting email and social logins.",
    icon: <Shield className="w-8 h-8 text-green-500" />,
  },
  {
    title: "Lightning Fast Performance",
    description:
      "Optimized for speed and responsiveness with server-side rendering, static generation, and edge-ready deployment.",
    icon: <Zap className="w-8 h-8 text-yellow-500" />,
  },
];

export default function Features(): JSX.Element {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Features of AI Notify</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore the powerful features that make AI Notify smarter, faster, and easier than other notification platforms.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 flex flex-col items-start gap-4"
            >
              <div className="mb-2">{feature.icon}</div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-semibold mb-6">Ready to Experience AI Notify?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Take advantage of our intelligent notification system, powered by AI and modern web technologies.
            It&apos;s free to start and easy to integrate.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
            Try AI Notify
          </button>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
