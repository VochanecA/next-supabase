// app/why/page.tsx
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JSX } from "react";
import { Zap, Cpu, Database, Shield, Star } from "lucide-react";

interface Reason {
  title: string;
  description: string;
  icon: JSX.Element;
}

const reasons: Reason[] = [
  {
    title: "Simplicity & Ease of Use",
    description:
      "Unlike many complex notification apps, AI Notify is built to be intuitive and easy to integrate. Get up and running in minutes without bloated features.",
    icon: <Star className="w-10 h-10 text-yellow-500" />,
  },
  {
    title: "Modern, Reliable Technology",
    description:
      "Built on the latest Next.js framework and Supabase backend, AI Notify provides a robust, scalable, and secure platform for all your notification needs.",
    icon: <Database className="w-10 h-10 text-blue-500" />,
  },
  {
    title: "Smarter Notifications with AI",
    description:
      "AI Notify uses intelligent algorithms to deliver context-aware, personalized alerts that reduce noise and keep you informed about what matters most.",
    icon: <Cpu className="w-10 h-10 text-purple-500" />,
  },
  {
    title: "Upgraded Boilerplate",
    description:
      "We started from the official Next.js + Supabase + Vercel example but improved it with real-time auth, custom components, fully responsive design, and ready-to-use AI integration.",
    icon: <Shield className="w-10 h-10 text-green-500" />,
  },
  {
    title: "Lightning Fast Performance",
    description:
      "Optimized for speed and responsiveness with server-side rendering, static generation, and edge-ready deployment for maximum performance.",
    icon: <Zap className="w-10 h-10 text-yellow-400" />,
  },
];

export default function Why(): JSX.Element {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Why Choose AI Notify?</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover why AI Notify outperforms other notification platforms, offering simplicity, speed, and intelligent automation.
          </p>
        </div>

        {/* Reasons Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition-shadow flex flex-col items-start gap-4"
            >
              <div className="mb-2">{reason.icon}</div>
              <h3 className="text-xl font-semibold">{reason.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{reason.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <h2 className="text-2xl font-semibold mb-6">Ready to Upgrade Your Notifications?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who enjoy a smarter, faster, and simpler notification experience with AI Notify.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
            Get Started
          </button>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
